import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
    document.body.style.color = isDarkMode ? '#e0e0e0' : '#333333';
  }, [isDarkMode]);

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Jerarquía de fondos (más oscuro -> más claro)
      background: isDarkMode ? '#121212' : '#f5f5f5',
      surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      cardBackground: isDarkMode ? '#252525' : '#FFFFFF',
      paper: isDarkMode ? '#2D2D2D' : '#FAFAFA',
      
      // Jerarquía de texto (más claro -> más oscuro)
      text: isDarkMode ? '#FFFFFF' : '#212121',
      textPrimary: isDarkMode ? '#E0E0E0' : '#333333',
      textSecondary: isDarkMode ? '#B0B0B0' : '#666666',
      textDisabled: isDarkMode ? '#757575' : '#9E9E9E',
      
      // Colores acento (naranja)
      primary: isDarkMode ? '#FFA726' : '#E67E22',
      primaryHover: isDarkMode ? '#FF9800' : '#D35400',
      primaryLight: isDarkMode ? '#FFB74D' : '#F39C12',
      primaryDark: isDarkMode ? '#FB8C00' : '#C0392B',
      
      // Colores secundarios (azul/turquesa)
      secondary: isDarkMode ? '#4FC3F7' : '#00BCD4',
      secondaryHover: isDarkMode ? '#03A9F4' : '#0097A7',
      
      // Bordes y divisiones
      border: isDarkMode ? '#424242' : '#E0E0E0',
      divider: isDarkMode ? '#373737' : '#EEEEEE',
      
      // Estados y feedback
      error: isDarkMode ? '#F44336' : '#D32F2F',
      success: isDarkMode ? '#4CAF50' : '#388E3C',
      warning: isDarkMode ? '#FFC107' : '#FFA000',
      info: isDarkMode ? '#2196F3' : '#1976D2',
      
      // Sombras y elevación
      shadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
      shadowIntense: isDarkMode ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 8px 24px rgba(0, 0, 0, 0.15)',
      
      // Elementos interactivos
      button: isDarkMode ? '#FFA726' : '#E67E22',
      buttonHover: isDarkMode ? '#FF9800' : '#D35400',
      inputBackground: isDarkMode ? '#2D2D2D' : '#FFFFFF',
      inputBorder: isDarkMode ? '#424242' : '#E0E0E0', // <-- Coma añadida aquí

      textOnPrimary: isDarkMode ? '#121212' : '#FFFFFF', // Texto sobre fondos primary
      textOnSecondary: isDarkMode ? '#121212' : '#FFFFFF' // Texto sobre fondos secondary
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};