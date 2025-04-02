import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/Theme';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Stack,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';

const ActualizarPlan = () => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  if (!theme) {
    return null;
  }

  const handlePlanUpdate = async (plan) => {
    try {
      setLoading(true);
      setSelectedPlan(plan);
      
      const token = localStorage.getItem('coindunk_token');
      const userData = JSON.parse(localStorage.getItem('coindunk_user'));
      
      if (!token || !userData?.id) {
        throw new Error('Usuario no autenticado');
      }

      // Llamada al endpoint para actualizar el plan
      const response = await axios.put(
        `http://localhost:5000/api/user/${userData.id}/plan`,
        { plan },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Actualizar los datos del usuario en localStorage
        const updatedUser = {
          ...userData,
          plan: plan
        };
        localStorage.setItem('coindunk_user', JSON.stringify(updatedUser));
        
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        });
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => navigate('/perfil'), 1500);
      }
    } catch (error) {
      console.error('Error al actualizar el plan:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al actualizar el plan',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  const handleGoBack = () => {
    navigate('/perfil');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        pt: 12,
        pb: 4,
        backgroundImage: theme.isDarkMode 
          ? 'linear-gradient(to bottom, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 1))'
          : 'linear-gradient(to bottom, rgba(245, 245, 245, 0.95), rgba(255, 255, 255, 1))'
      }}
    >
      <Container maxWidth="md">
      <Button
      startIcon={<ArrowBack />}
      onClick={handleGoBack}
      sx={{
        color: theme.colors.primary,
        fontWeight: 'bold',
        textDecoration: 'none',
        padding: '8px 20px',
        borderRadius: '16px',
        fontSize: '0.9rem',
        backgroundColor: theme.isDarkMode 
          ? `${theme.colors.primary}20` 
          : `${theme.colors.primary}10`,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: theme.isDarkMode 
            ? `${theme.colors.primary}30` 
            : `${theme.colors.primary}20`,
          transform: 'translateY(-1px)'
        },
        position: 'fixed',
        top: 100,
        left: 30,
        zIndex: 1000,
        boxShadow: theme.shadow,
        textTransform: 'none',
        '& .MuiButton-startIcon': {
          marginRight: '6px',
          '& svg': {
            fontSize: '1.1rem'
          }
        }
      }}
    >
      Volver al perfil
    </Button>

        {/* Encabezado */}
        <Box sx={{ textAlign: 'center', mb: 4, pt: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: theme.colors.textPrimary,
            mb: 1
          }}>
            Actualiza tu plan CoinDunk
          </Typography>
          <Typography variant="body1" sx={{ 
            color: theme.colors.textSecondary,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Mejora tu experiencia con acceso a más criptomonedas y características exclusivas
          </Typography>
        </Box>

        {/* Grid de planes */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          {/* Plan Básico */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.colors.cardBackground,
              border: `1px solid ${theme.colors.border}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadowIntense
              },
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: theme.colors.textPrimary,
                mb: 1
              }}>
                Básico
              </Typography>
              <Typography variant="h6" sx={{ 
                color: theme.colors.primary,
                mb: 2
              }}>
                50€ <Typography component="span" sx={{ 
                  fontSize: '0.8rem',
                  color: theme.colors.textSecondary
                }}>al mes</Typography>
              </Typography>
              <Typography variant="body2" sx={{ 
                color: theme.colors.textSecondary,
                mb: 2,
                minHeight: '60px'
              }}>
                Ideal para quienes se inician en este mundo o prefieren enfocarse en monedas específicas.
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.colors.divider }} />
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: theme.colors.textPrimary
                }}>
                  • Acceso a 3 criptomonedas
                </Typography>
              </Stack>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handlePlanUpdate('basic')}
              disabled={loading && selectedPlan === 'basic'}
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                '&:hover': {
                  backgroundColor: theme.colors.primaryHover
                },
                height: '48px',
                mt: 'auto'
              }}
            >
              {loading && selectedPlan === 'basic' ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Seleccionar Básico'
              )}
            </Button>
          </Paper>

          {/* Plan Pro */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.colors.cardBackground,
              border: `1px solid ${theme.colors.border}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadowIntense
              },
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: theme.colors.textPrimary,
                mb: 1
              }}>
                Dunk Pro
              </Typography>
              <Typography variant="h6" sx={{ 
                color: theme.colors.primary,
                mb: 2
              }}>
                100€ <Typography component="span" sx={{ 
                  fontSize: '0.8rem',
                  color: theme.colors.textSecondary
                }}>al mes</Typography>
              </Typography>
              <Typography variant="body2" sx={{ 
                color: theme.colors.textSecondary,
                mb: 2,
                minHeight: '60px'
              }}>
                Perfecto si buscas diversificar tu cartera y conocer más oportunidades de inversión.
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.colors.divider }} />
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: theme.colors.textPrimary
                }}>
                  • Acceso a 10 criptomonedas
                </Typography>
              </Stack>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handlePlanUpdate('pro')}
              disabled={loading && selectedPlan === 'pro'}
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                '&:hover': {
                  backgroundColor: theme.colors.primaryHover
                },
                height: '48px',
                mt: 'auto'
              }}
            >
              {loading && selectedPlan === 'pro' ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Seleccionar Pro'
              )}
            </Button>
          </Paper>

          {/* Plan Premium */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.colors.cardBackground,
              border: `1px solid ${theme.colors.border}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadowIntense
              },
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                color: theme.colors.textPrimary,
                mb: 1
              }}>
                Slam Dunk
              </Typography>
              <Typography variant="h6" sx={{ 
                color: theme.colors.primary,
                mb: 2
              }}>
                250€ <Typography component="span" sx={{ 
                  fontSize: '0.8rem',
                  color: theme.colors.textSecondary
                }}>al mes</Typography>
              </Typography>
              <Typography variant="body2" sx={{ 
                color: theme.colors.textSecondary,
                mb: 2,
                minHeight: '60px'
              }}>
                Incluye ventajas exclusivas adicionales para llevar tus estrategias al siguiente nivel.
              </Typography>
              <Divider sx={{ my: 2, borderColor: theme.colors.divider }} />
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: theme.colors.textPrimary
                }}>
                  • Acceso ilimitado a más de 100 criptomonedas
                </Typography>
              </Stack>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handlePlanUpdate('premium')}
              disabled={loading && selectedPlan === 'premium'}
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                '&:hover': {
                  backgroundColor: theme.colors.primaryHover
                },
                height: '48px',
                mt: 'auto'
              }}
            >
              {loading && selectedPlan === 'premium' ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Seleccionar Premium'
              )}
            </Button>
          </Paper>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActualizarPlan;