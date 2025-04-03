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
        u.user_id as id, 
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
    
    if (user.password_hash !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        plan: user.plan
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

// Endpoint para registrar un nuevo usuario
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, plan } = req.body;
    
    // Validaciones básicas
    if (!name || !email || !password || !plan) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }

    // Verificar si el email ya existe
    const [existingUsers] = await pool.query(
      'SELECT user_id FROM users WHERE email = ? LIMIT 1', 
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'El email ya está registrado' 
      });
    }

    // Obtener el plan_id correspondiente
    const [plans] = await pool.query(
      'SELECT plan_id FROM plans WHERE plan_name = ? LIMIT 1', 
      [plan.toLowerCase()]
    );
    
    if (plans.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Plan no válido' 
      });
    }

    const planId = plans[0].plan_id;

    // Iniciar transacción
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      // 1. Insertar el nuevo usuario
      const [userResult] = await conn.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [name, email, password] // En producción, deberías hashear la contraseña
      );
      
      const userId = userResult.insertId;

      // 2. Asignar el plan al usuario
      await conn.query(
        'INSERT INTO user_plans (user_id, plan_id, is_active) VALUES (?, ?, TRUE)',
        [userId, planId]
      );

      // Commit de la transacción
      await conn.commit();
      conn.release();

      // Respuesta exitosa
      res.json({
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: userId,
          username: name,
          email: email,
          plan: plan
        },
        token: 'token_simulado_para_desarrollo' // En producción, genera un JWT real
      });

    } catch (error) {
      // Rollback en caso de error
      await conn.rollback();
      conn.release();
      throw error;
    }

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});






// Endpoint para obtener las criptomonedas del usuario
app.get('/api/user/:userId/cryptos', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Primero obtenemos el plan del usuario para saber el límite
    const [plans] = await pool.query(`
      SELECT p.plan_name, p.max_cryptos
      FROM user_plans up
      JOIN plans p ON up.plan_id = p.plan_id
      WHERE up.user_id = ?
      AND up.is_active = TRUE
      LIMIT 1
    `, [userId]);
    
    if (plans.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no tiene plan activo' 
      });
    }

    const userPlan = plans[0];
    
    // Obtenemos las criptomonedas activas del usuario
    const [cryptos] = await pool.query(`
      SELECT 
        c.crypto_id as id,
        c.crypto_name as name,
        c.symbol
      FROM user_cryptos uc
      JOIN cryptocurrencies c ON uc.crypto_id = c.crypto_id
      WHERE uc.user_id = ?
      AND uc.is_active = TRUE
      LIMIT ?
    `, [userId, userPlan.max_cryptos]);
    
    res.json({
      success: true,
      cryptos,
      plan: {
        name: userPlan.plan_name,
        maxCryptos: userPlan.max_cryptos,
        currentCount: cryptos.length
      }
    });

  } catch (error) {
    console.error('Error obteniendo criptomonedas del usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Endpoint para obtener todas las criptomonedas disponibles
app.get('/api/cryptos', async (req, res) => {
  try {
    const [cryptos] = await pool.query(`
      SELECT 
        crypto_id as id,
        crypto_name as name,
        symbol
      FROM cryptocurrencies
      ORDER BY crypto_name
    `);
    
    res.json({
      success: true,
      cryptos
    });

  } catch (error) {
    console.error('Error obteniendo criptomonedas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});




app.post('/api/auth/register', async (req, res) => {
  let conn;
  try {
    const { name, email, password, plan } = req.body;
    
    // Validaciones básicas
    if (!name || !email || !password || !plan) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }

    // Verificar conexión a DB
    conn = await pool.getConnection();
    
    // Verificar si el email ya existe
    const [existingUsers] = await conn.query(
      'SELECT user_id FROM users WHERE email = ? LIMIT 1', 
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'El email ya está registrado' 
      });
    }

    // Obtener el plan_id
    const [plans] = await conn.query(
      'SELECT plan_id FROM plans WHERE plan_name = ? LIMIT 1', 
      [plan.toLowerCase()]
    );
    
    if (plans.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Plan no válido' 
      });
    }

    const planId = plans[0].plan_id;

    await conn.beginTransaction();

    // 1. Insertar el nuevo usuario
    const [userResult] = await conn.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password]
    );
    
    const userId = userResult.insertId;

    // 2. Asignar el plan al usuario
    await conn.query(
      'INSERT INTO user_plans (user_id, plan_id, is_active) VALUES (?, ?, TRUE)',
      [userId, planId]
    );

    await conn.commit();
    
    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: userId,
        username: name,
        email: email,
        plan: plan
      },
      token: 'token_simulado_para_desarrollo'
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});






  app.post('/api/user/:userId/cryptos', async (req, res) => {
    let conn;
    try {
      const userId = parseInt(req.params.userId);
      const { cryptos } = req.body;

      // Validaciones más robustas
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID de usuario no válido' 
        });
      }

      if (!cryptos || !Array.isArray(cryptos)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Se requiere un array de criptomonedas' 
        });
      }

      // Verificar que todos los IDs sean números válidos
      if (cryptos.some(id => isNaN(parseInt(id)))) {
        return res.status(400).json({ 
          success: false, 
          message: 'IDs de criptomonedas no válidos' 
        });
      }

      conn = await pool.getConnection();
      await conn.beginTransaction();

      try {
        // 1. Verificar existencia del usuario
        const [users] = await conn.query(
          'SELECT user_id FROM users WHERE user_id = ? LIMIT 1',
          [userId]
        );
        
        if (users.length === 0) {
          throw new Error('Usuario no encontrado');
        }

        // 2. Obtener límite del plan
        const [plans] = await conn.query(`
          SELECT p.max_cryptos
          FROM user_plans up
          JOIN plans p ON up.plan_id = p.plan_id
          WHERE up.user_id = ?
          AND up.is_active = TRUE
          LIMIT 1
        `, [userId]);

        if (plans.length === 0) {
          throw new Error('Usuario no tiene plan activo');
        }

        const maxCryptos = plans[0].max_cryptos;

        if (cryptos.length > maxCryptos) {
          throw new Error(`Excedes el límite de ${maxCryptos} criptomonedas`);
        }

        // 3. Verificar existencia de las criptomonedas
        const [existingCryptos] = await conn.query(`
          SELECT crypto_id 
          FROM cryptocurrencies 
          WHERE crypto_id IN (?)
        `, [cryptos]);

        if (existingCryptos.length !== cryptos.length) {
          throw new Error('Alguna criptomoneda no existe');
        }

        // 4. Desactivar todas las criptomonedas actuales
        await conn.query(`
          UPDATE user_cryptos 
          SET is_active = FALSE, 
              updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = ?
        `, [userId]);

        // 5. Activar/insertar las nuevas
        for (const cryptoId of cryptos) {
          const [existing] = await conn.query(`
            SELECT user_crypto_id 
            FROM user_cryptos 
            WHERE user_id = ? 
            AND crypto_id = ?
            LIMIT 1
          `, [userId, cryptoId]);

          if (existing.length > 0) {
            await conn.query(`
              UPDATE user_cryptos 
              SET is_active = TRUE,
                  updated_at = CURRENT_TIMESTAMP 
              WHERE user_id = ? 
              AND crypto_id = ?
            `, [userId, cryptoId]);
          } else {
            await conn.query(`
              INSERT INTO user_cryptos (user_id, crypto_id, is_active)
              VALUES (?, ?, TRUE)
            `, [userId, cryptoId]);
          }
        }

        await conn.commit();
        
        res.json({ 
          success: true,
          message: 'Criptomonedas actualizadas correctamente',
          selectedCount: cryptos.length
        });

      } catch (error) {
        await conn.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error al guardar criptomonedas:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });




  // Endpoint para actualizar el plan del usuario
app.put('/api/user/:userId/plan', async (req, res) => {
  let conn;
  try {
    const userId = parseInt(req.params.userId);
    const { plan } = req.body;

    // Validaciones
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de usuario no válido' 
      });
    }

    if (!plan || !['basic', 'pro', 'premium'].includes(plan)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Plan no válido' 
      });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      // 1. Verificar que el usuario existe
      const [users] = await conn.query(
        'SELECT user_id FROM users WHERE user_id = ? LIMIT 1',
        [userId]
      );
      
      if (users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      // 2. Obtener el plan_id del nuevo plan
      const [plans] = await conn.query(
        'SELECT plan_id FROM plans WHERE plan_name = ? LIMIT 1',
        [plan]
      );
      
      if (plans.length === 0) {
        throw new Error('Plan no encontrado');
      }

      const planId = plans[0].plan_id;

      // 3. Desactivar el plan actual
      await conn.query(`
        UPDATE user_plans 
        SET is_active = FALSE, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ? 
        AND is_active = TRUE
      `, [userId]);

      // 4. Verificar si el usuario ya tenía este plan anteriormente
      const [existingPlans] = await conn.query(`
        SELECT user_plan_id 
        FROM user_plans 
        WHERE user_id = ? 
        AND plan_id = ?
        LIMIT 1
      `, [userId, planId]);

      if (existingPlans.length > 0) {
        // Reactivar el plan existente
        await conn.query(`
          UPDATE user_plans 
          SET is_active = TRUE,
              updated_at = CURRENT_TIMESTAMP 
          WHERE user_plan_id = ?
        `, [existingPlans[0].user_plan_id]);
      } else {
        // Crear nueva relación de plan
        await conn.query(`
          INSERT INTO user_plans (user_id, plan_id, is_active)
          VALUES (?, ?, TRUE)
        `, [userId, planId]);
      }

      await conn.commit();
      
      res.json({ 
        success: true,
        message: 'Plan actualizado correctamente',
        newPlan: plan
      });

    } catch (error) {
      await conn.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error al actualizar el plan:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});



// Endpoint para guardar los mensajes
app.post('/api/save-messages', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const filePath = path.join(__dirname, 'messages.json');
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
  
  res.json({ success: true });
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
      userCryptos: 'GET /api/user/:userId/cryptos',
      allCryptos: 'GET /api/cryptos',
      health: 'GET /api/health'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔑 Ruta de login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`💰 Ruta de criptomonedas del usuario: GET http://localhost:${PORT}/api/user/:userId/cryptos`);
  console.log(`📊 Ruta de todas las criptomonedas: GET http://localhost:${PORT}/api/cryptos`);
  console.log(`🩺 Ruta de salud: GET http://localhost:${PORT}/api/health\n`);
});