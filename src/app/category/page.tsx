'use client';

import React from 'react';
import { Typography, Box, Paper, IconButton, Chip } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTable } from '@/components/common/CustomTable';
import { CustomModal } from '@/components/common/CustomModal';
import { CustomButton } from '@/components/common/CustomButton';
import { CustomTextField } from '@/components/common/CustomTextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CustomSelect } from '@/components/common/CustomSelect';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const DUMMY_CATEGORIES = [
    { id: '1', name: 'Analgesics', company: 'PharmaCorp', itemsCount: 145, status: 'Active' },
    { id: '2', name: 'Analgesics', company: 'HealWell Labs', itemsCount: 40, status: 'Active' },
    { id: '3', name: 'Antibiotics', company: 'LifeSciences', itemsCount: 320, status: 'Active' },
    { id: '4', name: 'Antibiotics', company: 'MedLife', itemsCount: 50, status: 'Inactive' },
    { id: '5', name: 'Vitamins & Supplements', company: 'LifeSciences', itemsCount: 56, status: 'Active' },
    { id: '6', name: 'First Aid', company: 'FirstAid Inc', itemsCount: 42, status: 'Active' },
];

export default function CategoryPage() {
    const [openAdd, setOpenAdd] = React.useState(false);
    const [newCategory, setNewCategory] = React.useState({ name: '', company: '', description: '' });
    const [viewCategory, setViewCategory] = React.useState<any>(null);
    const [deleteOption, setDeleteOption] = React.useState<{ type: 'single' | 'grouped', payload: any } | null>(null);

    const distinctCategories = Array.from(new Set(DUMMY_CATEGORIES.map(c => c.name))).map(name => {
        const cats = DUMMY_CATEGORIES.filter(c => c.name === name);
        return {
            id: name,
            name: name,
            companies: cats.map(c => c.company),
            rawCategories: cats,
            itemsCount: cats.reduce((acc, c) => acc + c.itemsCount, 0),
            status: cats.every(c => c.status === 'Active') ? 'Active' : (cats.some(c => c.status === 'Active') ? 'Mixed' : 'Inactive')
        };
    });

    const columns = [
        { id: 'name', label: 'Category Name (Distinct)' },
        {
            id: 'companies',
            label: 'Companies Assgnd.',
            format: (val: string[], row: any) => (
                <Typography variant="body2" color="text.secondary">
                    {val.length} Compan{val.length !== 1 ? 'ies' : 'y'}
                </Typography>
            )
        },
        { id: 'itemsCount', label: 'Total Items Linked', align: 'center' as const },
        {
            id: 'status',
            label: 'Overall Status',
            align: 'center' as const,
            format: (val: string) => (
                <Chip
                    label={val}
                    color={val === 'Active' ? 'success' : val === 'Mixed' ? 'warning' : 'default'}
                    size="small"
                    variant="outlined"
                />
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right' as const,
            format: (val: any, row: any) => (
                <Box>
                    <IconButton size="small" color="primary" onClick={() => setViewCategory(row)}><VisibilityIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteOption({ type: 'grouped', payload: row })}><DeleteIcon fontSize="small" /></IconButton>
                </Box>
            )
        }
    ];

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Categories
                    </Typography>
                    <Typography color="text.secondary">
                        Manage product categories for better inventory organization.
                    </Typography>
                </Box>
                <CustomButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
                    Add Category
                </CustomButton>
            </Box>

            <Paper sx={{ p: 2, borderRadius: 3 }}>
                <CustomTable columns={columns} rows={distinctCategories} searchPlaceholder="Search categories..." />
            </Paper>

            {/* View Associated Companies Modal */}
            <CustomModal
                open={!!viewCategory}
                onClose={() => setViewCategory(null)}
                title={`Companies for "${viewCategory?.name}"`}
                maxWidth="sm"
            >
                {viewCategory && (
                    <Box sx={{ mt: 2 }}>
                        {viewCategory.rawCategories.map((c: any) => (
                            <Box key={c.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1 }}>
                                <Box>
                                    <Typography fontWeight="bold">{c.company}</Typography>
                                    <Typography variant="caption" color="text.secondary">{c.itemsCount} Items • {c.status}</Typography>
                                </Box>
                                <IconButton size="small" color="error" onClick={() => setDeleteOption({ type: 'single', payload: c })}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}
            </CustomModal>

            {/* Add Category Modal */}
            <CustomModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                title="Add New Category"
                actions={
                    <CustomButton variant="contained" onClick={() => setOpenAdd(false)}>Create Category</CustomButton>
                }
            >
                <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CustomTextField
                        label="Category Name"
                        placeholder="e.g. Analgesics"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        required
                    />
                    <CustomSelect
                        label="Assign to Company"
                        required
                        value={newCategory.company}
                        onChange={(e) => setNewCategory({ ...newCategory, company: String(e.target.value) })}
                        options={['PharmaCorp', 'HealWell Labs', 'LifeSciences', 'MedLife', 'FirstAid Inc'].map(c => ({ label: c, value: c }))}
                    />
                    <CustomTextField
                        label="Description"
                        placeholder="Description of the category"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    />
                </Box>
            </CustomModal>

            {/* Confirm Deletion */}
            <ConfirmDialog
                open={!!deleteOption}
                title="Confirm Deletion"
                content={deleteOption?.type === 'grouped'
                    ? `Are you sure you want to delete the category "${deleteOption.payload?.name}" for ALL associated companies?`
                    : `Are you sure you want to delete "${deleteOption?.payload?.name}" from ${deleteOption?.payload?.company}?`
                }
                onClose={() => setDeleteOption(null)}
                onConfirm={() => {
                    console.log("Deleted:", deleteOption?.payload);
                    if (deleteOption?.type === 'grouped' && deleteOption?.payload?.name === viewCategory?.name) {
                        setViewCategory(null);
                    }
                }}
                confirmText="Delete"
            />
        </DashboardLayout>
    );
}
