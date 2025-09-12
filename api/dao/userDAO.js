const User = require("../models/user");
const GlobalDAO = require("./globalDAO");

/**
 * Data Access Object (DAO) for the User model.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for User documents.
 */
class UserDAO extends GlobalDAO {
  /**
   * Create a new UserDAO instance.
   *
   * Passes the User Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the User collection.
   */
  constructor() {
    super(User);
  }

  /**
   * Finds a user document by email.
   *
   * @async
   * @param {string} email - The email of the user to search for.
   * @returns {Promise<Object|null>} Returns a Promise that resolves to the user document if found, or `null` if no user exists with the given email.
   */
  async findByEmail(email) {
    return this.model.findOne({ email });
  }
}

/**
 * Export a singleton instance of UserDAO.
 */
module.exports = new UserDAO();
