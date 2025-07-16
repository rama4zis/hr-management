'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LeaveRequest, CreateLeaveRequestRequest, LeaveRequestType, Employee } from '../../../../types';
import { EmployeeService } from '@/services/employeeService';

interface LeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeaveRequestRequest | LeaveRequest) => Promise<void>;
  leaveRequest?: LeaveRequest; // For editing
  mode: 'create' | 'edit';
  loading?: boolean;
}

const leaveTypes = [
  { value: LeaveRequestType.ANNUAL, label: 'Annual Leave', maxDays: 21 },
  { value: LeaveRequestType.SICK, label: 'Sick Leave', maxDays: 14 },
  { value: LeaveRequestType.PERSONAL, label: 'Personal Leave', maxDays: 7 },
  { value: LeaveRequestType.MATERNITY, label: 'Maternity Leave', maxDays: 90 },
  { value: LeaveRequestType.PATERNITY, label: 'Paternity Leave', maxDays: 14 },
  { value: LeaveRequestType.BEREAVEMENT, label: 'Bereavement Leave', maxDays: 5 },
  { value: LeaveRequestType.EMERGENCY, label: 'Emergency Leave', maxDays: 3 },
] as const;

export default function LeaveRequestForm({
  open,
  onClose,
  onSubmit,
  leaveRequest,
  mode,
  loading = false,
}: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveRequestType: '' as LeaveRequestType,
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    reason: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalDays, setTotalDays] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Load employees when dialog opens
  useEffect(() => {
    if (open) {
      loadEmployees();
    }
  }, [open]);

  const loadEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const employeeList = await EmployeeService.getAllEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    if (leaveRequest && mode === 'edit') {
      setFormData({
        employeeId: leaveRequest.employeeId,
        leaveRequestType: leaveRequest.leaveRequestType,
        startDate: dayjs(leaveRequest.startDate),
        endDate: dayjs(leaveRequest.endDate),
        reason: leaveRequest.reason,
      });
      
      // Find and set the selected employee
      const employee = employees.find(emp => emp.id === leaveRequest.employeeId);
      setSelectedEmployee(employee || null);
    } else if (mode === 'create') {
      setFormData({
        employeeId: '',
        leaveRequestType: '' as LeaveRequestType,
        startDate: null,
        endDate: null,
        reason: '',
      });
      setSelectedEmployee(null);
    }
    setErrors({});
  }, [leaveRequest, mode, open, employees]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = formData.startDate;
      const end = formData.endDate;
      if (end.isAfter(start) || end.isSame(start)) {
        const days = end.diff(start, 'day') + 1;
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    } else {
      setTotalDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee selection is required';
    }

    if (!formData.leaveRequestType) {
      newErrors.leaveRequestType = 'Leave type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      if (formData.endDate.isBefore(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }

      if (formData.startDate.isBefore(dayjs().startOf('day'))) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    } else if (formData.reason.length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    // Check max days for leave type
    const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveRequestType);
    if (selectedLeaveType && totalDays > selectedLeaveType.maxDays) {
      newErrors.totalDays = `Maximum ${selectedLeaveType.maxDays} days allowed for ${selectedLeaveType.label}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (mode === 'create') {
        const createData: CreateLeaveRequestRequest = {
          employeeId: formData.employeeId,
          leaveRequestType: formData.leaveRequestType,
          startDate: formData.startDate!.format('YYYY-MM-DD'),
          endDate: formData.endDate!.format('YYYY-MM-DD'),
          reason: formData.reason,
        };
        await onSubmit(createData);
      } else if (leaveRequest) {
        const updateData: LeaveRequest = {
          ...leaveRequest,
          employeeId: formData.employeeId,
          leaveRequestType: formData.leaveRequestType,
          startDate: formData.startDate!.format('YYYY-MM-DD'),
          endDate: formData.endDate!.format('YYYY-MM-DD'),
          reason: formData.reason,
          totalDays: totalDays,
        };
        await onSubmit(updateData);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveRequestType);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {mode === 'create' ? 'Create New Leave Request' : 'Edit Leave Request'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Autocomplete
                options={employees} // Limit to 5 options
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                value={selectedEmployee}
                onChange={(event, newValue) => {
                  setSelectedEmployee(newValue);
                  setFormData({ 
                    ...formData, 
                    employeeId: newValue ? newValue.id : '' 
                  });
                }}
                filterOptions={(options, { inputValue }) => {
                  if (!inputValue) return options.slice(0, 5);
                  
                  const filtered = options.filter(option => {
                    const fullName = `${option.firstName} ${option.lastName}`.toLowerCase();
                    const employeeId = option.id.toLowerCase();
                    const search = inputValue.toLowerCase();
                    
                    return fullName.includes(search) || employeeId.includes(search);
                  });
                  
                  return filtered.slice(0, 5); // Limit to 5 results
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.id}>
                    <Box>
                      <Typography variant="body2">
                        {option.firstName} {option.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {option.id} • Dept: {option.departmentId || 'No Department'}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Employee"
                    placeholder="Search by name or ID..."
                    error={!!errors.employeeId}
                    helperText={errors.employeeId}
                    disabled={mode === 'edit'}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {employeesLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                loading={employeesLoading}
                disabled={mode === 'edit'}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
              />
              <FormControl fullWidth error={!!errors.leaveRequestType}>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={formData.leaveRequestType}
                  label="Leave Type"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    leaveRequestType: e.target.value as LeaveRequestType
                  })}
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label} (Max: {type.maxDays} days)
                    </MenuItem>
                  ))}
                </Select>
                {errors.leaveRequestType && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.leaveRequestType}
                  </Typography>
                )}
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                  },
                }}
                minDate={dayjs()}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                  },
                }}
                minDate={formData.startDate || dayjs()}
              />
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                error={!!errors.reason}
                helperText={errors.reason}
                placeholder="Please provide a detailed reason for your leave request..."
              />
            </Box>

            {/* Summary */}
            {totalDays > 0 && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Leave Request Summary
                </Typography>
                {selectedEmployee && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Employee:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Days:</strong> {totalDays} days
                </Typography>
                {selectedLeaveType && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Leave Type:</strong> {selectedLeaveType.label}
                  </Typography>
                )}
                {formData.startDate && formData.endDate && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Period:</strong> {formData.startDate.format('MMM DD, YYYY')} - {formData.endDate.format('MMM DD, YYYY')}
                  </Typography>
                )}
              </Box>
            )}

            {/* Validation Errors */}
            {errors.totalDays && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.totalDays}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Request' : 'Update Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
