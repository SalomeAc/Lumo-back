/**
 * Generic Data Access Object (DAO) class.
 *
 * Provides reusable CRUD operations for any Mongoose model.
 * Specific DAOs (e.g., UserDAO) should extend this class
 * and inject their model via the constructor.
 */
class GlobalDAO {
  /**
   * Create a new GlobalDAO.
   * @param {import("mongoose").Model} model - The Mongoose model to operate on.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Create and persist a new document.
   * @async
   * @param {Object} data - The data used to create the document.
   * @returns {Promise<Object>} The created document.
   * @throws {Error} If validation or database errors occur.
   */
  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  /**
   * Find a document by its ID.
   * @async
   * @param {string} id - The document's unique identifier.
   * @returns {Promise<Object>} The found document.
   * @throws {Error} If not found or database errors occur.
   */
  async read(id) {
    const document = await this.model.findById(id);
    if (!document) throw new Error("Document not found");
    return document;
  }

  /**
   * Update a document by ID.
   * @async
   * @param {string} id - The document's unique identifier.
   * @param {Object} updateData - The data to update the document with.
   * @returns {Promise<Object>} The updated document.
   * @throws {Error} If not found or validation errors occur.
   */
  async update(id, updateData) {
    const updatedDocument = await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedDocument) throw new Error("Document not found");
    return updatedDocument;
  }

  /**
   * Delete a document by ID.
   * @async
   * @param {string} id - The document's unique identifier.
   * @returns {Promise<Object>} The deleted document.
   * @throws {Error} If not found or database errors occur.
   */
  async delete(id) {
    const deletedDocument = await this.model.findByIdAndDelete(id);
    if (!deletedDocument) throw new Error("Document not found");
    return deletedDocument;
  }

  /**
   * Retrieve all documents matching the given filter.
   * @async
   * @param {Object} [filter={}] - Optional MongoDB filter object.
   * @returns {Promise<Array>} An array of matching documents.
   * @throws {Error} If database errors occur.
   */
  async getAll(filter = {}) {
    return await this.model.find(filter);
  }
}

/**
 * Export a singleton instance of GlobalDAO.
 */
module.exports = GlobalDAO;
