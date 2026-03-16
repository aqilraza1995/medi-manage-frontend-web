'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomSelect } from '@/components/common/CustomSelect';
import { CustomButton } from '@/components/common/CustomButton';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateStoreStatus } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/themeSlice';
import { RootState } from '@/store/store';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';


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

export default function Onboarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    state: '',
    city: '',
    pincode: '',
    address: '',
    phone: ''
  });



  const handleSubmit = (e: React.FormEvent) => {
    router.push('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <Grid container sx={{ width: '100%' }}>

        {/* Left Side - Image/Branding (Hidden on mobile) */}
        {!isMobile && (
          <Grid size={{ xs: 0, md: 5 }} sx={{
            position: 'relative',
            bgcolor: themeMode === 'dark' ? 'background.default' : '#F3F4F6',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            borderRight: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ position: 'absolute', top: 40, left: 40, zIndex: 10 }}>
              <Typography variant="h4" fontWeight="900" color="primary.main" sx={{ letterSpacing: '-0.5px' }}>
                MedCloud+
              </Typography>
            </Box>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{ width: '100%', maxWidth: 500, textAlign: 'center', marginTop: '60px' }}
            >
              <Box sx={{
                width: '100%',
                position: 'relative',
                aspectRatio: '1/1',
                mb: 4,
                bgcolor: 'transparent',
                mixBlendMode: themeMode === 'dark' ? 'screen' : 'multiply',
                filter: themeMode === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none',
              }}>
                <Image
                  src="/onboarding_bg.png"
                  alt="Pharmacy Store Setup Graphic"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                Welcome Aboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Let's get your store configured and ready to operate.
              </Typography>
            </motion.div>
          </Grid>
        )}

        {/* Right Side - Onboarding Form */}
        <Grid size={{ xs: 12, md: 7 }} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          bgcolor: themeMode === 'dark' ? 'background.default' : 'background.paper',
          py: 6
        }}>
          {isMobile && (
            <Box sx={{ position: 'absolute', top: 30, left: 24, zIndex: 10 }}>
              <Typography variant="h5" fontWeight="900" color="primary.main">
                MedCloud+
              </Typography>
            </Box>
          )}

          <Box sx={{ position: 'absolute', top: 40, right: isMobile ? 24 : 40, zIndex: 10 }}>
            <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ width: '100%', maxWidth: 640, padding: isMobile ? 24 : 0, paddingTop: isMobile ? 60 : 0 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Setup Your Store
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please provide your pharmacy details to complete registration.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Store Name"
                    name="storeName"
                    required
                    fullWidth
                    placeholder="e.g. Apollo Pharmacy"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Owner Name"
                    name="ownerName"
                    required
                    fullWidth
                    placeholder="John Doe"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomSelect
                    label="State"
                    labelKey='name'
                    valueKey='id'
                    options={stateOption}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomSelect
                    label="City"
                    labelKey='name'
                    valueKey='id'
                    options={cityOption}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Pincode"
                    name="pincode"
                    required
                    fullWidth
                    placeholder="400001"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    label="Contact Phone"
                    name="phone"
                    required
                    fullWidth
                    placeholder="+91 9876543210"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    label="Full Address"
                    name="address"
                    required
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Shop No. 12, Main Street..."
                  />
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <CustomButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                  >
                    Complete Setup & Go to Dashboard
                  </CustomButton>
                </Grid>
              </Grid>
            </form>
          </motion.div>
        </Grid>

      </Grid>
    </Box>
  );
}
