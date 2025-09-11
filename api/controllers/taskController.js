const GlobalController = require("./globalController");
const TaskDAO = require("../dao/taskDAO");

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
}

/**
 * Export a singleton instance of TaskController.
 */
module.exports = new TaskController();
