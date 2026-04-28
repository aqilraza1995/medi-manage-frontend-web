import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  TableSortLabel,
  useTheme,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ClearIcon from '@mui/icons-material/Clear';
import { CustomTextField } from './CustomTextField';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

export interface DropdownFilter {
  id: string;
  label: string;
  options: string[];
  multiple?: boolean;
}

interface CustomTableProps {
  columns: Column[];
  rows: any[];
  maxHeight?: number | string;
  // Feature flags
  enableSearch?: boolean;
  enableColumnToggle?: boolean;
  searchPlaceholder?: string;
  dropdownFilters?: DropdownFilter[];
  visibleColumnsCount?: number;
}

export const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  rows,
  maxHeight = 'none',
  enableSearch = true,
  enableColumnToggle = false,
  searchPlaceholder = "Search records...",
  dropdownFilters = [],
  visibleColumnsCount=6
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sorting state
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('');

  // Column visibility state
  // Enforce max 6 visible by default
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(c => c.id).slice(0, visibleColumnsCount));
  const [tempVisibleColumns, setTempVisibleColumns] = useState<string[]>(visibleColumns);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);

  // Active Dropdown Filters state (e.g. { category: ['Syrup'], company: ['HealthInc', 'MedLife'] })
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Derive active columns
  const activeColumns = columns.filter(col => visibleColumns.includes(col.id));

  const handleFilterChange = (filterId: string, value: string | string[] | null) => {
    // value might be an array (for multiple) or a string (for single) or null
    const newValue = value === null ? [] : (Array.isArray(value) ? value : [value]);

    setActiveFilters(prev => ({
      ...prev,
      [filterId]: newValue
    }));
    setPage(0); // Reset pagination on filter change
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setPage(0);
  };

  // 1. Filter by Search Term and active Dropdown Filters
  const filteredRows = useMemo(() => {
    let result = rows;

    // Apply Dropdown Filters
    Object.entries(activeFilters).forEach(([key, values]) => {
      // Drop empty filters or empty strings inside arrays
      const cleanValues = values.filter(v => v !== '');
      if (cleanValues.length > 0) {
        result = result.filter(row => cleanValues.includes(String(row[key])));
      }
    });

    // Apply Text Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(row => {
        return activeColumns.some(col => {
          const val = row[col.id];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(lowerSearch);
        });
      });
    }

    return result;
  }, [rows, searchTerm, activeColumns, activeFilters]);

  const handleSort = (property: string) => {
    // 3-state sorting logic: asc -> desc -> none(original)
    if (orderBy === property) {
      if (order === 'asc') {
        setOrder('desc');
      } else if (order === 'desc') {
        setOrderBy(''); // Clear sort -> return to natural order
        setOrder('asc');
      }
    } else {
      setOrderBy(property);
      setOrder('asc');
    }
  };

  const sortedRows = useMemo(() => {
    let result = [...filteredRows];
    if (orderBy) {
      result.sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [filteredRows, order, orderBy]);

  // 2. Paginate the filtered rows
  const paginatedRows = useMemo(() => {
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const handleColumnToggle = (colId: string) => {
    setTempVisibleColumns(prev =>
      prev.includes(colId)
        ? prev.filter(id => id !== colId)
        : [...prev, colId]
    );
  };

  const applyColumnToggle = () => {
    setVisibleColumns(tempVisibleColumns);
    setColumnDialogOpen(false);
  };

  const cancelColumnToggle = () => {
    setTempVisibleColumns(visibleColumns);
    setColumnDialogOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box>
      {/* Table Controls (Search, Filters, View Toggles) */}
      {(enableSearch || enableColumnToggle || dropdownFilters.length > 0) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          {/* Left Side: Search & Filter Dropdowns */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flex: 1 }}>
            {enableSearch && (
              <CustomTextField
                size='small'
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                fullWidth={false}
                startIcon={<SearchIcon color="action" />}
                endIcon={<ClearIcon fontSize="small" />}
                endIconClick={() => { setSearchTerm(''); setPage(0); }}
              />
            )}

            {/* {dropdownFilters.map((filter) => {
              const currentVal = activeFilters[filter.id] || [];

              return (
                <FormControl size="small" key={filter.id} sx={{ width: 220, flexShrink: 0 }}>
                  <Autocomplete
                    multiple={filter.multiple}
                    size="small"
                    options={filter.options}
                    value={filter.multiple ? currentVal : (currentVal[0] || null)}
                    onChange={(_, newValue) => handleFilterChange(filter.id, newValue)}
                    limitTags={1}
                    renderTags={(value, getTagProps) => {
                      if (value.length === 0) return null;

                      // The first label we want to show
                      const firstLabel = filter.options.find(opt => opt === value[0]) || value[0];

                      return [
                        <Chip
                          // key="first-tag"
                          label={firstLabel}
                          size="small"
                          {...getTagProps({ index: 0 })}
                          sx={{ maxWidth: 120 }}
                        />,
                        value.length > 1 ? (
                          <Typography key="more-tags" variant="body2" sx={{ fontWeight: 600, color: 'primary.main', ml: 0.5, pt: 0.5 }}>
                            +{value.length - 1}
                          </Typography>
                        ) : null
                      ];
                    }}
                    ListboxProps={{ style: { maxHeight: 250 } }} // Ensure scrolling on long lists
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={filter.label}
                        variant="outlined"
                        sx={{
                          bgcolor: 'background.paper',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            flexWrap: 'nowrap',
                          }
                        }}
                      />
                    )}
                  />
                </FormControl>
              );
            })} */}

            {/* {(Object.values(activeFilters).some(v => v.length > 0) || searchTerm) && (
              <Tooltip title="Clear All Filters">
                <IconButton onClick={clearFilters} color="error" size="small">
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )} */}
          </Box>

          {/* Right Side: Column Toggles */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {enableColumnToggle && (
              <>
                <Tooltip title="Show/Hide Columns">
                  <IconButton
                    color="primary"
                    sx={{ bgcolor: 'primary.50' }}
                    onClick={() => {
                      setTempVisibleColumns(visibleColumns);
                      setColumnDialogOpen(true);
                    }}
                  >
                    <ViewColumnIcon />
                  </IconButton>
                </Tooltip>
                <Dialog
                  open={columnDialogOpen}
                  onClose={cancelColumnToggle}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle fontWeight="bold">Show/Hide Columns</DialogTitle>
                  <DialogContent dividers sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 0.5 }}>
                      {columns.map((col) => (
                        <MenuItem
                          key={col.id}
                          onClick={() => handleColumnToggle(col.id)}
                          disabled={tempVisibleColumns.length === 1 && tempVisibleColumns.includes(col.id)}
                          sx={{ borderRadius: 1 }}
                        >
                          <Checkbox checked={tempVisibleColumns.includes(col.id)} size="small" />
                          <ListItemText primary={col.label} />
                        </MenuItem>
                      ))}
                    </Box>
                  </DialogContent>
                  <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={cancelColumnToggle} color="inherit">Cancel</Button>
                    <Button onClick={applyColumnToggle} variant="contained" color="primary">Submit</Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Box>
        </Box>
      )}

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ maxHeight, boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table stickyHeader aria-label="custom table" sx={{ minWidth: activeColumns.length * 150 }}>
          <TableHead>
            <TableRow>
              {activeColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: theme.palette.background.default, whiteSpace: 'nowrap' }}
                  sx={{ py: 1.5 }} // Tighter vertical padding
                >
                  {column.id !== 'actions' ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id || index}>
                    {activeColumns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} sx={{ py: 1, maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {column.format ? column.format(value, row) : (
                            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {value}
                            </Box>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={activeColumns.length} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    {Object.values(activeFilters).some(v => v.length > 0) || searchTerm
                      ? "No results match your active filters/search."
                      : "No data available."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Global Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </TableContainer>
    </Box>
  );
};
