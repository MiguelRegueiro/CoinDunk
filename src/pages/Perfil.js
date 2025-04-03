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
  FormControl,
  CircularProgress
} from '@mui/material';
import { 
  Email, 
  Person, 
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
  const [saveLoading, setSaveLoading] = useState(false);
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
        setInitialCryptos(response.data.cryptos);
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
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCryptos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cryptos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('coindunk_token')}`
        }
      });
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
      setSaveLoading(true);
      const cryptoIds = userCryptos.map(c => c.id);
      
      const response = await axios.post(
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
        const updatedUser = {
          ...userData,
          cryptos: userCryptos
        };
        localStorage.setItem('coindunk_user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setInitialCryptos(userCryptos);
        setOpenEditDialog(false);
      }
    } catch (error) {
      console.error('Error saving cryptos:', error);
      setUserCryptos(initialCryptos);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setUserCryptos(initialCryptos);
    setOpenEditDialog(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('coindunk_token');
    localStorage.removeItem('coindunk_user');
    navigate('/login');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      pt: 12,
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
          border: `1px solid ${theme.colors.border}`
        }}>
          {/* Header */}
          <Box sx={{
            p: 1.5,
            backgroundColor: theme.colors.primary,
            color: theme.colors.textOnPrimary,
            position: 'relative',
            textAlign: 'center'
          }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                position: 'absolute',
                left: 12,
                top: 12,
                color: theme.colors.textOnPrimary
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Mi Cuenta CoinDunk
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={4}> {/* Aumentado el spacing para mejor distribución */}
              {/* Columna izquierda - Información del usuario */}
              <Grid item xs={12} md={5}>
                <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                  <Avatar sx={{ 
                    width: 120, 
                    height: 120, 
                    fontSize: '3rem',
                    bgcolor: theme.colors.primary,
                    color: theme.colors.textOnPrimary,
                    mb: 2,
                    border: `3px solid ${theme.colors.primaryLight}`,
                    boxShadow: theme.shadow
                  }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: theme.colors.textPrimary,
                    textAlign: 'center'
                  }}>
                    {user.username}
                  </Typography>
                  
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip 
                      icon={planInfo[user.plan]?.icon}
                      label={`${planInfo[user.plan]?.name} - ${planInfo[user.plan]?.price}`}
                      color={planInfo[user.plan]?.color}
                      variant="outlined"
                      sx={{ 
                        borderColor: theme.colors.primary,
                        color: theme.colors.textPrimary,
                        fontWeight: 500,
                        px: 1,
                        py: 1.5
                      }}
                    />
                    {user.plan !== 'premium' && (
                      <Button
                        href="/actualizar-plan"
                        variant="text"
                        size="small"
                        sx={{
                          color: theme.colors.primary,
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          padding: '6px 14px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          backgroundColor: theme.isDarkMode 
                            ? `${theme.colors.primary}20` 
                            : `${theme.colors.primary}10`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: theme.isDarkMode 
                              ? `${theme.colors.primary}30` 
                              : `${theme.colors.primary}20`,
                            transform: 'translateY(-1px)'
                          }
                        }}
                      >
                        Actualizar
                      </Button>
                    )}
                  </Stack>
                  <Typography variant="caption" sx={{ 
                    color: theme.colors.textSecondary,
                    textAlign: 'center'
                  }}>
                    {planInfo[user.plan]?.description}
                  </Typography>
                </Stack>

                <Divider sx={{ 
                  my: 3,
                  borderColor: theme.colors.divider,
                  borderWidth: 1
                }} />

                {/* Sección de información personal */}
                <Stack spacing={2.5}> {/* Aumentado el spacing */}
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    backgroundColor: theme.colors.paper,
                    border: `1px solid ${theme.colors.border}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadow
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
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Nombre de usuario
                        </Typography>
                        <Typography sx={{ 
                          color: theme.colors.textPrimary,
                          fontWeight: 500
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
                      boxShadow: theme.shadow
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
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Correo electrónico
                        </Typography>
                        <Typography sx={{ 
                          color: theme.colors.textPrimary,
                          fontWeight: 500
                        }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>

              {/* Columna derecha - Configuración */}
              <Grid item xs={12} md={7}>
                <Stack spacing={3}> {/* Aumentado el spacing entre elementos */}
                  {/* Sección de criptomonedas */}
                  <Paper elevation={0} sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    backgroundColor: theme.colors.paper,
                    border: `1px solid ${theme.colors.border}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: theme.shadow
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
                        startIcon={<Edit sx={{ fontSize: '1.1rem' }} />}
                        onClick={() => setOpenEditDialog(true)}
                        size="small"
                        sx={{ 
                          color: theme.colors.primary,
                          backgroundColor: 'transparent',
                          '&:hover': {
                            backgroundColor: theme.isDarkMode ? 'rgba(255, 167, 38, 0.08)' : 'rgba(230, 126, 34, 0.08)',
                            transform: 'translateY(-1px)'
                          },
                          transition: 'all 0.2s ease',
                          fontWeight: 500,
                          textTransform: 'none',
                          letterSpacing: '0.5px',
                          borderRadius: 1
                        }}
                      >
                        Editar
                      </Button>
                    </Stack>

                    {userCryptos.length > 0 ? (
                      <Stack direction="row" flexWrap="wrap" gap={1.5}> {/* Aumentado el gap */}
                        {userCryptos.map((crypto) => (
                          <Chip
                            key={crypto.id}
                            label={crypto.symbol}
                            sx={{
                              backgroundColor: theme.colors.primaryLight,
                              color: theme.colors.textOnPrimary,
                              fontWeight: 500,
                              '& .MuiChip-label': {
                                px: 1.2
                              },
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: theme.shadow
                              },
                              transition: 'all 0.2s ease'
                            }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" sx={{ 
                        color: theme.colors.textSecondary,
                        fontStyle: 'italic'
                      }}>
                        No has agregado criptomonedas aún
                      </Typography>
                    )}

                    <Typography variant="caption" sx={{ 
                      display: 'block',
                      mt: 2, // Aumentado el margen superior
                      color: theme.colors.textSecondary,
                      fontSize: '0.75rem'
                    }}>
                      {userCryptos.length}/{planInfo[user.plan]?.maxCryptos} criptomonedas
                    </Typography>
                  </Paper>

                  {/* Configuración de tema */}
                  <Paper elevation={0} sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    backgroundColor: theme.colors.paper,
                    border: `1px solid ${theme.colors.border}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadow
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
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Tema de la aplicación
                          </Typography>
                          <Typography sx={{ 
                            color: theme.colors.textPrimary,
                            fontWeight: 500
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
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: theme.colors.primary,
                            '&:hover': {
                              backgroundColor: 'transparent'
                            }
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: theme.colors.primaryLight
                          }
                        }}
                      />
                    </Stack>
                  </Paper>

                  {/* Botón de cerrar sesión */}
                  <Button 
                    fullWidth
                    variant="contained"
                    startIcon={<Logout sx={{ fontSize: '1.1rem' }} />}
                    onClick={handleLogout}
                    sx={{
                      backgroundColor: theme.colors.error,
                      color: theme.colors.textOnPrimary,
                      '&:hover': {
                        backgroundColor: theme.isDarkMode ? '#D32F2F' : '#B71C1C',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease',
                      fontWeight: 500,
                      textTransform: 'none',
                      letterSpacing: '0.5px',
                      borderRadius: 1,
                      py: 1.2,
                      boxShadow: theme.shadow
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                </Stack>
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
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme.colors.textOnPrimary,
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
          py: 2,
          borderBottom: `1px solid ${theme.colors.border}`
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Editar tus criptomonedas
          </Typography>
          <Typography variant="caption" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 400
          }}>
            Selecciona las criptomonedas que deseas seguir
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ 
              mb: 2,
              color: theme.colors.textSecondary,
              fontSize: '0.875rem'
            }}>
              Puedes agregar hasta {planInfo[user.plan]?.maxCryptos} criptomonedas ({userCryptos.length}/{planInfo[user.plan]?.maxCryptos} usadas)
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ 
                  color: theme.colors.textSecondary,
                  '&.Mui-focused': {
                    color: theme.colors.primary
                  }
                }}>
                  Seleccionar criptomoneda
                </InputLabel>
                <Select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  label="Seleccionar criptomoneda"
                  disabled={userCryptos.length >= planInfo[user.plan]?.maxCryptos}
                  sx={{
                    color: theme.colors.textPrimary,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.border,
                      borderRadius: 1
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.primary
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.colors.primary,
                      borderWidth: 1
                    },
                    '& .MuiSelect-icon': {
                      color: theme.colors.textSecondary
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.colors.cardBackground,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: 1,
                        mt: 0.5,
                        boxShadow: theme.shadowIntense,
                        '& .MuiMenuItem-root': {
                          color: theme.colors.textPrimary,
                          backgroundColor: theme.colors.cardBackground,
                          '&:hover': {
                            backgroundColor: theme.colors.primaryLight,
                            color: theme.colors.textOnPrimary
                          },
                          '&.Mui-selected': {
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.textOnPrimary,
                            '&:hover': {
                              backgroundColor: theme.colors.primaryHover
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  {availableCryptos
                    .filter(crypto => !userCryptos.some(c => c.id === crypto.id))
                    .map((crypto) => (
                      <MenuItem 
                        key={crypto.id} 
                        value={crypto.id}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Typography variant="caption" sx={{ 
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}>
                            {crypto.symbol}
                          </Typography>
                          <Typography sx={{ fontWeight: 500 }}>
                            {crypto.name}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleAddCrypto}
                disabled={!selectedCrypto || userCryptos.length >= planInfo[user.plan]?.maxCryptos || saveLoading}
                startIcon={<Add />}
                sx={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.textOnPrimary,
                  '&:hover': {
                    backgroundColor: theme.colors.primaryHover
                  },
                  '&:disabled': {
                    backgroundColor: theme.colors.textDisabled,
                    color: theme.colors.textOnPrimary
                  },
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                  minWidth: 100,
                  borderRadius: 1,
                  boxShadow: 'none'
                }}
              >
                Agregar
              </Button>
            </Stack>

            <Box sx={{ 
              maxHeight: 300, 
              overflow: 'auto',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 1,
              backgroundColor: theme.colors.paper
            }}>
              {userCryptos.length > 0 ? (
                <Stack spacing={0}>
                  {userCryptos.map((crypto) => (
                    <Paper 
                      key={crypto.id} 
                      elevation={0} 
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: theme.colors.paper,
                        borderBottom: `1px solid ${theme.colors.divider}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'
                        },
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: theme.colors.primaryLight,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="caption" sx={{ 
                            fontWeight: 600,
                            color: theme.colors.textOnPrimary
                          }}>
                            {crypto.symbol}
                          </Typography>
                        </Box>
                        <Typography sx={{ 
                          color: theme.colors.textPrimary,
                          fontWeight: 500
                        }}>
                          {crypto.name}
                        </Typography>
                      </Stack>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveCrypto(crypto.id)}
                        sx={{ 
                          color: theme.colors.error,
                          '&:hover': {
                            backgroundColor: theme.isDarkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ 
                  textAlign: 'center', 
                  py: 3,
                  color: theme.colors.textSecondary,
                  fontStyle: 'italic'
                }}>
                  No hay criptomonedas agregadas
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          backgroundColor: theme.colors.paper,
          borderTop: `1px solid ${theme.colors.divider}`,
          p: 2
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: theme.colors.textSecondary,
              fontWeight: 500,
              '&:hover': {
                color: theme.colors.textPrimary,
                backgroundColor: 'transparent'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveCryptos}
            variant="contained"
            disabled={saveLoading}
            startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              '&:hover': {
                backgroundColor: theme.colors.primaryHover
              },
              transition: 'all 0.2s ease',
              fontWeight: 500,
              borderRadius: 1,
              px: 3,
              boxShadow: 'none'
            }}
          >
            {saveLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Perfil;