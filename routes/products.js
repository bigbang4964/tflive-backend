import express from "express";
import { pool } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE user_id=?", [req.user.id]);
  res.json(rows);
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, code, price, unit, logo } = req.body;
  await pool.query(
    "INSERT INTO products (user_id, name, code, price, unit, logo) VALUES (?, ?, ?, ?, ?, ?)",
    [req.user.id, name, code, price, unit, logo]
  );
  res.json({ message: "Product added" });
});

export default router;
