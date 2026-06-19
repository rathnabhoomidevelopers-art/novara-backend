const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },          // plain-text (matches frontend)
  role:     { type: String, enum: ["viewer","editor","admin"], default: "viewer" },
  addedOn:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema, "blog_users");