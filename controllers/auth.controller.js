const User = require("../models/user.model");
const jwt  = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "novara_secret_key_2025";

// ── Hardcoded fallback admin (always available even if DB is empty) ───────────
const HARDCODED = [
  { id: "admin", email: "admin@gmail.com", password: "admin@123", role: "admin", name: "Novara Admin" },
];

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required." });

    // Check hardcoded first
    const hc = HARDCODED.find((u) => u.email === email.trim() && u.password === password);
    if (hc) {
      const token = jwt.sign({ id: hc.id, email: hc.email, role: hc.role, name: hc.name }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ success: true, token, user: { email: hc.email, role: hc.role, name: hc.name } });
    }

    // Check DB users
    const user = await User.findOne({ email: email.trim() });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { email: user.email, role: user.role, name: user.name } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/auth/me  (verify token)
exports.me = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "No token." });
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    res.json({ success: true, user: { email: decoded.email, role: decoded.role, name: decoded.name } });
  } catch {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};