import React, { useContext, useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LoginIcon from '@mui/icons-material/Login';
import { ThemeContext } from '../context/Theme';
import { generateSecureRandom } from '../components/security';

const Navbar = () => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [predictionPath, setPredictionPath] = useState('');

  useEffect(() => {
    // Verificar autenticación al cargar
    const userData = localStorage.getItem('coindunk_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Generar ruta segura para predicciones
      const randomString = generateSecureRandom(8);
      setPredictionPath(`/predicciones-${parsedUser.username}-${randomString}`);
    }
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

  const handleLogout = () => {
    localStorage.removeItem('coindunk_token');
    localStorage.removeItem('coindunk_user');
    setUser(null);
    setPredictionPath('');
    handleMenuClose();
    navigate('/');
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
          {user && (
            <>
              <Button
                component={Link}
                to={predictionPath}
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
          )}

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

          {/* Menú de usuario o botón de login */}
          {user ? (
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
          ) : (
            <Button
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontSize: '0.875rem',
                marginLeft: 2,
                '&:hover': {
                  backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              Iniciar Sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;