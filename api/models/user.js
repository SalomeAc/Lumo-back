const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * User schema definition.
 *
 * Represents application users stored in MongoDB.
 * Includes authentication fields and automatic timestamps.
 */
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  age: {
    type: Number,
    min: [13, "User must be at least 13 years old"],
    required: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Insert a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    ],
  },
});

/**
 * Hashes the password after validating all fields just before saving the document.
 */
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

/**
 * Hashes the password after validating all fields just before updating the document.
 */
UserSchema.pre("findOneAndUpdate", async function (next) {
  let update = this.getUpdate();

  if (update.$set) {
    update = update.$set;
  }

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
    this.setUpdate(update); // Sobreescribimos con el nuevo hash
  }

  next();
});

/**
 * Mongoose model for the User collection.
 * Provides an interface to interact with user documents.
 */
module.exports = mongoose.model("User", UserSchema);
