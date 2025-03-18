// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Planes from './pages/Planes'; // Importa el nuevo componente
import PredictionBasic from './pages/PredictionBasic';
import PredictionPro from './pages/PredictionPro';
import PredictionPremium from './pages/PredictionPremium';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planes" element={<Planes />} /> {/* Ruta para los planes */}
        <Route path="/prediction-basic" element={<PredictionBasic />} />
        <Route path="/prediction-pro" element={<PredictionPro />} />
        <Route path="/prediction-premium" element={<PredictionPremium />} />
      </Routes>
    </Router>
  );
}

export default App;