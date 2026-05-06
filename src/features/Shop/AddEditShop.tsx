'use client';

import { useCallback, useEffect, useMemo } from 'react';
import * as Yup from "yup"
import { toast } from 'react-toastify';
import { useFormik, FormikProvider } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography, Grid, Paper } from '@mui/material';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomSelect } from '@/components/common/CustomSelect';
import { CustomButton } from '@/components/common/CustomButton';
import { AppDispatch, RootState } from '@/store/store';
import { clearCities, setCitiesByState } from '@/store/slices/locationSlice';
import { createShop, getShopsById, updateShop } from '@/store/slices/shopSlice';
import { createShopData } from '@/types/shopType';

const AddEditShop = () => {
  const router = useRouter();
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state?.shop)
  const { states, cities } = useSelector((state: RootState) => state.location)

  const validationSchema = useMemo(() => {
    Yup.object({
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
  }, [])

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
      gst: "",
    },
    validationSchema,
    onSubmit: (values) => handleSubmit(values)
  })

  const handleStateChange = useCallback((e: any) => {
    const selectedStateValue = e.target.value as string
    formik.setFieldValue("address.state", selectedStateValue)
    formik.setFieldValue("address.city", "")
    if (selectedStateValue) {
      dispatch(setCitiesByState(selectedStateValue))
    } else {
      dispatch(clearCities());
    }
  }, [dispatch, formik])

  const handleSubmit = useCallback(async (values: createShopData) => {
    try {
      const payload = {
        ...values,
        email: values.email || undefined,
        phone: values.phone || undefined,
      }
      if (!id) {
        const res = await dispatch(createShop(payload)).unwrap()
        toast.success(res?.message || "Shop created successfully!")
      }
      else {

        const res = await dispatch(updateShop({ id: id as string, data: payload })).unwrap()
        toast.success(res?.message || "Shop updated successfully!")
      }
      router.push('/shop');

    } catch (error: unknown) {
      toast.error(error as string || "Failed to create shop. Please try again.")
    }
  }, [id, dispatch, router]);

  useEffect(() => {
    const getData = async () => {
      const res = await dispatch(getShopsById(id as string)).unwrap()

      const state = res?.data?.address?.state;
      const city = res?.data?.address?.city;

      formik.setFieldValue("name", res?.data?.name)
      formik.setFieldValue("phone", res?.data?.phone)
      formik.setFieldValue("email", res?.data?.email)
      formik.setFieldValue("gst", res?.data?.gst)
      formik.setFieldValue("address.street", res?.data?.address.street)
      formik.setFieldValue("address.state", state)
      formik.setFieldValue("address.pincode", res?.data?.address.pincode)

      if (state) {
        await dispatch(setCitiesByState(state));
      }

      formik.setFieldValue("address.city", city);
    }
    if (id) getData()
  }, [])


  const { name, email, phone, address, gst } = formik?.values

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CustomButton variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.push('/shop')}>
          Back
        </CustomButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">{id ? "Update Shop" : "Add New Shop"}</Typography>
          <Typography color="text.secondary">{id ? "Update  branch for your pharmacy network" : "Register a new branch for your pharmacy network"}.</Typography>
        </Box>
      </Box>

      <FormikProvider value={formik}>
        <form onSubmit={formik?.handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column: Basic Details */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  Basic Information
                </Typography>

                <CustomTextField
                  required
                  name="name"
                  label="Store Name"
                  placeholder="e.g. Wellness Pharmacy"
                  value={name}
                  onChange={formik?.handleChange}
                  errorText={formik?.touched?.name && formik?.errors?.name ? formik?.errors?.name : ""}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CustomTextField
                    name="phone"
                    label="Contact Phone"
                    placeholder="+91"
                    value={phone}
                    onChange={formik?.handleChange}
                  />
                  <CustomTextField
                    name="email"
                    type="email"
                    label="Contact Email"
                    placeholder="store@example.com"
                    value={email}
                    onChange={formik?.handleChange}
                  />
                </Box>

                <CustomTextField
                  name="gst"
                  label="GST Number"
                  placeholder="15-character GSTIN"
                  value={gst}
                  onChange={formik?.handleChange}
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
                  label="Full Address"
                  name="address.street"
                  required
                  fullWidth
                  multiline
                  value={address?.street}
                  placeholder="Shop No. 12, Main Street..."
                  onChange={formik?.handleChange}
                  errorText={formik?.touched?.address?.street && formik?.errors?.address?.street ? formik?.errors?.address?.street : ""}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CustomSelect
                    label="State"
                    name="address.state"
                    labelKey='name'
                    valueKey='value'
                    options={states}
                    required
                    onChange={handleStateChange}
                    value={address?.state}
                    errorText={formik?.touched?.address?.state && formik?.errors?.address?.state ? formik?.errors?.address?.state : ""}
                  />
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
                </Box>

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
              </Paper>
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                <CustomButton variant="outlined" size="large" onClick={() => router.push('/shop')}>
                  Cancel
                </CustomButton>
                <CustomButton loading={loading} type="submit" variant="contained" size="large">
                  {id ? "Update Shop" : "Save Shop"}
                </CustomButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </FormikProvider>
    </DashboardLayout>
  );
}

export default AddEditShop