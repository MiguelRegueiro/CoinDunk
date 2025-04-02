import React, { useContext } from 'react';
import { ThemeContext } from '../context/Theme';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  Divider, 
  Paper, 
  Switch, 
  Chip,
  Container,
  Stack,
  IconButton
} from '@mui/material';
import { 
  Email, 
  Person, 
  Security, 
  DarkMode, 
  LightMode,
  ArrowBack,
  Logout,
  Star,
  Rocket,
  Diamond
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Obtener datos del usuario
  const userData = JSON.parse(localStorage.getItem('coindunk_user')) || {};
  
  // Detalles de planes mejorados
  const planDetails = {
    basic: { 
      name: 'Básico', 
      color: 'default', 
      description: '3 criptomonedas',
      icon: <Star sx={{ color: theme.colors.primary }} />,
      price: '50€/mes'
    },
    pro: { 
      name: 'Pro', 
      color: 'primary', 
      description: '10 criptomonedas',
      icon: <Rocket sx={{ color: theme.colors.primary }} />,
      price: '100€/mes'
    },
    premium: { 
      name: 'Premium', 
      color: 'secondary', 
      description: 'Acceso ilimitado',
      icon: <Diamond sx={{ color: theme.colors.primary }} />,
      price: '250€/mes'
    },
  };

  const user = {
    username: userData.username || 'Invitado',
    email: userData.email || 'No especificado',
    plan: userData.plan || 'basic'
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      pt: 8,
      pb: 4,
      backgroundImage: theme.isDarkMode 
        ? 'linear-gradient(to bottom, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 1))'
        : 'linear-gradient(to bottom, rgba(245, 245, 245, 0.95), rgba(255, 255, 255, 1))'
    }}>
      <Container maxWidth="sm">
        {/* Tarjeta de perfil */}
        <Paper elevation={3} sx={{
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: theme.colors.cardBackground,
          boxShadow: theme.isDarkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          mb: 3,
          border: `1px solid ${theme.colors.border}`,
          backdropFilter: 'blur(8px)'
        }}>
          {/* Header con altura reducida */}
          <Box sx={{
            p: 1.5, // Padding reducido
            backgroundColor: theme.colors.primary,
            color: theme.colors.textOnPrimary,
            position: 'relative',
            textAlign: 'center',
            boxShadow: `0 4px 20px ${theme.colors.primary}30`,
          }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                position: 'absolute',
                left: 12, // Ajuste posición
                top: 12, // Ajuste posición
                color: theme.colors.textOnPrimary,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)'
                },
                transition: 'all 0.3s ease',
                size: 'small' // Icono más pequeño
              }}
              aria-label="Volver"
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            
            <Typography variant="h5" sx={{
              fontWeight: 700,
              mt: 0, // Margen superior eliminado
              letterSpacing: 0.5,
              fontSize: '1.3rem' // Tamaño de fuente reducido
            }}>
              Mi Cuenta CoinDunk
            </Typography>
          </Box>

          {/* Contenido principal */}
          <Box sx={{ p: 3 }}>
            <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Avatar sx={{ 
                width: 100, 
                height: 100, 
                fontSize: '2.8rem',
                bgcolor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                mb: 2,
                border: `3px solid ${theme.colors.primaryLight}`,
                boxShadow: `0 4px 12px ${theme.colors.primary}30`
              }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: theme.colors.textPrimary,
                fontSize: '1.5rem'
              }}>
                {user.username}
              </Typography>
              
              <Chip 
                icon={planDetails[user.plan]?.icon}
                label={`${planDetails[user.plan]?.name} - ${planDetails[user.plan]?.price}`}
                color={planDetails[user.plan]?.color}
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderColor: theme.colors.primary,
                  color: theme.colors.textPrimary,
                  '& .MuiChip-icon': {
                    color: theme.colors.primary
                  },
                  px: 1,
                  py: 1.5
                }}
              />
              <Typography variant="caption" sx={{ 
                color: theme.colors.textSecondary,
                textAlign: 'center',
                fontSize: '0.8rem'
              }}>
                {planDetails[user.plan]?.description}
              </Typography>
            </Stack>

            <Divider sx={{ 
              my: 3, 
              borderColor: theme.colors.divider,
              borderWidth: 1
            }} />

            {/* Sección de información */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Paper elevation={0} sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.colors.paper,
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.isDarkMode 
                    ? '0 4px 8px rgba(0, 0, 0, 0.2)'
                    : '0 4px 8px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Person sx={{ 
                    color: theme.colors.primary,
                    fontSize: '1.8rem'
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: theme.colors.textSecondary,
                      display: 'block',
                      fontSize: '0.75rem'
                    }}>
                      Nombre de usuario
                    </Typography>
                    <Typography sx={{ 
                      color: theme.colors.textPrimary,
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}>
                      {user.username}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.colors.paper,
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.isDarkMode 
                    ? '0 4px 8px rgba(0, 0, 0, 0.2)'
                    : '0 4px 8px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Email sx={{ 
                    color: theme.colors.primary,
                    fontSize: '1.8rem'
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: theme.colors.textSecondary,
                      display: 'block',
                      fontSize: '0.75rem'
                    }}>
                      Correo electrónico
                    </Typography>
                    <Typography sx={{ 
                      color: theme.colors.textPrimary,
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.colors.paper,
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.isDarkMode 
                    ? '0 4px 8px rgba(0, 0, 0, 0.2)'
                    : '0 4px 8px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Security sx={{ 
                      color: theme.colors.primary,
                      fontSize: '1.8rem'
                    }} />
                    <Box>
                      <Typography variant="caption" sx={{ 
                        color: theme.colors.textSecondary,
                        display: 'block',
                        fontSize: '0.75rem'
                      }}>
                        Plan actual
                      </Typography>
                      <Typography sx={{ 
                        color: theme.colors.textPrimary,
                        fontWeight: 500,
                        fontSize: '1rem'
                      }}>
                        {planDetails[user.plan]?.name}
                      </Typography>
                    </Box>
                  </Stack>
                  {/* Botón condicional solo para basic y pro */}
                  {user.plan !== 'premium' && (
                    <Button 
                      variant="contained"
                      size="small"
                      onClick={() => navigate('/planes')}
                      sx={{ 
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.textOnPrimary,
                        '&:hover': {
                          backgroundColor: theme.colors.primaryDark,
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease',
                        fontWeight: 500,
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        boxShadow: 'none'
                      }}
                    >
                      Actualizar
                    </Button>
                  )}
                </Stack>
              </Paper>
            </Stack>

            {/* Configuración de tema */}
            <Paper elevation={0} sx={{
              p: 2,
              borderRadius: 2,
              mb: 3,
              backgroundColor: theme.colors.paper,
              border: `1px solid ${theme.colors.border}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.isDarkMode 
                  ? '0 4px 8px rgba(0, 0, 0, 0.2)'
                  : '0 4px 8px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  {theme.isDarkMode ? (
                    <DarkMode sx={{ 
                      color: theme.colors.primary,
                      fontSize: '1.8rem'
                    }} />
                  ) : (
                    <LightMode sx={{ 
                      color: theme.colors.primary,
                      fontSize: '1.8rem'
                    }} />
                  )}
                  <Box>
                    <Typography variant="caption" sx={{ 
                      color: theme.colors.textSecondary,
                      display: 'block',
                      fontSize: '0.75rem'
                    }}>
                      Tema de la aplicación
                    </Typography>
                    <Typography sx={{ 
                      color: theme.colors.textPrimary,
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}>
                      Modo {theme.isDarkMode ? 'oscuro' : 'claro'}
                    </Typography>
                  </Box>
                </Stack>
                <Switch
                  checked={theme.isDarkMode}
                  onChange={theme.toggleTheme}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-thumb': {
                      backgroundColor: theme.colors.primary
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: theme.colors.border
                    }
                  }}
                />
              </Stack>
            </Paper>

            {/* Botón de cerrar sesión */}
            <Button 
              fullWidth
              variant="contained"
              startIcon={<Logout sx={{ 
                color: theme.colors.textOnPrimary,
                transition: 'all 0.2s ease'
              }} />}
              onClick={() => {
                localStorage.removeItem('coindunk_token');
                localStorage.removeItem('coindunk_user');
                navigate('/login');
              }}
              sx={{ 
                py: 1.5,
                mt: 2,
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                '&:hover': {
                  backgroundColor: theme.colors.primaryDark,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${theme.colors.primary}30`
                },
                fontWeight: 500,
                fontSize: '1rem',
                borderRadius: 2,
                textTransform: 'none',
                letterSpacing: 0.5,
                transition: 'all 0.2s ease',
                boxShadow: 'none'
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Perfil;