'use client';

import * as Yup from "yup"
import { useEffect } from "react";
import { toast } from 'react-toastify';
import { useFormik, FormikProvider } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Grid, Paper } from '@mui/material';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomSelect } from '@/components/common/CustomSelect';
import { CustomButton } from '@/components/common/CustomButton';
import { AppDispatch, RootState } from '@/store/store';
import { clearCities, setCitiesByState } from '@/store/slices/locationSlice';
import { createShop, getShopsByOwnerId, updateShop } from '@/store/slices/shopSlice';
import { createShopData } from '@/types/shopType';
import { createStaff } from "@/store/slices/staffSlice";
import { createStaffData } from "@/types/staffType";

const AddEditStaff = () => {
  const router = useRouter();
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state?.shop)
  const { states, cities } = useSelector((state: RootState) => state.location)
  const { shop } = useSelector((state: RootState) => state.shop)
  const auth = JSON.parse(localStorage.getItem("loggedUser") || "null")


  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required."),
    email: Yup.string().email("Invalid email"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Enter valid 10 digit number."),
    shopId: Yup.string().required("Please assign shop"),
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
      shopId: "",
      email: "",
      phone: "",
      address: {
        street: "",
        state: "",
        city: "",
        pincode: "",
      },
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

  const handleSubmit = async (values: createStaffData) => {
    try {
      console.log("values ====>", values)
      const payload = {
        ...values,
        email: values.email || undefined,
        // phone: values.phone || undefined,
      }
      if (!id) {
        const res = await dispatch(createStaff(values)).unwrap()
        toast.success(res?.message || "Shop created successfully!")
      }
      else {

        const res = await dispatch(updateShop({ id: id as string, data: payload })).unwrap()
        toast.success(res?.message || "Shop updated successfully!")
      }
      router.push('/staff');

    } catch (error: unknown) {
      toast.error(error as string || "Failed to create shop. Please try again.")
    }
  };

  //   useEffect(() => {
  //     const getData = async () => {
  //       const res = await dispatch(getShopsById(id as string)).unwrap()

  //       const state = res?.data?.address?.state;
  //       const city = res?.data?.address?.city;

  //       formik.setFieldValue("name", res?.data?.name)
  //       formik.setFieldValue("phone", res?.data?.phone)
  //       formik.setFieldValue("email", res?.data?.email)
  //       formik.setFieldValue("gst", res?.data?.gst)
  //       formik.setFieldValue("address.street", res?.data?.address.street)
  //       formik.setFieldValue("address.state", state)
  //       formik.setFieldValue("address.pincode", res?.data?.address.pincode)

  //       if (state) {
  //         await dispatch(setCitiesByState(state));
  //       }

  //       formik.setFieldValue("address.city", city);
  //     }
  //     if (id) getData()
  //   }, [])

  useEffect(() => {
    const getShop = async () => {
      await dispatch(getShopsByOwnerId(auth?._id)).unwrap()
    }
    getShop()
  }, [])


  const { name, email, phone, address, shopId } = formik?.values

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">{id ? "Update Staff" : "Add New Staff"}</Typography>
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
                  label="Name"
                  placeholder="e.g. John Dou"
                  value={name}
                  onChange={formik?.handleChange}
                  errorText={formik?.touched?.name && formik?.errors?.name ? formik?.errors?.name : ""}
                />

                <CustomSelect
                  name='shopId'
                  required
                  label="Assign Shop"
                  options={(shop || []) as any}
                  labelKey="name"
                  valueKey="_id"
                  value={shopId}
                  onChange={formik?.handleChange}
                  errorText={formik?.touched?.name && formik?.errors?.name ? formik?.errors?.name : ""}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CustomTextField
                    name="phone"
                    required
                    label="Contact Phone"
                    placeholder="+91"
                    value={phone}
                    onChange={formik?.handleChange}
                  />
                  <CustomTextField
                    name="email"
                    type="email"
                    label="Contact Email"
                    placeholder="staff@example.com"
                    value={email}
                    onChange={formik?.handleChange}
                  />
                </Box>

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

export default AddEditStaff