const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 5000;

// 1. Configuración mejorada de middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de logging para desarrollo
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 2. Configuración de conexión a MySQL con variables de entorno
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'coindunk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'UTC'
};

const pool = mysql.createPool(DB_CONFIG);

// 3. Verificación mejorada de conexión a la base de datos
const checkDatabaseConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    // Verificar que las tablas necesarias existan
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.error('❌ La tabla "users" no existe en la base de datos');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    console.error('Verifica que:');
    console.error('1. MySQL esté corriendo');
    console.error('2. Las credenciales sean correctas');
    console.error(`3. La base de datos "${DB_CONFIG.database}" exista`);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
};

checkDatabaseConnection();

// 4. Rutas mejoradas con manejo de errores

// Ruta de verificación de salud mejorada
app.get('/api/health', async (req, res) => {
  try {
    const [dbResult] = await pool.query('SELECT NOW() AS db_time, 1+1 AS test_value');
    const [usersCount] = await pool.query('SELECT COUNT(*) AS count FROM users');
    
    res.json({
      status: 'OK',
      serverTime: new Date().toISOString(),
      database: {
        status: 'OK',
        time: dbResult[0].db_time,
        testValue: dbResult[0].test_value,
        usersCount: usersCount[0].count
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'Error',
      database: 'Desconectado',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Ruta de login mejorada
app.post('/api/auth/login', async (req, res) => {
  console.log('Petición de login recibida:', req.body);
  
  try {
    const { email, password } = req.body;
    
    // Validación robusta
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos',
        received: { email: !!email, password: !!password }
      });
    }

    // Query segura con solo los campos necesarios
    const [users] = await pool.query(
      'SELECT user_id, username, email, password_hash FROM users WHERE email = ? LIMIT 1', 
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado',
        suggestion: 'Verifique el email o registrese'
      });
    }

    const user = users[0];
    
    // Comparación directa (en producción usar bcrypt)
    if (user.password_hash !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Contraseña incorrecta',
        suggestion: 'Verifique su contraseña'
      });
    }

    // Generar token simulado (en producción usar JWT)
    const simulatedToken = `dev_token_${user.user_id}_${Date.now()}`;
    
    // Respuesta exitosa con datos relevantes
    res.json({
      success: true,
      message: 'Autenticación exitosa',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      },
      token: simulatedToken,
      expiresIn: '24h', // Tiempo de expiración para el token
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en login:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId: req.id
    });
  }
});

// 5. Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 6. Manejo de rutas no encontradas mejorado
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    requestedPath: req.path,
    method: req.method,
    availableEndpoints: {
      login: { method: 'POST', path: '/api/auth/login' },
      health: { method: 'GET', path: '/api/health' }
    },
    timestamp: new Date().toISOString()
  });
});

// 7. Inicio del servidor con más información
const server = app.listen(PORT, () => {
  const { address, port } = server.address();
  console.log(`\n🚀 Servidor corriendo en http://${address}:${port}`);
  console.log(`🔑 Ruta de login: POST http://localhost:${port}/api/auth/login`);
  console.log(`🩺 Ruta de salud: GET http://localhost:${port}/api/health\n`);
  console.log('Configuración de base de datos:', {
    host: DB_CONFIG.host,
    database: DB_CONFIG.database,
    user: DB_CONFIG.user
  });
  console.log('\nPrueba estas rutas:');
  console.log(`1. curl http://localhost:${port}`);
  console.log(`2. curl http://localhost:${port}/api/health`);
  console.log(`3. curl -X POST http://localhost:${port}/api/auth/login \\
    -H "Content-Type: application/json" \\
    -d '{"email":"user@coindunk.com","password":"user"}'`);
});

// Manejo de cierre adecuado
process.on('SIGTERM', () => {
  console.log('Recibido SIGTERM. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    pool.end();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recibido SIGINT. Cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    pool.end();
    process.exit(0);
  });
});