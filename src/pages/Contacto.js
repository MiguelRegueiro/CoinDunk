// src/pages/Contacto.js
import React, { useContext } from 'react';
import { ThemeContext } from '../context/Theme'; // Importa el contexto del tema

const Contacto = () => {
  const theme = useContext(ThemeContext); // Accede al tema

  if (!theme) {
    return null; // O muestra un mensaje de carga
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.background, // Fondo dinámico
        color: theme.colors.text, // Texto dinámico
        minHeight: '100vh', // Ocupa toda la altura de la pantalla
        padding: '20px', // Ajusta el padding según sea necesario
      }}
    >
      <h1>Contacto</h1>
      <p>Esta es la página de contacto.</p>
      {/* Agrega más contenido aquí */}
    </div>
  );
};

export default Contacto;