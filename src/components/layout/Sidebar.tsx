'use client';

import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Toolbar,
    useTheme,
    Tooltip,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Storefront';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
    sidebarCollapsed: boolean;
}

const MENU_ITEMS = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Shops', icon: <StoreIcon />, path: '/shop/list' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/stock/list' },
    { text: 'Sales', icon: <PointOfSaleIcon />, path: '/sales' },
    { text: 'Category', icon: <CategoryIcon />, path: '/category' },
    { text: 'Staff', icon: <PeopleIcon />, path: '/staff' },
    { text: 'Company', icon: <BusinessIcon />, path: '/company' },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose, sidebarCollapsed }) => {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();

    const currentDrawerWidth = sidebarCollapsed ? 88 : 260;

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowX: 'hidden' }}>
            <Toolbar /> {/* Spacer for header */}
            <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, py: 2 }}>
                <List sx={{ px: sidebarCollapsed ? 1 : 2 }}>
                    {MENU_ITEMS.map((item) => {
                        const modulePath = item.path.split('/').slice(0, 2).join('/');
                        const isActive = pathname === item.path || (pathname?.startsWith(modulePath) && modulePath.length > 1);

                        const listItemButton = (
                            <ListItemButton
                                selected={isActive}
                                onClick={() => {
                                    router.push(item.path);
                                    if (mobileOpen) onClose();
                                }}
                                sx={{
                                    borderRadius: sidebarCollapsed ? 3 : 2,
                                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                    px: sidebarCollapsed ? 0 : 2,
                                    py: sidebarCollapsed ? 1.5 : 1.25,
                                    mb: 1,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.contrastText',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: sidebarCollapsed ? 0 : 40,
                                        mr: sidebarCollapsed ? 0 : 1,
                                        justifyContent: 'center',
                                        color: isActive ? 'primary.contrastText' : 'text.secondary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {!sidebarCollapsed && (
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 500,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        );

                        return (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                {sidebarCollapsed ? (
                                    <Tooltip title={item.text} placement="right" arrow>
                                        {listItemButton}
                                    </Tooltip>
                                ) : (
                                    listItemButton
                                )}
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}>
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 260,
                        boxSizing: 'border-box',
                        borderRight: 'none',
                        boxShadow: theme.shadows[8],
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        width: currentDrawerWidth,
                        boxSizing: 'border-box',
                        borderRight: `1px solid ${theme.palette.divider}`,
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.easeInOut,
                            duration: theme.transitions.duration.standard,
                        }),
                        overflowX: 'hidden'
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};
