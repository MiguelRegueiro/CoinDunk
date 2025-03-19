// src/context/Theme.js
import React, { createContext, useState } from 'react';

// Crear el contexto para el tema
export const ThemeContext = createContext();

// Proveedor del tema
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para el tema oscuro

  // Función para cambiar entre tema claro y oscuro
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Estilos basados en el tema
  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#121212' : '#ffffff', // Fondo claro u oscuro
      text: isDarkMode ? '#ffffff' : '#000000', // Texto claro u oscuro
      primary: isDarkMode ? '#bb86fc' : '#6200ee', // Color primario
      secondary: isDarkMode ? '#03dac6' : '#03dac6', // Color secundario
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};