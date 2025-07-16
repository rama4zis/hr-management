'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  InputAdornment,
  Autocomplete,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Payroll, CreatePayrollRequest, PayrollStatus } from '../../../../types/Payroll';
import { Employee } from '../../../../types';
import { EmployeeService } from '@/services/employeeService';

interface PayrollFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePayrollRequest) => Promise<void>;
  payroll?: Payroll | null;
  mode: 'create' | 'edit';
}

export default function PayrollForm({ open, onClose, onSubmit, payroll, mode }: PayrollFormProps) {
  const [formData, setFormData] = useState<CreatePayrollRequest>({
    employeeId: '',
    payPeriodStart: dayjs().startOf('month').format('YYYY-MM-DD'),
    payPeriodEnd: dayjs().endOf('month').format('YYYY-MM-DD'),
    salary: 0,
    bonus: 0,
    deductions: 0,
    payrollStatus: PayrollStatus.DRAFT,
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payPeriodStart, setPayPeriodStart] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [payPeriodEnd, setPayPeriodEnd] = useState<Dayjs | null>(dayjs().endOf('month'));

  // Load employees for autocomplete
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setEmployeesLoading(true);
        const employeeData = await EmployeeService.getAllEmployees();
        setEmployees(employeeData);
      } catch (err) {
        console.error('Error loading employees:', err);
      } finally {
        setEmployeesLoading(false);
      }
    };

    if (open) {
      loadEmployees();
    }
  }, [open]);

  // Populate form when editing or reset when creating
  useEffect(() => {
    if (payroll && mode === 'edit') {
      setFormData({
        employeeId: payroll.employeeId,
        payPeriodStart: payroll.payPeriodStart,
        payPeriodEnd: payroll.payPeriodEnd,
        salary: payroll.salary,
        bonus: payroll.bonus || 0,
        deductions: payroll.deductions || 0,
        payrollStatus: payroll.payrollStatus,
      });
      
      setPayPeriodStart(dayjs(payroll.payPeriodStart));
      setPayPeriodEnd(dayjs(payroll.payPeriodEnd));
      
      // Find and set the selected employee
      const employee = employees.find(emp => emp.id === payroll.employeeId);
      setSelectedEmployee(employee || null);
    } else {
      // Reset form for new payroll
      setFormData({
        employeeId: '',
        payPeriodStart: dayjs().startOf('month').format('YYYY-MM-DD'),
        payPeriodEnd: dayjs().endOf('month').format('YYYY-MM-DD'),
        salary: 0,
        bonus: 0,
        deductions: 0,
        payrollStatus: PayrollStatus.DRAFT,
      });
      setPayPeriodStart(dayjs().startOf('month'));
      setPayPeriodEnd(dayjs().endOf('month'));
      setSelectedEmployee(null);
    }
    setError(null);
  }, [payroll, mode, open, employees]);

  const handleEmployeeChange = (event: any, newValue: Employee | null) => {
    setSelectedEmployee(newValue);
    setFormData(prev => ({
      ...prev,
      employeeId: newValue?.id || '',
      salary: newValue?.salary || 0, // Pre-fill with employee's base salary
    }));
  };

  const handleInputChange = (field: keyof CreatePayrollRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = ['salary', 'bonus', 'deductions'].includes(field) 
      ? Number(event.target.value) 
      : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof CreatePayrollRequest) => (
    event: any
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleDateChange = (field: 'payPeriodStart' | 'payPeriodEnd') => (newValue: Dayjs | null) => {
    if (newValue) {
      const dateString = newValue.format('YYYY-MM-DD');
      setFormData(prev => ({ ...prev, [field]: dateString }));
      
      if (field === 'payPeriodStart') {
        setPayPeriodStart(newValue);
      } else {
        setPayPeriodEnd(newValue);
      }
    }
  };

  // Calculate net pay automatically
  const netPay = formData.salary + formData.bonus - formData.deductions;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!formData.employeeId) {
      setError('Please select an employee');
      return;
    }
    if (!formData.payPeriodStart) {
      setError('Pay period start date is required');
      return;
    }
    if (!formData.payPeriodEnd) {
      setError('Pay period end date is required');
      return;
    }
    if (dayjs(formData.payPeriodStart).isAfter(dayjs(formData.payPeriodEnd))) {
      setError('Pay period start date must be before end date');
      return;
    }
    if (formData.salary < 0) {
      setError('Salary cannot be negative');
      return;
    }
    if (formData.bonus < 0) {
      setError('Bonus cannot be negative');
      return;
    }
    if (formData.deductions < 0) {
      setError('Deductions cannot be negative');
      return;
    }

    // Additional validation for editing processed payrolls
    if (mode === 'edit' && payroll && ['COMPLETED', 'PROCESSING'].includes(payroll.payrollStatus)) {
      const originalNetPay = payroll.salary + (payroll.bonus || 0) - (payroll.deductions || 0);
      const newNetPay = formData.salary + formData.bonus - formData.deductions;
      const percentageChange = Math.abs((newNetPay - originalNetPay) / originalNetPay) * 100;
      
      if (percentageChange > 10) {
        const proceed = window.confirm(
          `Warning: You are changing the net pay by ${percentageChange.toFixed(1)}% (from $${originalNetPay.toFixed(2)} to $${newNetPay.toFixed(2)}) on a ${payroll.payrollStatus.toLowerCase()} payroll. This may affect completed transactions. Do you want to proceed?`
        );
        if (!proceed) {
          return;
        }
      }
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>
          {mode === 'edit' ? 'Edit Payroll Record' : 'Add New Payroll Record'}
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Show warning for editing non-draft payrolls */}
          {mode === 'edit' && payroll && payroll.payrollStatus !== PayrollStatus.DRAFT && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <strong>Editing {payroll.payrollStatus.toLowerCase()} payroll:</strong> Changes to processed payrolls may affect completed transactions. Please review carefully.
            </Alert>
          )}

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Employee Selection */}
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (ID: ${option.id})`}
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                loading={employeesLoading}
                disabled={mode === 'edit'} // Don't allow changing employee when editing
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee"
                    required
                    helperText={
                      mode === 'edit' 
                        ? 'Employee cannot be changed when editing existing payroll' 
                        : 'Search by name or ID'
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {employeesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <div style={{ fontWeight: 'bold' }}>
                        {option.firstName} {option.lastName}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'gray' }}>
                        ID: {option.id} • Salary: ${option.salary?.toLocaleString()}
                      </div>
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            {/* Pay Period */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="Pay Period Start"
                value={payPeriodStart}
                onChange={handleDateChange('payPeriodStart')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="Pay Period End"
                value={payPeriodEnd}
                onChange={handleDateChange('payPeriodEnd')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Grid>

            {/* Financial Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Base Salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange('salary')}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                helperText={
                  mode === 'edit' && payroll && ['COMPLETED', 'PROCESSING'].includes(payroll.payrollStatus)
                    ? 'Changing salary for processed payroll may require approval'
                    : undefined
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Bonus"
                type="number"
                value={formData.bonus}
                onChange={handleInputChange('bonus')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                helperText={
                  mode === 'edit' && payroll && ['COMPLETED', 'PROCESSING'].includes(payroll.payrollStatus)
                    ? 'Changes to processed payroll may affect final payment'
                    : undefined
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Deductions"
                type="number"
                value={formData.deductions}
                onChange={handleInputChange('deductions')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                helperText={
                  mode === 'edit' && payroll && ['COMPLETED', 'PROCESSING'].includes(payroll.payrollStatus)
                    ? 'Changes to processed payroll may affect final payment'
                    : undefined
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.payrollStatus}
                  label="Status"
                  onChange={handleSelectChange('payrollStatus')}
                >
                  {Object.values(PayrollStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
                {mode === 'edit' && payroll && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Current status: {payroll.payrollStatus.replace('_', ' ')}
                      {payroll.payrollStatus === 'COMPLETED' && ' - Consider carefully before changing completed payroll'}
                    </Typography>
                  </Box>
                )}
              </FormControl>
            </Grid>

            {/* Net Pay Display */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <TextField
                  fullWidth
                  label="Net Pay (Calculated)"
                  value={netPay.toFixed(2)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    readOnly: true,
                  }}
                  variant="filled"
                  sx={{ 
                    '& .MuiFilledInput-root': { 
                      bgcolor: 'success.lighter',
                      fontWeight: 'bold',
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Net pay is automatically calculated: (Salary + Bonus) - Deductions
                  {mode === 'edit' && ' • Changes will update the final payment amount'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || employeesLoading}
            startIcon={loading && <CircularProgress size={20} />}
            color={
              mode === 'edit' && payroll && ['COMPLETED', 'PROCESSING'].includes(payroll.payrollStatus)
                ? 'warning'
                : 'primary'
            }
          >
            {mode === 'edit' 
              ? (payroll && ['COMPLETED', 'PROCESSING'].includes(payroll.payrollStatus)
                  ? 'Update (Processed)'
                  : 'Update Payroll')
              : 'Create Payroll'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
