'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik, FormikProvider } from 'formik';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Image from 'next/image';
import * as Yup from "yup"
import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';

import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomSelect } from '@/components/common/CustomSelect';
import { CustomButton } from '@/components/common/CustomButton';
import { toggleTheme } from '@/store/slices/themeSlice';
import { AppDispatch, RootState } from '@/store/store';
import { clearCities, setCitiesByState } from '@/store/slices/locationSlice';
import { createShopData } from '@/types/shopType';
import { createShop } from '@/store/slices/shopSlice';
import { updateUser } from '@/store/slices/userSlice';



const Onboarding = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { states, cities } = useSelector((state: RootState) => state.location)
  const [loader, setLoader] = useState<boolean>(false)
  const auth = JSON.parse(localStorage.getItem("loggedUser") || "null");

  const validationSchema = Yup.object({
    name: Yup.string().required("Store name is required."),
    email: Yup.string().email("Invalid email"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Enter valid 10 digit number."),
    address: Yup.object({
      street: Yup.string().required("Address is required."),
      state: Yup.string().required("Please select state."),
      city: Yup.string().required("Please select city."),
      pincode: Yup.string().required("Pincode is required."),
    })
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      address: {
        street: "",
        state: "",
        city: "",
        pincode: "",
      },
      phone: "",
    },
    validationSchema,
    onSubmit: (values) => handleSubmit(values)
  })

  const handleStateChange = (e: any) => {
    const selectedStateValue = e.target.value as string
    formik.setFieldValue("address.state", selectedStateValue)
    formik.setFieldValue("address.city", "")

    if (selectedStateValue) {
      dispatch(setCitiesByState(selectedStateValue))
    } else {
      dispatch(clearCities());
    }
  }

  const handleSubmit = async (values: createShopData) => {
    try {
      setLoader(true);
      const payload = {
        ...values,
        email: values.email || undefined,
        phone: values.phone || undefined,
      }
      const res = await dispatch(createShop(payload)).unwrap()
      const updateUserPayload = {
        onboardingCompleted: true,
        stores: [res?.data?._id]
      }

      const updateRes = await dispatch(updateUser({ id: auth?._id as string, data: updateUserPayload })).unwrap()
      if (!updateRes?.data?.activeSubscription) {
        router.push('/onboarding/subscription');
      } else {
        router.push('/dashboard');
      }

      toast.success(res?.message || "Shop created successfully!")

    } catch (error: unknown) {
      toast.error(error as string || "Failed to create shop. Please try again.")
    } finally {
      setLoader(false);
    }
  };


  const { name, email, phone, address } = formik?.values

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
            p: 2,
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
          py: 2
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

            <FormikProvider value={formik}>
              <form onSubmit={formik?.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label="Store Name"
                      name="name"
                      value={name}
                      required
                      fullWidth
                      placeholder="e.g. Apollo Pharmacy"
                      onChange={formik?.handleChange}
                      errorText={formik?.touched?.name && formik?.errors?.name ? formik?.errors?.name : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={email}
                      placeholder="storename@gmail.com"
                      onChange={formik?.handleChange}
                      errorText={formik?.touched?.email && formik?.errors?.email ? formik?.errors?.email : ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomSelect
                      label="State"
                      name="address.state"
                      labelKey='name'
                      valueKey='isoCode'
                      options={states}
                      required
                      onChange={handleStateChange}
                      value={address?.state}
                      errorText={formik?.touched?.address?.state && formik?.errors?.address?.state ? formik?.errors?.address?.state : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomSelect
                      label="City"
                      labelKey='name'
                      valueKey='name'
                      name='address.city'
                      required
                      value={address?.city}
                      options={cities}
                      onChange={formik?.handleChange}
                      errorText={formik?.touched?.address?.city && formik?.errors?.address?.city ? formik?.errors?.address?.city : ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label="Pincode"
                      name="address.pincode"
                      required
                      fullWidth
                      placeholder="400001"
                      value={address?.pincode}
                      onChange={formik?.handleChange}
                      errorText={formik?.touched?.address?.pincode && formik?.errors?.address?.pincode ? formik?.errors?.address?.pincode : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label="Contact Phone"
                      name="phone"
                      fullWidth
                      placeholder="9876543210"
                      value={phone}
                      onChange={formik?.handleChange}
                      errorText={formik?.touched?.phone && formik?.errors?.phone ? formik?.errors?.phone : ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <CustomTextField
                      label="Full Address"
                      name="address.street"
                      required
                      fullWidth
                      multiline
                      rows={3}
                      value={address?.street}
                      placeholder="Shop No. 12, Main Street..."
                      onChange={formik?.handleChange}
                      errorText={formik?.touched?.address?.street && formik?.errors?.address?.street ? formik?.errors?.address?.street : ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                    <CustomButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                      loading={loader}
                    >
                      Complete Setup & Go to Dashboard
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
            </FormikProvider>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Onboarding