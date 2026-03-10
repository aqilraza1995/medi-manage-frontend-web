'use client';

import React from 'react';
import { Typography, Box, Paper, IconButton, Chip } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { CustomButton } from '@/components/common/CustomButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { TextField, InputLabel, Tooltip } from '@mui/material';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const DUMMY_INVENTORY = [
    { id: '1', item: 'Paracetamol 500mg', company: 'PharmaCorp', category: 'Pain Relief', dateAdded: '2026-03-01 10:30', addedBy: 'Alice Smith', quantity: 1240, price: 15, status: 'In Stock' },
    { id: '2', item: 'Amoxicillin 250mg', company: 'HealWell Labs', category: 'Antibiotics', dateAdded: '2026-03-05 14:15', addedBy: 'Bob Jones', quantity: 320, price: 120, status: 'In Stock' },
    { id: '3', item: 'Vitamin C 1000mg', company: 'LifeSciences', category: 'Vitamins', dateAdded: '2026-03-08 09:00', addedBy: 'Charlie Brown', quantity: 45, price: 50, status: 'Low Stock' },
    { id: '4', item: 'Band-Aid Pack (50s)', company: 'FirstAid Inc', category: 'First Aid', dateAdded: '2026-02-28 16:45', addedBy: 'Alice Smith', quantity: 0, price: 80, status: 'Out of Stock' },
];

export default function StockListPage() {
    const router = useRouter();

    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<any>(null);

    const handleDelete = (item: any) => {
        setSelectedItem(item);
        setDeleteDialogOpen(true);
    };

    const columns = [
        { id: 'item', label: 'Item Name' },
        { id: 'company', label: 'Company Name' },
        { id: 'category', label: 'Category' },
        { id: 'dateAdded', label: 'Date Added' },
        { id: 'addedBy', label: 'Added By' },
        { id: 'quantity', label: 'Quantity', align: 'center' as const },
        { id: 'price', label: 'Price (₹)' },
        {
            id: 'status',
            label: 'Status',
            align: 'center' as const,
            format: (val: string) => {
                let color: 'success' | 'warning' | 'error' = 'success';
                if (val === 'Low Stock') color = 'warning';
                if (val === 'Out of Stock') color = 'error';
                return <Chip label={val} color={color} size="small" />;
            },
        },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right' as const,
            format: (val: any, row: any) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="View Details">
                        <IconButton size="small" color="info" onClick={() => router.push(`/stock/view/${row.id}`)}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Inventory">
                        <IconButton size="small" color="primary" onClick={() => router.push(`/stock/add?edit=${row.id}`)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Item">
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
                        Inventory & Stock
                    </Typography>
                    <Typography color="text.secondary">
                        Monitor your inventory levels and bulk-add new stock items.
                    </Typography>
                </Box>
                <CustomButton variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/stock/add')}>
                    Bulk Add Stock
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
                    rows={DUMMY_INVENTORY.filter(row => {
                        if (!startDate && !endDate) return true;
                        // Extract the '2026-03-01' part from '2026-03-01 10:30'
                        const rowDate = new Date(row.dateAdded.split(' ')[0]);

                        // If only start date is provided, do exact match
                        if (startDate && !endDate) {
                            return rowDate.getTime() === new Date(startDate).getTime();
                        }

                        // If range is provided, check bounds
                        if (startDate && endDate) {
                            return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
                        }

                        return true;
                    })}
                    enableColumnToggle={true}
                    searchPlaceholder="Search medicines..."
                    dropdownFilters={[
                        { id: 'status', label: 'Stock Status', multiple: false, options: ['In Stock', 'Low Stock', 'Out of Stock'] },
                        { id: 'company', label: 'Company Name', multiple: true, options: Array.from(new Set(DUMMY_INVENTORY.map(c => c.company))).sort() },
                        { id: 'category', label: 'Category', multiple: true, options: Array.from(new Set(DUMMY_INVENTORY.map(c => c.category))).sort() }
                    ]}
                />
            </Paper>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Confirm Deletion"
                content={`Are you sure you want to delete ${selectedItem?.item} from the inventory?`}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => {
                    console.log("Deleted:", selectedItem?.item);
                }}
                confirmText="Delete Inventory"
            />
        </DashboardLayout>
    );
}
