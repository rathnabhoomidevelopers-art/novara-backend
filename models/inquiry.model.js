const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    firstName:    { type: String, required: true },
    lastName:     { type: String, required: true },
    email:        { type: String, required: true },
    phone:        { type: String },
    message:      { type: String },
    agreeToTerms: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema, "inquiry");