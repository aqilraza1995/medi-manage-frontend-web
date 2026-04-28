import React, { ChangeEvent } from 'react';
import { TextField, TextFieldProps, Typography, Box, InputAdornment, IconButton } from '@mui/material';

type CustomTextFieldProps = TextFieldProps & {
  label?: string;
  errorText?: string;
  type?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  size?: string;
  variant?: string;
  fullWidth?: boolean;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  endIconClick?: () => void;
};

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  errorText,
  type = "text",
  onChange,
  value,
  size = "small",
  variant = "outlined",
  fullWidth = true,
  required = false,
  startIcon,
  endIcon,
  endIconClick,
  ...props
}) => {
  return (
    <Box sx={{ mb: 2, width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
        {label} {required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
      </Typography>
      <TextField
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        error={!!errorText}
        helperText={errorText}
        {...props}
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {startIcon}
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={endIconClick}>
                {endIcon}
              </IconButton>
            </InputAdornment>
          ) : null,
          sx: { borderRadius: 2 }
        }}
      />
    </Box>
  );
};
