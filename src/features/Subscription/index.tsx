'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Paper, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { AppDispatch, RootState } from '@/store/store';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { getSubscriptions } from '@/store/slices/subscriptionSlice';
import { PopulateSubscriptionData, subscriptionData } from '@/types/subscriptionType';

const DUMMY_SUBSCRIPTIONS = [
  { id: 'sub_1', user: 'Alice', plan: 'Premium Plan', startDate: '2026-01-01', endDate: '2026-12-31', status: 'Active' },
  { id: 'sub_2', user: 'Smith', plan: 'Starter Plan', startDate: '2026-02-15', endDate: '2026-08-15', status: 'Active' },
  { id: 'sub_3', user: 'Bob', plan: 'Enterprise Plan', startDate: '2025-01-01', endDate: '2025-12-31', status: 'Expired' },
];

export default function SubscriptionList() {

  const dispatch = useDispatch<AppDispatch>()
  const { data, loading } = useSelector((state: RootState) => state?.subscription)
  console.log("data ======= :", data)



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
          <IconButton size="small" color="secondary"><EditIcon fontSize="small" /></IconButton>
        </Box>
      )
    }
  ];

  useEffect(() => {
    const getSubscriptionList = async () => {
      const res = await dispatch(getSubscriptions()).unwrap()
      console.log("useEffect res ===>", res)
    }
    getSubscriptionList()
  }, [])

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
          // rows={DUMMY_SUBSCRIPTIONS}
          rows={data || []}
          searchPlaceholder="Search subscriptions by user or plan..."
          enableColumnToggle={true}
        />
      </Paper>
    </DashboardLayout>
  );
}
