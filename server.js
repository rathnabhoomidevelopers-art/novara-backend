require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const corsOptions = require("./config/cors");
const chatRoutes = require("./routes/chat.routes");
const reviewRoutes = require("./routes/review.routes");
const formRoutes = require("./routes/form.routes");

const app = express();

app.use(cors(corsOptions));
app.options('(.*)', cors(corsOptions)); // ← fixed wildcard

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    return res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/", formRoutes);

app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.status(500).json({ error: err.message });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
