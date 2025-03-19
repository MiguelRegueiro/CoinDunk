// src/components/Navbar.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Ícono para el tema oscuro
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Ícono para el tema claro
import { ThemeContext } from '../context/Theme'; // Importa el contexto del tema

const Navbar = () => {
  const theme = useContext(ThemeContext); // Accede al tema

  if (!theme) {
    return null; // O puedes mostrar un mensaje de carga o un componente alternativo
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.isDarkMode ? '#121212' : '#2c3e50', // Fondo oscuro o azul oscuro
        color: theme.isDarkMode ? '#ffffff' : '#ffffff', // Texto blanco
        boxShadow: 'none',
        borderBottom: theme.isDarkMode ? '1px solid #333' : '1px solid #34495e', // Borde inferior sutil
        width: '100vw',
        margin: 0,
        padding: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1200,
        height: '60px',
        justifyContent: 'center',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        {/* Logo y nombre de la aplicación */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/CoinDunkNB.png"
            alt="CoinDunk Logo"
            style={{ height: 52, width: 58, marginRight: 2 }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            CoinDunk
          </Typography>
        </Box>

        {/* Enlaces de navegación */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            component={Link}
            to="/"
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Inicio
          </Button>
          <Button
            component={Link}
            to="/planes"
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Planes
          </Button>
          <Button
            component={Link}
            to="/about"
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Acerca de
          </Button>
          <Button
            component={Link}
            to="/contact"
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Contacto
          </Button>

          {/* Botón para cambiar el tema */}
          <IconButton
            onClick={theme.toggleTheme}
            color="inherit"
            sx={{
              marginLeft: 2,
              '&:hover': {
                backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            {theme.isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;