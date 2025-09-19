const GlobalController = require("./globalController");
const TaskDAO = require("../dao/taskDAO");
const ListDAO = require("../dao/listDAO");
const UserDAO = require("../dao/userDAO");

/**
 * Controller class for managing Task resources.
 *
 * Extends the generic {@link GlobalController} to inherit
 * CRUD operations, using the {@link TaskDAO} as the data access layer.
 */
class TaskController extends GlobalController {
  /**
   * Create a new TaskController instance.
   *
   * The constructor passes the TaskDAO to the parent class so that
   * all inherited methods (create, read, update, delete, getAll)
   * operate on the Task model.
   */
  constructor() {
    super(TaskDAO);
  }

  /**
   * Creates a new task for the authenticated user.
   *
   * The user ID is obtained from the decoded JWT token (`req.user.id`) and
   * automatically assigned to the `user` field of the task. Ensures that the
   * authenticated user exists before creating the task. Handles validation errors
   * and duplicate title conflicts.
   *
   * @async
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response with the created task or an error message.
   */
  async createTask(req, res) {
    try {
      const userId = req.user.id;
      const listId = req.body.list;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const list = await ListDAO.read(listId);
      if (!list) {
        return res.status(404).json({ message: "List not found" });
      }

      if (list.user.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden action" });
      }

      await this.dao.create({ ...req.body, list: listId, user: userId });

      return res.status(200).json({
        message: "Task successfully created",
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const firstMessage = Object.values(err.errors)[0].message;
        return res.status(400).json({ message: firstMessage });
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
   * Updates an existing task by its ID.
   *
   * Ensures that the authenticated user exists and is the owner
   * of the task before applying updates.
   *
   * @async
   * @param {import("express").Request} req - Express request object. Must include
   * the task ID in `req.params.id`.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response indicating success or an error message.
   */
  async updateTask(req, res) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const task = await this.dao.read(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.user.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden action" });
      }

      const allowedFields = ["title", "description", "status", "dueDate"];
      const updates = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      await this.dao.update(taskId, updates);

      return res.status(200).json({
        message: "Task successfully updated",
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const firstMessage = Object.values(err.errors)[0].message;
        return res.status(400).json({ message: firstMessage });
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
   * Deletes an existing task by its ID.
   *
   * Ensures that the authenticated user exists and is the owner
   * of the task before performing the deletion. Only the task owner
   * is allowed to delete it.
   *
   * @async
   * @param {import("express").Request} req - Express request object. Must include
   * the task ID in `req.params.id`.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response indicating success or an error message.
   */
  async deleteTask(req, res) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const task = await this.dao.read(taskId);
      if (!task) {
        return res.status(404).json({ message: "task not found" });
      }

      if (task.user.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden action" });
      }

      await this.dao.delete(taskId);

      return res.status(200).json({
        message: "Task successfully deleted",
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
   * Retrieve all tasks by status.
   *
   * Validates that the requesting user exists, then retrieves all tasks by status.
   *
   * @async
   * @function getKanbanTasks
   * @param {import("express").Request} req - Express request object.
   * @param {Object} req.user - Authenticated user data.
   * @param {string} req.user.id - ID of the authenticated user.
   * @param {Object} req.params - URL parameters.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} Responds with:
   * - 200 and an array of tasks if successful.
   * - 404 if the user does not exist.
   * - 500 if an internal server error occurs.
   */
  async getKanbanTasks(req, res) {
    try {
      const userId = req.user.id;

      const user = await UserDAO.read(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const tasks = await this.dao.getAll({ user: userId });

      const ongoingTasks = tasks.filter((t) => t.status === "ongoing");
      const unassignedTasks = tasks.filter((t) => t.status === "unassigned");
      const doneTasks = tasks.filter((t) => t.status === "done");

      return res.status(200).json({ ongoingTasks, unassignedTasks, doneTasks });
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
 * Export a singleton instance of TaskController.
 */
module.exports = new TaskController();
