'use client';

import React, { useEffect } from 'react';
import * as Yup from "yup";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useFormik, FormikProvider } from "formik";

import { CustomTextField } from "@/components/common/CustomTextField";
import { CustomButton } from "@/components/common/CustomButton";
import CustomAutoComplete from '@/components/common/CustomAutoComplete';
import { AppDispatch, RootState } from '@/store/store';
import { createPlan, getPlanById, updatePlan } from '@/store/slices/planSlice';

const predefinedDurations = ["1", "3", "6", "12"];

const PlanForm = () => {

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  const { id } = useParams()
  const {loading, editLoading } = useSelector((state: RootState) => state?.plans)

  const validationSchema = Yup.object({
    name: Yup.string().required("Plan name is required."),
    description: Yup.string().required("Description is required."),
    maxStores: Yup.number().positive("Must be at least 1").required("Max Stores is required."),
    features: Yup.array().of(Yup.string()).min(1, "At least one feature is required."),
    durations: Yup.array().of(Yup.number()).min(1, "Select at least one duration."),
    pricing: Yup.object().test('pricing-check', 'Pricing is required for all durations', function (value) {
      const { durations } = this.parent as { durations: number[] };
      const pricingValue = value as { [key: number]: { total: number } };
      if (!durations || !pricingValue) return false;
      return durations.every(d => pricingValue[d] && typeof pricingValue[d].total === 'number' && pricingValue[d].total > 0);
    })
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      maxStores: '' as unknown as number,
      features: [] as string[],
      durations: [] as number[],
      pricing: {} as { [key: number]: { total: number } },
      isRecommended: false,
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let res
        if (id) {
          res = await dispatch(updatePlan({ planId: id as string, data: values })).unwrap()
        }
        else {
          res = await dispatch(createPlan(values)).unwrap()
        }
        router.push("/plan")
        toast.success(res?.message || "Plan created successfully!");

      } catch (error: unknown) {
        toast.error("Failed to create plan. Please try again.");
      }
    }
  });

  useEffect(() => {
    const getPlanByIdData = async () => {
      const res = await dispatch(getPlanById(id as string)).unwrap()
      formik.setValues({
        name: res?.data?.name || '',
        description: res?.data?.description || '',
        maxStores: res?.data?.maxStores || 0,
        features: res.data?.features || [],
        durations: res?.data?.durations || [],
        pricing: res?.data?.pricing || {},
        isRecommended: !!res?.data?.isRecommended,
        isActive: !!res?.data?.isActive,
      });
    }
    if (id) {
      getPlanByIdData()
    }
  }, [])

  return (
    <Box sx={{ mx: 'auto', p: { xs: 2, md: 0 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {id ? "Update Subscription Plan" : " Create Subscription Plan"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {id ? "Update the configuration of your existing subscription plan." : "Configure a new plan available for your clients to subscribe to."}
          </Typography>
        </Box>

        {editLoading ?
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size="3rem" aria-label="Loading…" />
          </Box>
          :
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Details */}
                {/* <Grid size={{ xs: 12 }}>
                <Typography variant="h6" fontWeight="600" mb={2}>Basic Settings</Typography>
              </Grid> */}

                <Grid size={{ xs: 12, md: 8 }}>
                  <CustomTextField
                    label="Plan Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    required
                    fullWidth
                    placeholder="e.g. Premium Plan"
                    errorText={formik.touched.name && formik.errors.name ? formik.errors.name as string : ""}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomTextField
                    label="Max Stores Allowed"
                    name="maxStores"
                    type="number"
                    value={formik.values.maxStores}
                    onChange={formik.handleChange}
                    required
                    fullWidth
                    placeholder="e.g. 5"
                    errorText={formik.touched.maxStores && formik.errors.maxStores ? formik.errors.maxStores as string : ""}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    required
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="e.g. Best for growing medical stores with multiple staff and branches"
                    errorText={formik.touched.description && formik.errors.description ? formik.errors.description as string : ""}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <CustomAutoComplete<string>
                    multiple
                    freeSolo
                    options={[]}
                    label="Features Included"
                    placeholder="Type a feature and press Enter"
                    value={formik.values.features}
                    onChange={(newValue) => {
                      formik.setFieldValue('features', newValue);
                    }}
                    getOptionLabel={(option) => option}
                    error={formik.touched.features && Boolean(formik.errors.features)}
                    helperText={formik.touched.features && formik.errors.features ? (formik.errors.features as string) : ""}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                      },
                      width: '100%'
                    }}
                  />
                </Grid>

                {/* Toggles */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.isActive}
                        onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Is Active?"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.isRecommended}
                        onChange={(e) => formik.setFieldValue('isRecommended', e.target.checked)}
                        color="secondary"
                      />
                    }
                    label="Recommend this Plan?"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight="600" mb={1}>Pricing & Durations</Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Select the allowed durations and define a price for each.
                  </Typography>
                </Grid>

                {/* Durations */}
                <Grid size={{ xs: 12 }}>
                  <CustomAutoComplete<string>
                    multiple
                    options={predefinedDurations.map(String)}
                    value={formik.values.durations.map(String)}
                    label="Allowed Durations (Months)"
                    placeholder="e.g. 3, 6, 12"
                    getOptionLabel={(option) => option}
                    onChange={(value) => {
                      if (!Array.isArray(value)) return;

                      const parsedValues = value.map((v) => parseInt(v as string)).filter((v) => !isNaN(v));
                      formik.setFieldValue('durations', parsedValues);

                      const newPricing = { ...formik.values.pricing };
                      parsedValues.forEach((d) => {
                        if (!newPricing[d]) newPricing[d] = { total: 0 }
                      });
                      formik.setFieldValue('pricing', newPricing);
                    }}
                    error={formik.touched.durations && Boolean(formik.errors.durations)}
                    helperText={
                      formik.touched.durations && formik.errors.durations
                        ? (formik.errors.durations as string)
                        : "Press enter to add custom durations"
                    }
                  />
                </Grid>

                {/* Dynamic Pricing Fields */}
                {formik.values.durations.length > 0 && formik.values.durations.map((duration) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`duration-${duration}`}>
                    <CustomTextField
                      label={`Price for ${duration} Months`}
                      type="number"
                      fullWidth
                      required
                      value={formik.values.pricing[duration]?.total || ''}
                      onChange={(e) => {
                        formik.setFieldValue(`pricing.${duration}.total`, Number(e.target.value));
                      }}
                      errorText={formik.touched.pricing && (!formik.values.pricing[duration] || formik.values.pricing[duration].total <= 0)
                        ? "Price must be greater than 0"
                        : ""}
                    />
                  </Grid>
                ))}

                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  {formik.touched.pricing && typeof formik.errors.pricing === 'string' && (
                    <Typography color="error" variant="body2">
                      {formik.errors.pricing}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "end", gap: 1 }}>
                    <CustomButton variant="contained" type='submit' loading={loading}>
                      {id ? "Update Plan" : "Create Plan"}
                    </CustomButton>
                    <CustomButton variant="outlined" color="inherit" onClick={() => router.push('/plan')}>
                      Cancel
                    </CustomButton>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </FormikProvider>
        }
      </Paper>
    </Box>
  );
}

export default PlanForm;
