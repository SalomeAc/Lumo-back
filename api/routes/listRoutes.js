const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const ListController = require("../controllers/listController");

/**
 * @route GET /api/lists/get-user-lists
 * @description Retrieve all lists related to a given user.
 * @access Private (requires valid JWT)
 */
router.get("/get-user-lists", authenticateToken, (req, res) =>
  ListController.getUserLists(req, res),
);

/**
 * @route GET /api/lists/get-tasks/:id
 * @description Retrieve all tasks related to a given list.
 * @param {string} id - The unique identifier of the list.
 * @access Private (requires valid JWT)
 */
router.get("/get-tasks/:id", authenticateToken, (req, res) =>
  ListController.getListTasks(req, res),
);

/**
 * @route POST /api/lists
 * @description Create a new list.
 * @body {string} title - The title of the list.
 * @access Private (requires valid JWT)
 */
router.post("/", authenticateToken, (req, res) =>
  ListController.createList(req, res),
);

/**
 * @route PUT /api/lists/:id
 * @description Update an existing list by ID.
 * @param {string} id - The unique identifier of the list.
 * @body {string} [title] - Updated title (optional).
 * @access Private (requires valid JWT)
 */
router.put("/:id", authenticateToken, (req, res) =>
  ListController.updateList(req, res),
);

/**
 * @route DELETE /api/lists/:id
 * @description Delete a list by ID.
 * @param {string} id - The unique identifier of the list.
 * @access Private (requires valid JWT)
 */
router.delete("/:id", authenticateToken, (req, res) =>
  ListController.deleteList(req, res),
);

/**
 * Export the router instance to be mounted in the main routes file.
 */
module.exports = router;
