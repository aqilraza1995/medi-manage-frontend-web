'use client';

import React, { useState } from 'react';
import { Typography, Box, Paper, IconButton, Chip } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { CustomButton } from '@/components/common/CustomButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { TextField, InputLabel, Tooltip } from '@mui/material';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const DUMMY_SALES = [
    { id: 'INV-1001', date: '2026-03-09 10:30', customerName: 'Walk-in', medicineName: 'Paracetamol 500mg', company: 'PharmaCorp', category: 'Pain Relief', quantity: 2, price: 30 },
    { id: 'INV-1002', date: '2026-03-09 11:15', customerName: 'John Doe', medicineName: 'Amoxicillin 250mg', company: 'HealWell Labs', category: 'Antibiotics', quantity: 1, price: 120 },
    { id: 'INV-1003', date: '2026-03-08 09:45', customerName: 'Alice Wong', medicineName: 'Vitamin C 1000mg', company: 'LifeSciences', category: 'Vitamins', quantity: 3, price: 150 },
    { id: 'INV-1004', date: '2026-03-08 14:20', customerName: 'Walk-in', medicineName: 'Band-Aid Pack (50s)', company: 'FirstAid Inc', category: 'First Aid', quantity: 1, price: 80 },
    { id: 'INV-1005', date: '2026-03-07 16:00', customerName: 'Robert Chen', medicineName: 'Cough Syrup 100ml', company: 'HealWell Labs', category: 'Syrup', quantity: 2, price: 240 },
];

export default function SalesPage() {
    const router = useRouter();

    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedSale, setSelectedSale] = React.useState<any>(null);

    const handleDelete = (sale: any) => {
        setSelectedSale(sale);
        setDeleteDialogOpen(true);
    };

    const columns = [
        { id: 'id', label: 'Invoice Num' },
        { id: 'medicineName', label: 'Medicine Name' },
        { id: 'date', label: 'Date/Time' },
        { id: 'company', label: 'Company Name' },
        { id: 'quantity', label: 'Quantity', align: 'center' as const },
        { id: 'price', label: 'Price (₹)' },
        { id: 'category', label: 'Category' },
        { id: 'customerName', label: 'Customer Name' },
        {
            id: 'actions',
            label: 'Action',
            align: 'right' as const,
            format: (val: any, row: any) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="View Receipt">
                        <IconButton size="small" color="primary">
                            <ReceiptLongIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Sale">
                        <IconButton size="small" color="info">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Sale">
                        <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Sales & Billing
                    </Typography>
                    <Typography color="text.secondary">
                        Process new point-of-sale transactions with multiple medicines.
                    </Typography>
                </Box>
                <CustomButton variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/sales/add')}>
                    New Invoice
                </CustomButton>
            </Box>

            <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center', pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="body2" fontWeight="bold" color="text.secondary">Date Range :</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                size="small"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                sx={{ width: 140 }}
                                InputProps={{ sx: { fontSize: '0.875rem' } }}
                            />
                            <Typography variant="body2" color="text.secondary">to</Typography>
                            <TextField
                                size="small"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                sx={{ width: 140 }}
                                InputProps={{ sx: { fontSize: '0.875rem' } }}
                            />
                        </Box>
                        {(startDate || endDate) && (
                            <CustomButton variant="text" color="error" size="small" onClick={() => { setStartDate(''); setEndDate(''); }}>
                                Clear Dates
                            </CustomButton>
                        )}
                    </Box>
                </Box>

                <CustomTable
                    columns={columns}
                    rows={DUMMY_SALES.filter(row => {
                        if (!startDate && !endDate) return true;
                        const rowDate = new Date(row.date.split(' ')[0]);
                        if (startDate && !endDate) return rowDate.getTime() === new Date(startDate).getTime();
                        if (startDate && endDate) return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
                        return true;
                    })}
                    enableColumnToggle={true}
                    searchPlaceholder="Search invoice, medicine, customer..."
                    dropdownFilters={[
                        { id: 'company', label: 'Company Name', multiple: true, options: Array.from(new Set(DUMMY_SALES.map(c => c.company))).sort() },
                        { id: 'category', label: 'Category', multiple: true, options: Array.from(new Set(DUMMY_SALES.map(c => c.category))).sort() }
                    ]}
                />
            </Paper>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Confirm Cancellation"
                content={`Are you sure you want to delete invoice ${selectedSale?.id}? This action cannot be undone.`}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => {
                    console.log("Deleted Invoice:", selectedSale?.id);
                }}
                confirmText="Delete Invoice"
            />
        </DashboardLayout>
    );
}
