import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    // Status of the captain (whether they are available for rides or not)
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    vehicle: {
      color: {
        type: String,
        required: true,
      },
      plate: {
        type: String,
        required: true,
        unique: true,
      },
      capacity: {
        type: Number,
        required: true,
        min: 1,
      },
      vehicleType: {
        type: String,
        enum: ["car", "bike" , "auto"],
        required: true,
      },
    },
    // GPS coordinates for the driver's location
    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    socketId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Function to generate a JWT token
captainSchema.methods.generateToken = function () {
  const payload = { id: this._id, email: this.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

// Function to hash the password before saving
captainSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Function to compare passwords during login
captainSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Captain = mongoose.model("Captain", captainSchema);

export default Captain;
