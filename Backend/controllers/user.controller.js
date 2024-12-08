import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import BlacklistedToken from "../models/blacklistedToken.model.js";

class UserController {
  // Handle user registration
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { fullname, email, password } = req.body;

      // Validate that fullname contains both first and last name
      if (!fullname || !fullname.firstName || !fullname.lastName) {
        return res.status(400).json({
          message: "Fullname with firstName and lastName is required.",
        });
      }

      // Check if a user with the given email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Create a new user and save it to the database
      const newUser = await User.create({
        fullname,
        email,
        password,
      });

      // Generate a JWT token for the new user
      const token = newUser.generateToken();

      // Set the token in a cookie (optional: set secure: true for production)
      res.cookie("token", token, {
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === "production", // Only set cookie over HTTPS in production
        maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration (1 day)
      });

      // Convert the user object to a plain object and remove the password field for security
      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(201).json({
        message: "User registered and logged in successfully.",
        user: userResponse, // Send the user object without the password
        token, // Send the token in the response body
      });
    } catch (error) {
      res.status(500).json({ message: "Error registering user.", error });
    }
  }

  // Handle user login
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = user.generateToken();

      // Set the token in a cookie (optional: set secure: true for production)
      res.cookie("token", token, {
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === "production", // Only set cookie over HTTPS in production
        maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration (1 day)
      });

      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        message: "Login successful.",
        user: userResponse, // Send the user object without the password
        token, // Send the token in the response body
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in.", error });
    }
  }

  // Retrieve the profile of the currently authenticated user
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({ user: userResponse });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile.", error });
    }
  }

  // Handle user logout
  async logout(req, res) {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "No token to logout." });
      }

      // Add the token to the blacklist
      await BlacklistedToken.create({ token });

      // Clear the cookie
      res.clearCookie("token");

      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error during logout.", error });
    }
  }
}

export default new UserController();
