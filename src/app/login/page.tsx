'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Link as MuiLink,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomButton } from '@/components/common/CustomButton';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/themeSlice';
import { RootState } from '@/store/store';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ id: '1', name: 'John Doe', email, hasStore: false }));
    // Redirect to onboarding assuming they don't have a store yet (mock behavior)
    router.push('/onboarding');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <Grid container sx={{ width: '100%' }}>

        {/* Left Side - Image/Branding (Hidden on mobile) */}
        {!isMobile && (
          <Grid size={{ xs: 0, md: 6 }} sx={{
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
                Medi-manage
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
              }}>
                <Image
                  src="/auth_bg.png"
                  alt="Medical Dashboard Graphic"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>



              <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                Medi-manage
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Streamline your inventory, manage staff, and track sales in one powerful dashboard.
              </Typography>
            </motion.div>
          </Grid>
        )}

        {/* Right Side - Login Form */}
        <Grid size={{ xs: 12, md: 6 }} sx={{
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
            style={{ width: '100%', maxWidth: 440, padding: isMobile ? 24 : 0 }}
          >
            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please enter your details to sign in.
              </Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <CustomTextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  placeholder="name@company.com"
                />
                <Box>
                  <CustomTextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    placeholder="••••••••"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <MuiLink component={NextLink} href="#" variant="body2" color="primary.main" fontWeight="600" underline="hover">
                      Forgot password?
                    </MuiLink>
                  </Box>
                </Box>

                <CustomButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                >
                  Sign In
                </CustomButton>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <MuiLink component={NextLink} href="/register" color="primary.main" fontWeight="600" underline="hover">
                      Sign up for free
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </form>
          </motion.div>
        </Grid>

      </Grid>
    </Box>
  );
}
