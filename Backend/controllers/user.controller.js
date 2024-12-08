import { validationResult } from "express-validator";
import User from "../models/user.model.js";

class UserController {
  // Handle user registration
  async register(req, res) {
    // Check if the incoming request has validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If errors exist, send them back as a response
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
        // If the user already exists, send a response indicating so
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

      // Convert the user object to a plain object and remove the password field for security
      const userResponse = newUser.toObject();
      delete userResponse.password;

      // Send a success response with the token and user data (excluding the password)
      res.status(201).json({
        message: "User registered and logged in successfully.",
        token,
        user: userResponse, // Send the user object without the password
      });
    } catch (error) {
      // Handle any errors during user registration
      res.status(500).json({ message: "Error registering user.", error });
    }
  }

  // Handle user login
  async login(req, res) {
    // Validate the incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Attempt to find a user by the provided email address
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        // If no user is found, return a 404 error
        return res.status(404).json({ message: "User not found." });
      }

      // Compare the provided password with the stored password in the database
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        // If passwords don't match, return a 401 unauthorized error
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Generate a JWT token upon successful login
      const token = user.generateToken();

      // Convert the user object to a plain object and exclude the password field
      const userResponse = user.toObject();
      delete userResponse.password;

      // Send a success response with the token and user data (excluding the password)
      res.status(200).json({
        message: "Login successful.",
        token,
        user: userResponse, // Send the user object without the password
      });
    } catch (error) {
      // Handle any errors during login
      res.status(500).json({ message: "Error logging in.", error });
    }
  }

  // Retrieve the profile of the currently authenticated user
  async getProfile(req, res) {
    try {
      // Get the user ID from the request (this assumes a valid JWT has been used)
      const userId = req.user.id;

      // Find the user by their ID in the database
      const user = await User.findById(userId).select("-password");
      if (!user) {
        // If the user is not found, return a 404 error
        return res.status(404).json({ message: "User not found." });
      }

      // Convert the user object to a plain object and remove the password field
      const userResponse = user.toObject();
      delete userResponse.password;

      // Send the user profile data in the response (excluding the password)
      res.status(200).json({ user: userResponse }); // Send the user object without the password
    } catch (error) {
      // Handle any errors when fetching the user profile
      res.status(500).json({ message: "Error fetching user profile.", error });
    }
  }
}

export default new UserController();
