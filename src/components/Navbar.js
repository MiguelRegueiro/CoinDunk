import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar
      position="fixed" // Cambia 'static' a 'fixed'
      sx={{
        backgroundColor: '#2c3e50', // Color de fondo oscuro
        color: '#fff', // Texto blanco
        boxShadow: 'none', // Sin sombra
        borderBottom: '1px solid #34495e', // Borde inferior sutil
        width: '100vw', // Asegura que ocupe todo el ancho de la ventana
        margin: 0, // Elimina cualquier margen
        padding: 0, // Elimina cualquier padding
        left: 0, // Asegura que esté pegado a la izquierda
        right: 0, // Asegura que esté pegado a la derecha
        top: 0, // Asegura que esté pegado a la parte superior
        zIndex: 1200, // Asegura que esté por encima de otros elementos
        height: '60px', 
        justifyContent: 'center',
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px', // Limita el ancho del contenido
        width: '100%', // Asegura que el Toolbar ocupe todo el ancho disponible
        margin: '0 auto', // Centra el contenido
        padding: '0 16px', // Añade un poco de padding a los lados
      }}>
        {/* Logo y nombre de la aplicación */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img src="/CoinDunkNB.png" alt="CoinDunk Logo" style={{ height: 52, width: 58, marginRight: 2 }} />
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