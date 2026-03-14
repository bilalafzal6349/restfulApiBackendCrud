let users = [];
let nextId = 1;

// Simple email format validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── GET ALL USERS ───────────────────────────────────────────────────────────
const getAllUsers = (req, res) => {
  try {
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── GET USER BY ID ──────────────────────────────────────────────────────────
const getUserById = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid ID. Must be a positive number" });
    }

    const user = users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── CREATE USER ─────────────────────────────────────────────────────────────
const createUser = (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "Name must be a non-empty string" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = users.find((u) => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const newUser = { id: nextId++, name: name.trim(), email: email.toLowerCase() };
    users.push(newUser);
    res.status(201).json({ message: "User has been created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── UPDATE USER ─────────────────────────────────────────────────────────────
const updateUser = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid ID. Must be a positive number" });
    }

    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: "At least one field (name or email) is required to update" });
    }
    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      return res.status(400).json({ message: "Name must be a non-empty string" });
    }
    if (email !== undefined && !isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailTaken = users.find((u) => u.email === email.toLowerCase() && u.id !== id);
      if (emailTaken) {
        return res.status(409).json({ message: "Another account with this email already exists" });
      }
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── DELETE USER ─────────────────────────────────────────────────────────────
const deleteUser = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid ID. Must be a positive number" });
    }

    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    users.splice(index, 1);
    res.status(200).json({ message: "User has been deleted successfully" });
    
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
