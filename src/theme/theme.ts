import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12, // More pill-like and native feel
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                input[type=number]::-webkit-outer-spin-button,
                input[type=number]::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `,
        },
    },
};

export const lightTheme = createTheme({
    ...baseOptions,
    palette: {
        mode: 'light',
        primary: {
            main: '#4F46E5', // Indigo modern
            light: '#818CF8',
            dark: '#3730A3',
        },
        secondary: {
            main: '#10B981', // Emerald
            light: '#34D399',
            dark: '#047857',
        },
        background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#0F172A',
            secondary: '#64748B',
        },
    },
    components: {
        ...baseOptions.components,
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: 'none',
                    padding: '10px 24px',
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 3px rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.04)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    ...baseOptions,
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366F1', // Indigo modern lighter
            light: '#818CF8',
            dark: '#4338CA',
        },
        secondary: {
            main: '#34D399',
            light: '#6EE7B7',
            dark: '#10B981',
        },
        background: {
            default: '#0F172A', // Slate 900
            paper: '#1E293B',   // Slate 800
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
    },
    components: {
        ...baseOptions.components,
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: 'none',
                    padding: '10px 24px',
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundImage: 'none',
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 3px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)',
                },
            },
        },
    },
});
