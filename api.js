require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoclient = require("mongodb").MongoClient;

// node-fetch v2 is CommonJS-compatible; install with: npm install node-fetch@2
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;
const connectionString = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";

// ─── CORS ────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: [
    "https://www.novaranatureestates.com",
    "https://novaranatureestates.com",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── VOICEFLOW CONFIG ────────────────────────────────────────────────────────
const VOICEFLOW_API_KEY     = process.env.VOICEFLOW_API_KEY;
const VOICEFLOW_PROJECT_ID  = process.env.VOICEFLOW_PROJECT_ID;
const ASSISTANT_NAME        = process.env.ASSISTANT_NAME || "Website Assistant";
const ASSISTANT_DESCRIPTION =
  process.env.ASSISTANT_DESCRIPTION ||
  "You are a helpful assistant for this website. Never reveal you are an AI or how you are implemented.";

if (!VOICEFLOW_API_KEY || !VOICEFLOW_PROJECT_ID) {
  console.warn("⚠️  WARNING: VOICEFLOW_API_KEY or VOICEFLOW_PROJECT_ID is missing from .env");
}

// Simple in-memory sessions (resets on server restart)
const sessions = {};

function getSessionState(sessionId) {
  if (!sessions[sessionId]) sessions[sessionId] = { variables: {} };
  return sessions[sessionId];
}

function sanitizeReply(rawText) {
  if (!rawText) return "";
  let text = rawText;
  text = text.replace(
    /(i am|i'm)\s+(an?\s+)?(ai|artificial intelligence|chatbot|bot)/gi,
    `I'm ${ASSISTANT_NAME}`
  );
  text = text.replace(/voiceflow/gi, ASSISTANT_NAME);
  text = text.replace(/openai/gi, ASSISTANT_NAME);
  text = text.replace(/chatgpt/gi, ASSISTANT_NAME);
  if (/api key|secret key|implementation|server\.js|backend|database/gi.test(text)) {
    text =
      "I'm your website assistant. I can help you with information and guidance related to this site.";
  }
  return text.trim();
}

// ─── CHATBOT ROUTE ───────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const sid = sessionId || "demo-user";
    const state = getSessionState(sid);
    state.variables = {
      ...state.variables,
      assistant_name: ASSISTANT_NAME,
      assistant_description: ASSISTANT_DESCRIPTION,
    };

    const url = `https://general-runtime.voiceflow.com/state/user/${encodeURIComponent(sid)}/interact?projectID=${VOICEFLOW_PROJECT_ID}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: VOICEFLOW_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request: { type: "text", payload: message }, state }),
    });

    const data = await response.json();

    let botReply = "";
    if (Array.isArray(data)) {
      botReply = data
        .filter((b) => b.type === "text" || b.type === "speak")
        .map((b) => b.payload?.message || b.payload?.text || "")
        .join("\n")
        .trim();
    }

    if (!botReply) {
      botReply =
        "I'm here to help you with this website. Could you please repeat or rephrase your question?";
    }

    if (data?.state) sessions[sid] = data.state;

    res.json({ reply: sanitizeReply(botReply) });
  } catch (err) {
    console.error("CHATBOT ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── MONGODB HELPER ──────────────────────────────────────────────────────────
function insertAndRespond(collectionName, doc, res) {
  mongoclient
    .connect(connectionString)
    .then((clientObj) => {
      const database = clientObj.db("ecovara");
      return database.collection(collectionName).insertOne(doc);
    })
    .then(() => {
      res.send("Thank You, Our team will reach you soon!.");
    })
    .catch((err) => {
      console.error(`DB ERROR [${collectionName}]:`, err);
      res.status(500).send("Something went wrong. Please try again later.");
    });
}

// ─── CONTACT ROUTE ───────────────────────────────────────────────────────────
app.post("/contact", (req, res) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    inquiry_project: req.body.inquiry_project,
    know_us: req.body.know_us,
    message: req.body.message,
    agreeToTerms: req.body.agreeToTerms,
  };
  insertAndRespond("contact", user, res);
});

// ─── INQUIRY ROUTE ───────────────────────────────────────────────────────────
app.post("/inquiry", (req, res) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    agreeToTerms: req.body.agreeToTerms,
  };
  insertAndRespond("inquiry", user, res);
});

// ─── POP-UP ROUTE ────────────────────────────────────────────────────────────
app.post("/pop-up", (req, res) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    email: req.body.email,
    message: req.body.message,
  };
  insertAndRespond("pop-up", user, res);
});

// ─── BLOGS ROUTE ─────────────────────────────────────────────────────────────
app.post("/blogs", (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    agreeToTerms: req.body.agreeToTerms,
  };
  insertAndRespond("blogs", user, res);
});

// ─── START SERVER ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});