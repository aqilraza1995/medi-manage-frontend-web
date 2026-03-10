import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    content,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'error'
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle fontWeight="bold">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    {cancelText}
                </Button>
                <Button onClick={() => { onConfirm(); onClose(); }} color={confirmColor} variant="contained" disableElevation>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
