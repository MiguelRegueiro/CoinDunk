import React, { useContext, useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import StarIcon from '@mui/icons-material/Star';
import { ThemeContext } from '../context/Theme';

const Navbar = () => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  // Función para actualizar el estado del usuario
  const updateUserState = () => {
    const userData = localStorage.getItem('coindunk_user');
    setUser(userData ? JSON.parse(userData) : null);
  };

  // Efecto que se ejecuta al cambiar la ruta
  useEffect(() => {
    updateUserState();
    
    const handleStorageChange = () => {
      updateUserState();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  // Efecto inicial para cargar el usuario
  useEffect(() => {
    updateUserState();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handlePlans = () => {
    navigate('/planes');
  };

  const handleLogout = () => {
    localStorage.removeItem('coindunk_token');
    localStorage.removeItem('coindunk_user');
    setUser(null);
    handleMenuClose();
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  if (!theme) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.isDarkMode ? '#121212' : '#2c3e50',
        color: '#ffffff',
        boxShadow: 'none',
        borderBottom: theme.isDarkMode ? '1px solid #333' : '1px solid #34495e',
        width: '100vw',
        zIndex: 1200,
        height: '60px',
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
          {user ? (
            <>
              <Button
                component={Link}
                to="/predicciones"
                sx={{
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                Predicciones
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
                to="/contacto"
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
            </>
          ) : (
            <>
              {/* Botón para cambiar el tema */}
              <IconButton
                onClick={theme.toggleTheme}
                color="inherit"
                sx={{
                  '&:hover': {
                    backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {theme.isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              {/* Botón de Planes - Versión mejorada */}
              <Button
                variant="outlined"
                startIcon={<StarIcon sx={{ 
                  color: theme.isDarkMode ? theme.colors.primary : '#2c3e50'
                }} />}
                onClick={handlePlans}
                sx={{
                  color: theme.isDarkMode ? theme.colors.primary : '#2c3e50',
                  borderColor: theme.isDarkMode ? theme.colors.primary : '#2c3e50',
                  backgroundColor: theme.isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontWeight: 'medium',
                  '&:hover': {
                    backgroundColor: theme.isDarkMode ? 
                      theme.colors.primary + '20' : 
                      'rgba(255, 255, 255, 1)',
                    borderColor: theme.isDarkMode ? 
                      theme.colors.primaryDark : '#1a2a3a',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Planes
              </Button>

              {/* Botón de Iniciar Sesión */}
              <Button
                variant="contained"
                startIcon={<VpnKeyIcon />}
                onClick={handleLogin}
                sx={{
                  backgroundColor: theme.colors.primary,
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: theme.colors.primaryDark,
                    boxShadow: '0 2px 8px ' + theme.colors.primary + '80',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Iniciar Sesión
              </Button>
            </>
          )}

          {/* Menú de usuario */}
          {user && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{
                  marginLeft: 2,
                  '&:hover': {
                    backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: theme.colors.primary,
                    fontSize: '0.875rem'
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: theme.colors.cardBackground,
                    color: theme.colors.text,
                    marginTop: '8px',
                    minWidth: '200px',
                  }
                }}
              >
                <MenuItem 
                  onClick={() => {
                    navigate('/perfil');
                    handleMenuClose();
                  }}
                >
                  Mi Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;