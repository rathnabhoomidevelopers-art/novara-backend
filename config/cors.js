const allowedOrigins = [
  "https://www.novaranatureestates.com",
  "https://novaranatureestates.com",
  "http://localhost:3000",
  "http://localhost:5173", // Vite dev server (just in case)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  preflightContinue: false,
};

module.exports = corsOptions;