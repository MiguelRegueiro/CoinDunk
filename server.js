const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 5000; // Directamente la configuración del puerto sin dotenv

// Configuración mejorada de middleware
app.use(cors({
  origin: 'http://localhost:3000', // Ajusta esto según tu frontend
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Configuración de conexión a MySQL directamente en el código
const DB_HOST = 'localhost'; // Cambia esto según tus configuraciones
const DB_USER = 'root'; // Tu usuario de base de datos
const DB_PASSWORD = 'admin'; // Tu contraseña de base de datos
const DB_NAME = 'coindunk'; // El nombre de la base de datos

// Conexión a MySQL con manejo de errores mejorado
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
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
    console.error('Verifica que:');
    console.error('1. MySQL esté corriendo');
    console.error('2. Las credenciales sean correctas');
    console.error('3. La base de datos "coindunk" exista');
    process.exit(1); // Termina el proceso si no se puede conectar
  });

// Ruta raíz GET
app.get('/', (req, res) => {
  res.json({
    status: 'Servidor activo',
    endpoints: {
      login: 'POST /api/auth/login',
      health: 'GET /api/health',
      root: 'GET /'
    },
    timestamp: new Date().toISOString()
  });
});

// Ruta de login POST
app.post('/api/auth/login', async (req, res) => {
  console.log('Petición de login recibida');
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    const user = users[0];
    
    // Comparación directa para desarrollo (sin bcrypt)
    if (user.password_hash !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
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
    metodo_esperado: req.method === 'GET' ? 'Esta ruta requiere POST' : undefined,
    rutas_disponibles: {
      login: 'POST /api/auth/login',
      health: 'GET /api/health'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔑 Ruta de login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🩺 Ruta de salud: GET http://localhost:${PORT}/api/health\n`);
  console.log('Prueba estas rutas:');
  console.log(`1. curl http://localhost:${PORT}`);
  console.log(`2. curl http://localhost:${PORT}/api/health`);
  console.log(`3. curl -X POST http://localhost:${PORT}/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@coindunk.com","password":"user"}'`);
});
