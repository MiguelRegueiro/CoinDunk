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
      background: isDarkMode ? '#1e1e1e' : '#ffffff', // Fondo oscuro o claro
      text: isDarkMode ? '#e0e0e0' : '#000000', // Texto claro u oscuro
      primary: isDarkMode ? '#da7319' : '#e67e22', // Color naranja oscuro o claro
      secondary: isDarkMode ? '#03dac6' : '#03dac6', // Color secundario (se mantiene igual)
      cardBackground: isDarkMode ? '#2d2d2d' : '#efefef', // Fondo de tarjetas oscuro o claro
      border: isDarkMode ? '#444' : '#ddd', // Bordes más sutiles
      button: isDarkMode ? '#da7319' : '#e67e22', // Botón naranja oscuro o claro
      buttonHover: isDarkMode ? '#d05c0f' : '#d35400', // Botón naranja más oscuro al hacer hover
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};