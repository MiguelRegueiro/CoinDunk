import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/Theme'; // Importa el contexto del tema
import './Planes.css'; // Archivo de estilos

const Planes = () => {
  const theme = useContext(ThemeContext); // Accede al tema

  if (!theme) {
    return null; // O muestra un mensaje de carga
  }

  return (
    <div
      className="planes-container"
      style={{
        backgroundColor: theme.colors.background, // Fondo dinámico
        color: theme.colors.text, // Texto dinámico
      }}
    >
      {/* Encabezado con logo y texto */}
      <div className="header">
        <img
          src="CoinDunkNB.png"
          alt="Logo"
          className="logo-planes" // Clase específica para el logo en Planes
        />
        <div className="header-text">
          <h1>Bienvenido a CoinDunk</h1>
          <p className="description">
            Predice el futuro de las criptomonedas con nuestros planes de suscripción.
          </p>
        </div>
      </div>

      {/* Grid de planes */}
      <div className="plans-grid">
        {/* Plan Básico */}
        <div
          className="plan-card"
          style={{
            backgroundColor: theme.colors.cardBackground, // Fondo de tarjetas dinámico
            color: theme.colors.text, // Texto dinámico
            border: `1px solid ${theme.colors.border}`, // Borde dinámico
          }}
        >
          <h2>Básico</h2>
          <p className="price">
            50€ <span>Cada mes</span>
          </p>
          <p className="plan-description">
            Ideal para quienes se inician en este mundo o prefieren enfocarse en
            monedas específicas.
          </p>
          <ul>
            <li>Accede a predicciones de 3 criptomonedas de tu elección</li>
          </ul>
          <div className="button-container">
            <Link
              to="/prediction-basic"
              className="plan-button"
              style={{
                backgroundColor: theme.colors.button, // Color del botón dinámico
                color: '#fff', // Texto blanco
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = theme.colors.buttonHover)} // Hover
              onMouseOut={(e) => (e.target.style.backgroundColor = theme.colors.button)} // Restaurar color
            >
              Comenzar con Básico
            </Link>
          </div>
        </div>

        {/* Plan Pro */}
        <div
          className="plan-card"
          style={{
            backgroundColor: theme.colors.cardBackground, // Fondo de tarjetas dinámico
            color: theme.colors.text, // Texto dinámico
            border: `1px solid ${theme.colors.border}`, // Borde dinámico
          }}
        >
          <h2>Dunk Pro</h2>
          <p className="price">
            100€ <span>Cada mes</span>
          </p>
          <p className="plan-description">
            Perfecto si buscas diversificar tu cartera y conocer más oportunidades
            de inversión.
          </p>
          <ul>
            <li>Recibe predicciones de 10 criptomonedas</li>
          </ul>
          <div className="button-container">
            <Link
              to="/prediction-pro"
              className="plan-button"
              style={{
                backgroundColor: theme.colors.button, // Color del botón dinámico
                color: '#fff', // Texto blanco
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = theme.colors.buttonHover)} // Hover
              onMouseOut={(e) => (e.target.style.backgroundColor = theme.colors.button)} // Restaurar color
            >
              Elegir Dunk Pro
            </Link>
          </div>
        </div>

        {/* Plan Premium */}
        <div
          className="plan-card"
          style={{
            backgroundColor: theme.colors.cardBackground, // Fondo de tarjetas dinámico
            color: theme.colors.text, // Texto dinámico
            border: `1px solid ${theme.colors.border}`, // Borde dinámico
          }}
        >
          <h2>Slam Dunk</h2>
          <p className="price">
            250€ <span>Cada mes</span>
          </p>
          <p className="plan-description">
            Incluye ventajas exclusivas adicionales para llevar tus estrategias de
            inversión al siguiente nivel.
          </p>
          <ul>
            <li>Disfruta de acceso ilimitado a más de 100 criptomonedas</li>
          </ul>
          <div className="button-container">
            <Link
              to="/prediction-premium"
              className="plan-button"
              style={{
                backgroundColor: theme.colors.button, // Color del botón dinámico
                color: '#fff', // Texto blanco
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = theme.colors.buttonHover)} // Hover
              onMouseOut={(e) => (e.target.style.backgroundColor = theme.colors.button)} // Restaurar color
            >
              Ir por Slam Dunk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planes;