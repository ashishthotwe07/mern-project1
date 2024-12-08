import express from "express";
import { body } from "express-validator";
import UserController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Validation rules for registration
const registerValidationRules = [
  body("fullname.firstName").notEmpty().withMessage("First name is required."),
  body("fullname.lastName").notEmpty().withMessage("Last name is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

// Validation rules for login
const loginValidationRules = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

// User registration route
router.post("/register", registerValidationRules, UserController.register);

// User login route
router.post("/login", loginValidationRules, UserController.login);

// Get user profile (protected route)
router.get("/profile", authMiddleware, UserController.getProfile);

export default router;
