// src/pages/Planes.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Planes.css'; // Archivo de estilos (opcional)

const Planes = () => {
  return (
    <div className="plans-container">
      {/* Plan Básico */}
      <div className="plan-card">
        <h2>Básico</h2>
        <p className="price">50€ <span>Cada mes</span></p>
        <p className="description">
          Ideal para quienes se inician en este mundo o prefieren enfocarse en monedas específicas.
        </p>
        <p className="trial">7 días de prueba gratuita</p>
        <ul>
          <li>Accede a predicciones de 3 criptomonedas de tu elección</li>
        </ul>
        <Link to="/prediction-basic" className="plan-button">
          Seleccionar Plan Básico
        </Link>
      </div>

      {/* Plan Pro */}
      <div className="plan-card">
        <h2>Dunk Pro</h2>
        <p className="price">100€ <span>Cada mes</span></p>
        <p className="description">
          Perfecto si buscas diversificar tu cartera y conocer más oportunidades de inversión.
        </p>
        <ul>
          <li>Recibe predicciones de 10 criptomonedas</li>
        </ul>
        <Link to="/prediction-pro" className="plan-button">
          Seleccionar Dunk Pro
        </Link>
      </div>

      {/* Plan Premium */}
      <div className="plan-card">
        <h2>Slam Dunk</h2>
        <p className="price">250€ <span>Cada mes</span></p>
        <p className="description">
          Para los que no temen clavar la máxima jugada. Incluye ventajas exclusivas adicionales para llevar tus estrategias de inversión al siguiente nivel.
        </p>
        <ul>
          <li>Disfruta de acceso ilimitado a todas las criptomonedas</li>
          <li>Sé parte del nuevo proyecto CoinDunk</li>
        </ul>
        <Link to="/prediction-premium" className="plan-button">
          Seleccionar Slam Dunk
        </Link>
      </div>
    </div>
  );
};

export default Planes;