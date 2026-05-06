'use client';

import React, { useEffect, useState } from 'react';
import { format } from "date-fns"
import { useRouter } from 'next/navigation';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import { Typography, Box, Paper, IconButton, Chip } from '@mui/material';
import { Edit, Add, Delete } from '@mui/icons-material';

import { CustomTable } from '@/components/common/CustomTable';
import { CustomButton } from '@/components/common/CustomButton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppDispatch, RootState } from '@/store/store';
import { deleteStaff, getAllStaff } from '@/store/slices/staffSlice';
import { staffData } from '@/types/staffType';
import { toast } from 'react-toastify';


const Staff = () => {

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { staff, loading } = useSelector((state: RootState) => state?.staff)
  const [open, setOpen] = useState<boolean>(false)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string>("")


  const columns = [
    { id: 'name', label: 'Staff Name' },
    { id: 'shop', label: 'Assigned Shop', format: (value: string, row: staffData) => row?.shopId?.name },
    { id: 'name', label: 'Joining', format: (value: string, row: staffData) => format(row?.createdAt, 'dd-MM-yyyy') },
    { id: 'phone', label: 'Phone' },
    {
      id: 'active',
      label: 'Status',
      format: (value: string, row: staffData) => (
        <Chip
          label={row?.status === "active" ? 'Active' : 'Inactive'}
          color={row?.status === "active" ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { id: 'role', label: 'Role' },
    { id: 'owner', label: 'Owner', format: (value: string, row: staffData) => row?.ownerId?.name },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right' as const,
      format: (val: any, row: any) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() => router.push(`/staff/${row?._id}`)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleOpenDeleteModal(row?._id)}><Delete fontSize="small" /></IconButton>
        </Box>
      )
    }
  ];

  const handleOpenDeleteModal = (id: string) => {
    setOpen(true)
    setSelectedId(id)
  }

  const handleConfirmDelete = async () => {
    try {
      const res = await dispatch(deleteStaff(selectedId)).unwrap()
      setRefresh(!refresh)
      toast.success(res?.message || "Staff delete successfully")

    } catch (error) {
      toast.error(error as string || "Somthing went wrong")
    } finally {
      setOpen(false);
      setSelectedId("")
    }
  }

  useEffect(() => {
    const getData = async () => {
      await dispatch(getAllStaff()).unwrap()
    }
    getData()
  }, [refresh])


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
        <CustomButton variant="contained" startIcon={<Add />} onClick={() => router.push("/staff/add")}>
          Add Staff
        </CustomButton>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <CustomTable
          columns={columns}
          rows={staff}
          searchPlaceholder="Search staff name, role, phone..."
          enableColumnToggle={true}
        />
      </Paper>

      {/* Confirm Deletion */}
      <ConfirmDialog
        open={open}
        title="Confirm Removal"
        content={'Are you sure you want to permanently delete this  staff? This action cannot be undone.'}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Staff"
        loading={loading}
      />
    </DashboardLayout>
  );
}

export default Staff
