require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const corsOptions = require("./config/cors");

const chatRoutes = require("./routes/chat.routes");
const reviewRoutes = require("./routes/review.routes");
const formRoutes = require("./routes/form.routes");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── DB CONNECTION ────────────────────────────────────────────────────────────
connectDB();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/", formRoutes);

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});