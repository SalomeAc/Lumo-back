const express = require("express");
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");
const listRoutes = require("./listRoutes");

const router = express.Router();

/**
 * Mount project routes.
 *
 * All routes defined in {@link userRoutes} will be accessible under `/users`.
 * Example:
 *   - GET  /users        → Get all users
 *   - POST /users        → Create a new user
 *   - GET  /users/:id    → Get a user by ID
 *   - PUT  /users/:id    → Update a user by ID
 *   - DELETE /users/:id  → Delete a user by ID
 *
 * Same goes for the other routes.
 */
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/lists", listRoutes);

/**
 * Export the main router instance.
 * This is imported in `index.js` and mounted under `/api/v1`.
 */
module.exports = router;
