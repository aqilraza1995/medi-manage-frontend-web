'use client';

import React, { useState } from 'react';
import { Typography, Box, Paper, IconButton, Grid, Divider, Chip } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomButton } from '@/components/common/CustomButton';
import { CustomTextField } from '@/components/common/CustomTextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useRouter } from 'next/navigation';
import { Autocomplete, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// Simulate backend list of registered medicines
const MEDICINE_CATALOG = [
    'Paracetamol 500mg', 'Amoxicillin 250mg', 'Vitamin C 1000mg', 'Band-Aid Pack (50s)',
    'Ibuprofen 400mg', 'Cough Syrup 100ml', 'Omega 3 Fish Oil', 'Aspirin 81mg'
];

export default function AddStockPage() {
    const router = useRouter();
    // Simplified State targeting exactly what the user ordered
    const [items, setItems] = useState([{ id: Date.now(), medicine: null as string | null, qty: 1, unitPrice: 0, discount: 0 }]);

    const addNewItemRow = () => {
        setItems([...items, { id: Date.now(), medicine: null, qty: 1, unitPrice: 0, discount: 0 }]);
    };

    const updateItem = (id: number, field: string, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItemRow = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Bulk Add Stock
                    </Typography>
                    <Typography color="text.secondary">
                        Add multiple medicines to your inventory simultaneously.
                    </Typography>
                </Box>
                <Chip label={`${items.length} Item${items.length !== 1 ? 's' : ''} added`} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
            </Box>

            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, maxWidth: 1200, mx: 'auto' }}>
                {items.map((item, index) => (
                    <Box key={item.id} sx={{ mb: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'relative', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 2, borderColor: 'primary.light' } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', fontSize: 12 }}>
                                    {index + 1}
                                </Box>
                                Item Details
                            </Typography>

                            {items.length > 1 && (
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => removeItemRow(item.id)}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 1.5fr 1fr 1fr 1fr' }, gap: 3, alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>Medicine Name <Box component="span" sx={{ color: 'error.main' }}>*</Box></Typography>
                                <Autocomplete
                                    options={MEDICINE_CATALOG}
                                    value={item.medicine}
                                    onChange={(_, newValue) => updateItem(item.id, 'medicine', newValue)}
                                    renderInput={(params) => <TextField {...params} size="small" placeholder="Type to search..." variant="outlined" />}
                                    fullWidth
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>Quantity <Box component="span" sx={{ color: 'error.main' }}>*</Box></Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <IconButton size="small" onClick={() => updateItem(item.id, 'qty', Math.max(1, item.qty - 1))}>
                                        <RemoveCircleOutlineIcon fontSize="small" />
                                    </IconButton>
                                    <TextField
                                        size="small"
                                        value={item.qty}
                                        onChange={(e) => updateItem(item.id, 'qty', Math.max(1, Number(e.target.value) || 1))}
                                        sx={{ flexGrow: 1, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& input': { textAlign: 'center' } }}
                                        type="number"
                                    />
                                    <IconButton size="small" onClick={() => updateItem(item.id, 'qty', item.qty + 1)}>
                                        <AddCircleOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box>
                                <CustomTextField
                                    label="Unit Price (₹)"
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => updateItem(item.id, 'unitPrice', Math.max(0, Number(e.target.value) || 0))}
                                    fullWidth
                                    required
                                />
                            </Box>
                            <Box>
                                <CustomTextField
                                    label="Discount (%)"
                                    type="number"
                                    value={item.discount}
                                    onChange={(e) => updateItem(item.id, 'discount', Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                                    fullWidth
                                />
                            </Box>
                            <Box>
                                <CustomTextField
                                    label="Net Total (₹)"
                                    disabled
                                    value={(item.qty * item.unitPrice * (1 - item.discount / 100)).toFixed(2)}
                                    fullWidth
                                    sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'primary.main', fontWeight: 'bold', WebkitTextFillColor: 'inherit' } }}
                                />
                            </Box>
                        </Box>
                    </Box>
                ))}

                <CustomButton
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addNewItemRow}
                    sx={{ width: '100%', borderStyle: 'dashed', mb: 3, py: 1.5 }}
                >
                    Add Another Item
                </CustomButton>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Please verify the exact batch numbers before saving.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <CustomButton variant="outlined" color="inherit" onClick={() => router.push('/stock/list')}>
                            Cancel
                        </CustomButton>
                        <CustomButton variant="contained" onClick={() => router.push('/stock/list')}>
                            Save & Add {items.length} Items
                        </CustomButton>
                    </Box>
                </Box>
            </Paper>
        </DashboardLayout>
    );
}
