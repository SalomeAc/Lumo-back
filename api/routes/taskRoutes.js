const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const TaskController = require("../controllers/taskController");

/**
 * @route POST /api/tasks
 * @description Create a new task.
 * @body {string} title - The title of the task.
 * @body {string} description - The description of the task.
 * @body {string} status - The status of the task.
 * @body {date} dueDate - The due date of the task.
 * @body {string} list - The ID of the list who contains this task (refers to a List document).
 * @access Private (requires valid JWT)
 */
router.post("/", authenticateToken, (req, res) =>
  TaskController.createTask(req, res),
);

/**
 * @route PUT /api/tasks/:id
 * @description Update an existing task by ID.
 * @param {string} id - The unique identifier of the task.
 * @body {string} [title] - Updated title (optional).
 * @body {string} [description] - Updated description (optional).
 * @body {string} [status] - Updated status (optional).
 * @body {date} [dueDate] - Updated due date (optional).
 * @access Private (requires valid JWT)
 */
router.put("/:id", authenticateToken, (req, res) =>
  TaskController.updateTask(req, res),
);

/**
 * @route DELETE /api/tasks/:id
 * @description Delete a task by ID.
 * @param {string} id - The unique identifier of the task.
 * @access Private (requires valid JWT)
 */
router.delete("/:id", authenticateToken, (req, res) =>
  TaskController.deleteTask(req, res),
);

/**
 * Export the router instance to be mounted in the main routes file.
 */
module.exports = router;
