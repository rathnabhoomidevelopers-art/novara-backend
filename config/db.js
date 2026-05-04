const mongoose = require("mongoose");

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI.endsWith("/")
    ? `${process.env.MONGO_URI}ecovara`
    : process.env.MONGO_URI.includes("/ecovara")
    ? process.env.MONGO_URI
    : `${process.env.MONGO_URI}/ecovara`;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    }).then((m) => {
      console.log("✅ MongoDB connected");
      return m;
    }).catch((err) => {
      cached.promise = null; // reset so next request retries
      console.error("❌ MongoDB connection error:", err.message);
      throw err; // let the route handler return a proper 500
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
