const mongoose = require("mongoose");

/**
 * Task schema definition.
 *
 * Represents application tasks stored in MongoDB.
 * Includes authentication fields and automatic timestamps.
 */
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El titulo es requerido"],
      trim: true,
      maxlength: [30, "El título no puede tener más de 30 caracteres"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "La descripción no puede tener más de 200 caracteres"],
    },
    status: {
      type: String,
      enum: ["ongoing", "unassigned", "done"],
      default: "unassigned",
    },
    dueDate: {
      type: Date,
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
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
 * Mongoose model for the Task collection.
 * Provides an interface to interact with task documents.
 */
module.exports = mongoose.model("Task", TaskSchema);
