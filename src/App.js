import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { ThemeProvider } from './context/Theme';
import Planes from './pages/Planes';
import Contacto from './pages/Contacto';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import Perfil from './pages/Perfil';
import RegisterPage from './pages/RegisterPage'; // Importa el componente RegisterPage
import CryptoSelection from './components/CryptoSelection';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/predicciones" element={<Home />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Nueva ruta para el registro */}
          <Route path="/seleccion-criptos" element={<CryptoSelection />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;