'use client';

import  { useEffect, useState } from 'react';
import { format } from "date-fns"
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Delete, Add } from '@mui/icons-material';
import { Typography, Box, Paper, IconButton } from '@mui/material';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { CustomButton } from '@/components/common/CustomButton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AppDispatch, RootState } from '@/store/store';
import { deleteShop, getShops } from '@/store/slices/shopSlice';
import CustomAutoComplete from '@/components/common/CustomAutoComplete';
import { clearCities, setCitiesByState } from '@/store/slices/locationSlice';

const Shop = () => {

  const dispatch = useDispatch<AppDispatch>()
  const { loading, shop } = useSelector((state: RootState) => state?.shop)
  const { states, cities } = useSelector((state: RootState) => state.location)

  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [refresh, setRefresh]= useState<boolean>(false)

  // Filter Logic States
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [selectedCities, setSelectedCities] = useState<any | null>(null);
  const router = useRouter();

  const columns = [
    { id: 'name', label: 'Shop Name' },
    { id: 'owner', label: 'Owner', format: (value: string, row: any) => row?.ownerId?.name },
    { id: 'street', label: 'Street', format: (value: string, row: any) => row?.address?.street },
    { id: 'city', label: 'City', format: (value: string, row: any) => row?.address?.city },
    { id: 'state', label: 'State', format: (value: string, row: any) => row?.address?.state },
    { id: 'createdAt', label: 'Create Date', format: (value: string, row: any) => format(row?.createdAt, 'dd-MM-yyyy') },
    { id: 'status', label: 'Status', format: (value: string, row: any) => row?.address?.state ? "Active" : "inactive" },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right' as const,
      format: (val: any, row: any) => (
        <Box>
          <IconButton size="small" color="primary" onClick={() =>  router.push(`/shop/${row?._id}`)}><Edit /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleOpenDelete(row)}><Delete /></IconButton>
        </Box>
      )
    }
  ];

    const handleOpenDelete = (shop: any) => {
    setSelectedShop(shop);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async ()=>{
    try {
      const res = await dispatch(deleteShop(selectedShop?._id)).unwrap()
      toast.success(res?.message)
      setRefresh(!refresh)
      setSelectedShop(null)
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error(error as string)
    }
  }

  useEffect(() => {
    const getAllShop = async () => {
      try {
        await dispatch(getShops()).unwrap()
      } catch (error: unknown) {
        toast.error(error as string || "Somthing went wrong")
      }
    }
    getAllShop()
  }, [refresh])


  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Shops
          </Typography>
          <Typography color="text.secondary">
            Manage all registered medical stores underneath your umbrella account.
          </Typography>
        </Box>
        <CustomButton variant="contained" startIcon={<Add />} onClick={()=>  router.push('/shop/add')}>
          Add Shop
        </CustomButton>
      </Box>

      {/* Custom Manual Cascading Filter Control */}
      <Paper sx={{ p: 2, borderRadius: 3, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2" fontWeight="bold">Location Filters:</Typography>
        <CustomAutoComplete
          options={states}
          label="Select State"
          placeholder="Choose state"
          sx={{ minWidth: 200 }}
          multiple={false}
          getOptionLabel={(option) => option.name}
          value={selectedState}
          onChange={(value) => {
            dispatch(clearCities());
            setSelectedState(value?.value);
            dispatch(setCitiesByState(value?.value))
            setSelectedCities(null);
          }}
        />

        <CustomAutoComplete
          options={cities}
          label="Select City"
          placeholder="Choose city"
          sx={{ minWidth: 200 }}
          multiple={false}
          getOptionLabel={(option) => option.name}
          value={selectedCities}
          onChange={(value) => setSelectedCities(value?.name)}
        />
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <CustomTable
          columns={columns}
          rows={shop || []}
          enableColumnToggle={true}
          visibleColumnsCount={6}
        />
      </Paper>

      {/* Global Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Deletion"
        content={`Are you sure you want to permanently delete ${selectedShop?.name} from your account? This action cannot be undone.`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Shop"
      />
    </DashboardLayout>
  );
}

export default Shop
