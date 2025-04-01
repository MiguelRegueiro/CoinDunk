const axios = require('axios');
const chalk = require('chalk');

// Configuración
const API_URL = 'http://localhost:5000/api/auth/login';
const TEST_CASES = [
  {
    email: 'user@coindunk.com',
    password: 'user123',
    description: 'Usuario 1 con credenciales correctas',
    shouldPass: true
  },
  {
    email: 'user2@coindunk.com',
    password: 'user456',
    description: 'Usuario 2 con credenciales correctas',
    shouldPass: true
  },
  {
    email: 'user@coindunk.com',
    password: 'wrongpass',
    description: 'Usuario 1 con contraseña incorrecta',
    shouldPass: false
  },
  {
    email: 'noexiste@test.com',
    password: 'anypass',
    description: 'Usuario inexistente',
    shouldPass: false
  }
];

// Función para mostrar resultados
function logResult(test, success, response) {
  const status = success ? chalk.green('✓') : chalk.red('✗');
  console.log(`${status} ${test.description}`);
  
  if (response) {
    console.log(`   ${chalk.blue('Respuesta:')}`, {
      status: response.status,
      data: response.data
    });
  }
}

// Función para ejecutar pruebas
async function runTests() {
  console.log(chalk.bold('\n🔍 Iniciando pruebas de autenticación...\n'));
  
  let passed = 0;
  
  for (const test of TEST_CASES) {
    try {
      const response = await axios.post(API_URL, {
        email: test.email,
        password: test.password
      });
      
      if (test.shouldPass) {
        logResult(test, true, response);
        passed++;
      } else {
        logResult(test, false, response);
      }
    } catch (error) {
      if (!test.shouldPass) {
        logResult(test, true, error.response);
        passed++;
      } else {
        logResult(test, false, error.response);
        console.error(chalk.red('   Error:'), error.message);
      }
    }
    console.log(chalk.gray('----------------------------------------'));
  }
  
  // Resumen final
  console.log(chalk.bold(`\n📊 Resultados:`));
  console.log(`   ${chalk.green(`Pasadas: ${passed}`)}`);
  console.log(`   ${chalk.red(`Falladas: ${TEST_CASES.length - passed}`)}`);
  console.log(`   ${chalk.blue(`Total: ${TEST_CASES.length}`)}`);
  
  process.exit(passed === TEST_CASES.length ? 0 : 1);
}

// Verificar conexión antes de ejecutar pruebas
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/api/health');
    return true;
  } catch (error) {
    console.error(chalk.red('\n⚠️  El servidor no está respondiendo:'));
    console.error('   Asegúrate de que el servidor esté corriendo en el puerto 5000');
    console.error('   Ejecuta:', chalk.cyan('node server.js'));
    return false;
  }
}

// Ejecución principal
async function main() {
  const serverReady = await checkServer();
  if (serverReady) {
    await runTests();
  } else {
    process.exit(1);
  }
}

main();