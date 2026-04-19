const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI.endsWith("/")
      ? `${process.env.MONGO_URI}ecovara`
      : process.env.MONGO_URI.includes("/ecovara")
      ? process.env.MONGO_URI
      : `${process.env.MONGO_URI}/ecovara`;

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;