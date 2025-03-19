import React from 'react';
import { Link } from 'react-router-dom';
import './Planes.css'; // Archivo de estilos (lo crearemos después)

const Planes = () => {
  return (
    <div className="planes-container">
      <img src="CoinDunkNB.png" alt="Logo" width="220" height="200" className="logo" />
      <h1>Bienvenido a CoinDunk</h1>
      <p className="description">
        Predice el futuro de las criptomonedas con nuestros planes de suscripción.
      </p>

      <div className="plans-grid">
        {/* Plan Básico */}
        <div className="plan-card">
          <h2>Básico</h2>
          <p className="price">50€ <span>Cada mes</span></p>
          <p className="plan-description">
            Ideal para quienes se inician en este mundo o prefieren enfocarse en monedas específicas.
          </p>
          <ul>
            <li>Accede a predicciones de 3 criptomonedas de tu elección</li>
          </ul>
          <div className="button-container">
            <Link to="/prediction-basic" className="plan-button">
              Comenzar con Básico
            </Link>
          </div>
        </div>

        {/* Plan Pro */}
        <div className="plan-card">
          <h2>Dunk Pro</h2>
          <p className="price">100€ <span>Cada mes</span></p>
          <p className="plan-description">
            Perfecto si buscas diversificar tu cartera y conocer más oportunidades de inversión.
          </p>
          <ul>
            <li>Recibe predicciones de 10 criptomonedas</li>
          </ul>
          <div className="button-container">
            <Link to="/prediction-pro" className="plan-button">
              Elegir Dunk Pro
            </Link>
          </div>
        </div>

        {/* Plan Premium */}
        <div className="plan-card">
          <h2>Slam Dunk</h2>
          <p className="price">250€ <span>Cada mes</span></p>
          <p className="plan-description">
            Para los que no temen clavar la máxima jugada. Incluye ventajas exclusivas adicionales para llevar tus estrategias de inversión al siguiente nivel.
          </p>
          <ul>
            <li>Disfruta de acceso ilimitado a todas las criptomonedas</li>
            <li>Sé parte del nuevo proyecto CoinDunk</li>
          </ul>
          <div className="button-container">
            <Link to="/prediction-premium" className="plan-button">
              Ir por Slam Dunk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planes;