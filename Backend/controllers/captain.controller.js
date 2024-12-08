import { validationResult } from "express-validator";
import Captain from "../models/captain.model.js";
import BlacklistedToken from "../models/blacklistedToken.model.js";

class CaptainController {
  // Register a new captain
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { fullname, email, password, vehicle } = req.body;

      // Check if the captain already exists
      const existingCaptain = await Captain.findOne({ email });
      if (existingCaptain) {
        return res.status(400).json({ message: "Captain already exists." });
      }

      const newCaptain = await Captain.create({
        fullname,
        email,
        password,
        vehicle,
      });

      const token = newCaptain.generateToken();

      // Set the token in the cookies
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Remove password from response data
      const captainResponse = newCaptain.toObject();
      delete captainResponse.password;

      res.status(201).json({
        message: "Captain registered successfully.",
        captain: captainResponse,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Error registering captain.", error });
    }
  }

  // Login a captain
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Find the captain by email and compare passwords
      const captain = await Captain.findOne({ email }).select("+password");
      if (!captain) {
        return res.status(404).json({ message: "Captain not found." });
      }

      const isMatch = await captain.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = captain.generateToken();

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      const captainResponse = captain.toObject();
      delete captainResponse.password;

      res.status(200).json({
        message: "Login successful.",
        captain: captainResponse,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in.", error });
    }
  }

  // Retrieve the profile of the currently authenticated captain
  async getProfile(req, res) {
    try {
      const captainId = req.captain.id;
      const captain = await Captain.findById(captainId).select("-password");
      if (!captain) {
        return res.status(404).json({ message: "Captain not found." });
      }

      const captainResponse = captain.toObject();
      delete captainResponse.password;

      res.status(200).json({ captain: captainResponse });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching captain profile.", error });
    }
  }

  // Update captain profile
  async updateProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const captainId = req.user.id;
      const { firstName, lastName, email, vehicle, status, location } =
        req.body;

      // Prepare the update data
      const updateData = {
        fullname: { firstName, lastName },
        email,
        vehicle,
        status,
        location,
      };

      // Find the captain and update their profile
      const updatedCaptain = await Captain.findByIdAndUpdate(
        captainId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedCaptain) {
        return res.status(404).json({ message: "Captain not found." });
      }

      const captainResponse = updatedCaptain.toObject();
      delete captainResponse.password;

      res.status(200).json({
        message: "Profile updated successfully.",
        captain: captainResponse,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile.", error });
    }
  }

  // Handle captain logout
  async logout(req, res) {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "No token to logout." });
      }

      // Blacklist the token to invalidate it
      await BlacklistedToken.create({ token });
      res.clearCookie("token");

      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error during logout.", error });
    }
  }
}

export default new CaptainController();
