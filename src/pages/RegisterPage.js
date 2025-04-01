import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/Theme';
import { Box, TextField, Typography, Alert, Link, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import './LoginPage.css';

function RegisterPage() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        plan: location.state?.selectedPlan || 'basic' // Plan preseleccionado
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serverStatus, setServerStatus] = useState(null);
    const navigate = useNavigate();
    const theme = useContext(ThemeContext);

    // Verificar estado del servidor al cargar el componente
    useEffect(() => {
        const checkServerHealth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/health');
                setServerStatus(response.data.status === 'OK' ? 'online' : 'error');
            } catch (error) {
                setServerStatus('offline');
                console.error('Error checking server health:', error);
            }
        };
        
        checkServerHealth();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlanSelect = (plan) => {
        setFormData(prev => ({
            ...prev,
            plan: plan
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            // Validación básica del formulario
            if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                throw new Error('Todos los campos son requeridos');
            }

            if (formData.password !== formData.confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            // Intento de registro
            const response = await axios.post(
                'http://localhost:5000/api/auth/register', 
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    plan: formData.plan
                },
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 5000 // 5 segundos de timeout
                }
            );

            if (response.data.success) {
                // Almacenar datos de autenticación
                localStorage.setItem('coindunk_token', response.data.token);
                localStorage.setItem('coindunk_user', JSON.stringify(response.data.user));
                
                // Redirigir al dashboard
                navigate('/predicciones');
            } else {
                throw new Error(response.data.message || 'Error en el registro');
            }
        } catch (err) {
            console.error('Register error:', err);
            
            let errorMessage = 'Error durante el registro';
            if (err.response) {
                if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!theme) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                marginTop: '50px',
                backgroundColor: theme.colors.background,
                padding: '20px'
            }}
        >
            <Box
                component="form"
                onSubmit={handleRegister}
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '40px',
                    borderRadius: '16px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    backgroundColor: theme.colors.cardBackground,
                    textAlign: 'center'
                }}
            >
                <img 
                    src="CoinDunkNB.png" 
                    alt="Logo" 
                    className="logo-planeslogin"
                    style={{ maxWidth: '200px', marginBottom: '20px' }}
                />

                <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: 3,
                    color: theme.colors.textPrimary
                }}>
                    Crear Cuenta
                </Typography>

                {serverStatus === 'offline' && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        El servidor no está disponible. Inténtalo más tarde.
                    </Alert>
                )}

            <TextField
            label="Nombre Completo"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{
                mb: 2,
                '& .MuiInputLabel-root': {
                color: theme.colors.textSecondary,
                '&.Mui-focused': {
                    color: theme.colors.primary
                }
                },
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: theme.colors.border,
                },
                '&:hover fieldset': {
                    borderColor: theme.colors.primary,
                },
                '&.Mui-focused fieldset': {
                    borderColor: theme.colors.primary,
                    borderWidth: '1px'
                },
                '& input': {
                    color: theme.colors.textPrimary,
                    '&::placeholder': {
                    color: theme.colors.textSecondary,
                    opacity: 0.8
                    }
                }
                },
                '& .MuiFormHelperText-root': {
                color: theme.colors.textSecondary
                }
            }}
            />

            <TextField
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{
                mb: 2,
                '& .MuiInputLabel-root': {
                color: theme.colors.textSecondary,
                '&.Mui-focused': {
                    color: theme.colors.primary
                }
                },
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: theme.colors.border,
                },
                '&:hover fieldset': {
                    borderColor: theme.colors.primary,
                },
                '&.Mui-focused fieldset': {
                    borderColor: theme.colors.primary,
                    borderWidth: '1px'
                },
                '& input': {
                    color: theme.colors.textPrimary,
                    '&::placeholder': {
                    color: theme.colors.textSecondary,
                    opacity: 0.8
                    }
                }
                }
            }}
            />

            <TextField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{
                mb: 2,
                '& .MuiInputLabel-root': {
                color: theme.colors.textSecondary,
                '&.Mui-focused': {
                    color: theme.colors.primary
                }
                },
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: theme.colors.border,
                },
                '&:hover fieldset': {
                    borderColor: theme.colors.primary,
                },
                '&.Mui-focused fieldset': {
                    borderColor: theme.colors.primary,
                    borderWidth: '1px'
                },
                '& input': {
                    color: theme.colors.textPrimary,
                }
                }
            }}
            />

            <TextField
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            disabled={isLoading}
            sx={{
                mb: 3,
                '& .MuiInputLabel-root': {
                color: theme.colors.textSecondary,
                '&.Mui-focused': {
                    color: theme.colors.primary
                }
                },
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: theme.colors.border,
                },
                '&:hover fieldset': {
                    borderColor: theme.colors.primary,
                },
                '&.Mui-focused fieldset': {
                    borderColor: theme.colors.primary,
                    borderWidth: '1px'
                },
                '& input': {
                    color: theme.colors.textPrimary,
                }
                }
            }}
            />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ 
                        mb: 2,
                        color: theme.colors.textPrimary
                    }}>
                        Selecciona tu plan:
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {['basic', 'pro', 'premium'].map((plan) => (
                            <Button
                                key={plan}
                                variant={formData.plan === plan ? 'contained' : 'outlined'}
                                onClick={() => handlePlanSelect(plan)}
                                sx={{
                                    textTransform: 'capitalize',
                                    backgroundColor: formData.plan === plan ? theme.colors.primary : 'transparent',
                                    color: formData.plan === plan ? theme.colors.textOnPrimary : theme.colors.textPrimary,
                                    borderColor: theme.colors.primary,
                                    '&:hover': {
                                        backgroundColor: formData.plan === plan ? theme.colors.primaryHover : theme.colors.paper,
                                        borderColor: theme.colors.primaryHover
                                    }
                                }}
                            >
                                {plan}
                            </Button>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <button
                        type="submit"
                        disabled={isLoading || serverStatus !== 'online'}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isLoading || serverStatus !== 'online' ? 
                                theme.colors.disabled : theme.colors.primary,
                            color: theme.colors.textOnPrimary,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: isLoading || serverStatus !== 'online' ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        {isLoading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                    {isLoading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                                color: theme.colors.primary
                            }}
                        />
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mt: 3 }}>
                    <Link 
                        component="button"
                        type="button"
                        onClick={() => navigate('/login')}
                        sx={{ 
                            color: theme.colors.textSecondary,
                            textDecoration: 'none',
                            '&:hover': {
                                color: theme.colors.primary,
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </Link>
                </Box>
            </Box>
        </Box>
    );

    
}

export default RegisterPage;