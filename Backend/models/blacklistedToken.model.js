import mongoose from "mongoose";

const BlacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  BlacklistedTokenSchema
);

export default BlacklistedToken;
