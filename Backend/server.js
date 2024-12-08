import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js"; // Import user routes

// Initialize dotenv to load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors()); // This will allow all origins by default

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(cookieParser());

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

// Use user routes
app.use("/api/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
