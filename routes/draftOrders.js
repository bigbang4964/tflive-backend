import express from "express";
import { pool } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM draft_orders WHERE user_id=?", [req.user.id]);
  res.json(rows);
});

router.post("/", authMiddleware, async (req, res) => {
  const { customer_id, social_platform, social_id, comment } = req.body;
  await pool.query(
    "INSERT INTO draft_orders (user_id, customer_id, social_platform, social_id, comment) VALUES (?, ?, ?, ?, ?)",
    [req.user.id, customer_id, social_platform, social_id, comment]
  );
  res.json({ message: "Draft order created" });
});

export default router;
