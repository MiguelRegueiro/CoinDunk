// src/context/Theme.js
import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto para el tema
export const ThemeContext = createContext();

// Proveedor del tema
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para el tema oscuro

  // Función para cambiar entre tema claro y oscuro
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Efecto para actualizar el body cuando cambie el tema
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Estilos basados en el tema
  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#1e1e1e' : '#ffffff',
      text: isDarkMode ? '#e0e0e0' : '#000000',
      primary: isDarkMode ? '#bb86fc' : '#6200ee', // Color primario
      secondary: isDarkMode ? '#03dac6' : '#03dac6', // Color secundario
      cardBackground: isDarkMode ? '#2d2d2d' : '#f9f9f9', // Fondo de tarjetas
      border: isDarkMode ? '#444' : '#ddd', // Bordes más sutiles
      button: isDarkMode ? '#bb86fc' : '#e67e22', // Color del botón
      buttonHover: isDarkMode ? '#9a67ea' : '#d35400', // Color del botón al hacer hover
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};