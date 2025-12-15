const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Regiter User
// Register User
router.post("/signup", async (req, res) => {
  try {
    const { username,email, password, usertype } = req.body;

     // Email validation
    if (!username) {
      return res.status(400).json({ error: "USername is required" });
    }
    // Email validation
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Password validation
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set usertype safely (default = guide)
    const finalUserType = usertype === "admin" ? "admin" : "guide";

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      usertype: finalUserType,
    });

    // Response
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.usertype,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// User login with JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is Required" });
    }
    // Email format validation
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is Required" });
    }
    //Password validation
    const strongPasswordRegEx =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password || !strongPasswordRegEx.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({
        success: true,
        token: token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      return res
        .status(401)
        .json({ error: "Incorrect password. Please try again." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/deleteuser/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Reset password route
router.post("/reset-password", auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.userId; // from JWT

    // Check if new password was entered
    if (!newPassword) {
      return res.status(400).json({
        error: "New Password is Required",
      });
    }

    // Password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.",
      });
    }
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    // Update user password
    await user.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;