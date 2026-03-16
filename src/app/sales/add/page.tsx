'use client';

import React, { useState } from 'react';
import { Typography, Box, Paper, IconButton } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomButton } from '@/components/common/CustomButton';
import { CustomTextField } from '@/components/common/CustomTextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useRouter } from 'next/navigation';
import { Autocomplete, TextField, Divider } from '@mui/material';

const AVAILABLE_MEDICINES = [
    { id: 1, name: 'Paracetamol 500mg', price: 15, stock: 1240 },
    { id: 2, name: 'Amoxicillin 250mg', price: 120, stock: 320 },
    { id: 3, name: 'Vitamin C 1000mg', price: 50, stock: 45 },
    { id: 4, name: 'Cough Syrup 100ml', price: 120, stock: 50 },
];

export default function AddInvoicePage() {
    const router = useRouter();
    // State for Billing multiple medicines
    const [cartItems, setCartItems] = useState([{ id: Date.now(), medicine: null as any, qty: 1, price: 0, discount: 0 }]);

    const addCartItem = () => {
        setCartItems([...cartItems, { id: Date.now(), medicine: null, qty: 1, price: 0, discount: 0 }]);
    };

    const removeCartItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const updateCartItem = (id: number, field: string, value: any) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'medicine' && value) {
                    updated.price = value.price;
                    updated.qty = 1; // reset quantity on new medicine
                } else if (field === 'medicine' && !value) {
                    updated.price = 0;
                }
                return updated;
            }
            return item;
        }));
    };

    const calculateGrandTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.qty * item.price * (1 - item.discount / 100));
        }, 0);
    };

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Create Invoice
                </Typography>
                <Typography color="text.secondary">
                    Process new point-of-sale transactions with multiple medicines.
                </Typography>
            </Box>

            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, maxWidth: 1100, mx: 'auto' }}>
                {/* Customer Metadata */}
                <Box sx={{ mb: 3 }}>
                    <CustomTextField label="Customer Name (Optional)" placeholder="e.g. John Doe" />
                </Box>

                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                    Prescription / Medication Cart
                </Typography>

                {/* Dynamic Cart Items mapping */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {cartItems.map((item, index) => (
                        <Box key={item.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2" color="primary.main" fontWeight="bold">Item {index + 1}</Typography>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => removeCartItem(item.id)}
                                    disabled={cartItems.length === 1}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 1.5fr 1fr 1fr 1fr' }, gap: 3, alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>Medicine</Typography>
                                    <Autocomplete
                                        options={AVAILABLE_MEDICINES}
                                        getOptionLabel={(option) => option.name}
                                        value={item.medicine}
                                        onChange={(_, newValue) => updateCartItem(item.id, 'medicine', newValue)}
                                        renderInput={(params) => <TextField {...params} size="small" placeholder="Search medicine..." />}
                                    />
                                    {item.medicine && (
                                        <Typography variant="caption" color="text.secondary">
                                            Available Stock: <strong>{item.medicine.stock}</strong>
                                        </Typography>
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>Qty</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                        <IconButton size="small" onClick={() => updateCartItem(item.id, 'qty', Math.max(1, item.qty - 1))}>
                                            <RemoveCircleOutlineIcon fontSize="small" />
                                        </IconButton>
                                        <TextField
                                            size="small"
                                            value={item.qty}
                                            onChange={(e) => updateCartItem(item.id, 'qty', Math.max(1, Number(e.target.value) || 1))}
                                            sx={{ flexGrow: 1, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& input': { textAlign: 'center', p: 1 } }}
                                        />
                                        <IconButton size="small" onClick={() => updateCartItem(item.id, 'qty', item.qty + 1)}>
                                            <AddCircleOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box>
                                    <CustomTextField
                                        label="Price (₹)"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => updateCartItem(item.id, 'price', Math.max(0, Number(e.target.value) || 0))}
                                    />
                                </Box>
                                <Box>
                                    <CustomTextField
                                        label="Disc (%)"
                                        type="number"
                                        value={item.discount}
                                        onChange={(e) => updateCartItem(item.id, 'discount', Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                                    />
                                </Box>
                                <Box>
                                    <CustomTextField
                                        label="Total (₹)"
                                        disabled
                                        value={(item.qty * item.price * (1 - item.discount / 100)).toFixed(2)}
                                        sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'primary.main', fontWeight: 'bold', WebkitTextFillColor: 'inherit' } }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <CustomButton variant="text" startIcon={<AddIcon />} onClick={addCartItem} sx={{ borderStyle: 'dashed', borderWidth: 1, borderColor: 'primary.main' }}>
                        Add Another Item
                    </CustomButton>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">Grand Total</Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            ₹{calculateGrandTotal().toFixed(2)}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', borderTop: 1, borderColor: 'divider', pt: 3 }}>
                    <CustomButton variant="outlined" color="inherit" onClick={() => router.push('/sales')}>
                        Cancel
                    </CustomButton>
                    <CustomButton variant="contained" onClick={() => router.push('/sales')}>
                        Complete Transaction
                    </CustomButton>
                </Box>
            </Paper>
        </DashboardLayout>
    );
}
