const GlobalController = require("./globalController");
const UserDAO = require("../dao/userDAO");
const ListDAO = require("../dao/listDAO");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Controller class for managing User resources.
 *
 * Extends the generic {@link GlobalController} to inherit
 * CRUD operations, using the {@link UserDAO} as the data access layer.
 */
class UserController extends GlobalController {
  /**
   * Create a new UserController instance.
   *
   * The constructor passes the UserDAO to the parent class so that
   * all inherited methods (create, read, update, delete, getAll)
   * operate on the User model.
   */
  constructor() {
    super(UserDAO);
  }

  /**
   * Registers a new user and creates a default task list for them.
   *
   * @async
   * @param {import("express").Request} req - Express request object containing user data in `req.body`
   * @param {import("express").Response} res - Express response object
   * @returns {Promise<void>} Returns HTTP status codes:
   *   - 201: User created successfully
   *   - 400: Validation error (e.g., required fields missing or invalid)
   *   - 409: Duplicate email
   *   - 500: Internal server error
   */
  async create(req, res) {
    const session = await this.dao.model.db.startSession();
    try {
      await session.withTransaction(async () => {
        const user = await this.dao.create(req.body);

        const listData = {
          title: "Tasks",
          user: user._id,
        };

        await ListDAO.create(listData, { session });
      });

      return res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
      if (err.name === "ValidationError") {
        const firstMessage = Object.values(err.errors)[0].message;
        return res.status(400).json({ message: firstMessage });
      }

      if (err.code === 11000) {
        return res.status(409).json({ message: "Email already registered" });
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    } finally {
      session.endSession();
    }
  }

  /**
   * Authenticates a user with email and password, returning a JWT token.
   *
   * @async
   * @param {import("express").Request} req - Express request object containing `email` and `password` in `req.body`
   * @param {import("express").Response} res - Express response object
   * @returns {Promise<void>} Returns HTTP status codes:
   *   - 200: Login successful, returns `{ token }`
   *   - 400: Missing email or password
   *   - 401: Email or password incorrect
   *   - 500: Internal server error
   */
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const user = await this.dao.findByEmail(email);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Email or password are incorrect" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Email or password are incorrect" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.status(200).json({ token });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    }
  }

  /**
   * Retrieves the profile information of the currently authenticated user.
   *
   * Requires authentication via {@link authenticateToken}.
   *
   * @async
   * @param {import("express").Request} req - Express request object, `req.user` contains decoded JWT info
   * @param {import("express").Response} res - Express response object
   * @returns {Promise<void>} Returns HTTP status codes:
   *   - 200: Returns user profile `{ firstName, lastName, age, email }`
   *   - 404: User not found
   *   - 500: Internal server error
   *
   * @example
   * GET /users/profile
   * Headers: { Authorization: "Bearer <token>" }
   * Response: { firstName, lastName, age, email }
   */
  async profile(req, res) {
    try {
      const userId = req.user.id;

      const user = await this.dao.read(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
      });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    }
  }
}

/**
 * Export a singleton instance of UserController.
 */
module.exports = new UserController();
