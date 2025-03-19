// src/pages/About.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/Theme'; // Importa el contexto del tema
import './About.css'; // Archivo de estilos

const About = () => {
  const theme = useContext(ThemeContext); // Accede al tema

  return (
    <div
      className="about-container"
      style={{
        backgroundColor: theme.colors.background, // Fondo dinámico
        color: theme.colors.text, // Texto dinámico
      }}
    >
      {/* Encabezado con logo y nombre */}
      <div className="header">
        <div className="header-content">
        <img src={"CoinDunkNB.png"} alt="Logo de CoinDunk" className="logohome" />
        <h1 className="app-name">CoinDunk</h1>
      </div>
    </div>

      {/* Contenido de la página About */}
      <div
        className="about-content"
        style={{
          backgroundColor: theme.colors.cardBackground, // Fondo dinámico
          color: theme.colors.text, // Texto dinámico
        }}
      >
        <h2 style={{ color: theme.colors.primary }}>Sobre Nosotros</h2>
        <p>
          En <strong>CoinDunk</strong>, nos apasiona el mundo de las criptomonedas y queremos
          ayudarte a tomar decisiones informadas. Nuestra plataforma te permite
          explorar y analizar el mercado de criptomonedas en tiempo real, con
          gráficos interactivos y predicciones basadas en modelos avanzados.
        </p>
        <p>
          Ya seas un inversor experimentado o estés dando tus primeros pasos en
          el mundo de las criptomonedas, CoinDunk tiene las herramientas que
          necesitas para tener éxito.
        </p>
        <h3 style={{ color: theme.colors.primary }}>Nuestro Equipo</h3>
        <p>
          Contamos con un equipo de expertos en finanzas, tecnología y análisis
          de datos que trabajan incansablemente para ofrecerte la mejor
          experiencia posible.
        </p>
        <h3 style={{ color: theme.colors.primary }}>Contacto</h3>
        <p>
          Si tienes alguna pregunta o sugerencia, no dudes en contactarnos en{' '}
          <a
            href="mailto:soporte@coindunk.com"
            style={{ color: theme.colors.link }}
          >
            soporte@coindunk.com
          </a>
          .
        </p>
      </div>

      {/* Enlace para volver a la página de inicio */}
      <div className="back-to-home">
        <Link
          to="/"
          className="back-link"
          style={{ color: theme.colors.link }}
        >
          Volver a Inicio
        </Link>
      </div>
    </div>
  );
};

export default About;