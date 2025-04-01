// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { ThemeProvider } from './context/Theme'; // Importa el ThemeProvider
import Planes from './pages/Planes';
import PredictionBasic from './pages/PredictionBasic';
import PredictionPro from './pages/PredictionPro';
import PredictionPremium from './pages/PredictionPremium';
import Contacto from './pages/Contacto'; // Importa la página de contacto
import About from './pages/About'; // Importa el componente About
import LoginPage from './pages/LoginPage'; 
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/prediction-basic" element={<PredictionBasic />} />
          <Route path="/prediction-pro" element={<PredictionPro />} />
          <Route path="/prediction-premium" element={<PredictionPremium />} />
          <Route path="/contacto" element={<Contacto />} /> {/* Ruta para contacto */}
          <Route path="/about" element={<About />} /> {/* Ruta para About */}
          <Route path="/login" element={<LoginPage />} /> {/* Ruta para About */}
          <Route path="/perfil" element={<Perfil />} /> {/* Ruta para el perfil */}
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
