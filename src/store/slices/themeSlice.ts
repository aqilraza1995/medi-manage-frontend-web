import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
    mode: 'light' | 'dark';
}

const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
    }
    return 'light'; // default
};

const initialState: ThemeState = {
    mode: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            const newMode = state.mode === 'light' ? 'dark' : 'light';
            state.mode = newMode;
            if (typeof window !== 'undefined') localStorage.setItem('theme', newMode);
        },
        setTheme: (state, action: { payload: 'light' | 'dark' }) => {
            state.mode = action.payload;
            if (typeof window !== 'undefined') localStorage.setItem('theme', action.payload);
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
