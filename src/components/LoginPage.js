import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../stores/authStore';
import { Box, TextField, Typography, Alert, Link } from '@mui/material';
import StyledButton from './StyledButton';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showCredentials, setShowCredentials] = useState(false);
    const navigate = useNavigate();

    const defaultCredentials = {
        email: 'default@example.com',
        password: 'password123'
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        if (!email || !password) {
            setError('Please fill in both email and password.');
            return;
        }

        if (email === defaultCredentials.email && password === defaultCredentials.password) {
            login();
            navigate('/dashboard'); // Redirect to the dashboard
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    const handleShowDefaultCredentials = () => {
        setEmail(defaultCredentials.email);
        setPassword(defaultCredentials.password);
        setShowCredentials(true);
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 8,
                mb: 8, // Add bottom margin to prevent touching the footer
                p: 3,
                borderRadius: 2,
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #222, #333)' 
                    : 'linear-gradient(135deg, #f5f7fa, #ffffff)', 
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Login
            </Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    helperText={!email && 'Enter your email address'}
                    error={!email && Boolean(error)}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    helperText={!password && 'Enter your password'}
                    error={!password && Boolean(error)}
                />
                <StyledButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </StyledButton>
            </form>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {showCredentials && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>Email:</strong> {defaultCredentials.email}<br />
                    <strong>Password:</strong> {defaultCredentials.password}
                </Alert>
            )}

            <StyledButton
                onClick={handleShowDefaultCredentials}
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Show Default Credentials
            </StyledButton>

            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                <Link
                    component="button"
                    onClick={() => navigate('/forgot-password')}
                    sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    Forgot Password?
                </Link>
            </Typography>

            <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
                Don't have an account?{' '}
                <Link
                    component="button"
                    onClick={() => navigate('/register')}
                    sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'none',
                            color: 'primary.dark',
                        },
                    }}
                >
                    Register
                </Link>
            </Typography>
        </Box>
    );
}

export default LoginPage;
