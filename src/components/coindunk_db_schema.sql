-- COINDUNK DATABASE SCHEMA - Versión Simplificada
-- Elimina tablas existentes (solo para desarrollo)
DROP DATABASE IF EXISTS coindunk;
CREATE DATABASE coindunk;
USE coindunk;

DROP TABLE IF EXISTS user_cryptos;
DROP TABLE IF EXISTS user_plans;
DROP TABLE IF EXISTS cryptocurrencies;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS users;

-- Tabla de usuarios
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de planes (sin precios)
CREATE TABLE plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(20) NOT NULL UNIQUE,
    max_cryptos INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de criptomonedas (solo nombre y símbolo)
CREATE TABLE cryptocurrencies (
    crypto_id INT AUTO_INCREMENT PRIMARY KEY,
    crypto_name VARCHAR(50) NOT NULL UNIQUE,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de relación usuario-plan
CREATE TABLE user_plans (
    user_plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de criptomonedas favoritas de usuarios
CREATE TABLE user_cryptos (
    user_crypto_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crypto_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (crypto_id) REFERENCES cryptocurrencies(crypto_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_crypto (user_id, crypto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales de planes
INSERT INTO plans (plan_name, max_cryptos, description) VALUES
('basic', 3, 'Plan gratuito con acceso a 3 criptomonedas'),
('pro', 10, 'Plan profesional con acceso a 10 criptomonedas'),
('premium', 999, 'Plan premium con acceso ilimitado');

-- Datos iniciales de criptomonedas (solo nombre y símbolo)
INSERT INTO cryptocurrencies (crypto_name, symbol) VALUES
('Bitcoin', 'BTC'),
('Ethereum', 'ETH'),
('Cardano', 'ADA'),
('Solana', 'SOL'),
('Polkadot', 'DOT'),
('Tether', 'USDT'),
('Ripple', 'XRP'),
('Dogecoin', 'DOGE'),
('Binance Coin', 'BNB'),
('Litecoin', 'LTC'),
('Chainlink', 'LINK'),
('Polygon', 'MATIC'),
('Stellar', 'XLM'),
('Uniswap', 'UNI'),
('Avalanche', 'AVAX'),
('Cosmos', 'ATOM'),
('Monero', 'XMR'),
('Algorand', 'ALGO'),
('VeChain', 'VET'),
('Filecoin', 'FIL'),
('Tron', 'TRX'),
('EOS', 'EOS');


-- Usuarios de ejemplo 
INSERT INTO users (username, email, password_hash) VALUES
('user', 'user@coindunk.com', 'user'),
('user2', 'user2@coindunk.com', 'user2'),
('user3', 'user3@coindunk.com', 'user3');

-- Asignación de planes
INSERT INTO user_plans (user_id, plan_id) VALUES 
(1, 1),  -- user con plan básico
(2, 2),  -- user2 con plan Dunk Pro
(3, 3);  -- pro_trader con plan premium

-- Asignación de criptomonedas a usuarios
-- User 1 (básico)
INSERT INTO user_cryptos (user_id, crypto_id) VALUES
(1, 1), (1, 2), (1, 3);  -- Bitcoin, Ethereum, Cardano

-- User 2 (Dunk Pro)
INSERT INTO user_cryptos (user_id, crypto_id) VALUES
(2, 4),  -- Solana
(2, 5),  -- Polkadot
(2, 6),  -- Tether
(2, 7),  -- Ripple
(2, 8),  -- Dogecoin
(2, 9),  -- Binance Coin
(2, 10), -- Litecoin
(2, 11), -- Chainlink
(2, 12), -- Polygon
(2, 13); -- Stellar

-- User 3 (premium - casi todas)
INSERT INTO user_cryptos (user_id, crypto_id) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
(3, 6), (3, 7), (3, 8), (3, 9), (3, 10),
(3, 11), (3, 12), (3, 13), (3, 14), (3, 15),
(3, 16), (3, 17), (3, 18), (3, 19), (3, 20);