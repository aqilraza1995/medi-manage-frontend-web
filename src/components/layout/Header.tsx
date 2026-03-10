'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleTheme } from '@/store/slices/themeSlice';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    onDrawerToggle: () => void;
    sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onDrawerToggle, sidebarCollapsed }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const themeMode = useSelector((state: RootState) => state.theme.mode);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        dispatch(logout());
        router.push('/login');
    };

    const handleProfile = () => {
        handleMenuClose();
        router.push('/profile');
    };

    return (
        <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: (t) => t.zIndex.drawer + 1,
                backdropFilter: 'blur(8px)',
                backgroundColor: themeMode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.8)',
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', width: sidebarCollapsed ? 88 : 260, transition: 'width 0.3s ease-in-out', flexShrink: 0 }}>
                    <LocalPharmacyIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                    {!sidebarCollapsed && (
                        <Typography variant="h6" color="text.primary" fontWeight="bold" noWrap>
                            Medisphere
                        </Typography>
                    )}
                </Box>

                {/* Desktop Toggle Icon immediately next to logo area */}
                <IconButton
                    color="primary"
                    onClick={onDrawerToggle}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        ml: 2,
                        bgcolor: themeMode === 'light' ? 'primary.50' : 'rgba(99, 102, 241, 0.1)',
                        '&:hover': {
                            bgcolor: themeMode === 'light' ? 'primary.100' : 'rgba(99, 102, 241, 0.2)',
                        },
                        borderRadius: 2
                    }}
                >
                    {sidebarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        onClick={() => dispatch(toggleTheme())}
                        sx={{
                            color: themeMode === 'light' ? 'text.primary' : 'primary.contrastText',
                            bgcolor: themeMode === 'light' ? 'transparent' : 'rgba(255,255,255,0.1)',
                            '&:hover': { bgcolor: themeMode === 'light' ? 'action.hover' : 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    <IconButton
                        sx={{
                            color: themeMode === 'light' ? 'text.primary' : 'primary.contrastText',
                            bgcolor: themeMode === 'light' ? 'transparent' : 'rgba(255,255,255,0.1)',
                            '&:hover': { bgcolor: themeMode === 'light' ? 'action.hover' : 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>

                    <IconButton onClick={handleMenuOpen} sx={{ ml: 1, p: 0.5, bgcolor: themeMode === 'light' ? 'transparent' : 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                        <Avatar alt={user?.name || 'User'} src="/static/images/avatar/2.jpg">
                            {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            elevation: 4,
                            sx: { minWidth: 200, mt: 1.5, borderRadius: 2 },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {user?.name || 'User Profile'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {user?.email || 'user@example.com'}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>Profile Settings</MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
