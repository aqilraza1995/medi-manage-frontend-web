'use client';

import React, { useState, useMemo } from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomButton } from '@/components/common/CustomButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

// Mock DB for parent item
const DUMMY_PARENT_ITEM = {
    id: '1', item: 'Paracetamol 500mg', company: 'PharmaCorp', totalStock: 1240, status: 'In Stock'
};

// Mock DB for history additions
const DUMMY_HISTORY = [
    { id: 'h1', date: '2026-03-01', quantity: 500, price: 15 },
    { id: 'h2', date: '2026-02-15', quantity: 400, price: 14.5 },
    { id: 'h3', date: '2026-01-20', quantity: 340, price: 16 },
    { id: 'h4', date: '2025-12-10', quantity: 600, price: 15 },
    { id: 'h5', date: '2025-11-05', quantity: 200, price: 13.5 },
];

export default function ViewStockHistoryPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const columns = [
        { id: 'date', label: 'Addition Date' },
        { id: 'quantity', label: 'Quantity Added', align: 'center' as const },
        { id: 'price', label: 'Unit Price (₹)' },
    ];

    // Filter local history rows by selected date ranges before passing into CustomTable
    const filteredHistory = useMemo(() => {
        let rows = [...DUMMY_HISTORY];

        if (startDate) {
            rows = rows.filter(row => new Date(row.date) >= new Date(startDate));
        }
        if (endDate) {
            rows = rows.filter(row => new Date(row.date) <= new Date(endDate));
        }

        return rows;
    }, [startDate, endDate]);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CustomButton variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
                    Back to Inventory
                </CustomButton>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Medicine Details
                    </Typography>
                </Box>
            </Box>

            {/* Medicine Metadata Card */}
            <Paper sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                    {DUMMY_PARENT_ITEM.item}
                </Typography>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Company</Typography>
                        <Typography variant="body1" fontWeight="bold">{DUMMY_PARENT_ITEM.company}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Current Total Stock</Typography>
                        <Typography variant="body1" fontWeight="bold">{DUMMY_PARENT_ITEM.totalStock} Units</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Status</Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">{DUMMY_PARENT_ITEM.status}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">Times Added</Typography>
                        <Typography variant="body1" fontWeight="bold">{DUMMY_HISTORY.length} Batches</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Addition History Table */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Stock Addition History
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
                {/* Date Filters row mounted directly above the Table */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 1, alignItems: 'flex-end', borderBottom: '1px solid', borderColor: 'divider', pb: 3 }}>
                    <Box>
                        <Typography variant="caption" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>Date Range Filter</Typography>
                        <CustomTextField
                            type="date"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <CustomTextField
                            type="date"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Box>
                    {(startDate || endDate) && (
                        <CustomButton variant="text" color="error" onClick={() => { setStartDate(''); setEndDate(''); }}>
                            Clear Dates
                        </CustomButton>
                    )}
                </Box>

                <CustomTable
                    columns={columns}
                    rows={filteredHistory}
                    enableSearch={false} // Disable general text search, let users rely entirely on the Date Filters & sorting
                />
            </Paper>
        </DashboardLayout>
    );
}
