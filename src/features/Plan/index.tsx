'use client';

import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Typography, Box, Paper, Button, Chip, IconButton } from '@mui/material';


import { AppDispatch, RootState } from '@/store/store';
import { CustomTable } from '@/components/common/CustomTable';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { deletePlan, getAllActivePlans } from '@/store/slices/planSlice';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PlanData } from '@/types/planType';

const Plan = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.plans);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletablePlan, setDeletablePlan] = useState<PlanData | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const columns = [
    { id: 'name', label: 'Plan Name' },
    { id: 'maxStores', label: 'Max Stores' },
    {
      id: 'isRecommended',
      label: 'Recomanded',
      format: (val: boolean) => (
        <Chip
          label={val ? 'Active' : 'Inactive'}
          color={val ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'isActive',
      label: 'Status',
      format: (val: boolean) => (
        <Chip
          label={val ? 'Active' : 'Inactive'}
          color={val ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right' as const,
      format: (value:string, row: PlanData) => (
        <Box>
          <IconButton size="small" color="primary" onClick={()=> router.push(`/plan/${row?._id}`)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(row)}><Delete fontSize="small" /></IconButton>
        </Box>
      )
    }
  ];

  const handleDelete = (plan: PlanData) => {
    setDeleteDialogOpen(true);
    setDeletablePlan(plan);
  }
  const handleConfirmDelete = async () => {
    try {
      const res = await dispatch(deletePlan(deletablePlan?._id as string)).unwrap();
      setRefresh(!refresh);
      setDeleteDialogOpen(false);
      toast.success(res?.message || "Plan deleted successfully");
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete plan. Please try again later.");
    }
  }

  useEffect(() => {
    const getPlans = async () => {
      try {
        await dispatch(getAllActivePlans())
      } catch (error: unknown) {
        toast.error((error as Error).message || "Failed to fetch plans. Please try again later.");
      }
    }
    getPlans();
  }, [refresh]);


  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Subscription Plans
          </Typography>
          <Typography color="text.secondary">
            Manage your available subscription plans and their features.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/plan/add')}
          sx={{ fontWeight: 'bold' }}
        >
          Add Plan
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <CustomTable
          columns={columns}
          rows={data || []}
          searchPlaceholder="Search plans..."
        />
      </Paper>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Deletion"
        content={`Are you sure you want to permanently delete this ${deletablePlan?.name} plan? This action cannot be undone.`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Plan"
        loading={loading}
      />
    </DashboardLayout>
  );
}

export default Plan;