'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PlaceholderPage({ title }: { title?: string }) {
    // To simulate different pages, we read the pathname if title is not provided.
    // But this will just be a generic component used by each page.
    return (
        <DashboardLayout>
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {title || 'Page Under Construction'}
                </Typography>
                <Typography color="text.secondary">
                    This feature is currently being built. Please check back later!
                </Typography>
            </Box>
        </DashboardLayout>
    );
}
