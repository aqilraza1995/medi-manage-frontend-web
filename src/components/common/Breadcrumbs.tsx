'use client';

import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Typography, Link, Box } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const CustomBreadcrumbs = () => {
    const pathname = usePathname();

    // Skip creating breadcrumbs for home/login/register/onboarding
    if (['/', '/login', '/register', '/onboarding'].includes(pathname)) {
        return null;
    }

    // Filter out empty strings and 'list' to keep breadcrumbs clean
    const pathnames = pathname.split('/').filter((x) => x && x !== 'list');

    // Capitalize and format text
    const formatText = (text: string) => {
        const decamelized = text.replace(/([A-Z])/g, ' $1');
        return decamelized.charAt(0).toUpperCase() + decamelized.slice(1);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <MUIBreadcrumbs
                separator={<ChevronRightIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                <Link
                    component={NextLink}
                    href="/dashboard"
                    underline="hover"
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>

                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isDashboardRoot = value === 'dashboard' && last;

                    if (isDashboardRoot) return null; // Already handled by Home icon link

                    return last ? (
                        <Typography
                            color="text.primary"
                            key={to}
                            sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600 }}
                        >
                            {formatText(value)}
                        </Typography>
                    ) : (
                        <Link
                            component={NextLink}
                            href={to}
                            underline="hover"
                            color="inherit"
                            key={to}
                            sx={{ fontSize: '0.875rem' }}
                        >
                            {formatText(value)}
                        </Link>
                    );
                })}
            </MUIBreadcrumbs>
        </Box>
    );
};
