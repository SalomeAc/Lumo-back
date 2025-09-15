const mongoose = require("mongoose");
const Task = require("../models/task");
const GlobalDAO = require("./globalDAO");

/**
 * Data Access Object (DAO) for the Task model.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for Task documents.
 */
class TaskDAO extends GlobalDAO {
  /**
   * Create a new TaskDAO instance.
   *
   * Passes the Task Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the Task collection.
   */
  constructor() {
    super(Task);
  }

  /**
   * Returns all tasks associated with a list ordered by:
   *  1) status (ongoing, unassigned, done)
   *  2) dueDate asc (tasks without dueDate will be last)
   *
   * @param {string} listId - ID of the list to get the tasks from.
   * @returns {Promise<Array>} sorted tasks.
   */
  async getTasksByListOrdered(listId) {
    const _id =
      typeof listId === "string" ? new mongoose.Types.ObjectId(listId) : listId;

    const tasks = await this.model.aggregate([
      { $match: { list: _id } },

      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "ongoing"] }, then: 0 },
                { case: { $eq: ["$status", "unassigned"] }, then: 1 },
                { case: { $eq: ["$status", "done"] }, then: 2 },
              ],
              default: 3,
            },
          },
          _dueForSort: { $ifNull: ["$dueDate", new Date("9999-12-31")] },
        },
      },

      { $sort: { statusOrder: 1, _dueForSort: 1 } },

      { $project: { statusOrder: 0, _dueForSort: 0 } },
    ]);

    return tasks;
  }
}

/**
 * Export a singleton instance of TaskDAO.
 */
module.exports = new TaskDAO();
