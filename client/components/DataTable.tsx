import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Generic column interface
export interface TableColumn<T = any> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

// Props interface
interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: TableColumn<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  pageable?: boolean;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  getRowId: (row: T) => string | number;
  emptyMessage?: string;
  actions?: React.ReactNode;
}

export default function DataTable<T>({
  title,
  subtitle,
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchFields = [],
  pageable = true,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  onRowClick,
  getRowId,
  emptyMessage = 'No data available',
  actions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Filter data based on search term
  const filteredData = searchable && searchTerm
    ? data.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        
        // If specific search fields are provided, search only in those fields
        if (searchFields.length > 0) {
          return searchFields.some(field => {
            const value = item[field];
            return value && String(value).toLowerCase().includes(searchLower);
          });
        }
        
        // Otherwise, search in all string values
        return Object.values(item as any).some(value =>
          value && String(value).toLowerCase().includes(searchLower)
        );
      })
    : data;

  // Paginate data
  const paginatedData = pageable
    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredData;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Header Section */}
      {(title || subtitle || actions) && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            {title && (
              <Typography variant="h4" component="h1" gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </Box>
      )}

      {/* Search Bar */}
      {searchable && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 600 }}
          />
        </Box>
      )}

      {/* Table */}
      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    hover
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                    }}
                  >
                    {columns.map((column) => {
                      const value = (row as any)[column.id];
                      return (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pageable && (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
}

// Helper component for status chips
export const StatusChip = ({ 
  status, 
  colorMap = {} 
}: { 
  status: string; 
  colorMap?: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> 
}) => (
  <Chip
    label={status}
    color={colorMap[status] || 'default'}
    size="small"
    variant="outlined"
  />
);

// Helper function for formatting currency
export const formatCurrency = (amount: number, currency = 'IDR') => {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function for formatting dates
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(dateObj);
};
