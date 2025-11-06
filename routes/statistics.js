import express from "express";
import { pool } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const [stats] = await pool.query(
    `SELECT 
      (SELECT COUNT(*) FROM customers WHERE user_id=?) AS total_customers,
      (SELECT COUNT(*) FROM products WHERE user_id=?) AS total_products,
      (SELECT COUNT(*) FROM orders WHERE user_id=?) AS total_orders,
      (SELECT IFNULL(SUM(total),0) FROM orders WHERE user_id=?) AS total_revenue`,
    [req.user.id, req.user.id, req.user.id, req.user.id]
  );
  res.json(stats[0]);
});

export default router;
