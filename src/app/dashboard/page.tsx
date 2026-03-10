'use client';

import React, { useState } from 'react';
import {
    Typography,
    Grid,
    Paper,
    Box,
    IconButton,
    TablePagination,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { CustomTable } from '@/components/common/CustomTable';

// --- MOCK DATA ---
const SALES_DATA = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

const LOW_STOCK_DATA = [
    { id: '1', item: 'Paracetamol 500mg', company: 'PharmaCorp', category: 'Pain Relief', stock: 12, threshold: 50, added: '2026-02-10' },
    { id: '2', item: 'Vitamin C 1000mg', company: 'LifeSciences', category: 'Vitamins', stock: 5, threshold: 20, added: '2026-01-15' },
    { id: '3', item: 'Band-Aid Pack', company: 'FirstAid Inc', category: 'First Aid', stock: 0, threshold: 100, added: '2025-11-20' },
    { id: '4', item: 'Amoxicillin 250mg', company: 'HealWell Labs', category: 'Antibiotics', stock: 15, threshold: 40, added: '2026-03-01' },
    { id: '5', item: 'Ibuprofen 400mg', company: 'PharmaCorp', category: 'Pain Relief', stock: 8, threshold: 30, added: '2026-02-28' },
    { id: '6', item: 'Cough Syrup 100ml', company: 'MedLife', category: 'Cold & Flu', stock: 4, threshold: 15, added: '2025-12-10' },
    { id: '7', item: 'Omega 3 Fish Oil', company: 'LifeSciences', category: 'Supplements', stock: 2, threshold: 25, added: '2026-01-05' },
    { id: '8', item: 'Aspirin 81mg', company: 'PharmaCorp', category: 'Pain Relief', stock: 10, threshold: 50, added: '2026-02-01' },
    { id: '9', item: 'Antiseptic Cream', company: 'FirstAid Inc', category: 'First Aid', stock: 3, threshold: 20, added: '2025-10-15' },
    { id: '10', item: 'Thermometer', company: 'MedLife', category: 'Equipment', stock: 1, threshold: 10, added: '2025-08-20' },
    { id: '11', item: 'Cetirizine 10mg', company: 'HealWell Labs', category: 'Allergy', stock: 7, threshold: 30, added: '2026-01-20' },
    { id: '12', item: 'Zinc Supplements', company: 'LifeSciences', category: 'Vitamins', stock: 4, threshold: 15, added: '2025-12-01' },
    { id: '13', item: 'Calamine Lotion', company: 'MedLife', category: 'Skin Care', stock: 6, threshold: 20, added: '2026-02-15' },
    { id: '14', item: 'Loperamide 2mg', company: 'PharmaCorp', category: 'Digestion', stock: 9, threshold: 40, added: '2026-03-05' },
    { id: '15', item: 'Cotton Rolls', company: 'FirstAid Inc', category: 'First Aid', stock: 2, threshold: 50, added: '2025-09-10' },
    { id: '16', item: 'Blood Pressure Monitor', company: 'MedLife', category: 'Equipment', stock: 0, threshold: 5, added: '2025-06-15' },
    { id: '17', item: 'Multivitamin Gummies', company: 'LifeSciences', category: 'Vitamins', stock: 11, threshold: 30, added: '2026-01-25' },
];

const EXPIRING_SOON_DATA = [
    { id: 'e1', item: 'Insulin Glargine', company: 'HealWell Labs', category: 'Diabetes', stock: 45, added: '2025-01-10', expiry: '2026-03-25', daysLeft: 16 },
    { id: 'e2', item: 'Azithromycin 500mg', company: 'PharmaCorp', category: 'Antibiotics', stock: 120, added: '2025-02-15', expiry: '2026-04-10', daysLeft: 32 },
    { id: 'e3', item: 'Aspirin 81mg', company: 'PharmaCorp', category: 'Pain Relief', stock: 300, added: '2025-03-01', expiry: '2026-05-15', daysLeft: 67 },
    { id: 'e4', item: 'Cetirizine 10mg', company: 'HealWell Labs', category: 'Allergy', stock: 85, added: '2025-04-20', expiry: '2026-06-20', daysLeft: 103 },
    { id: 'e5', item: 'Epinephrine Auto-Injector', company: 'LifeSciences', category: 'Allergy', stock: 12, added: '2024-11-01', expiry: '2026-03-12', daysLeft: 3 },
    { id: 'e6', item: 'Lisinopril 10mg', company: 'MedLife', category: 'Cardiac', stock: 200, added: '2025-01-05', expiry: '2026-04-05', daysLeft: 27 },
    { id: 'e7', item: 'Metformin 500mg', company: 'PharmaCorp', category: 'Diabetes', stock: 450, added: '2025-05-10', expiry: '2026-07-01', daysLeft: 114 },
    { id: 'e8', item: 'Albuterol Inhaler', company: 'LifeSciences', category: 'Respiratory', stock: 30, added: '2024-12-15', expiry: '2026-03-30', daysLeft: 21 },
    { id: 'e9', item: 'Omeprazole 20mg', company: 'MedLife', category: 'Digestion', stock: 150, added: '2025-02-28', expiry: '2026-05-01', daysLeft: 53 },
    { id: 'e10', item: 'Hydrocortisone Cream', company: 'FirstAid Inc', category: 'Skin Care', stock: 65, added: '2025-03-15', expiry: '2026-06-10', daysLeft: 93 },
    { id: 'e11', item: 'Folic Acid 5mg', company: 'LifeSciences', category: 'Vitamins', stock: 90, added: '2025-01-20', expiry: '2026-04-15', daysLeft: 37 },
    { id: 'e12', item: 'Atorvastatin 20mg', company: 'PharmaCorp', category: 'Cardiac', stock: 180, added: '2025-06-05', expiry: '2026-08-20', daysLeft: 164 },
    { id: 'e13', item: 'Doxycycline 100mg', company: 'HealWell Labs', category: 'Antibiotics', stock: 40, added: '2024-10-10', expiry: '2026-03-15', daysLeft: 6 },
    { id: 'e14', item: 'Sertraline 50mg', company: 'MedLife', category: 'Psychiatric', stock: 110, added: '2025-02-01', expiry: '2026-05-10', daysLeft: 62 },
    { id: 'e15', item: 'Gabapentin 300mg', company: 'PharmaCorp', category: 'Neurology', stock: 75, added: '2025-04-05', expiry: '2026-07-15', daysLeft: 128 },
    { id: 'e16', item: 'Clonazepam 1mg', company: 'MedLife', category: 'Psychiatric', stock: 50, added: '2024-11-20', expiry: '2026-04-01', daysLeft: 23 },
    { id: 'e17', item: 'Levothyroxine 50mcg', company: 'LifeSciences', category: 'Thyroid', stock: 220, added: '2025-07-10', expiry: '2026-09-05', daysLeft: 180 },
];

const PIE_DATA = [
    { name: 'Medicines', value: 80 },
    { name: 'Equipment', value: 10 },
    { name: 'Wellness', value: 10 },
];
const PIE_COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

// --- DASHBOARD COMPONENTS ---
const DashboardCard = ({ title, value, icon, gradient, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 4,
                background: gradient,
                color: 'white',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.2, transform: 'scale(2)' }}>
                {icon}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="600" sx={{ opacity: 0.9 }}>
                    {title}
                </Typography>
                <IconButton size="small" sx={{ color: 'white', opacity: 0.8 }}><MoreVertIcon /></IconButton>
            </Box>
            <Typography variant="h3" fontWeight="bold">
                {value}
            </Typography>
        </Paper>
    </motion.div>
);

