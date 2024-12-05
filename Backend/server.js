import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors()); // This will allow all origins by default

// Middleware
app.use(express.json()); // To parse JSON bodies

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
