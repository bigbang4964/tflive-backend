import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import socialRoutes from "./routes/socialAccounts.js";
import customersRoutes from "./routes/customers.js";
import productsRoutes from "./routes/products.js";
import draftOrdersRoutes from "./routes/draftOrders.js";
import ordersRoutes from "./routes/orders.js";
import statisticsRoutes from "./routes/statistics.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/social-accounts", socialRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/draft-orders", draftOrdersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/statistics", statisticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