export default function Dashboard() {
    const router = useRouter();
    const [salesFilter, setSalesFilter] = useState('This Week');
    const [revenueFilter, setRevenueFilter] = useState('All Sources');
    const [expiryTimeframe, setExpiryTimeframe] = useState('All');

    // Filter Expiring Soon data based on timeframe explicitly
    const filteredExpiring = React.useMemo(() => {
        if (expiryTimeframe === 'All') return EXPIRING_SOON_DATA;
        return EXPIRING_SOON_DATA.filter(item => {
            if (expiryTimeframe === '1 Week') return item.daysLeft <= 7;
            if (expiryTimeframe === '1 Month') return item.daysLeft <= 30;
            if (expiryTimeframe === '2 Months') return item.daysLeft <= 60;
            if (expiryTimeframe === '3 Months') return item.daysLeft <= 90;
            return true;
        });
    }, [expiryTimeframe]);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Overview
                    </Typography>
                    <Typography color="text.secondary">
                        Welcome back! Here's what's happening in your medical stores today.
                    </Typography>
                </motion.div>
            </Box>

            {/* Metric Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Total Sales (Today)"
                        value="₹45,231"
                        icon={<TrendingUpIcon />}
                        gradient="linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
                        delay={0.1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Active Staff"
                        value="12"
                        icon={<PeopleOutlineIcon />}
                        gradient="linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)"
                        delay={0.2}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Items in Inventory"
                        value="8,402"
                        icon={<Inventory2OutlinedIcon />}
                        gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
                        delay={0.3}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Low Stock Alerts"
                        value="24"
                        icon={<WarningAmberIcon />}
                        gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                        delay={0.4}
                    />
                </Grid>
            </Grid>

            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Sales Area Chart */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Paper sx={{ p: 3, borderRadius: 4, height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Sales Trend
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select
                                        value={salesFilter}
                                        onChange={(e) => setSalesFilter(e.target.value)}
                                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                                    >
                                        <MenuItem value="This Week">This Week</MenuItem>
                                        <MenuItem value="This Month">This Month</MenuItem>
                                        <MenuItem value="This Year">This Year</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flexGrow: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={SALES_DATA}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dx={-10} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                            labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                                        />
                                        <Area type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Sales By Category Pie Chart */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Paper sx={{ p: 3, borderRadius: 4, height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Revenue by Category
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <Select
                                        value={revenueFilter}
                                        onChange={(e) => setRevenueFilter(e.target.value)}
                                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                                    >
                                        <MenuItem value="All Sources">All Sources</MenuItem>
                                        <MenuItem value="Online Orders">Online Orders</MenuItem>
                                        <MenuItem value="Walk-Ins">Walk-Ins</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ flexGrow: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={PIE_DATA}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {PIE_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Expiring Soon Table */}
                <Grid size={{ xs: 12 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold" color="warning.main">
                                    Expiring Soon
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel>Timeframe</InputLabel>
                                    <Select
                                        value={expiryTimeframe}
                                        label="Timeframe"
                                        onChange={(e) => setExpiryTimeframe(e.target.value)}
                                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                                    >
                                        <MenuItem value="All">All Critical</MenuItem>
                                        <MenuItem value="1 Week">&lt; 1 Week</MenuItem>
                                        <MenuItem value="1 Month">&lt; 1 Month</MenuItem>
                                        <MenuItem value="2 Months">&lt; 2 Months</MenuItem>
                                        <MenuItem value="3 Months">&lt; 3 Months</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box>
                                <CustomTable
                                    dropdownFilters={[
                                        { id: 'company', label: 'Company', multiple: true, options: Array.from(new Set(EXPIRING_SOON_DATA.map(d => d.company))).sort() },
                                        { id: 'category', label: 'Category', multiple: true, options: Array.from(new Set(EXPIRING_SOON_DATA.map(d => d.category))).sort() }
                                    ]}
                                    columns={[
                                        { id: 'item', label: 'Medicine Name' },
                                        { id: 'company', label: 'Company' },
                                        { id: 'category', label: 'Category' },
                                        { id: 'stock', label: 'Remaining Stock', align: 'center' },
                                        { id: 'added', label: 'Added Date' },
                                        { id: 'expiry', label: 'Expiry Date' },
                                        {
                                            id: 'daysLeft',
                                            label: 'Status',
                                            align: 'right',
                                            format: (val: number) => (
                                                <Chip size="small" label={`${val} days`} color={val < 60 ? 'error' : 'warning'} variant="outlined" />
                                            )
                                        }
                                    ]}
                                    rows={filteredExpiring}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Low Stock Table */}
                <Grid size={{ xs: 12 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <Paper sx={{ p: 3, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WarningAmberIcon /> Low Stock Alerts
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <CustomTable
                                    dropdownFilters={[
                                        { id: 'company', label: 'Company', multiple: true, options: Array.from(new Set(LOW_STOCK_DATA.map(d => d.company))).sort() },
                                        { id: 'category', label: 'Category', multiple: true, options: Array.from(new Set(LOW_STOCK_DATA.map(d => d.category))).sort() }
                                    ]}
                                    maxHeight={'none'}
                                    columns={[
                                        { id: 'item', label: 'Medicine Name' },
                                        { id: 'company', label: 'Company' },
                                        { id: 'category', label: 'Category' },
                                        { id: 'added', label: 'Added Date' },
                                        {
                                            id: 'stock',
                                            label: 'Current Stock',
                                            align: 'center',
                                            format: (val: number) => (
                                                <Typography fontWeight="bold" color={val === 0 ? 'error.main' : 'warning.main'}>
                                                    {val} Units
                                                </Typography>
                                            )
                                        },
                                        { id: 'threshold', label: 'Min Threshold', align: 'center' },
                                        {
                                            id: 'status',
                                            label: 'Action',
                                            align: 'right',
                                            format: (val: any, row: any) => (
                                                <IconButton size="small" color="primary" onClick={() => router.push(`/stock/view/${row.id}`)} title="View Details">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            )
                                        }
                                    ]}
                                    rows={LOW_STOCK_DATA}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}
