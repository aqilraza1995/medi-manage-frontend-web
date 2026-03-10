'use client';

import React, { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CustomBreadcrumbs } from '@/components/common/Breadcrumbs';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    // Using md breakpoint for desktop view mappings
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    // mobileOpen is for full screen drawer on mobile devices
    const [mobileOpen, setMobileOpen] = useState(false);
    // sidebarCollapsed is the mini-drawer state on desktop
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleDrawerToggle = () => {
        if (isDesktop) {
            setSidebarCollapsed(!sidebarCollapsed);
        } else {
            setMobileOpen(!mobileOpen);
        }
    };

    const currentDrawerWidth = isDesktop && sidebarCollapsed ? 88 : 260; // 88px for mini variant

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header onDrawerToggle={handleDrawerToggle} sidebarCollapsed={sidebarCollapsed} />
            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sidebarCollapsed={sidebarCollapsed}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3, md: 4 },
                    width: {
                        xs: '100%',
                        md: `calc(100% - ${currentDrawerWidth}px)`
                    },
                    maxWidth: '100vw',
                    overflowX: 'hidden',
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.standard,
                    }),
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                <CustomBreadcrumbs />
                {children}
            </Box>
        </Box>
    );
};
