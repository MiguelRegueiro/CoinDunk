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
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;