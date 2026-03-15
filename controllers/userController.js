import User from "../models/User.js";
import mongoose from "mongoose";

// ─── Helper ────────────────────────────────────────────────────────────────

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── Controllers ───────────────────────────────────────────────────────────

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /users
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Manual presence checks for clear error messages
    if (!name && !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: "User has been created successfully", user: newUser });
  } catch (err) {
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    // Mongoose validation error (e.g., invalid email format)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: "At least one field (name or email) is required to update" });
    }

    // Build update object with only provided fields
    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } // return the updated doc and run schema validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Another account with this email already exists" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    res.status(200).json({ message: "User has been deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
