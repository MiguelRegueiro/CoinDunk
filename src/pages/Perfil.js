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
                    mb: 2
                  }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                  
                  <Chip 
                    icon={planInfo[user.plan]?.icon}
                    label={`${planInfo[user.plan]?.name} - ${planInfo[user.plan]?.price}`}
                    color={planInfo[user.plan]?.color}
                    variant="outlined"
                  />
                  <Typography variant="caption">
                    {planInfo[user.plan]?.description}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Sección de información */}
                <Stack spacing={2}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Person sx={{ color: theme.colors.primary }} />
                      <Box>
                        <Typography variant="caption">Nombre de usuario</Typography>
                        <Typography>{user.username}</Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Email sx={{ color: theme.colors.primary }} />
                      <Box>
                        <Typography variant="caption">Correo electrónico</Typography>
                        <Typography>{user.email}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>

              {/* Columna derecha - Criptomonedas y configuración */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Tus Criptomonedas</Typography>
                    <Button
                      startIcon={<Edit />}
                      onClick={() => setOpenEditDialog(true)}
                      size="small"
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
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2">
                      No has agregado criptomonedas aún
                    </Typography>
                  )}

                  <Typography variant="caption">
                    {userCryptos.length}/{planInfo[user.plan]?.maxCryptos} criptomonedas
                  </Typography>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Security sx={{ color: theme.colors.primary }} />
                      <Box>
                        <Typography variant="caption">Plan actual</Typography>
                        <Typography>{planInfo[user.plan]?.name}</Typography>
                      </Box>
                    </Stack>
                    {user.plan !== 'premium' && (
                      <Button 
                        variant="contained"
                        size="small"
                        onClick={() => navigate('/planes')}
                      >
                        Actualizar
                      </Button>
                    )}
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      {theme.isDarkMode ? (
                        <DarkMode sx={{ color: theme.colors.primary }} />
                      ) : (
                        <LightMode sx={{ color: theme.colors.primary }} />
                      )}
                      <Box>
                        <Typography variant="caption">Tema de la aplicación</Typography>
                        <Typography>Modo {theme.isDarkMode ? 'oscuro' : 'claro'}</Typography>
                      </Box>
                    </Stack>
                    <Switch
                      checked={theme.isDarkMode}
                      onChange={theme.toggleTheme}
                      color="primary"
                    />
                  </Stack>
                </Paper>

                <Button 
                  fullWidth
                  variant="contained"
                  startIcon={<Logout />}
                  onClick={handleLogout}
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
      >
        <DialogTitle>
          Editar tus criptomonedas
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Puedes agregar hasta {planInfo[user.plan]?.maxCryptos} criptomonedas ({userCryptos.length}/{planInfo[user.plan]?.maxCryptos} usadas)
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Seleccionar criptomoneda</InputLabel>
              <Select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                label="Seleccionar criptomoneda"
                disabled={userCryptos.length >= planInfo[user.plan]?.maxCryptos}
              >
                {availableCryptos
                  .filter(crypto => !userCryptos.some(c => c.id === crypto.id))
                  .map((crypto) => (
                    <MenuItem key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddCrypto}
              disabled={!selectedCrypto || userCryptos.length >= planInfo[user.plan]?.maxCryptos || saveLoading}
              startIcon={<Add />}
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
                      alignItems: 'center'
                    }}
                  >
                    <Typography>
                      {crypto.name} ({crypto.symbol})
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveCrypto(crypto.id)}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ textAlign: 'center', py: 2 }}>
                No hay criptomonedas agregadas
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveCryptos}
            variant="contained"
            disabled={saveLoading}
            startIcon={saveLoading ? <CircularProgress size={20} /> : null}
          >
            {saveLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Perfil;