import express from "express";
import UserModel from "../models/User.model.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, phone, address, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      status: 400,
      message: "All fields are required.",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.json({
        status: 400,
        message: "User already exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    });
    await newUser.save();
    res.json({
      status: 201,
      message: "User created!",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.json({
      status: 500,
      message: "Error registering user",
    });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      status: 400,
      message: "Email and password are required.",
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.json({
        status: 404,
        message: "User not found. Please register first!",
      });
    }

    const isValidPassword = bcrypt.compareSync(password, existingUser.password);
    if (!isValidPassword) {
      return res.json({
        status: 401,
        message: "Invalid password!",
      });
    }

    req.session.userId = existingUser._id; // Store user ID in session
    res.json({ status: 200, message: "User logged in!" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.json({
      status: 500,
      message: "Error logging in",
    });
  }
});

// Get user data by email
router.get("/getUserByEmail/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.json({
        status: 404,
        message: "User not found!",
      });
    }

    const userData = {
      name: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone,
      address: existingUser.address,
      cart: existingUser.cart,
      orders: existingUser.orders,
    };

    res.json({
      status: 200,
      message: "User found!",
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.json({
      status: 500,
      message: "Error fetching user data",
    });
  }
});

// Delete user by email
router.delete("/deleteUserByEmail", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await UserModel.findOneAndDelete({ email });
    if (!existingUser) {
      return res.json({
        status: 404,
        message: "User not found!",
      });
    }

    res.json({
      status: 200,
      message: "User deleted!",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.json({
      status: 500,
      message: "Error deleting user",
    });
  }
});

export default router;
