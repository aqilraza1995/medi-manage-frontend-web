
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

const stateOption = [
  { id: 1, name: "Maharashtra" },
  { id: 2, name: "Karnataka" },
  { id: 3, name: "West Bangal" },
  { id: 4, name: "Jharkhand" },
  { id: 5, name: "Gujarat" },
  { id: 6, name: "M.P" },
  { id: 7, name: "Kerla" },
  { id: 8, name: "Orisha" },
  { id: 9, name: "U.P" },
  { id: 10, name: "Bihar" },
]

const cityOption = [
  { id: 1, name: "Mumbai" },
  { id: 2, name: "Banglore" },
  { id: 3, name: "Kolkata" },
  { id: 4, name: "Dhanbad" },
  { id: 5, name: "Surat" },
  { id: 6, name: "Raipur" },
  { id: 7, name: "Truvantpuram" },
  { id: 8, name: "Jharsuguda" },
  { id: 9, name: "Kanpur" },
  { id: 10, name: "Patna" },
]


const AddEditShop = () => {
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
                value={formData?.shopName}
              />

              <CustomTextField
                required
                name="managerName"
                label="Store Manager"
                placeholder="e.g. Jane Doe"
                value={formData?.managerName}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <CustomTextField
                  required
                  name="phone"
                  label="Contact Phone"
                  placeholder="+91"
                  value={formData?.phone}
                />
                <CustomTextField
                  name="email"
                  type="email"
                  label="Contact Email"
                  placeholder="store@example.com"
                  value={formData?.email}
                />
              </Box>

              <CustomTextField
                name="gst"
                label="GST Number"
                placeholder="15-character GSTIN"
                value={formData?.gst}
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
                value={formData?.addressLine}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <CustomSelect
                  label="State"
                  labelKey='name'
                  valueKey='id'
                  options={stateOption}
                  required
                />
                <CustomSelect
                  label="City"
                  labelKey='name'
                  valueKey='id'
                  options={cityOption}
                />
              </Box>

              <CustomTextField
                required
                name="pincode"
                label="Postal / PIN Code"
                placeholder="e.g. 400001"
                value={formData?.pincode}
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

export default AddEditShop