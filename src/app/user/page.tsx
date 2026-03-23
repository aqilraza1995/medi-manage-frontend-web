'use client';

import React from 'react';
import { Typography, Box, Paper, IconButton, Chip } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const DUMMY_STAFF = [
  { id: 1, email: 'alice1990@gmail.com', name: 'Alice', shop_count: 1, expire_plan: '54 days', phone: '+1 234 567 8001', active: true },
  { id: 2, email: 'smitgh13@gmail.com', name: 'Smith', shop_count: 5, expire_plan: '15 days', phone: '+1 234 567 8002', active: true },
  { id: 3, email: 'bob34@gmail.com', name: 'Bob', shop_count: 2, expire_plan: '34 day', phone: '+1 234 567 8003', active: false },
  { id: 4, email: 'Johns@gmail.com', name: 'Jones', shop_count: 3, expire_plan: '12 days', phone: '+1 234 567 8004', active: true },
];


export default function StaffPage() {
  const [deleteOption, setDeleteOption] = React.useState<any>(null);

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'shop_count', label: 'Shops' },
    { id: 'expire_plan', label: 'Expire Plan' },
    {
      id: 'active',
      label: 'Status',
      format: (val: boolean) => (
        <Chip
          label={val ? 'Active' : 'Inactive'}
          color={val ? 'success' : 'default'}
          size="small"
          />
        ),
      },
      { id: 'plan', label: 'Subscription Plan' },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right' as const,
      format: (val: any, row: any) => (
        <Box>
          <IconButton size="small" color="error" onClick={() => setDeleteOption(row)}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      )
    }
  ];

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            User Management
          </Typography>
          <Typography color="text.secondary">
            View and manage employees across all stores.
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <CustomTable
          columns={columns}
          rows={DUMMY_STAFF}
          searchPlaceholder="Search staff name, role, phone..."
          enableColumnToggle={true}
        />
      </Paper>

      {/* Confirm Deletion */}
      <ConfirmDialog
        open={!!deleteOption}
        title="Confirm Removal"
        content={`Are you sure you want to remove ${deleteOption?.name}?`}
        onClose={() => setDeleteOption(null)}
        onConfirm={() => {
          console.log("Deleted Staff:", deleteOption?.name);
        }}
        confirmText="Remove Staff"
      />
    </DashboardLayout>
  );
}
