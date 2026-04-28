import { Autocomplete, TextField, SxProps, Theme } from "@mui/material";

type AutocompleteOption<T> = T | string;

interface CustomAutoCompleteProps<T> {
  options: T[];
  label: string;
  placeholder?: string;
  value: AutocompleteOption<T> | AutocompleteOption<T>[] | null;
  onChange: (value: AutocompleteOption<T> | AutocompleteOption<T>[] | null) => void;
  getOptionLabel: (option: T) => string;
  error?: boolean;
  helperText?: string;
  limitTags?: number;
  multiple?: boolean;
  freeSolo?: boolean;
  sx?: SxProps<Theme>;
  loading?: boolean;
  size?: "small" | "medium";
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
  size = "small",
}: CustomAutoCompleteProps<T>) => {
  return (
    <Autocomplete
      multiple={multiple}
      freeSolo={freeSolo}
      limitTags={limitTags}
      size={size}
      options={options}
      value={value}
      loading={loading}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        return getOptionLabel(option as T);
      }}
      onChange={(_event, newValue) => {
        onChange(newValue);
      }}
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