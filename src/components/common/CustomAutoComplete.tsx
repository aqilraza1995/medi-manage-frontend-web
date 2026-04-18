import { Autocomplete, TextField, SxProps, Theme } from "@mui/material";

// We define a type that represents what an option can be when freeSolo is on
type AutocompleteOption<T> = T | string;

interface CustomAutoCompleteProps<T> {
  options: T[];
  label: string;
  placeholder?: string;
  // Value can now be a single item or array of (T or string)
  value: AutocompleteOption<T> | AutocompleteOption<T>[] | null;
  // Use the same union type for the onChange callback
  onChange: (value: AutocompleteOption<T> | AutocompleteOption<T>[] | null) => void;
  getOptionLabel: (option: T) => string;
  error?: boolean;
  helperText?: string;
  limitTags?: number;
  multiple?: boolean;
  freeSolo?: boolean;
  sx?: SxProps<Theme>;
  loading?: boolean;
}

const CustomAutoComplete = <T,>({
  options,
  label,
  placeholder = "",
  value,
  onChange,
  getOptionLabel,
  error = false,
  helperText = "",
  limitTags,
  multiple = true,
  freeSolo = false,
  sx = { width: "100%" },
  loading = false,
}: CustomAutoCompleteProps<T>) => {
  return (
    <Autocomplete
      multiple={multiple}
      freeSolo={freeSolo}
      limitTags={limitTags}
      options={options}
      value={value}
      loading={loading}
      // FIX 1: Handle the case where 'option' is just a string from freeSolo
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        return getOptionLabel(option as T);
      }}
      // FIX 2: Ensure the onChange signature matches what MUI expects
      onChange={(_event, newValue) => {
        onChange(newValue);
      }}
      // FIX 3: Safety check for equality
      isOptionEqualToValue={(option, val) => {
        if (typeof option === "string" || typeof val === "string") {
          return option === val;
        }
        return getOptionLabel(option as T) === getOptionLabel(val as T);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      )}
      sx={sx}
    />
  );
};

export default CustomAutoComplete;