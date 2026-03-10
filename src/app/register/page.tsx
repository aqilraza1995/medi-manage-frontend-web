'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Link as MuiLink,
    Grid,
    useTheme,
    useMediaQuery,
    Divider
} from '@mui/material';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomButton } from '@/components/common/CustomButton';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/store/slices/themeSlice';
import { RootState } from '@/store/store';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Register() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const themeMode = useSelector((state: RootState) => state.theme.mode);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // Mock successful registration -> redirect to login
        router.push('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
            <Grid container sx={{ width: '100%', flexDirection: 'row-reverse' }}>

                {/* Right Side - Image/Branding (Hidden on mobile) */}
                {!isMobile && (
                    <Grid size={{ xs: 0, md: 5 }} sx={{
                        position: 'relative',
                        bgcolor: themeMode === 'dark' ? 'background.default' : '#F8FAFC',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                        borderLeft: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Box sx={{ position: 'absolute', top: 40, right: 40, zIndex: 10 }}>
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
                                    src="/register_bg.png"
                                    alt="Register Dashboard Graphic"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                                Join the Network
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Setup your account in seconds and unlock enterprise-level pharmacy tools.
                            </Typography>
                        </motion.div>
                    </Grid>
                )}

                {/* Left Side - Register Form */}
                <Grid size={{ xs: 12, md: 7 }} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    bgcolor: themeMode === 'dark' ? 'background.default' : 'background.paper',
                }}>
                    {isMobile && (
                        <Box sx={{ position: 'absolute', top: 40, left: 24, zIndex: 10 }}>
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
                        style={{ width: '100%', maxWidth: 560, padding: isMobile ? 24 : 0, paddingTop: isMobile ? 100 : 0 }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Create your account
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Start managing your medical store effectively today.
                            </Typography>
                        </Box>

                        <form onSubmit={handleRegister}>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <CustomTextField
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="John Doe"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <CustomTextField
                                        label="Phone Number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="+91 9876543210"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <CustomTextField
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="name@company.com"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <CustomTextField
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="••••••••"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <CustomTextField
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        placeholder="••••••••"
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <CustomButton
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        sx={{ mt: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                                    >
                                        Create Account
                                    </CustomButton>
                                </Grid>
                            </Grid>

                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <MuiLink component={NextLink} href="/login" color="primary.main" fontWeight="600" underline="hover">
                                        Log in here
                                    </MuiLink>
                                </Typography>
                            </Box>
                        </form>
                    </motion.div>
                </Grid>

            </Grid>
        </Box>
    );
}
