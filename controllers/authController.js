const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username",
    [username, email, hashed]
  );
  res.json(result.rows[0]);
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (user.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};