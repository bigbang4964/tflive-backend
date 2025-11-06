import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { email, password, shop_name } = req.body;
    const [exists] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    if (exists.length) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (email, password, shop_name) VALUES (?, ?, ?)",
      [email, hashed, shop_name]
    );
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    if (!rows.length) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
