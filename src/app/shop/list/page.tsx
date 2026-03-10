'use client';

import React from 'react';
import { Typography, Box, Paper, IconButton } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { CustomModal } from '@/components/common/CustomModal';
import { CustomButton } from '@/components/common/CustomButton';
import { CustomTextField } from '@/components/common/CustomTextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const DUMMY_SHOPS = [
    { id: '1', name: 'Main City Pharmacy', location: 'Downtown', city: 'Mumbai', state: 'Maharashtra', manager: 'Alice Smith', status: 'Active' },
    { id: '2', name: 'HealthPlus Suburb', location: 'Northfield', city: 'Pune', state: 'Maharashtra', manager: 'Bob Jones', status: 'Active' },
    { id: '3', name: 'CareMeds Central', location: 'Central Parkway', city: 'Delhi', state: 'Delhi', manager: 'Charlie Brown', status: 'Inactive' },
    { id: '4', name: 'Wellness Medics', location: 'Sector 4', city: 'Gurgaon', state: 'Haryana', manager: 'David Clark', status: 'Active' },
    { id: '5', name: 'LifeCare Rx', location: 'High Street', city: 'Bangalore', state: 'Karnataka', manager: 'Eva White', status: 'Active' },
    { id: '6', name: 'CureAll Pharmacy', location: 'MG Road', city: 'Bangalore', state: 'Karnataka', manager: 'Frank Green', status: 'Active' },
    { id: '7', name: 'QuickMeds', location: 'Ring Road', city: 'Surat', state: 'Gujarat', manager: 'Grace Hall', status: 'Inactive' },
    { id: '8', name: 'City Health Store', location: 'Civil Lines', city: 'Jaipur', state: 'Rajasthan', manager: 'Harry King', status: 'Active' },
    { id: '9', name: 'Apex Pharma', location: 'Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', manager: 'Irene Scott', status: 'Active' },
    { id: '10', name: 'TrustMeds', location: 'Salt Lake', city: 'Kolkata', state: 'West Bengal', manager: 'Jack Young', status: 'Active' },
    { id: '11', name: 'Prime Health', location: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', manager: 'Karen Adams', status: 'Inactive' },
    { id: '12', name: 'Metro Pharmacy', location: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', manager: 'Leo Baker', status: 'Active' },
    { id: '13', name: 'CareFirst', location: 'Palasia', city: 'Indore', state: 'Madhya Pradesh', manager: 'Mia Carter', status: 'Active' },
    { id: '14', name: 'Sunrise Meds', location: 'Kothrud', city: 'Pune', state: 'Maharashtra', manager: 'Noah Davis', status: 'Active' },
    { id: '15', name: 'GoodHealth Rx', location: 'Vasant Kunj', city: 'Delhi', state: 'Delhi', manager: 'Olivia Evans', status: 'Inactive' },
    { id: '16', name: 'TrueCare Store', location: 'Koramangala', city: 'Bangalore', state: 'Karnataka', manager: 'Paul Ford', status: 'Active' },
    { id: '17', name: 'Vitality Pharmacy', location: 'Andheri', city: 'Mumbai', state: 'Maharashtra', manager: 'Quinn Garcia', status: 'Active' }
];

export default function ShopListPage() {
    const [openAddEdit, setOpenAddEdit] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [selectedShop, setSelectedShop] = React.useState<any>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    // Filter Logic States
    const [selectedState, setSelectedState] = React.useState('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);

    const allStates = Array.from(new Set(DUMMY_SHOPS.map(s => s.state))).sort();

    // Derived cities based strictly on selected State (if any)
    const availableCities = React.useMemo(() => {
        if (!selectedState) return [];
        return Array.from(new Set(DUMMY_SHOPS.filter(s => s.state === selectedState).map(s => s.city))).sort();
    }, [selectedState]);

    const router = useRouter();

    const handleOpenEdit = (shop: any) => {
        setSelectedShop(shop);
        setEditMode(true);
        setOpenAddEdit(true);
    };

    const handleOpenAdd = () => {
        router.push('/shop/add');
    };

    const handleOpenDelete = (shop: any) => {
        setSelectedShop(shop);
        setDeleteDialogOpen(true);
    };

    const columns = [
        { id: 'name', label: 'Shop Name' },
        { id: 'location', label: 'Location' },
        { id: 'city', label: 'City' },
        { id: 'state', label: 'State' },
        { id: 'manager', label: 'Manager' },
        { id: 'status', label: 'Status' },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right' as const,
            format: (val: any, row: any) => (
                <Box>
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleOpenDelete(row)}><DeleteIcon /></IconButton>
                </Box>
            )
        }
    ];

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
                <CustomButton variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                    Add Shop
                </CustomButton>
            </Box>

            {/* Custom Manual Cascading Filter Control */}
            <Paper sx={{ p: 2, borderRadius: 3, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight="bold">Location Filters:</Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                        labelId="state-label"
                        label="State"
                        value={selectedState}
                        onChange={(e) => {
                            setSelectedState(e.target.value as string);
                            setSelectedCities([]); // Reset dependent cities
                        }}
                        endAdornment={
                            selectedState ? (
                                <InputAdornment position="end" sx={{ pr: 3 }}>
                                    <IconButton size="small" onClick={() => { setSelectedState(''); setSelectedCities([]); }}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }
                    >
                        <MenuItem value=""><em>All States</em></MenuItem>
                        {allStates.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200 }} disabled={!selectedState}>
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                        labelId="city-label"
                        label="City"
                        multiple
                        value={selectedCities}
                        onChange={(e) => setSelectedCities(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
                        renderValue={(selected) => (selected as string[]).join(', ')}
                        endAdornment={
                            selectedCities.length > 0 ? (
                                <InputAdornment position="end" sx={{ pr: 3 }}>
                                    <IconButton size="small" onClick={() => setSelectedCities([])}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }
                    >
                        {availableCities.map(city => <MenuItem key={city} value={city}>{city}</MenuItem>)}
                    </Select>
                </FormControl>

                {(selectedState || selectedCities.length > 0) && (
                    <CustomButton variant="text" color="error" onClick={() => { setSelectedState(''); setSelectedCities([]); }}>
                        Clear All
                    </CustomButton>
                )}
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 3 }}>
                <CustomTable
                    columns={columns}
                    // Filter the generic rows manually BEFORE handing them to CustomTable since we override its dropdownFilters to support the complex dependency logic natively here.
                    rows={DUMMY_SHOPS.filter(row => {
                        if (selectedState && row.state !== selectedState) return false;
                        if (selectedCities.length > 0 && !selectedCities.includes(row.city)) return false;
                        return true;
                    })}
                />
            </Paper>

            <CustomModal
                open={openAddEdit}
                onClose={() => setOpenAddEdit(false)}
                title={editMode ? "Edit Shop Details" : "Add New Shop"}
                actions={
                    <CustomButton variant="contained" onClick={() => setOpenAddEdit(false)}>
                        {editMode ? "Save Changes" : "Create Shop"}
                    </CustomButton>
                }
            >
                <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle2" color="primary">Basic Details</Typography>
                    <CustomTextField required label="Owner Name" disabled value={editMode && selectedShop ? selectedShop.manager : "Altamash Raza (Current Account)"} />
                    <CustomTextField required label="Shop Name" placeholder="e.g. City Pharmacy" defaultValue={selectedShop?.name || ''} />

                    <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>Location & Address</Typography>
                    <CustomTextField required label="Address Line" placeholder="Building, Street, Area" />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size="medium" sx={{ flexGrow: 1 }} required>
                            <InputLabel>State</InputLabel>
                            <Select label="State" defaultValue={selectedShop?.state || ''}>
                                {allStates.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl size="medium" sx={{ flexGrow: 1 }} required>
                            <InputLabel>City</InputLabel>
                            <Select label="City" defaultValue={selectedShop?.city || ''}>
                                {/* Using all map cities just for the form mock */}
                                <MenuItem value="Mumbai">Mumbai</MenuItem>
                                <MenuItem value="Pune">Pune</MenuItem>
                                <MenuItem value="Delhi">Delhi</MenuItem>
                                <MenuItem value="Surat">Surat</MenuItem>
                                <MenuItem value="Bangalore">Bangalore</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <CustomTextField required label="Pincode" placeholder="e.g. 400001" sx={{ flexGrow: 1 }} />
                        <CustomTextField label="GST Number" placeholder="Optional" sx={{ flexGrow: 1 }} />
                    </Box>
                </Box>
            </CustomModal>

            {/* Global Delete Confirm Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Confirm Deletion"
                content={`Are you sure you want to permanently delete ${selectedShop?.name} from your account? This action cannot be undone.`}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => {
                    // MOCK: Handle deletion logic here
                    // e.g., dispatch(deleteShop(selectedShop.id));
                    console.log("Deleted:", selectedShop?.name);
                }}
                confirmText="Delete Shop"
            />
        </DashboardLayout>
    );
}
