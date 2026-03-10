import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

type CustomButtonProps = ButtonProps & {
    loading?: boolean;
};

export const CustomButton: React.FC<CustomButtonProps> = ({
    children,
    loading = false,
    disabled,
    ...props
}) => {
    return (
        <Button
            disabled={disabled || loading}
            {...props}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : props.startIcon}
        >
            {loading ? 'Processing...' : children}
        </Button>
    );
};
