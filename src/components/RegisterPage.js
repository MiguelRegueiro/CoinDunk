import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Alert, Link } from '@mui/material';
import StyledButton from './StyledButton';
import { login } from '../stores/authStore';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setError(''); // Reset error

        // Check if all fields are filled
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Check if the email is already registered
        const existingUser = JSON.parse(localStorage.getItem('user'));
        if (existingUser && existingUser.email === email) {
            setError('This email is already registered.');
            return;
        }

        // Save the new user data in localStorage
        const newUser = { email, password };
        localStorage.setItem('user', JSON.stringify(newUser));

        // Automatically log the user in after successful registration
        login(newUser);

        // Show success message and redirect to dashboard
        setSuccess(true);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    return (
        <Box sx={{ mb: 4 }}> {/* Outer Box for spacing below the form */}
            <Box
                sx={{
                    maxWidth: 400,
                    mx: 'auto',
                    mt: 8,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #333, #444)'
                        : 'linear-gradient(135deg, #f5f7fa, #ffffff)',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <StyledButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Register
                    </StyledButton>
                </form>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Account created successfully! Redirecting to dashboard...
                    </Alert>
                )}

                {/* Link to login page */}
                <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary', fontSize: '1.1rem' }}>
                    Already have an account?{' '}
                    <Link
                        component="button"
                        onClick={() => navigate('/login')}
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
                        Log in
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}

export default RegisterPage;
