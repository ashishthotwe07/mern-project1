import express from "express";
import { body } from "express-validator";
import CaptainController from "../controllers/captain.controller.js";
import captAuthMiddleware from "../middlewares/captain.auth.middleware.js";

const router = express.Router();

/**
 * Validation rules for captain registration
 */
const registerValidation = [
  body("fullname.firstName").notEmpty().withMessage("First name is required"),
  body("fullname.lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
  body("vehicle.plate").notEmpty().withMessage("Vehicle plate is required"),
  body("vehicle.capacity")
    .isInt({ gt: 0 })
    .withMessage("Vehicle capacity must be a positive number"),
  body("vehicle.vehicleType")
    .notEmpty()
    .withMessage("Vehicle type is required"),
];

/**
 * Validation rules for captain login
 */
const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Validation rules for updating profile
 */
const updateProfileValidation = [
  body("fullname.firstName")
    .optional()
    .notEmpty()
    .withMessage("First name cannot be empty"),
  body("fullname.lastName")
    .optional()
    .notEmpty()
    .withMessage("Last name cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("vehicle.color")
    .optional()
    .notEmpty()
    .withMessage("Vehicle color cannot be empty"),
  body("vehicle.plate")
    .optional()
    .notEmpty()
    .withMessage("Vehicle plate cannot be empty"),
  body("vehicle.capacity")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Vehicle capacity must be a positive number"),
  body("vehicle.vehicleType")
    .optional()
    .notEmpty()
    .withMessage("Vehicle type cannot be empty"),
];

// Routes

// Register a new captain
router.post("/register", registerValidation, CaptainController.register);

// Login a captain
router.post("/login", loginValidation, CaptainController.login);

// Update captain profile (protected route)
router.put(
  "/profile",
  captAuthMiddleware, 
  updateProfileValidation,
  CaptainController.updateProfile
);

// Get captain profile (protected route)
router.get("/profile", captAuthMiddleware, CaptainController.getProfile);


// Handle captain logout
router.post("/logout", captAuthMiddleware, CaptainController.logout);


export default router;
