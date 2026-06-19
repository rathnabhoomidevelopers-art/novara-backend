const User = require("../models/user.model");
const jwt  = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "novara_secret_key_2025";

// Middleware — verify JWT & require admin role
const requireAdmin = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "Unauthorized." });
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ success: false, message: "Admin access required." });
    req.user = decoded;
    next();
  } catch { res.status(401).json({ success: false, message: "Invalid token." }); }
};

// GET /api/users — list all users (admin only)
exports.list = [requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-__v").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
}];

// POST /api/users — create user (admin only)
exports.create = [requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "name, email, password required." });
    const exists = await User.findOne({ email: email.trim() });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered." });
    const user = await User.create({ name, email: email.trim(), password, role: role || "viewer", addedOn: new Date().toLocaleDateString("en-GB") });
    res.status(201).json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
}];

// PUT /api/users/:id — update user (admin only)
exports.update = [requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email.trim();
    if (password) update.password = password;
    if (role) update.role = role;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
}];

// DELETE /api/users/:id — delete user (admin only)
exports.remove = [requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, message: "User removed." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
}];