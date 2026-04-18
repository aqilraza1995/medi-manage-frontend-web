'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Close } from '@mui/icons-material';
import { CustomButton } from '@/components/common/CustomButton';

import { PlanData } from '@/types/planType';
import { updateUser } from '@/store/slices/userSlice';
import { AppDispatch, RootState } from '@/store/store';
import { getAllActivePlans } from '@/store/slices/planSlice';
import { createSubscription } from '@/store/slices/subscriptionSlice';


const Subscription = () => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.plans);
  const auth = JSON.parse(localStorage.getItem("loggedUser") || "null");

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [loader, setLLoader] = useState(false);

  const [viewDetailsPlan, setViewDetailsPlan] = useState<PlanData | null>(null);
  const [error, setError] = useState('');

  const displayPlans = React.useMemo(() => {
    return data ? [...data].reverse() : [];
  }, [data]);


  const handleSelect = (planId: string, duration: number) => {
    setSelectedPlan(planId);
    setSelectedDuration(duration);
    setError('');
  };

  const handleContinue = async () => {
    try {
      if (!selectedPlan || !selectedDuration) {
        setError('Please select a plan and duration to continue.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setLLoader(true);
      const result = await dispatch(createSubscription({ planId: selectedPlan, duration: selectedDuration })).unwrap();

      if (result.success) {
        const payload = { activeSubscription: result?.data?._id, }
        await dispatch(updateUser({ id: auth?._id as string, data: payload })).unwrap()
        toast.success("Subscription activated successfully!");
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to activate subscription");
    } finally {
      setLLoader(false);
    }
  };

  useEffect(() => {
    const getPlanData = async () => await dispatch(getAllActivePlans()).unwrap()
    getPlanData();
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: 8,
      px: { xs: 2, md: 4 }
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="900" gutterBottom color="text.primary">
            Choose Your Plan
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400" mb={4}>
            Select the perfect subscription to power your pharmacy.
          </Typography>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {displayPlans?.map((plan: PlanData, index: number) => {
            const isPlanSelected = selectedPlan === plan?._id;
            // The currently viewed duration defaults to 3 if not selected
            const activeDuration = isPlanSelected ? (selectedDuration || 3) : 3;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan?._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      borderRadius: 4,
                      border: isPlanSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                      borderColor: isPlanSelected ? 'primary.main' : 'divider',
                      boxShadow: isPlanSelected ? `0 8px 32px ${theme.palette.primary.main}40` : theme.shadows[2],
                      overflow: 'visible',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {plan.isRecommended && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -16,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          px: 3,
                          py: 0.5,
                          borderRadius: 4,
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          boxShadow: theme.shadows[4]
                        }}
                      >
                        Recommended
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1, p: 4, pt: plan.isRecommended ? 5 : 4, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" textAlign="center" mb={4} sx={{ minHeight: 40 }}>
                        {plan.description}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                        {plan.durations.map((duration) => {
                          const isSelected = isPlanSelected && selectedDuration === duration;
                          const label = duration === 1 ? '1 Mo' : `${duration} Mo`;
                          return (
                            <Chip
                              key={duration}
                              label={label}
                              clickable
                              onClick={() => handleSelect(plan?._id ?? "", duration)}
                              sx={{
                                fontWeight: isSelected ? 'bold' : 'normal',
                                bgcolor: isSelected ? 'primary.main' : 'action.hover',
                                color: isSelected ? 'primary.contrastText' : 'text.primary',
                                '&:hover': {
                                  bgcolor: isSelected ? 'primary.dark' : 'action.selected',
                                },
                                px: 0.5,
                                py: 2.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                              }}
                            />
                          );
                        })}
                      </Box>

                      <Box textAlign="center" mb={4} sx={{ minHeight: 70 }}>
                        <AnimatePresence mode="wait">
                          {( activeDuration === 1) ? (
                            <motion.div
                              key="free"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Typography variant="h3" fontWeight="900" color="success.main" sx={{ pt: 1 }}>
                                Free
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                for 1 month
                              </Typography>
                            </motion.div>
                          ) : (
                            <motion.div
                              key={`${activeDuration}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Typography variant="h3" fontWeight="900" color="text.primary">
                                ₹{plan.pricing[activeDuration]?.total.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {`for ${activeDuration} months`}
                              </Typography>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>

                      <Box mb={4} sx={{ flexGrow: 1 }}>
                        <List disablePadding>
                          {plan.features.slice(0, 4).map((feature, i) => (
                            <ListItem key={i} disableGutters sx={{ py: 1 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <CheckCircle color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={feature}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Dynamic Activate Button */}
                        <AnimatePresence mode="popLayout">
                          {isPlanSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CustomButton
                                variant="contained"
                                fullWidth
                                onClick={handleContinue}
                                sx={{ py: 1.5, fontWeight: 'bold' }}
                                color={activeDuration === 1 ? "success" : "primary"}
                                loading={loader}
                              >
                                Activate
                              </CustomButton>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <CustomButton
                          variant="outlined"
                          fullWidth
                          onClick={() => setViewDetailsPlan(plan)}
                          sx={{ py: 1 }}
                        >
                          View Details
                        </CustomButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CustomButton
              variant={selectedPlan ? "contained" : "outlined"}
              size="large"
              onClick={handleContinue}
              sx={{ px: 8, py: 2, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 8 }}
            >
              {(selectedPlan === 'basic' && selectedDuration === 1) ? "Start for Free" : "Continue to Dashboard"}
            </CustomButton>
          </motion.div>
        </Box>
      </motion.div>

      {/* Plan Details Dialog */}
      <Dialog
        open={!!viewDetailsPlan}
        onClose={() => setViewDetailsPlan(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {viewDetailsPlan?.name} Plan Details
          </Typography>
          <IconButton onClick={() => setViewDetailsPlan(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Box mb={4}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
              Store Allowance
            </Typography>
            <Typography variant="body1">
              Maximum Stores: <strong>{viewDetailsPlan?.maxStores}</strong>
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
              Included Features
            </Typography>
            <List disablePadding>
              {viewDetailsPlan?.features.map((feature, i) => (
                <ListItem key={i} disableGutters sx={{ py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 3, pt: 1, px: 3 }}>
          <CustomButton onClick={() => setViewDetailsPlan(null)} fullWidth variant="contained">
            Got it
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Subscription