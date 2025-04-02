import React, { useContext, useState, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl
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
  Diamond,
  Edit,
  Add,
  Remove
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Perfil = () => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userCryptos, setUserCryptos] = useState([]);
  const [availableCryptos, setAvailableCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('coindunk_user')) || {});
  const [loading, setLoading] = useState(false);
  const [initialCryptos, setInitialCryptos] = useState([]);
  
  // Detalles de planes mejorados
  const planInfo = {
    basic: { 
      name: 'Básico', 
      color: 'default', 
      maxCryptos: 3,
      description: '3 criptomonedas',
      icon: <Star sx={{ color: theme.colors.primary }} />,
      price: '50€/mes'
    },
    pro: { 
      name: 'Pro', 
      color: 'primary', 
      maxCryptos: 10,
      description: '10 criptomonedas',
      icon: <Rocket sx={{ color: theme.colors.primary }} />,
      price: '100€/mes'
    },
    premium: { 
      name: 'Premium', 
      color: 'secondary', 
      maxCryptos: 999,
      description: 'Acceso ilimitado',
      icon: <Diamond sx={{ color: theme.colors.primary }} />,
      price: '250€/mes'
    },
  };

  const user = {
    ...userData,
    username: userData.username || 'Invitado',
    email: userData.email || 'No especificado',
    plan: userData.plan || 'basic',
  };

  useEffect(() => {
    fetchUserData();
    fetchAvailableCryptos();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/user/${userData.id}/cryptos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('coindunk_token')}`
        }
      });
      
      if (response.data.success) {
        setUserCryptos(response.data.cryptos);
        setInitialCryptos(response.data.cryptos); // Guardamos las criptos iniciales
        // Actualizar datos del usuario en localStorage
        const updatedUser = {
          ...userData,
          cryptos: response.data.cryptos,
          plan: response.data.plan.name.toLowerCase()
        };
        localStorage.setItem('coindunk_user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('coindunk_user');
        localStorage.removeItem('coindunk_token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCryptos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cryptos');
      if (response.data.success) {
        setAvailableCryptos(response.data.cryptos);
      }
    } catch (error) {
      console.error('Error fetching available cryptos:', error);
    }
  };

  const handleAddCrypto = () => {
    if (selectedCrypto && !userCryptos.some(c => c.id === selectedCrypto)) {
      const cryptoToAdd = availableCryptos.find(c => c.id === selectedCrypto);
      if (cryptoToAdd) {
        setUserCryptos([...userCryptos, cryptoToAdd]);
        setSelectedCrypto('');
      }
    }
  };

  const handleRemoveCrypto = (cryptoId) => {
    setUserCryptos(userCryptos.filter(c => c.id !== cryptoId));
  };

  const handleSaveCryptos = async () => {
    try {
      setLoading(true);
      const cryptoIds = userCryptos.map(c => c.id);
      
      const response = await axios.put(
        `http://localhost:5000/api/user/${userData.id}/cryptos`,
        { cryptos: cryptoIds },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('coindunk_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Actualizar el estado y localStorage con los nuevos datos
        const updatedUser = {
          ...userData,
          cryptos: userCryptos
        };
        localStorage.setItem('coindunk_user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setInitialCryptos(userCryptos); // Actualizar las criptos iniciales
        setOpenEditDialog(false);
      }
    } catch (error) {
      console.error('Error saving cryptos:', error);
      // Revertir a las criptos iniciales si hay error
      setUserCryptos(initialCryptos);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    // Revertir a las criptos iniciales al cancelar
    setUserCryptos(initialCryptos);
    setOpenEditDialog(false);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      pt: 12,  // Ajustado para evitar solapamiento con navbar
      pb: 4,
      backgroundImage: theme.isDarkMode 
        ? 'linear-gradient(to bottom, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 1))'
        : 'linear-gradient(to bottom, rgba(245, 245, 245, 0.95), rgba(255, 255, 255, 1))'
    }}>
      <Container maxWidth="md">
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
          {/* Header compacto */}
          <Box sx={{
            p: 1.5,
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
                left: 12,
                top: 12,
                color: theme.colors.textOnPrimary,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)'
                },
                transition: 'all 0.3s ease',
                size: 'small'
              }}
              aria-label="Volver"
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            
            <Typography variant="h5" sx={{
              fontWeight: 700,
              mt: 0,
              letterSpacing: 0.5,
              fontSize: '1.3rem'
            }}>
              Mi Cuenta CoinDunk
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Columna izquierda - Información del usuario */}
              <Grid item xs={12} md={6}>
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
                    icon={planInfo[user.plan]?.icon}
                    label={`${planInfo[user.plan]?.name} - ${planInfo[user.plan]?.price}`}
                    color={planInfo[user.plan]?.color}
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
                    {planInfo[user.plan]?.description}
                  </Typography>
                </Stack>

                <Divider sx={{ 
                  my: 3, 
                  borderColor: theme.colors.divider,
                  borderWidth: 1
                }} />

                {/* Sección de información */}
                <Stack spacing={2}>
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
                </Stack>
              </Grid>

              {/* Columna derecha - Criptomonedas y configuración */}
              <Grid item xs={12} md={"6"}>
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
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ 
                      color: theme.colors.textPrimary,
                      fontWeight: 600
                    }}>
                      Tus Criptomonedas
                    </Typography>
                    <Button
                      startIcon={<Edit />}
                      onClick={() => setOpenEditDialog(true)}
                      size="small"
                      sx={{
                        color: theme.colors.primary,
                        textTransform: 'none'
                      }}
                    >
                      Editar
                    </Button>
                  </Stack>

                  {userCryptos.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {userCryptos.map((crypto) => (
                        <Chip
                          key={crypto.id}
                          label={crypto.symbol}
                          sx={{
                            backgroundColor: theme.colors.primary + '20',
                            color: theme.colors.textPrimary
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                      No has agregado criptomonedas aún
                    </Typography>
                  )}

                  <Typography variant="caption" sx={{ 
                    display: 'block',
                    mt: 1,
                    color: theme.colors.textSecondary
                  }}>
                    {userCryptos.length}/{planInfo[user.plan]?.maxCryptos} criptomonedas
                  </Typography>
                </Paper>

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
                          {planInfo[user.plan]?.name}
                        </Typography>
                      </Box>
                    </Stack>
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
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* Diálogo para editar criptomonedas */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: theme.colors.cardBackground,
            border: `1px solid ${theme.colors.border}`
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.colors.primary,
          color: theme.colors.textOnPrimary
        }}>
          Editar tus criptomonedas
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ 
            mb: 2, 
            color: theme.colors.textSecondary,
            fontSize: '0.9rem'
          }}>
            Puedes agregar hasta {planInfo[user.plan]?.maxCryptos} criptomonedas ({userCryptos.length}/{planInfo[user.plan]?.maxCryptos} usadas)
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel 
                id="crypto-select-label"
                sx={{ color: theme.colors.textSecondary }}
              >
                Seleccionar criptomoneda
              </InputLabel>
              <Select
                labelId="crypto-select-label"
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                label="Seleccionar criptomoneda"
                disabled={userCryptos.length >= planInfo[user.plan]?.maxCryptos}
                sx={{
                  color: theme.colors.textPrimary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.colors.border
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.colors.primary
                  }
                }}
              >
                {availableCryptos
                  .filter(crypto => !userCryptos.some(c => c.id === crypto.id))
                  .map((crypto) => (
                    <MenuItem 
                      key={crypto.id} 
                      value={crypto.id}
                      sx={{
                        backgroundColor: theme.colors.paper,
                        '&:hover': {
                          backgroundColor: theme.colors.primary + '20'
                        }
                      }}
                    >
                      {crypto.name} ({crypto.symbol})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddCrypto}
              disabled={!selectedCrypto || userCryptos.length >= planInfo[user.plan]?.maxCryptos || loading}
              startIcon={<Add />}
              sx={{ 
                minWidth: 120,
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                '&:disabled': {
                  backgroundColor: theme.colors.disabled,
                  color: theme.colors.textDisabled
                }
              }}
            >
              Agregar
            </Button>
          </Stack>

          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            {userCryptos.length > 0 ? (
              <Stack spacing={1}>
                {userCryptos.map((crypto) => (
                  <Paper 
                    key={crypto.id} 
                    elevation={0} 
                    sx={{
                      p: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: theme.colors.paper,
                      borderRadius: 1,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  >
                    <Typography sx={{ color: theme.colors.textPrimary }}>
                      {crypto.name} ({crypto.symbol})
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveCrypto(crypto.id)}
                      sx={{ 
                        color: theme.isDarkMode ? theme.colors.error : '#d32f2f',
                        '&:hover': {
                          backgroundColor: theme.isDarkMode ? '#d32f2f20' : '#ffebee'
                        }
                      }}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                  py: 2
                }}
              >
                No hay criptomonedas agregadas
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          backgroundColor: theme.colors.paper,
          borderTop: `1px solid ${theme.colors.border}`
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ color: theme.colors.textSecondary }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveCryptos}
            variant="contained"
            disabled={loading}
            sx={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              '&:disabled': {
                backgroundColor: theme.colors.disabled,
                color: theme.colors.textDisabled
              }
            }}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Perfil;