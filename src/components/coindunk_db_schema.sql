-- COINDUNK DATABASE SCHEMA - Versión Final Funcional
DROP DATABASE IF EXISTS coindunk;
CREATE DATABASE coindunk;
USE coindunk;

-- Tablas en orden correcto para evitar problemas de referencias
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

-- Tabla de planes
CREATE TABLE plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(20) NOT NULL UNIQUE,
    max_cryptos INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de criptomonedas
CREATE TABLE cryptocurrencies (
    crypto_id INT AUTO_INCREMENT PRIMARY KEY,
    crypto_name VARCHAR(50) NOT NULL UNIQUE,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de relación usuario-plan
CREATE TABLE user_plans (
    user_plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(plan_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_plan (user_id, plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de criptomonedas favoritas de usuarios (ACTUALIZADA)
CREATE TABLE user_cryptos (
    user_crypto_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crypto_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (crypto_id) REFERENCES cryptocurrencies(crypto_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_crypto (user_id, crypto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales de planes
INSERT INTO plans (plan_name, max_cryptos, description) VALUES
('basic', 3, 'Plan gratuito con acceso a 3 criptomonedas'),
('pro', 10, 'Plan profesional con acceso a 10 criptomonedas'),
('premium', 999, 'Plan premium con acceso ilimitado');

-- Datos iniciales de criptomonedas
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

-- Usuarios de ejemplo con contraseñas seguras (en producción usar bcrypt con salt)
INSERT INTO users (username, email, password_hash) VALUES
('user', 'user@coindunk.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqOqBd4r1V8R3ZJ5D5t2fI6hQ1WXy'),
('user2', 'user2@coindunk.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqOqBd4r1V8R3ZJ5D5t2fI6hQ1WXy'),
('user3', 'user3@coindunk.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqOqBd4r1V8R3ZJ5D5t2fI6hQ1WXy');

-- Asignación de planes
INSERT INTO user_plans (user_id, plan_id) VALUES 
(1, 1),  -- user con plan básico
(2, 2),  -- user2 con plan pro
(3, 3);  -- user3 con plan premium

-- Asignación inicial de criptomonedas (opcional, puede hacerse desde la app)
INSERT INTO user_cryptos (user_id, crypto_id) VALUES
-- User 1 (básico: 3 criptos)
(1, 1), (1, 2), (1, 3),

-- User 2 (pro: 10 criptos)
(2, 4), (2, 5), (2, 6), (2, 7), (2, 8),
(2, 9), (2, 10), (2, 11), (2, 12), (2, 13),

-- User 3 (premium: 20 criptos)
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
(3, 6), (3, 7), (3, 8), (3, 9), (3, 10),
(3, 11), (3, 12), (3, 13), (3, 14), (3, 15),
(3, 16), (3, 17), (3, 18), (3, 19), (3, 20);