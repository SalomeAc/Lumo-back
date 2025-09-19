const GlobalController = require("./globalController");
const ListDAO = require("../dao/listDAO");
const UserDAO = require("../dao/userDAO");
const TaskDAO = require("../dao/taskDAO");

/**
 * Controller class for managing List resources.
 *
 * Extends the generic {@link GlobalController} to inherit
 * CRUD operations, using the {@link ListDAO} as the data access layer.
 */
class ListController extends GlobalController {
  /**
   * Create a new ListController instance.
   *
   * The constructor passes the ListDAO to the parent class so that
   * all inherited methods (create, read, update, delete, getAll)
   * operate on the List model.
   */
  constructor() {
    super(ListDAO);
  }

  /**
   * Returns all the lists associated to a user.
   *
   * The user ID is obtained from the decoded JWT token (`req.user.id`).
   *
   * @async
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response with the lists associated +
   * to the user or an error if it failed.
   */
  async getUserLists(req, res) {
    try {
      const userId = req.user.id;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const lists = await this.dao.getAll({ user: userId });

      return res.status(200).json(lists);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    }
  }

  /**
   * Creates a new list for the authenticated user.
   *
   * The user ID is obtained from the decoded JWT token (`req.user.id`) and
   * automatically assigned to the `user` field of the list. Ensures that the
   * authenticated user exists before creating the list. Handles validation errors
   * and duplicate title conflicts.
   *
   * @async
   * @param {import("express").Request} req - Express request object. The body should
   * contain the list data (e.g., `title`), but the `user` field is ignored and
   * replaced with the authenticated user's ID.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response with the created list or an error message.
   */
  async createList(req, res) {
    try {
      const userId = req.user.id;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await this.dao.create({ ...req.body, user: userId });

      return res.status(200).json({
        message: "Lista creada exitosamente",
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const firstMessage = Object.values(err.errors)[0].message;
        return res.status(400).json({ message: firstMessage });
      }

      if (err.code === 11000) {
        return res
          .status(409)
          .json({ message: "Ya existe una lista con ese título" });
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    }
  }

  /**
   * Updates an existing list by its ID.
   *
   * Ensures that the authenticated user exists and is the owner
   * of the list before applying updates. Only the `title` field can
   * be updated. Handles validation errors and duplicate title conflicts.
   *
   * @async
   * @param {import("express").Request} req - Express request object. Must include
   * the list ID in `req.params.id`. The body may contain an updated `title`.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response indicating success or an error message.
   */
  async updateList(req, res) {
    try {
      const userId = req.user.id;
      const listId = req.params.id;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const list = await this.dao.read(listId);
      if (!list) {
        return res.status(404).json({ message: "Lista no encontrada" });
      }

      if (list.user.toString() !== userId) {
        return res.status(403).json({ message: "Acción prohibida" });
      }

      await this.dao.update(listId, { title: req.body.title });

      return res.status(200).json({
        message: "Lista actualizada exitosamente",
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const firstMessage = Object.values(err.errors)[0].message;
        return res.status(400).json({ message: firstMessage });
      }

      if (err.code === 11000) {
        return res
          .status(409)
          .json({ message: "Ya existe una lista con ese título" });
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    }
  }

  /**
   * Deletes an existing list by its ID.
   *
   * Ensures that the authenticated user exists and is the owner
   * of the list before performing the deletion. Only the list owner
   * is allowed to delete it.
   *
   * @async
   * @param {import("express").Request} req - Express request object. Must include
   * the list ID in `req.params.id`.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response indicating success or an error message.
   */
  async deleteList(req, res) {
    try {
      const userId = req.user.id;
      const listId = req.params.id;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const list = await this.dao.read(listId);
      if (!list) {
        return res.status(404).json({ message: "Lista no encontrada" });
      }

      if (list.user.toString() !== userId) {
        return res.status(403).json({ message: "Acción prohibida" });
      }

      await this.dao.delete(listId);

      return res.status(200).json({
        message: "Lista eliminada exitosamente",
      });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    }
  }

  /**
   * Retrieve all tasks associated with a specific list.
   *
   * Validates that the requesting user exists and is the owner of the list,
   * then retrieves all tasks linked to that list.
   *
   * @async
   * @function getListTasks
   * @param {import("express").Request} req - Express request object. Must include
   * the list ID in `req.params.id`.
   * @param {Object} req.user - Authenticated user data.
   * @param {string} req.user.id - ID of the authenticated user.
   * @param {Object} req.params - URL parameters.
   * @param {string} req.params.id - ID of the list whose tasks are to be retrieved.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Responds with:
   * - 200 and an array of tasks if successful.
   * - 403 if the list does not belong to the user.
   * - 404 if the user or list does not exist.
   * - 500 if an internal server error occurs.
   */
  async getListTasks(req, res) {
    try {
      const userId = req.user.id;
      const listId = req.params.id;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const list = await this.dao.read(listId);
      if (!list) {
        return res.status(404).json({ message: "Lista no encontrada" });
      }

      if (list.user.toString() !== userId) {
        return res.status(403).json({ message: "Acción prohibida" });
      }

      const tasks = await TaskDAO.getTasksByListOrdered(listId);

      return res.status(200).json(tasks);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    }
  }
}

/**
 * Export a singleton instance of ListController.
 */
module.exports = new ListController();
