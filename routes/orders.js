import express from "express";
import { pool } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM orders WHERE user_id=?", [req.user.id]);
  res.json(rows);
});

router.post("/", authMiddleware, async (req, res) => {
  const { customer_id, total } = req.body;
  await pool.query("INSERT INTO orders (user_id, customer_id, total) VALUES (?, ?, ?)", [
    req.user.id,
    customer_id,
    total,
  ]);
  res.json({ message: "Order created" });
});

export default router;
