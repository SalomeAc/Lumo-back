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

  async create(req, res) {
    const { firstName, lastName, age, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (age < 13) {
      return res
        .status(400)
        .json({ message: "User must be atleast 13 years old" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Insert a valid email" });
    }

    const existingUser = await this.dao.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = { ...req.body, password: hashedPassword };

      await this.dao.create(userData);

      return res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Internal server error: ${err.message}`);
      }
      res
        .status(500)
        .json({ message: "Internal server error, try again later" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const user = await this.dao.findOne({ email });
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
}

/**
 * Export a singleton instance of UserController.
 */
module.exports = new UserController();
