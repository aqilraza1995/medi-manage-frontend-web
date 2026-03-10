import React from 'react';
import { TextField, TextFieldProps, Typography, Box } from '@mui/material';

type CustomTextFieldProps = TextFieldProps & {
    label: string;
    errorText?: string;
};

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    errorText,
    ...props
}) => {
    return (
        <Box sx={{ mb: 2, width: '100%' }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
                {label} {props.required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                error={!!errorText}
                helperText={errorText}
                {...props}
                value={props.value === 0 && props.type === 'number' ? '' : (props.value !== undefined ? props.value : '')}
                onChange={(e) => {
                    // Allow typed clearing of '0' by just passing it through, let the parent component parse or cast it.
                    if (props.onChange) {
                        props.onChange(e);
                    }
                }}
            />
        </Box>
    );
};
