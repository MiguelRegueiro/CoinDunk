// src/theme.js
import { createTheme } from '@mui/material/styles';

const sharedButtonStyles = {
    borderRadius: '8px',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
        transform: 'scale(1.05)',
    },
};

// Light Theme
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1E90FF', // Bright blue
            contrastText: '#fff',
        },
        background: {
            default: '#f4f5f7', // Light gray background
            paper: '#ffffff', // Pure white for card/paper elements
        },
        text: {
            primary: '#333', // Darker text for contrast
            secondary: '#555', // Muted secondary text
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(to right, #ffffff, #f4f5f7)',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px', // Smooth rounded corners
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #f7f8fa, #ffffff)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    ...sharedButtonStyles,
                    color: '#333',
                    backgroundColor: '#e0e0e0',
                    '&:hover': {
                        backgroundColor: '#d3d3d3',
                    },
                },
            },
        },
    },
});

// Dark Theme
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#66FCF1', // Sleek teal
            contrastText: '#0b0c10',
        },
        background: {
            default: '#0b0c10', // Dark background
            paper: '#1f2833', // Slightly lighter for contrast
        },
        text: {
            primary: '#c5c6c7', // Soft gray for readability
            secondary: '#8c8f91', // Muted secondary text
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(to right, #1f2833, #0b0c10)',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.4)',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #2b2b2b, #1f2833)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    ...sharedButtonStyles,
                    color: '#333', // Keeping consistent with light theme
                    backgroundColor: '#e0e0e0',
                    '&:hover': {
                        backgroundColor: '#d3d3d3',
                    },
                },
            },
        },
    },
});
