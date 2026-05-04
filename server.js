require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const corsOptions = require("./config/cors");
const chatRoutes = require("./routes/chat.routes");
const reviewRoutes = require("./routes/review.routes");
const formRoutes = require("./routes/form.routes");

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── DB connect per request (serverless-safe) ────────────────────────────────
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/", formRoutes);

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Crashed:', err.message);
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.status(500).json({ error: err.message });
});

// ─── LOCAL ONLY ───────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
