const List = require("../models/list");
const GlobalDAO = require("./globalDAO");

/**
 * Data Access Object (DAO) for the List model.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for List documents.
 */
class ListDAO extends GlobalDAO {
  /**
   * Create a new ListDAO instance.
   *
   * Passes the List Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the List collection.
   */
  constructor() {
    super(List);
  }
}

/**
 * Export a singleton instance of ListDAO.
 */
module.exports = new ListDAO();
