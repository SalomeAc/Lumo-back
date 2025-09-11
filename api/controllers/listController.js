const GlobalController = require("./globalController");
const ListDAO = require("../dao/listDAO");

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
}

/**
 * Export a singleton instance of ListController.
 */
module.exports = new ListController();
