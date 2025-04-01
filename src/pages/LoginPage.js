import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/Theme';
import { Box, TextField, Typography, Alert, Link } from '@mui/material';
import axios from 'axios';  
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('user@coindunk.com'); // Valor por defecto para pruebas
    const [password, setPassword] = useState('user'); // Valor por defecto para pruebas
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useContext(ThemeContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            // 1. Verificar conexión con el backend
            await axios.get('http://localhost:5000/api/health');
            
            // 2. Intentar login
            const response = await axios.post(
                'http://localhost:5000/api/auth/login', 
                { email, password },
                { 
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                localStorage.setItem('coindunk_token', response.data.token);
                localStorage.setItem('coindunk_user', JSON.stringify(response.data.user));
                navigate('/');
            } else {
                setError(response.data.message || 'Credenciales incorrectas');
            }
        } catch (err) {
            console.error('Error completo:', err);
            let errorMessage = 'Error al conectar con el servidor';
            
            if (err.response) {
                // El servidor respondió con un código de error
                if (err.response.status === 401) {
                    errorMessage = 'Credenciales incorrectas';
                } else if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.request) {
                // La solicitud fue hecha pero no hubo respuesta
                errorMessage = 'El servidor no responde. Verifica que esté corriendo en el puerto 5000';
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!theme) {
        return <div>Cargando tema...</div>;
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
                <img src="CoinDunkNB.png" alt="Logo"className="logo-planes"/>

                <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: 3,
                    color: theme.colors.primary
                }}>
                    Iniciar Sesión
                </Typography>

                <form onSubmit={handleLogin}>
                    <TextField
                        label="Correo Electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        sx={{ mb: 3 }}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: theme.colors.primary,
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mt: 3 }}>
                    <Link 
                        href="#" 
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