import express from "express";
import { pool } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM customers WHERE user_id=?", [req.user.id]);
  res.json(rows);
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, phone, address } = req.body;
  await pool.query(
    "INSERT INTO customers (user_id, name, phone, address) VALUES (?, ?, ?, ?)",
    [req.user.id, name, phone, address]
  );
  res.json({ message: "Customer added" });
});

export default router;
