import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/Theme';
import { Box, TextField, Typography, Alert, Link, CircularProgress } from '@mui/material';
import axios from 'axios';  
import './LoginPage.css';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: 'user@coindunk.com',
        password: 'user'
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            // Validación básica del formulario
            if (!formData.email || !formData.password) {
                throw new Error('Email y contraseña son requeridos');
            }

            // Intento de login
            const response = await axios.post(
                'http://localhost:5000/api/auth/login', 
                formData,
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
                navigate('/dashboard');
            } else {
                throw new Error(response.data.message || 'Credenciales incorrectas');
            }
        } catch (err) {
            console.error('Login error:', err);
            
            let errorMessage = 'Error durante el login';
            if (err.response) {
                // Error del servidor
                if (err.response.status === 401) {
                    errorMessage = 'Credenciales incorrectas';
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.request) {
                // No hubo respuesta del servidor
                errorMessage = 'El servidor no responde. Por favor, inténtalo más tarde.';
            } else if (err.message) {
                // Error en el código
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
                backgroundColor: theme.colors.background,
                padding: '20px'
            }}
        >
            <Box
                component="form"
                onSubmit={handleLogin}
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
                    className="logo-planes"
                    style={{ maxWidth: '200px', marginBottom: '20px' }}
                />

                <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: 3,
                    color: theme.colors.primary
                }}>
                    Iniciar Sesión
                </Typography>

                {serverStatus === 'offline' && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        El servidor no está disponible. Inténtalo más tarde.
                    </Alert>
                )}

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
                    sx={{ mb: 2 }}
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
                    sx={{ mb: 3 }}
                />

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
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: isLoading || serverStatus !== 'online' ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
                        onClick={() => navigate('/register')}
                        sx={{ 
                            color: theme.colors.text,
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        ¿No tienes cuenta? Regístrate
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}




export default LoginPage;