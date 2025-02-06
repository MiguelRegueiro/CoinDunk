import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Archivo de estilos (lo crearemos después)

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenido a CoinDunk</h1>
      <p className="description">
        Predice el futuro de las criptomonedas con nuestros planes de suscripción.
      </p>

      <div className="plans-container">
        {/* Plan Básico */}
        <div className="plan-card">
          <h2>Plan Básico</h2>
          <p>Acceso a predicciones básicas.</p>
          <ul>
            <li>Predicciones diarias</li>
            <li>Soporte por correo electrónico</li>
            <li>Acceso limitado a datos históricos</li>
          </ul>
          <Link to="/prediction-basic" className="plan-button">
            Seleccionar Plan Básico
          </Link>
        </div>

        {/* Plan Pro */}
        <div className="plan-card">
          <h2>Plan Pro</h2>
          <p>Acceso a predicciones avanzadas.</p>
          <ul>
            <li>Predicciones en tiempo real</li>
            <li>Soporte prioritario</li>
            <li>Acceso completo a datos históricos</li>
          </ul>
          <Link to="/prediction-pro" className="plan-button">
            Seleccionar Plan Pro
          </Link>
        </div>

        {/* Plan Premium */}
        <div className="plan-card">
          <h2>Plan Premium</h2>
          <p>Acceso a todas las funciones premium.</p>
          <ul>
            <li>Predicciones en tiempo real</li>
            <li>Soporte 24/7</li>
            <li>Acceso completo a datos históricos y análisis avanzados</li>
          </ul>
          <Link to="/prediction-premium" className="plan-button">
            Seleccionar Plan Premium
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;