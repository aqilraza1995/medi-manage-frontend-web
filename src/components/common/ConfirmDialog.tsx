import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { CustomButton } from './CustomButton';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
    loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    content,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'error',
    loading = false
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle fontWeight="bold">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <CustomButton onClick={onClose} color="inherit" variant="outlined">
                    {cancelText}
                </CustomButton>
                
                <CustomButton
                    onClick={onConfirm}
                    color={confirmColor}
                    variant="contained"
                    disableElevation
                    loading={loading}
                >
                    {confirmText}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};
