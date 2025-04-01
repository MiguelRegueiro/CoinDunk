import React, { useContext } from 'react';
import { ThemeContext } from '../context/Theme';
import { Box, Typography, Avatar, Button, Divider, Paper, Switch } from '@mui/material';
import { Email, Person, Security, DarkMode, LightMode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const theme = useContext(ThemeContext) || {
    isDarkMode: false,
    colors: {
      background: '#f5f5f5',
      surface: '#FFFFFF',
      cardBackground: '#FFFFFF',
      paper: '#FAFAFA',
      text: '#212121',
      textPrimary: '#333333',
      textSecondary: '#666666',
      primary: '#E67E22',
      primaryHover: '#D35400',
      border: '#E0E0E0',
      divider: '#EEEEEE'
    }
  };

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('coindunk_user')) || {};
  const user = {
    username: userData.username || 'Usuario',
    email: userData.email || 'email@ejemplo.com',
    plan: userData.plan || 'basic'
  };

  // Estilos actualizados con mejor contraste
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      color: theme.colors.textPrimary,
      padding: '2rem'
    },
    profileCard: {
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: theme.colors.shadow,
      backgroundColor: theme.colors.surface,
      maxWidth: '600px',
      margin: '2rem auto'
    },
    profileItem: {
      display: 'flex',
      alignItems: 'center',
      margin: '1.5rem 0',
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: theme.colors.paper,
      color: theme.colors.textPrimary // Aseguramos color legible
    },
    avatar: {
      width: 120, 
      height: 120, 
      fontSize: '3rem', 
      bgcolor: theme.colors.primary,
      mb: 2,
      color: '#fff' // Texto blanco en el avatar
    },
    button: {
      bgcolor: theme.colors.primary, 
      color: '#fff', // Texto blanco en botones primarios
      '&:hover': { 
        bgcolor: theme.colors.primaryHover 
      }
    },
    outlinedButton: {
      color: theme.colors.primary, 
      borderColor: theme.colors.primary,
      '&:hover': {
        borderColor: theme.colors.primaryDark
      }
    },
    strongText: {
      color: theme.colors.textPrimary, // Texto principal para elementos importantes
      fontWeight: 'bold'
    },
    labelText: {
      color: theme.colors.textSecondary // Texto secundario para etiquetas
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Paper sx={styles.profileCard}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.colors.primary }}>
            Mi Perfil
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={styles.button}
          >
            Volver al Inicio
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <Avatar sx={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" sx={styles.strongText}>
            {user.username}
          </Typography>
          <Typography sx={styles.labelText}>
            Plan: {user.plan.toUpperCase()}
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderColor: theme.colors.divider }} />

        <Box sx={styles.profileItem}>
          <Person sx={{ mr: 2, color: theme.colors.primary }} />
          <Typography flexGrow={1}>
            <span style={styles.labelText}>Nombre de usuario:</span>{' '}
            <span style={styles.strongText}>{user.username}</span>
          </Typography>
        </Box>

        <Box sx={styles.profileItem}>
          <Email sx={{ mr: 2, color: theme.colors.primary }} />
          <Typography flexGrow={1}>
            <span style={styles.labelText}>Email:</span>{' '}
            <span style={styles.strongText}>{user.email}</span>
          </Typography>
        </Box>

        <Box sx={styles.profileItem}>
          <Security sx={{ mr: 2, color: theme.colors.primary }} />
          <Typography flexGrow={1}>
            <span style={styles.labelText}>Tipo de plan:</span>{' '}
            <span style={styles.strongText}>{user.plan}</span>
          </Typography>
          <Button 
            variant="outlined"
            onClick={() => navigate('/planes')}
            sx={styles.outlinedButton}
          >
            Cambiar Plan
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: theme.colors.divider }} />

        <Box sx={styles.profileItem}>
          {theme.isDarkMode ? (
            <DarkMode sx={{ mr: 2, color: theme.colors.primaryLight }} />
          ) : (
            <LightMode sx={{ mr: 2, color: theme.colors.primary }} />
          )}
          <Typography flexGrow={1}>
            <span style={styles.labelText}>Modo:</span>{' '}
            <span style={styles.strongText}>{theme.isDarkMode ? 'Oscuro' : 'Claro'}</span>
          </Typography>
          <Switch
            checked={theme.isDarkMode}
            onChange={theme.toggleTheme}
            color="primary"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained"
            sx={{
              bgcolor: theme.colors.error,
              color: '#fff',
              '&:hover': { bgcolor: theme.isDarkMode ? '#D32F2F' : '#B71C1C' }
            }}
            onClick={() => {
              localStorage.removeItem('coindunk_token');
              localStorage.removeItem('coindunk_user');
              navigate('/login');
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Perfil;