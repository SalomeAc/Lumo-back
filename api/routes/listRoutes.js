const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const ListController = require("../controllers/listController");

/**
 * @route GET /lists/:id
 * @description Retrieve all tasks related to a given list.
 * @param {string} id - The unique identifier of the list.
 * @access Public
 */
router.get("/:id", authenticateToken, (req, res) =>
  ListController.read(req, res),
);

/**
 * @route POST /lists
 * @description Create a new list.
 * @body {string} title - The title of the list.
 * @body {string} user - The ID of the user who owns this list (refers to a User document).
 * @access Public
 */
router.post("/", authenticateToken, (req, res) =>
  ListController.createList(req, res),
);

/**
 * @route PUT /lists/:id
 * @description Update an existing list by ID.
 * @param {string} id - The unique identifier of the list.
 * @body {string} [title] - Updated title (optional).
 * @access Public
 */
router.put("/:id", authenticateToken, (req, res) =>
  ListController.update(req, res),
);

/**
 * @route DELETE /lists/:id
 * @description Delete a list by ID.
 * @param {string} id - The unique identifier of the list.
 * @access Public
 */
router.delete("/:id", authenticateToken, (req, res) =>
  ListController.delete(req, res),
);

/**
 * Export the router instance to be mounted in the main routes file.
 */
module.exports = router;
