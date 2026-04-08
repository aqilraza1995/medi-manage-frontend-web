'use client';

import { useDispatch, useSelector } from "react-redux";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useFormik, FormikProvider } from "formik";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NextLink from 'next/link';
import Image from "next/image";
import * as Yup from "yup"
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Link as MuiLink,
} from "@mui/material";
import { toast } from "react-toastify";

import { CustomTextField } from "@/components/common/CustomTextField";
import { CustomButton } from "@/components/common/CustomButton";
import { registerUser } from "@/store/slices/authSlice";
import { toggleTheme } from '@/store/slices/themeSlice';
import { RootState, AppDispatch } from '@/store/store';
import { RegisterPayload } from "@/types/authType";



const RegisterForm = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { loading } = useSelector((state: RootState) => state.auth);

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required."),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter valid 10 digit number.")
      .required("Phone number is required."),
    email: Yup.string().email("Invalid email.").required("Email is required."),
    password: Yup.string().min(6, "Password  minimum 6 charecter.").required("Password is required."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password must match.")
      .required("Confirm password is required")
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => handleRegister(values)
  })


  const handleRegister = async (values: RegisterPayload) => {
    try {

      const { confirmPassword, ...payload } = values;
      const res = await dispatch(registerUser(payload)).unwrap();
      toast.success(res?.message || "Registration successful!");
      router.push("/login");

    } catch (error: unknown) {
      toast.error(error as string || "Registration failed. Please try again.");
    }
  };

  const { name, email, phone, password, confirmPassword } = formik?.values


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
              {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
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

            {/* <form onSubmit={handleRegister}> */}
            <FormikProvider value={formik} >
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label="Full Name"
                      name="name"
                      value={name}
                      onChange={formik.handleChange}
                      required
                      fullWidth
                      placeholder="John Doe"
                      errorText={formik.touched.name && formik.errors.name ? formik?.errors?.name : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label="Phone Number"
                      name="phone"
                      value={phone}
                      onChange={formik.handleChange}
                      required
                      fullWidth
                      placeholder="9876543210"
                      errorText={formik.touched.phone && formik.errors.phone ? formik?.errors?.phone : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <CustomTextField
                      label="Email Address"
                      type="email"
                      name="email"
                      value={email}
                      onChange={formik?.handleChange}
                      required
                      fullWidth
                      placeholder="name@company.com"
                      errorText={formik.touched.email && formik.errors.email ? formik?.errors?.email : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label="Password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={formik?.handleChange}
                      required
                      fullWidth
                      placeholder="••••••••"
                      errorText={formik.touched.password && formik.errors.password ? formik?.errors?.password : ""}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={formik?.handleChange}
                      required
                      fullWidth
                      placeholder="••••••••"
                      errorText={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik?.errors?.confirmPassword : ""}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <CustomButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{ mt: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                      loading={loading}
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
            </FormikProvider>
            {/* </form> */}
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  )
}


export default RegisterForm