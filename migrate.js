// migrate.js
const mysql = require("mysql2/promise");
require("dotenv").config();

async function migrate() {
    const db = await mysql.createConnection({
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        port: process.env.MYSQLPORT
    });

    console.log("🚀 Connected to MySQL Railway!");

    const queries = [

        // USERS
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            shop_name VARCHAR(255),
            shop_logo VARCHAR(255),
            created_at DATETIME DEFAULT NULL
        );`,

        // SOCIAL ACCOUNTS
        `CREATE TABLE IF NOT EXISTS social_accounts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            platform ENUM('facebook','tiktok') NOT NULL,
            account_name VARCHAR(255),
            access_token TEXT,
            created_at DATETIME DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`,

        // CUSTOMERS
        `CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            logo VARCHAR(255),
            name VARCHAR(255),
            facebook_id VARCHAR(50),
            tiktok_id VARCHAR(50),
            phone VARCHAR(20),
            address VARCHAR(255),
            total_orders INT DEFAULT 0,
            total_received DECIMAL(10,2) DEFAULT 0,
            total_spent DECIMAL(10,2) DEFAULT 0,
            status ENUM('normal','warning','blocked') DEFAULT 'normal',
            created_at DATETIME DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`,

        // PRODUCTS
        `CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255),
            code VARCHAR(50),
            logo VARCHAR(255),
            unit VARCHAR(50),
            price DECIMAL(10,2),
            created_at DATETIME DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`,

        // DRAFT ORDERS
        `CREATE TABLE IF NOT EXISTS draft_orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            customer_id INT,
            social_platform ENUM('facebook','tiktok'),
            social_id VARCHAR(50),
            comment TEXT,
            status ENUM('pending','converted') DEFAULT 'pending',
            created_at DATETIME DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );`,

        // ORDERS
        `CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            customer_id INT,
            total DECIMAL(10,2) DEFAULT 0,
            status ENUM('active','cancelled') DEFAULT 'active',
            created_at DATETIME DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );`,

        // ORDER ITEMS
        `CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT DEFAULT 1,
            price DECIMAL(10,2),
            created_at DATETIME DEFAULT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );`,

        // LIVE SESSIONS
        `CREATE TABLE IF NOT EXISTS live_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            platform ENUM('facebook','tiktok'),
            session_id VARCHAR(50),
            total_comments INT DEFAULT 0,
            total_orders INT DEFAULT 0,
            revenue DECIMAL(10,2) DEFAULT 0,
            created_at DATETIME DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`
    ];

    for (const query of queries) {
        await db.execute(query);
        console.log("✔ Executed:");
        console.log(query.split("(")[0]); // log tên bảng
    }

    console.log("🎉 Database migration completed successfully!");
    await db.end();
}

migrate().catch(err => {
    console.error("❌ Migration failed:", err);
});
