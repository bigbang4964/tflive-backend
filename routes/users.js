import express from "express";
import { pool } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  const [user] = await pool.query("SELECT id, email, shop_name, shop_logo FROM users WHERE id=?", [
    req.user.id,
  ]);
  res.json(user[0]);
});

router.put("/update", authMiddleware, async (req, res) => {
  const { shop_name, shop_logo } = req.body;
  await pool.query("UPDATE users SET shop_name=?, shop_logo=? WHERE id=?", [
    shop_name,
    shop_logo,
    req.user.id,
  ]);
  res.json({ message: "Profile updated" });
});

export default router;
