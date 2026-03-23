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

                /* Global app background (light/dark) + smooth transitions */
                body {
                    background-attachment: fixed;
                }

                .MuiPaper-root,
                .MuiAppBar-root,
                .MuiDrawer-paper,
                .MuiButton-root,
                .MuiIconButton-root,
                .MuiInputBase-root,
                .MuiOutlinedInput-notchedOutline,
                .MuiDivider-root {
                    transition:
                      background-color 220ms ease,
                      color 220ms ease,
                      border-color 220ms ease,
                      box-shadow 220ms ease;
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
            default: '#F5F7FF',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#0F172A',
            secondary: '#64748B',
        },
        divider: 'rgba(15, 23, 42, 0.08)',
        action: {
            hover: 'rgba(15, 23, 42, 0.04)',
            selected: 'rgba(79, 70, 229, 0.08)',
            focus: 'rgba(79, 70, 229, 0.12)',
        },
    },
    components: {
        ...baseOptions.components,
        MuiCssBaseline: {
            styleOverrides: `
                ${baseOptions.components?.MuiCssBaseline?.styleOverrides ?? ''}
                html, body { color-scheme: light; }
                body {
                    background:
                      radial-gradient(1200px 700px at 12% 6%, rgba(79, 70, 229, 0.18) 0%, rgba(79, 70, 229, 0) 60%),
                      radial-gradient(900px 600px at 86% 14%, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0) 55%),
                      linear-gradient(180deg, #F5F7FF 0%, #EEF2FF 52%, #ECFDF5 100%);
                }
            `,
        },
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
                    backgroundColor: 'rgba(255, 255, 255, 0.78)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(15, 23, 42, 0.06)',
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
            default: '#070B16',
            paper: '#0B1426',
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
        },
        divider: 'rgba(148, 163, 184, 0.14)',
        action: {
            hover: 'rgba(248, 250, 252, 0.06)',
            selected: 'rgba(99, 102, 241, 0.18)',
            focus: 'rgba(99, 102, 241, 0.22)',
        },
    },
    components: {
        ...baseOptions.components,
        MuiCssBaseline: {
            styleOverrides: `
                ${baseOptions.components?.MuiCssBaseline?.styleOverrides ?? ''}
                html, body { color-scheme: dark; }
                body {
                    background:
                      radial-gradient(1100px 780px at 14% 10%, rgba(99, 102, 241, 0.34) 0%, rgba(99, 102, 241, 0) 58%),
                      radial-gradient(900px 680px at 86% 18%, rgba(52, 211, 153, 0.22) 0%, rgba(52, 211, 153, 0) 55%),
                      linear-gradient(180deg, #070B16 0%, #0B1224 52%, #071A16 100%);
                }
            `,
        },
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
                    backgroundColor: 'rgba(11, 20, 38, 0.78)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.16)',
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)',
                },
            },
        },
    },
});
