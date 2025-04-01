const axios = require('axios');

console.log("Iniciando prueba de login...");

async function testLogin() {
  try {
    console.log("Enviando petición al servidor...");
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@coindunk.com',
      password: 'user'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Éxito! Respuesta del servidor:');
    console.log({
      status: response.status,
      data: response.data
    });
    
  } catch (error) {
    console.error('❌ Error en la prueba:');
    
    if (error.response) {
      // El servidor respondió con un error
      console.error('Status:', error.response.status);
      console.error('Datos:', error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('El servidor no respondió. Verifica que:');
      console.error('1. El servidor esté corriendo (npm run server)');
      console.error('2. No haya errores en la consola del servidor');
    } else {
      // Error al configurar la petición
      console.error('Error de configuración:', error.message);
    }
  }
}

testLogin();