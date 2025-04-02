import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/Theme';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Stack,
  Divider
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import './Planes.css';

const ActualizarPlan = () => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!theme) {
    return null;
  }

  const handlePlanUpdate = (plan) => {
    // Aquí iría la lógica para actualizar el plan
    console.log('Actualizando a plan:', plan);
    // Después de actualizar, podrías redirigir al perfil
    navigate('/perfil');
  };

  const handleGoBack = () => {
    navigate('/perfil');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        pt: 4,
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
            mb: 3,
            color: theme.colors.primary,
            '&:hover': {
              backgroundColor: theme.isDarkMode ? 'rgba(255, 167, 38, 0.08)' : 'rgba(230, 126, 34, 0.08)'
            }
          }}
        >
          Volver al perfil
        </Button>

        {/* Encabezado */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
              }
            }}
          >
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
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                • Acceso a 3 criptomonedas
              </Typography>
            </Stack>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handlePlanUpdate('basic')}
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                '&:hover': {
                  backgroundColor: theme.colors.primaryHover
                }
              }}
            >
              Seleccionar Básico
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
              }
            }}
          >
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
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                • Acceso a 10 criptomonedas
              </Typography>
            </Stack>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handlePlanUpdate('pro')}
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                '&:hover': {
                  backgroundColor: theme.colors.primaryHover
                }
              }}
            >
              Seleccionar Pro
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
              }
            }}
          >
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
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                • Acceso ilimitado a más de 100 criptomonedas
              </Typography>
            </Stack>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handlePlanUpdate('premium')}
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                '&:hover': {
                  backgroundColor: theme.colors.primaryHover
                }
              }}
            >
              Seleccionar Premium
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ActualizarPlan;