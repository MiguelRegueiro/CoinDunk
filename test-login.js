const axios = require('axios');
const chalk = require('chalk');

// Configuración mejorada
const BASE_URL = 'http://localhost:5000/api';
const TEST_USERS = [
  {
    email: 'user@coindunk.com',
    password: 'user',
    description: 'Usuario básico con credenciales correctas',
    expectedPlan: 'basic'
  },
  {
    email: 'user2@coindunk.com',
    password: 'user2',
    description: 'Usuario pro con credenciales correctas',
    expectedPlan: 'pro'
  },
  {
    email: 'user3@coindunk.com',
    password: 'user3',
    description: 'Usuario premium con credenciales correctas',
    expectedPlan: 'premium'
  }
];

// Colores para mejor visualización
const colors = {
  success: chalk.green.bold,
  error: chalk.red.bold,
  info: chalk.blue.bold,
  warning: chalk.yellow.bold
};

// Función mejorada para mostrar resultados
function logTestResult(test, result, response = null) {
  const status = result.passed ? colors.success('✓') : colors.error('✗');
  console.log(`${status} ${test.description}`);
  
  if (response) {
    console.log(colors.info('   Respuesta:'), {
      status: response.status,
      data: response.data || 'Sin datos'
    });
  }
  
  if (result.message) {
    console.log(colors.warning('   Detalles:'), result.message);
  }
}

// Función para verificar el servidor
async function checkServerHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.status === 'OK') {
      console.log(colors.success('✅ Servidor funcionando correctamente'));
      return true;
    }
    throw new Error('Servidor no está listo');
  } catch (error) {
    console.log(colors.error('\n⚠️  Problema de conexión con el servidor:'));
    console.log(colors.info('   Asegúrate de que:'));
    console.log('   1. El servidor esté ejecutándose (node server.js)');
    console.log('   2. MySQL esté corriendo y la base de datos esté configurada');
    console.log('   3. El puerto 5000 esté disponible');
    return false;
  }
}

// Pruebas de autenticación mejoradas
async function runAuthTests() {
  console.log(colors.info('\n🔐 Ejecutando pruebas de autenticación...'));
  
  let passedTests = 0;
  const totalTests = TEST_USERS.length + 2; // Usuarios válidos + 2 casos inválidos

  // 1. Pruebas con usuarios existentes
  for (const user of TEST_USERS) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      const passed = response.status === 200 && 
                    response.data.user && 
                    response.data.user.plan === user.expectedPlan;
      
      logTestResult(user, {
        passed,
        message: passed ? '' : `Plan esperado: ${user.expectedPlan}`
      });
      
      if (passed) passedTests++;
    } catch (error) {
      logTestResult(user, {
        passed: false,
        message: `Error: ${error.message}`
      });
    }
  }

  // 2. Prueba con credenciales incorrectas
  const wrongPassTest = {
    description: 'Autenticación con contraseña incorrecta',
    shouldPass: false
  };
  
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: 'user@coindunk.com',
      password: 'contraseña_incorrecta'
    });
    logTestResult(wrongPassTest, { passed: false });
  } catch (error) {
    const passed = error.response.status === 401;
    logTestResult(wrongPassTest, {
      passed,
      message: passed ? 'Correctamente rechazado' : 'Código de estado inesperado'
    });
    if (passed) passedTests++;
  }

  // 3. Prueba con usuario inexistente
  const nonExistentTest = {
    description: 'Autenticación con usuario inexistente',
    shouldPass: false
  };
  
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: 'noexiste@coindunk.com',
      password: 'cualquiercontraseña'
    });
    logTestResult(nonExistentTest, { passed: false });
  } catch (error) {
    const passed = error.response.status === 401 || error.response.status === 404;
    logTestResult(nonExistentTest, {
      passed,
      message: passed ? 'Correctamente rechazado' : 'Código de estado inesperado'
    });
    if (passed) passedTests++;
  }

  // Resumen final
  console.log(colors.info('\n📊 Resultados de autenticación:'));
  console.log(`   ${colors.success(`Pasadas: ${passedTests}`)}`);
  console.log(`   ${colors.error(`Falladas: ${totalTests - passedTests}`)}`);
  console.log(`   ${colors.info(`Total: ${totalTests}`)}`);
  
  return passedTests === totalTests;
}

// Ejecución principal mejorada
async function main() {
  console.log(chalk.bold('\n🚀 Iniciando pruebas de CoinDunk'));
  console.log(chalk.gray('----------------------------------------'));
  
  if (!await checkServerHealth()) {
    process.exit(1);
  }

  const authSuccess = await runAuthTests();
  
  console.log(chalk.gray('----------------------------------------'));
  console.log(chalk.bold('\n🏁 Pruebas completadas'));
  console.log(`Estado final: ${authSuccess ? colors.success('ÉXITO') : colors.error('FALLIDO')}`);
  
  process.exit(authSuccess ? 0 : 1);
}

main();