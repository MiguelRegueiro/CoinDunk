const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 5000;

// Configuración de middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Configuración de conexión a MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'coindunk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificación de conexión a la base de datos
pool.getConnection()
  .then(conn => {
    conn.release();
    console.log('✅ Conexión a MySQL establecida correctamente');
  })
  .catch(err => {
    console.error('❌ Error de conexión a MySQL:', err.message);
    process.exit(1);
  });

// Ruta de login mejorada que incluye el plan del usuario
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    const [users] = await pool.query(`
      SELECT 
        u.user_id, 
        u.username, 
        u.email, 
        u.password_hash,
        p.plan_name as plan
      FROM users u
      JOIN user_plans up ON u.user_id = up.user_id
      JOIN plans p ON up.plan_id = p.plan_id
      WHERE u.email = ? 
      AND up.is_active = TRUE
      LIMIT 1
    `, [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    const user = users[0];
    
    // Comparación directa para desarrollo (en producción usar bcrypt)
    if (user.password_hash !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    // Respuesta exitosa con el plan incluido
    res.json({
      success: true,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        plan: user.plan // Añadido el plan a la respuesta
      },
      token: 'token_simulado_para_desarrollo'
    });

  } catch (error) {
    console.error('Error en el endpoint /api/auth/login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Endpoint para obtener el plan del usuario
app.get('/api/user/:userId/plan', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const [plans] = await pool.query(`
      SELECT p.plan_name
      FROM user_plans up
      JOIN plans p ON up.plan_id = p.plan_id
      WHERE up.user_id = ?
      AND up.is_active = TRUE
      LIMIT 1
    `, [userId]);
    
    if (plans.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plan no encontrado' 
      });
    }

    res.json({
      success: true,
      plan: plans[0].plan_name
    });

  } catch (error) {
    console.error('Error obteniendo plan del usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Ruta de verificación de salud
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({
      status: 'OK',
      database: rows[0].solution === 2 ? 'Conectado' : 'Error',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      database: 'Desconectado',
      error: error.message
    });
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    availableEndpoints: {
      login: 'POST /api/auth/login',
      userPlan: 'GET /api/user/:userId/plan',
      health: 'GET /api/health'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔑 Ruta de login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`📋 Ruta de plan de usuario: GET http://localhost:${PORT}/api/user/:userId/plan`);
  console.log(`🩺 Ruta de salud: GET http://localhost:${PORT}/api/health\n`);
});