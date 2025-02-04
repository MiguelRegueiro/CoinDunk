import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a la Demo de Predicción de Criptomonedas</h1>
      <p>Elige un plan de suscripción:</p>
      <ul>
        <li><Link to="/prediction-basic">Plan Básico</Link></li>
        <li><Link to="/prediction-pro">Plan Pro</Link></li>
        <li><Link to="/prediction-premium">Plan Premium</Link></li>
      </ul>
    </div>
  );
};

export default Home;