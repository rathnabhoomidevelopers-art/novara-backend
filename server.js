require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const corsOptions = require("./config/cors");
const chatRoutes = require("./routes/chat.routes");
const reviewRoutes = require("./routes/review.routes");
const formRoutes = require("./routes/form.routes");

const app = express();

connectDB();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/", formRoutes);

// Only listen locally, NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // ← Vercel needs this
