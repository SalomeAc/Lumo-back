const GlobalController = require("./globalController");
const ListDAO = require("../dao/listDAO");
const UserDAO = require("../dao/userDAO");

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
    } catch (err) {
      if (err.name === "ValidationError") {
        const firstMessage = Object.values(err.errors)[0].message;
        return res.status(400).json({ message: firstMessage });
      }

      if (err.code === 11000) {
        return res
          .status(409)
          .json({ message: "There already exist a list with said title" });
      }

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
