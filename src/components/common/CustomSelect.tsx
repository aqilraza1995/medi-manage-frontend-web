import React from 'react';
import { FormControl, Select, MenuItem, SelectProps, Typography, Box, FormHelperText } from '@mui/material';

type Option = {
  [key: string]: string | number | boolean;
};

type CustomSelectProps = SelectProps & {
  label: string;
  options: Option[];
  errorText?: string;
  labelKey: string;
  valueKey: string;
  name: string;
  required: boolean;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  errorText,
  value,
  valueKey,
  labelKey,
  name,
  required = false,
  ...props
}) => {
  return (
    <Box sx={{ mb: 2, width: '100%', minWidth: 120 }}>
      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
        {label} {required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
      </Typography>
      <FormControl fullWidth size="small" error={!!errorText}>
        <Select
          name={name}
          value={value ?? ''}
          displayEmpty
          error={errorText !== "" ? true : false}
          {...props}
        >
          {/* Default empty selection text if no value is matched */}
          <MenuItem value="" disabled>
            <em>Select an option</em>
          </MenuItem>
          {options.map((opt, index) => (
            <MenuItem key={index} value={`${opt[valueKey]}`}>
              {opt[labelKey]}
            </MenuItem>
          ))}
        </Select>
        {errorText && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </Box>
  );
};
