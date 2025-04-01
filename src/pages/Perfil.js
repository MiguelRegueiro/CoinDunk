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
  Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Obtener datos del usuario
  const userData = JSON.parse(localStorage.getItem('coindunk_user')) || {};
  
  // Detalles de planes
  const planDetails = {
    basic: { 
      name: 'Básico', 
      color: 'default', 
      description: '3 criptomonedas',
      icon: '⭐'
    },
    pro: { 
      name: 'Profesional', 
      color: 'primary', 
      description: '10 criptomonedas',
      icon: '🚀'
    },
    premium: { 
      name: 'Premium', 
      color: 'secondary', 
      description: 'Ilimitado',
      icon: '👑'
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
      pt: 10, // Espacio para el navbar
      pb: 4
    }}>
      <Container maxWidth="sm">
        {/* Tarjeta de perfil */}
        <Paper elevation={3} sx={{
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: theme.colors.surface,
          boxShadow: theme.colors.shadow,
          mb: 30
        }}>
          {/* Header con gradiente */}
          <Box sx={{
            p: 3,
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
            color: '#fff',
            position: 'relative',
            textAlign: 'center'
          }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                position: 'absolute',
                left: 16,
                top: 16,
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                },
                width: 40,
                height: 40
              }}
              aria-label="Volver"
            >
              <ArrowBack />
            </IconButton>
            
            <Typography variant="h5" sx={{
              fontWeight: 'bold',
              mt: 1
            }}>
              Mi Perfil
            </Typography>
          </Box>

          {/* Contenido principal */}
          <Box sx={{ p: 3 }}>
            <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Avatar sx={{ 
                width: 96, 
                height: 96, 
                fontSize: '2.5rem',
                bgcolor: theme.colors.primary,
                mb: 1
              }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: theme.colors.textPrimary
              }}>
                {user.username}
              </Typography>
              
              <Chip 
                label={`${planDetails[user.plan]?.icon} ${planDetails[user.plan]?.name}`}
                color={planDetails[user.plan]?.color}
                size="small"
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              />
              <Typography variant="caption" sx={{ 
                color: theme.colors.textSecondary
              }}>
                {planDetails[user.plan]?.description}
              </Typography>
            </Stack>

            <Divider sx={{ my: 3, borderColor: theme.colors.divider }} />

            {/* Sección de información */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Paper elevation={0} sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.colors.paper
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Person sx={{ color: theme.colors.primary }} />
                  <Typography sx={{ color: theme.colors.textPrimary }}>
                    <strong>Usuario:</strong> {user.username}
                  </Typography>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.colors.paper
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Email sx={{ color: theme.colors.primary }} />
                  <Typography sx={{ color: theme.colors.textPrimary }}>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.colors.paper
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Security sx={{ color: theme.colors.primary }} />
                    <Typography sx={{ color: theme.colors.textPrimary }}>
                      <strong>Plan Actual:</strong> {planDetails[user.plan]?.name}
                    </Typography>
                  </Stack>
                  <Button 
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/planes')}
                    sx={{ 
                      color: theme.colors.primary,
                      borderColor: theme.colors.primary
                    }}
                  >
                    Cambiar
                  </Button>
                </Stack>
              </Paper>
            </Stack>

            {/* Configuración de tema */}
            <Paper elevation={0} sx={{
              p: 2,
              borderRadius: 2,
              mb: 3,
              backgroundColor: theme.colors.paper
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  {theme.isDarkMode ? (
                    <DarkMode sx={{ color: theme.colors.primary }} />
                  ) : (
                    <LightMode sx={{ color: theme.colors.primary }} />
                  )}
                  <Typography sx={{ color: theme.colors.textPrimary }}>
                    Modo {theme.isDarkMode ? 'Oscuro' : 'Claro'}
                  </Typography>
                </Stack>
                <Switch
                  checked={theme.isDarkMode}
                  onChange={theme.toggleTheme}
                  color="primary"
                />
              </Stack>
            </Paper>

            {/* Botón de cerrar sesión */}
            <Button 
              fullWidth
              variant="contained"
              startIcon={<Logout />}
              onClick={() => {
                localStorage.removeItem('coindunk_token');
                localStorage.removeItem('coindunk_user');
                navigate('/login');
              }}
              sx={{ 
                py: 1.5,
                backgroundColor: theme.colors.error
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