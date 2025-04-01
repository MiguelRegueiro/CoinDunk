import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/Theme';
import './Planes.css';

const Planes = () => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!theme) {
    return null;
  }

  const handlePlanSelect = (plan) => {
    navigate('/register', { state: { selectedPlan: plan } });
  };

  return (
    <div
      className="planes-container"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Encabezado con logo y texto */}
      <div className="header">
        <img
          src="CoinDunkNB.png"
          alt="Logo"
          className="logo-planes"
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
            backgroundColor: theme.colors.cardBackground,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.border}`,
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
            <button
              onClick={() => handlePlanSelect('basic')}
              className="plan-button"
              style={{
                backgroundColor: theme.colors.button,
                color: theme.colors.textOnPrimary,
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = theme.colors.buttonHover)}
              onMouseOut={(e) => (e.target.style.backgroundColor = theme.colors.button)}
            >
              Comenzar con Básico
            </button>
          </div>
        </div>

        {/* Plan Pro */}
        <div
          className="plan-card"
          style={{
            backgroundColor: theme.colors.cardBackground,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.border}`,
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
            <button
              onClick={() => handlePlanSelect('pro')}
              className="plan-button"
              style={{
                backgroundColor: theme.colors.button,
                color: theme.colors.textOnPrimary,
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = theme.colors.buttonHover)}
              onMouseOut={(e) => (e.target.style.backgroundColor = theme.colors.button)}
            >
              Elegir Dunk Pro
            </button>
          </div>
        </div>

        {/* Plan Premium */}
        <div
          className="plan-card"
          style={{
            backgroundColor: theme.colors.cardBackground,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.border}`,
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
            <button
              onClick={() => handlePlanSelect('premium')}
              className="plan-button"
              style={{
                backgroundColor: theme.colors.button,
                color: theme.colors.textOnPrimary,
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = theme.colors.buttonHover)}
              onMouseOut={(e) => (e.target.style.backgroundColor = theme.colors.button)}
            >
              Ir por Slam Dunk
            </button>
          </div>
        </div>
      </div>

      {/* Enlace al login en la parte inferior */}
      <div className="login-footer" style={{ marginTop: '60px', paddingBottom: '40px' }}>
        <p style={{ 
          marginBottom: '16px', 
          color: theme.isDarkMode ? theme.colors.textSecondary : '#5a5a5a',
          fontSize: '0.95rem'
        }}>
          ¿Ya tienes una cuenta?
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backgroundColor: theme.isDarkMode ? 'transparent' : '#f8f9fa',
            color: theme.isDarkMode ? theme.colors.primary : '#2c3e50',
            border: `1px solid ${theme.isDarkMode ? theme.colors.primary : '#2c3e50'}`,
            boxShadow: theme.isDarkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = theme.isDarkMode ? 
              theme.colors.primary + '10' : 
              '#e9ecef';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = theme.isDarkMode ? 
              'none' : 
              '0 4px 8px rgba(0,0,0,0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = theme.isDarkMode ? 
              'transparent' : 
              '#f8f9fa';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = theme.isDarkMode ? 
              'none' : 
              '0 2px 4px rgba(0,0,0,0.05)';
          }}
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default Planes;