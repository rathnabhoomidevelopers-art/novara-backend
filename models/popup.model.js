const mongoose = require("mongoose");

const popupSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    mobile:    { type: String },
    email:     { type: String, required: true },
    message:   { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Popup", popupSchema, "pop-up");