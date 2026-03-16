'use client';

import React from 'react';
import { Typography, Box, Paper, IconButton, Chip } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { CustomModal } from '@/components/common/CustomModal';
import { CustomButton } from '@/components/common/CustomButton';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomSelect } from '@/components/common/CustomSelect';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const DUMMY_STAFF = [
  { id: 1, name: 'Sarah Connor', owner: 'Alice Smith', role: 'Pharmacist', shop: 'Main City Pharmacy', phone: '+1 234 567 8001', active: true },
  { id: 2, name: 'John Smith', owner: 'Alice Smith', role: 'Cashier', shop: 'Main City Pharmacy', phone: '+1 234 567 8002', active: true },
  { id: 3, name: 'Emma Watson', owner: 'Bob Jones', role: 'Manager', shop: 'HealthPlus Suburb', phone: '+1 234 567 8003', active: false },
  { id: 4, name: 'Michael Jordan', owner: 'Bob Jones', role: 'Delivery Agent', shop: 'CareMeds Central', phone: '+1 234 567 8004', active: true },
];

const roleOption = [
  { label: 'Pharmacist', value: 'Pharmacist' },
  { label: 'Cashier', value: 'Cashier' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Delivery Agent', value: 'Delivery Agent' }
]

export default function StaffPage() {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [editStaff, setEditStaff] = React.useState<any>(null);
  const [deleteOption, setDeleteOption] = React.useState<any>(null);

  const openEditModal = (staff: any) => {
    setEditStaff(staff);
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setEditStaff(null);
  };

  const columns = [
    { id: 'name', label: 'Staff Name' },
    { id: 'role', label: 'Role' },
    { id: 'shop', label: 'Assigned Shop' },
    { id: 'owner', label: 'Owner' },
    { id: 'phone', label: 'Phone' },
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
    {
      id: 'actions',
      label: 'Actions',
      align: 'right' as const,
      format: (val: any, row: any) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => openEditModal(row)}><EditIcon fontSize="small" /></IconButton>
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
            Staff Management
          </Typography>
          <Typography color="text.secondary">
            View and manage employees across all stores.
          </Typography>
        </Box>
        <CustomButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
          Add Staff
        </CustomButton>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <CustomTable
          columns={columns}
          rows={DUMMY_STAFF}
          searchPlaceholder="Search staff name, role, phone..."
          enableColumnToggle={true}
          dropdownFilters={[
            { id: 'shop', label: 'Filter by Shop', multiple: true, options: Array.from(new Set(DUMMY_STAFF.map(s => s.shop))).sort() }
          ]}
        />
      </Paper>

      <CustomModal
        open={openAdd}
        onClose={handleCloseAdd}
        title={editStaff ? "Edit Staff Member" : "Add New Staff Member"}
        actions={
          <CustomButton variant="contained" onClick={handleCloseAdd}>
            {editStaff ? "Save Changes" : "Add Staff"}
          </CustomButton>
        }
      >
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CustomTextField
            label="Full Name"
            placeholder="e.g. Sarah Connor"
            defaultValue={editStaff?.name || ''}
            required
          />
          <CustomSelect
            label="Role"
            required
            labelKey='label'
            valueKey='value'
            value={editStaff?.role || ''}
            options={roleOption}
          />
          <CustomSelect
            label="Assign Shop"
            required
            value={editStaff?.shop || ''}
            labelKey='shop'
            valueKey='id'
            options={DUMMY_STAFF}
          />
          <CustomTextField
            label="Phone Number"
            placeholder="e.g. +1 234 567 8900"
            defaultValue={editStaff?.phone || ''}
            required
          />
        </Box>
      </CustomModal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        open={!!deleteOption}
        title="Confirm Removal"
        content={`Are you sure you want to remove ${deleteOption?.name} from ${deleteOption?.shop}?`}
        onClose={() => setDeleteOption(null)}
        onConfirm={() => {
          console.log("Deleted Staff:", deleteOption?.name);
        }}
        confirmText="Remove Staff"
      />
    </DashboardLayout>
  );
}
