'use client';

import React, { useState } from 'react';
import { Typography, Box, Paper, Grid, Divider } from '@mui/material';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomTextField } from '@/components/common/CustomTextField';
import { CustomButton } from '@/components/common/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updateProfile } from '@/store/slices/authSlice';

export default function ProfilePage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setUpdatingProfile(true);
        setTimeout(() => {
            dispatch(updateProfile({ name: profileData.name, email: profileData.email }));
            setUpdatingProfile(false);
            alert('Profile updated successfully!');
        }, 1000);
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords don't match!");
            return;
        }
        setUpdatingPassword(true);
        setTimeout(() => {
            setUpdatingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            alert('Password changed successfully!');
        }, 1000);
    };

    return (
        <DashboardLayout>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Profile Settings
            </Typography>

            <Grid container spacing={4} sx={{ mt: 1 }}>
                {/* Profile Details Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Personal Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Update your personal details below.
                        </Typography>

                        <form onSubmit={handleProfileUpdate}>
                            <CustomTextField
                                label="Full Name"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                required
                            />
                            <CustomTextField
                                label="Email Address"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                required
                            />
                            <CustomTextField
                                label="Store Name"
                                value={user?.storeName || 'N/A'}
                                disabled
                            />

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <CustomButton type="submit" variant="contained" loading={updatingProfile}>
                                    Save Changes
                                </CustomButton>
                            </Box>
                        </form>
                    </Paper>
                </Grid>

                {/* Change Password Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Change Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Ensure your account is using a long, random password to stay secure.
                        </Typography>

                        <form onSubmit={handlePasswordUpdate}>
                            <CustomTextField
                                label="Current Password"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                            />
                            <CustomTextField
                                label="New Password"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                            />
                            <CustomTextField
                                label="Confirm New Password"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                required
                            />

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <CustomButton type="submit" variant="contained" color="secondary" loading={updatingPassword}>
                                    Update Password
                                </CustomButton>
                            </Box>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}
