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
}

/**
 * Export a singleton instance of TaskDAO.
 */
module.exports = new TaskDAO();
