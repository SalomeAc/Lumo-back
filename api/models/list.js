const mongoose = require("mongoose");

/**
 * List schema definition.
 *
 * Represents application lists stored in MongoDB.
 * Includes authentication fields and automatic timestamps.
 */
const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: [30, "El título no puede tener más de 30 caracteres"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

/**
 * Makes it so a user can't have more than one list with the same title.
 */
ListSchema.index({ title: 1, user: 1 }, { unique: true });

/**
 * Mongoose model for the List collection.
 * Provides an interface to interact with task documents.
 */
module.exports = mongoose.model("List", ListSchema);
