'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Paper, Chip, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

import { AppDispatch, RootState } from '@/store/store';
import { CustomTable } from '@/components/common/CustomTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { deleteSubscriptions, getSubscriptions } from '@/store/slices/subscriptionSlice';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PopulateSubscriptionData, subscriptionData } from '@/types/subscriptionType';


export default function SubscriptionList() {

  const dispatch = useDispatch<AppDispatch>()
  const { data, loading } = useSelector((state: RootState) => state?.subscription)
  const [open, setOpen] = useState<boolean>(false)
  const [id, setId] = useState<string>("")
  const [referesh, setReferesh] = useState<boolean>(false)

  const columns = [
    { id: 'user', label: 'User Name', format: (val: string, row: PopulateSubscriptionData) => row?.userId?.name },
    { id: 'plan', label: 'Plan Name', format: (val: string, row: PopulateSubscriptionData) => row?.planId?.name },
    {
      id: 'startDate',
      label: 'Expire In',
      format: (_: string, row: subscriptionData) => {
        const today = new Date().getTime();
        const end = new Date(row?.endDate).getTime();

        const diffInMs = end - today;
        if (diffInMs <= 0) return "Expired";

        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        return `${diffInDays} days left`;
      }
    },
    { id: 'duration', label: 'Duration' },
    { id: 'price', label: 'Price', format: (val: string, row: PopulateSubscriptionData) => row?.planSnapshot?.price },
    {
      id: 'status',
      label: 'Status',
      format: (val: string) => (
        <Chip
          label={val}
          color={val.toLowerCase() === 'active' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right' as const,
      format: (val: any, row: any) => (
        <Box>
          <IconButton size="small" color="error" onClick={() => hanleOpenDeleteDialog(row?._id)}><Delete fontSize="small" /></IconButton>
        </Box>
      )
    }
  ];

  const hanleOpenDeleteDialog = (deletableId: string) => {
    setOpen(true)
    setId(deletableId)
  }

  const handleConfirmDelete = async () => {
    try {
      const res = await dispatch(deleteSubscriptions(id)).unwrap()
      setReferesh(!referesh)
      toast.success(res?.message || "Subscription delete succefully")
    } catch (error: unknown) {
      toast.error(error as string || "Somthing went wrong")
    } finally {
      setOpen(false);
    }

  }

  useEffect(() => {
    const getSubscriptionList = async () => {
      await dispatch(getSubscriptions()).unwrap()
    }
    getSubscriptionList()
  }, [referesh])

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Subscriptions
          </Typography>
          <Typography color="text.secondary">
            View and manage all active subcriptions assigned to users.
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <CustomTable
          columns={columns}
          rows={data || []}
          searchPlaceholder="Search subscriptions by user or plan..."
          enableColumnToggle={true}
          visibleColumnsCount={7}
        />
      </Paper>
      <ConfirmDialog
        open={open}
        title="Confirm Deletion"
        content={`Are you sure you want to permanently delete this  subscription? This action cannot be undone.`}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Plan"
        loading={loading}
      />
    </DashboardLayout>
  );
}
