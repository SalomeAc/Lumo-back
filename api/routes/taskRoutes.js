const express = require("express");
const router = express.Router();

const TaskController = require("../controllers/taskController");

/**
 * @route POST /tasks
 * @description Create a new task.
 * @body {string} title - The title of the task.
 * @body {string} description - The description of the task.
 * @body {string} status - The status of the task.
 * @body {date} dueDate - The due date of the task.
 * @body {string} list - The ID of the list who contains this task (refers to a List document).
 * @body {string} user - The ID of the user who owns this task (refers to a User document).
 * @access Public
 */
router.post("/", (req, res) => TaskController.create(req, res));

/**
 * @route PUT /tasks/:id
 * @description Update an existing task by ID.
 * @param {string} id - The unique identifier of the task.
 * @body {string} [title] - Updated title (optional).
 * @body {string} [description] - Updated description (optional).
 * @body {string} [status] - Updated status (optional).
 * @body {date} [dueDate] - Updated due date (optional).
 * @access Public
 */
router.put("/:id", (req, res) => TaskController.update(req, res));

/**
 * @route DELETE /tasks/:id
 * @description Delete a task by ID.
 * @param {string} id - The unique identifier of the task.
 * @access Public
 */
router.delete("/:id", (req, res) => TaskController.delete(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */
module.exports = router;
