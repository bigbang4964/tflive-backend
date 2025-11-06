import express from "express";
import { pool } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM social_accounts WHERE user_id=?", [req.user.id]);
  res.json(rows);
});

router.post("/", authMiddleware, async (req, res) => {
  const { platform, account_name, access_token } = req.body;
  await pool.query(
    "INSERT INTO social_accounts (user_id, platform, account_name, access_token) VALUES (?, ?, ?, ?)",
    [req.user.id, platform, account_name, access_token]
  );
  res.json({ message: "Social account added" });
});

export default router;
