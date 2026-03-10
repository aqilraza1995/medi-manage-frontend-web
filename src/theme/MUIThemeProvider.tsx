'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { lightTheme, darkTheme } from './theme';

export default function MUIThemeProvider({ children }: { children: React.ReactNode }) {
    const mode = useSelector((state: RootState) => state.theme.mode);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Prevent layout shift/hydration mismatch: render children without theme initially or with a default
        // To be perfectly safe with SSR, we render a default but hidden or we accept the flash.
        // Returning null delays first paint. Returning children is better but might lack CSS for a split second.
        return <div style={{ visibility: 'hidden' }}>{children}</div>;
    }

    return (
        <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
