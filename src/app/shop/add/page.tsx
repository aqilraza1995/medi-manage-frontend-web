'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomSelect } from '@/components/common/CustomSelect';
import { CustomButton } from '@/components/common/CustomButton';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const MOCK_STATES_CITIES: Record<string, string[]> = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'Dwarka'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
};

export default function AddShopPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        shopName: '',
        managerName: '',
        phone: '',
        email: '',
        addressLine: '',
        state: '',
        city: '',
        pincode: '',
        gst: ''
    });

    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        if (formData.state) {
            setCities(MOCK_STATES_CITIES[formData.state] || []);
            setFormData(prev => ({ ...prev, city: '' }));
        } else {
            setCities([]);
        }
    }, [formData.state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // MOCK: save logic
        console.log("Saving Shop:", formData);
        router.push('/shop/list');
    };

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CustomButton variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.push('/shop/list')}>
                    Back
                </CustomButton>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Add New Shop</Typography>
                    <Typography color="text.secondary">Register a new branch for your pharmacy network.</Typography>
                </Box>
            </Box>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* Left Column: Basic Details */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                                Basic Information
                            </Typography>

                            <CustomTextField
                                required
                                name="shopName"
                                label="Shop Name"
                                placeholder="e.g. Wellness Pharmacy"
                                value={formData.shopName}
                                onChange={handleChange}
                            />

                            <CustomTextField
                                required
                                name="managerName"
                                label="Store Manager"
                                placeholder="e.g. Jane Doe"
                                value={formData.managerName}
                                onChange={handleChange}
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <CustomTextField
                                    required
                                    name="phone"
                                    label="Contact Phone"
                                    placeholder="+91"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                <CustomTextField
                                    name="email"
                                    type="email"
                                    label="Contact Email"
                                    placeholder="store@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Box>

                            <CustomTextField
                                name="gst"
                                label="GST Number"
                                placeholder="15-character GSTIN"
                                value={formData.gst}
                                onChange={handleChange}
                            />
                        </Paper>
                    </Grid>

                    {/* Right Column: Location */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                                Location Details
                            </Typography>

                            <CustomTextField
                                required
                                name="addressLine"
                                label="Address Line 1"
                                placeholder="Building flat no, street area"
                                value={formData.addressLine}
                                onChange={handleChange}
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <CustomSelect
                                    required
                                    label="State"
                                    value={formData.state}
                                    onChange={(e) => handleSelectChange('state', String(e.target.value))}
                                    options={Object.keys(MOCK_STATES_CITIES).map(st => ({ label: st, value: st }))}
                                />
                                <CustomSelect
                                    required
                                    label="City"
                                    value={formData.city}
                                    onChange={(e) => handleSelectChange('city', String(e.target.value))}
                                    options={cities.map(ct => ({ label: ct, value: ct }))}
                                    disabled={!formData.state}
                                />
                            </Box>

                            <CustomTextField
                                required
                                name="pincode"
                                label="Postal / PIN Code"
                                placeholder="e.g. 400001"
                                value={formData.pincode}
                                onChange={handleChange}
                            />
                        </Paper>
                    </Grid>

                    {/* Actions */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <CustomButton variant="outlined" size="large" onClick={() => router.push('/shop/list')}>
                                Cancel
                            </CustomButton>
                            <CustomButton type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
                                Save Shop
                            </CustomButton>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </DashboardLayout>
    );
}
