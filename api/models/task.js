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
      required: [true, "A title is required"],
      trim: true,
      maxlength: [30, "The title cannot have more than 30 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "The description cannot have more than 200 characters"],
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
