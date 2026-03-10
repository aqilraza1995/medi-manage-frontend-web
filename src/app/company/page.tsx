'use client';

import React from 'react';
import { Typography, Box, Paper, IconButton } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { CustomModal } from '@/components/common/CustomModal';
import { CustomButton } from '@/components/common/CustomButton';
import { CustomTextField } from '@/components/common/CustomTextField';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const DUMMY_COMPANIES = [
    { id: '1', name: 'Pfizer Ltd.', contact: 'partners@pfizer.example.com', rep: 'Tim Allen', terms: 'Net 30' },
    { id: '2', name: 'Johnson & Johnson', contact: 'sales@jnj.example.com', rep: 'Steve Rogers', terms: 'Net 45' },
    { id: '3', name: 'Novartis', contact: 'vendors@novartis.example.com', rep: 'Natasha Romanoff', terms: 'Prepaid' },
    { id: '4', name: 'GlaxoSmithKline', contact: 'orders@gsk.example.com', rep: 'Bruce Banner', terms: 'Net 30' },
];

export default function CompanyPage() {
    const [openModal, setOpenModal] = React.useState(false);
    const [editMode, setEditMode] = React.useState<{ id: string, name: string, contact: string, rep: string } | null>(null);
    const [deleteOption, setDeleteOption] = React.useState<any>(null);

    const openEdit = (company: any) => {
        setEditMode(company);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setEditMode(null);
        setOpenModal(false);
    };

    const columns = [
        { id: 'name', label: 'Company Name' },
        { id: 'contact', label: 'Contact Email' },
        { id: 'rep', label: 'Sales Rep' },
        { id: 'terms', label: 'Payment Terms' },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right' as const,
            format: (val: any, row: any) => (
                <Box>
                    <IconButton size="small" color="info" title="Contracts">
                        <DescriptionIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" title="Edit Company" onClick={() => openEdit(row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" title="Delete Company" onClick={() => setDeleteOption(row)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Company Partners
                    </Typography>
                    <Typography color="text.secondary">
                        Track pharmaceutical suppliers and wholesale companies.
                    </Typography>
                </Box>
                <CustomButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
                    Add Company
                </CustomButton>
            </Box>

            <Paper sx={{ p: 2, borderRadius: 3 }}>
                <CustomTable columns={columns} rows={DUMMY_COMPANIES} />
            </Paper>

            <CustomModal
                open={openModal}
                onClose={handleCloseModal}
                title={editMode ? "Edit Company Partner" : "Add New Company Partner"}
                actions={
                    <CustomButton variant="contained" onClick={handleCloseModal}>
                        {editMode ? "Save Changes" : "Add Company"}
                    </CustomButton>
                }
            >
                <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CustomTextField label="Company Name" placeholder="e.g. Pfizer Ltd." defaultValue={editMode?.name || ''} required />
                    <CustomTextField label="Contact Email" placeholder="e.g. partners@pfizer.com" defaultValue={editMode?.contact || ''} />
                    <CustomTextField label="Sales Representative" placeholder="e.g. Tim Allen" defaultValue={editMode?.rep || ''} />
                </Box>
            </CustomModal>

            {/* Confirm Deletion */}
            <ConfirmDialog
                open={!!deleteOption}
                title="Confirm Removal"
                content={`Are you sure you want to remove ${deleteOption?.name} from your partners list?`}
                onClose={() => setDeleteOption(null)}
                onConfirm={() => {
                    console.log("Deleted Company:", deleteOption?.name);
                }}
                confirmText="Remove Company"
            />
        </DashboardLayout>
    );
}
