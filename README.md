# CoinDunk - Plataforma de Predicción de Criptomonedas

![Logo de CoinDunk](./public/CoinDunkNB.png)

## 📌 Tabla de Contenidos
- [Visión General del Proyecto](#-visión-general-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Guía de Instalación Completa](#-guía-de-instalación-completa)
- [Configuración de la Base de Datos](#-configuración-de-la-base-de-datos)
- [Puesta en Marcha](#-puesta-en-marcha)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación de la API](#-documentación-de-la-api)
- [Pruebas](#-pruebas)
- [Despliegue](#-despliegue)
- [Contribuciones](#-contribuciones)
- [Licencia](#-licencia)

## 🌟 Visión General del Proyecto
### 🚀 CoinDunk - Tu Brújula en el Mundo Cripto
CoinDunk es una plataforma avanzada para predicción de criptomonedas que ofrece:

🔹 Predicciones en tiempo real con algoritmos avanzados. Pronósticos precisos en 24h, 1 semana y 1 mes  
🔹 Sistema de suscripción por niveles (Básico, Pro, Premium)  
🔹 Gestión de portafolios personalizados  
🔹 Visualización interactiva de datos  
🔹 Temas claro/oscuro    

![image](https://github.com/user-attachments/assets/98bd3716-d7d1-4f1e-849c-d39826b00f22)
![image](https://github.com/user-attachments/assets/c074a39b-70f5-40ef-80a0-9c1458782be0)



## 🚀 Características Principales

### Sistema de Usuarios
- Autenticación segura con JWT
- Planes de suscripción escalables
- Gestión completa de perfiles
- Selección personalizada de criptomonedas

### Motor de Predicciones
- Pronósticos para 1día, 1semana y 1mes
- Múltiples modelos predictivos
- Mecanismos de respaldo cuando fallan las APIs

### Visualización
- Gráficos interactivos con Chart.js
- Diseño completamente responsive
- Tema claro/oscuro adaptable

## 💻 Tecnologías Utilizadas

### Frontend
- React 18
- React Router 6
- Chart.js
- Material-UI
- Context API (Gestión de estado)
- Axios (Cliente HTTP)

### Backend
- Node.js
- Express
- MySQL 8
- JWT (Autenticación)
- CORS (Seguridad)

### Herramientas de Desarrollo
- npm
- Git
- Prettier (Formateo de código)
- ESLint (Linteo de código)

## 🔧 Guía de Instalación Completa

### Requisitos Previos

1. **Node.js** (versión 16+ recomendada)
   ```bash
   # Verificar instalación
   node -v
   npm -v
   ```

2. **MySQL** (versión 8.0+ recomendada)
   ```bash
   # Verificar instalación
   mysql --version
   ```

### Pasos de Instalación Detallados

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/turepositorio/coindunk.git
   cd coindunk
   ```

2. Instalar dependencias principales:
   ```bash
   npm install
   ```

3. Instalar dependencias adicionales del cliente:
   ```bash
   npm install react-scripts@latest
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   npm install chart.js react-chartjs-2
   npm install axios
   ```

4. Instalar dependencias del servidor:
   ```bash
   npm install express mysql2 cors body-parser dotenv jsonwebtoken
   npm install bcrypt bcryptjs chalk concurrently

   ```


![image](https://github.com/user-attachments/assets/e31e6204-56b4-4b4a-9053-ca17c0352960)


## 🗃 Configuración de la Base de Datos

1. Abrir MySQL Workbench o tu cliente MySQL preferido

2. Ejecutar el archivo `coindunk_db_schema.sql`:
   - Abrir el archivo en el cliente MySQL
   - Hacer clic en el icono de "rayo" para ejecutar el script completo
   - Verificar que se crearon las tablas correctamente

3. Los datos iniciales incluyen:
   - 3 planes de suscripción
   - 22 criptomonedas populares
   - 3 usuarios de ejemplo (user1, user2, user3)

![image](https://github.com/user-attachments/assets/73d4a3bd-dbf4-40f3-b71c-f70f94fff916)


## 🏃 Puesta en Marcha

1. Iniciar el servidor backend:
   ```bash
   npm run server     
   ```
   Alternativamente:
   ```bash
   node server.js    
   ```
   
3. Iniciar el frontend (en otra terminal):
   ```bash
   npm start
   ```

4. Acceder a la aplicación:
   ```
   http://localhost:3000
   ```
![image](https://github.com/user-attachments/assets/6c31237a-52c3-4485-9b1a-dbe4055896b3)
![image](https://github.com/user-attachments/assets/ff8242d5-6ec6-4ffe-8bac-67de3b43c345)



## 📂 Estructura del Proyecto

```

📂 coindunk/
├── 📂 public/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── CryptoButton.js
│   │   ├── CryptoSelection.css
│   │   ├── CryptoSelection.js
│   │   ├── Navbar.js
│   │   ├── NotificationPopup.js
│   │   ├── predictions.js
│   │   └── coindunk_db_schema.sql
│   ├── 📂 context/
│   │   └── Theme.js
│   ├── 📂 pages/
│   │   ├── About.css
│   │   ├── About.js
│   │   ├── ActualizarPlan.js
│   │   ├── Contacto.css
│   │   ├── Contacto.js
│   │   ├── Home.css
│   │   ├── Home.js
│   │   ├── LoginPage.css
│   │   ├── LoginPage.js
│   │   ├── Perfil.js
│   │   ├── Planes.css
│   │   ├── Planes.js
│   │   ├── RegisterPage.css
│   │   └── RegisterPage.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── server.js
└── test-login.js
```

## 📚 Documentación de la API

### Autenticación

🔹 `POST /api/auth/login`  
   - Login de usuario existente
   - Body: { email, password }
   - Retorna: token JWT y datos de usuario

🔹 `POST /api/auth/register`  
   - Registro de nuevo usuario
   - Body: { name, email, password, plan }
   - Retorna: usuario creado y token

### Gestión de Usuario

🔹 `GET /api/user/:userId/cryptos`  
   - Obtiene criptomonedas del usuario
   - Retorna: array de criptomonedas y datos del plan

🔹 `POST /api/user/:userId/cryptos`  
   - Actualiza criptomonedas seleccionadas
   - Body: { cryptos: [array de IDs] }

🔹 `PUT /api/user/:userId/plan`  
   - Cambia el plan de suscripción
   - Body: { plan: 'basic'|'pro'|'premium' }

### Datos de Criptomonedas

🔹 `GET /api/cryptos`  
   - Lista todas las criptomonedas disponibles
   - Retorna: array con id, nombre y símbolo

## 🧪 Pruebas

Para ejecutar las pruebas automatizadas:

```bash
node test-login.js
```

Las pruebas cubren:
- Flujo completo de autenticación
- Funcionamiento básico del servidor
- Autenticación de usuarios (básico, pro y premium)
- Manejo de credenciales inválidas (contraseña incorrecta y usuario inexistente)

![image](https://github.com/user-attachments/assets/79646046-4577-4bc9-9aad-576a3aac4933)


## 🤝 Contribuciones

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir NuevaFuncionalidad'`)
4. Haz push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 📜 Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

---

**CoinDunk** © 2025 - Plataforma de predicción de criptomonedas con inteligencia artificial.
