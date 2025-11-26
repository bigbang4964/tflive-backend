-- Create database (chạy riêng nếu cần)
-- CREATE DATABASE liveshop;

-- =====================================================================================
-- Users
-- =====================================================================================
CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    shop_name VARCHAR(255),
    shop_logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================================================
-- Social Accounts
-- =====================================================================================
CREATE TABLE social_accounts (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('facebook','tiktok')),
    account_name VARCHAR(255),
    access_token TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================================================
-- Customers
-- =====================================================================================
CREATE TABLE customers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
    status VARCHAR(20) DEFAULT 'normal' CHECK (status IN ('normal','warning','blocked')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================================================
-- Products
-- =====================================================================================
CREATE TABLE products (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255),
    code VARCHAR(50),
    logo VARCHAR(255),
    unit VARCHAR(50),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================================================
-- Draft Orders
-- =====================================================================================
CREATE TABLE draft_orders (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    customer_id INT,
    social_platform VARCHAR(20) CHECK (social_platform IN ('facebook','tiktok')),
    social_id VARCHAR(50),
    comment TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','converted')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- =====================================================================================
-- Orders
-- =====================================================================================
CREATE TABLE orders (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    customer_id INT,
    total DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- =====================================================================================
-- Order Items
-- =====================================================================================
CREATE TABLE order_items (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================================================
-- Live Sessions
-- =====================================================================================
CREATE TABLE live_sessions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    platform VARCHAR(20) CHECK (platform IN ('facebook','tiktok')),
    session_id VARCHAR(50),
    total_comments INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
