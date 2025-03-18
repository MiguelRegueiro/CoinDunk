import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#2c3e50', // Color de fondo oscuro
        color: '#fff', // Texto blanco
        boxShadow: 'none', // Sin sombra
        borderBottom: '1px solid #34495e', // Borde inferior sutil
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo y nombre de la aplicación */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            CoinDunk
          </Typography>
        </Box>

        {/* Enlaces de navegación */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Efecto hover sutil
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
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Contacto
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;