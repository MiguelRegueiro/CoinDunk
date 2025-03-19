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
      // Fondos
      background: isDarkMode ? '#121212' : '#f5f5f5', // Fondo oscuro o claro
      cardBackground: isDarkMode ? '#1e1e1e' : '#ffffff', // Fondo de tarjetas oscuro o claro

      // Textos
      text: isDarkMode ? '#e0e0e0' : '#333333', // Texto claro u oscuro
      textSecondary: isDarkMode ? '#b0b0b0' : '#666666', // Texto secundario

      // Colores primarios y secundarios
      primary: isDarkMode ? '#ffa726' : '#e67e22', // Naranja principal
      primaryHover: isDarkMode ? '#fb8c00' : '#d35400', // Naranja más oscuro al hacer hover
      secondary: isDarkMode ? '#03dac6' : '#00bcd4', // Color secundario (turquesa)
      secondaryHover: isDarkMode ? '#00bcd4' : '#0097a7', // Turquesa más oscuro al hacer hover

      // Bordes
      border: isDarkMode ? '#444' : '#ddd', // Bordes más sutiles

      // Botones
      button: isDarkMode ? '#ffa726' : '#e67e22', // Botón naranja
      buttonHover: isDarkMode ? '#fb8c00' : '#d35400', // Botón naranja más oscuro al hacer hover

      // Sombras
      shadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};