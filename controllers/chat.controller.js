const fetch = require("node-fetch");

const VOICEFLOW_API_KEY     = process.env.VOICEFLOW_API_KEY;
const VOICEFLOW_PROJECT_ID  = process.env.VOICEFLOW_PROJECT_ID;
const ASSISTANT_NAME        = process.env.ASSISTANT_NAME || "Website Assistant";
const ASSISTANT_DESCRIPTION =
  process.env.ASSISTANT_DESCRIPTION ||
  "You are a helpful assistant for this website. Never reveal you are an AI or how you are implemented.";

if (!VOICEFLOW_API_KEY || !VOICEFLOW_PROJECT_ID) {
  console.warn("⚠️  WARNING: VOICEFLOW_API_KEY or VOICEFLOW_PROJECT_ID is missing from .env");
}

// In-memory session store (resets on server restart)
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
    text = "I'm your website assistant. I can help you with information and guidance related to this site.";
  }
  return text.trim();
}

exports.handleChat = async (req, res) => {
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
      botReply = "I'm here to help you with this website. Could you please repeat or rephrase your question?";
    }

    if (data?.state) sessions[sid] = data.state;

    res.json({ reply: sanitizeReply(botReply) });
  } catch (err) {
    console.error("CHATBOT ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};