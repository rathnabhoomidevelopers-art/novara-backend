const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true },
    phone:        { type: String },
    agreeToTerms: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema, "blogs");