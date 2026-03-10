import React from 'react';
import { FormControl, Select, MenuItem, SelectProps, Typography, Box, FormHelperText } from '@mui/material';

type Option = {
    value: string | number;
    label: string;
};

type CustomSelectProps = SelectProps & {
    label: string;
    options: Option[];
    errorText?: string;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
    label,
    options,
    errorText,
    value,
    ...props
}) => {
    return (
        <Box sx={{ mb: 2, width: '100%', minWidth: 120 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
                {label} {props.required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
            </Typography>
            <FormControl fullWidth size="small" error={!!errorText}>
                <Select
                    value={value ?? ''}
                    displayEmpty
                    {...props}
                >
                    {/* Default empty selection text if no value is matched */}
                    <MenuItem value="" disabled>
                        <em>Select an option</em>
                    </MenuItem>
                    {options.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Select>
                {errorText && <FormHelperText>{errorText}</FormHelperText>}
            </FormControl>
        </Box>
    );
};
