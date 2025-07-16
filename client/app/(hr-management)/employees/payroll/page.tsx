'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Payment as PaymentIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DataTable, { TableColumn, StatusChip, formatCurrency, formatDate } from '../../../../components/DataTable';
import { Payroll, PayrollStatus, CreatePayrollRequest } from '../../../../types/Payroll';
import { Employee } from '../../../../types';
import { PayrollService } from '@/services/payrollService';
import { EmployeeService } from '@/services/employeeService';
import PayrollForm from './PayrollForm';

export default function PayrollPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Current month
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<{ [key: string]: Employee }>({});
  const [stats, setStats] = useState<{
    total: number;
    draft: number;
    pending: number;
    approved: number;
    processing: number;
    completed: number;
    failed: number;
    totalGrossPay: number;
    totalNetPay: number;
    totalDeductions: number;
    totalBonus: number;
  }>({
    total: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    totalGrossPay: 0,
    totalNetPay: 0,
    totalDeductions: 0,
    totalBonus: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [payrollFormOpen, setPayrollFormOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Load payroll data from API
  useEffect(() => {
    loadPayrollData();
  }, [selectedDate]);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get filtered payroll data by month/year
      const filters = {
        month: selectedDate.month() + 1, // dayjs months are 0-indexed
        year: selectedDate.year(),
      };
      
      const [payrollData, statsData] = await Promise.all([
        PayrollService.getFiltered(filters),
        PayrollService.getStats(filters),
      ]);
      
      setPayrolls(payrollData);
      setStats(statsData);
      
      // Fetch employee details for all unique employee IDs
      const employeeIds = new Set<string>();
      payrollData.forEach((payroll) => {
        employeeIds.add(payroll.employeeId);
      });
      
      // Fetch employee data
      const employeePromises = Array.from(employeeIds).map(async (id) => {
        try {
          const employee = await EmployeeService.getEmployeeById(id);
          return { id, employee };
        } catch (error) {
          console.error(`Error fetching employee ${id}:`, error);
          return { id, employee: null };
        }
      });
      
      const employeeResults = await Promise.all(employeePromises);
      const employeeMap: { [key: string]: Employee } = {};
      employeeResults.forEach(({ id, employee }) => {
        if (employee) {
          employeeMap[id] = employee;
        }
      });
      
      setEmployees(employeeMap);
    } catch (err) {
      console.error('Error loading payroll data:', err);
      setError('Failed to load payroll data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter payroll data and add employee names
  const filteredPayroll = useMemo(() => {
    return payrolls.map((payroll) => {
      const employee = employees[payroll.employeeId];
      
      return {
        ...payroll,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : `Employee ID: ${payroll.employeeId}`,
        employeeProfileImage: employee?.profileImage || '',
        // Convert status to match the existing UI expectations
        status: payroll.payrollStatus.toLowerCase(),
        // Calculate gross pay
        grossPay: payroll.salary + payroll.bonus,
        // Map fields for backward compatibility
        baseSalary: payroll.salary,
        bonuses: payroll.bonus,
        overtime: 0, // Add overtime if available in your API
        payPeriodStart: payroll.payPeriodStart,
        payPeriodEnd: payroll.payPeriodEnd,
      };
    });
  }, [payrolls, employees]);

  // Calculate summary statistics from API stats
  const summaryStats = useMemo(() => {
    return {
      total: stats.total,
      draft: stats.draft,
      processed: stats.processing + stats.approved, // Combine processing and approved as "processed"
      paid: stats.completed,
      totalGrossPay: stats.totalGrossPay,
      totalNetPay: stats.totalNetPay,
      totalDeductions: stats.totalDeductions,
      totalOvertimePay: 0, // Add if available in your API
    };
  }, [stats]);

  // Handle payroll actions
  const handleProcessPayroll = async (payroll: Payroll & { employeeName: string }) => {
    try {
      setActionLoading(true);
      await PayrollService.process(payroll.id);
      await loadPayrollData(); // Refresh data
    } catch (err) {
      console.error('Error processing payroll:', err);
      setError('Failed to process payroll. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPaid = async (payroll: Payroll & { employeeName: string }) => {
    try {
      setActionLoading(true);
      await PayrollService.complete(payroll.id);
      await loadPayrollData(); // Refresh data
    } catch (err) {
      console.error('Error marking as paid:', err);
      setError('Failed to mark as paid. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPayslip = (payroll: Payroll & { employeeName: string }) => {
    console.log('Download payslip:', payroll.id);
    // In a real app, this would generate and download a PDF payslip
    // You could add an API endpoint for this
  };

  const handleViewDetails = (payroll: Payroll & { employeeName: string }) => {
    console.log('View payroll details:', payroll.id);
    // In a real app, this would open a detailed view modal
  };

  // Handle form actions
  const handleAddPayroll = () => {
    setSelectedPayroll(null);
    setFormMode('create');
    setPayrollFormOpen(true);
  };

  const handleEditPayroll = (payroll: Payroll & { employeeName: string }) => {
    setSelectedPayroll(payroll);
    setFormMode('edit');
    setPayrollFormOpen(true);
  };

  const handleFormSubmit = async (data: CreatePayrollRequest) => {
    try {
      if (formMode === 'create') {
        await PayrollService.create(data);
      } else if (selectedPayroll) {
        // Update the payroll - need to use the update service method
        await PayrollService.update(selectedPayroll.id, {
          salary: data.salary,
          bonus: data.bonus,
          deductions: data.deductions,
          payrollStatus: data.payrollStatus,
        });
      }
      await loadPayrollData(); // Refresh data
      setPayrollFormOpen(false);
    } catch (err) {
      console.error('Error saving payroll:', err);
      throw new Error('Failed to save payroll. Please try again.');
    }
  };

  const handleFormClose = () => {
    setPayrollFormOpen(false);
    setSelectedPayroll(null);
  };

  // Define table columns
  const columns: TableColumn<Payroll & { employeeName: string, employeeProfileImage: string, status: string, grossPay: number, baseSalary: number, bonuses: number, overtime: number }>[] = [
    {
      id: 'employee',
      label: 'Employee',
      minWidth: 200,
      format: (value, row) => {
        const employeeName = row.employeeName;
        const initials = employeeName
          .split(' ')
          .map((n) => n[0])
          .join('');

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 35, height: 35 }} src={row.employeeProfileImage}>{initials}</Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="medium">
                {employeeName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {row.employeeId}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'payPeriod',
      label: 'Pay Period',
      minWidth: 160,
      format: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {formatDate(row.payPeriodStart, { month: 'short', day: 'numeric' })} - {formatDate(row.payPeriodEnd, { month: 'short', day: 'numeric' })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedDate.format('MMMM YYYY')}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'baseSalary',
      label: 'Base Salary',
      align: 'right',
      format: (value) => (
        <Typography variant="body2">
          {formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'overtime',
      label: 'Overtime',
      align: 'right',
      format: (value) => (
        <Typography variant="body2" color={value > 0 ? 'success.main' : 'text.secondary'}>
          {value > 0 ? '+' : ''}{formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'bonuses',
      label: 'Bonuses',
      align: 'right',
      format: (value) => (
        <Typography variant="body2" color={value > 0 ? 'success.main' : 'text.secondary'}>
          {value > 0 ? '+' : ''}{formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'deductions',
      label: 'Deductions',
      align: 'right',
      format: (value) => (
        <Typography variant="body2" color={value > 0 ? 'error.main' : 'text.secondary'}>
          {value > 0 ? '-' : ''}{formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'netPay',
      label: 'Net Pay',
      align: 'right',
      format: (value) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          {formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      format: (value) => (
        <StatusChip
          status={value}
          colorMap={{
            draft: 'default',
            pending: 'warning',
            approved: 'info',
            processing: 'warning',
            completed: 'success',
            failed: 'error',
            // Legacy mappings for backward compatibility
            processed: 'warning',
            paid: 'success',
          }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      minWidth: 150,
      format: (value, row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {/* <Tooltip title="View Details">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => handleViewDetails(row)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          
          {/* Edit button - allow editing for most statuses except completed and failed */}
          {!['completed', 'failed'].includes(row.status) && (
            <Tooltip title="Edit Payroll">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => handleEditPayroll(row)}
                disabled={actionLoading}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {row.status === 'draft' && (
            <Tooltip title="Process Payroll">
              <IconButton 
                size="small" 
                color="warning"
                onClick={() => handleProcessPayroll(row)}
                disabled={actionLoading}
              >
                <PaymentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {(row.status === 'processing' || row.status === 'approved') && (
            <Tooltip title="Mark as Paid">
              <IconButton 
                size="small" 
                color="success"
                onClick={() => handleMarkAsPaid(row)}
                disabled={actionLoading}
              >
                <PaymentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {/* {(row.status === 'processing' || row.status === 'approved' || row.status === 'completed') && (
            <Tooltip title="Download Payslip">
              <IconButton 
                size="small" 
                color="info"
                onClick={() => handleDownloadPayslip(row)}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )} */}
        </Box>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Page Header with Date Filter */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Payroll Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage employee payroll and salary payments
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            {/* Add Payroll Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPayroll}
              disabled={loading}
              sx={{ minWidth: 140 }}
            >
              Add Payroll
            </Button>

            {/* Month/Year Picker */}
            <Box sx={{ minWidth: 200 }}>
              <DatePicker
                label="Select Month/Year"
                value={selectedDate}
                onChange={(newValue) => newValue && setSelectedDate(newValue)}
                views={['year', 'month']}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Summary Statistics - Row 1 */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary">
                    {summaryStats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Employees
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="default">
                    {summaryStats.draft}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Draft
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main">
                    {summaryStats.processed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Processed
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {summaryStats.paid}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Paid
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Summary Statistics - Row 2 (Financial) */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontSize: '1.1rem' }}>
                    {formatCurrency(summaryStats.totalGrossPay)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Gross Pay
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main" sx={{ fontSize: '1.1rem' }}>
                    {formatCurrency(summaryStats.totalNetPay)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Net Pay
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="error.main" sx={{ fontSize: '1.1rem' }}>
                    {formatCurrency(summaryStats.totalDeductions)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Deductions
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="info.main" sx={{ fontSize: '1.1rem' }}>
                    {formatCurrency(summaryStats.totalOvertimePay)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Overtime
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Payroll Table */}
            <DataTable
              columns={columns}
              data={filteredPayroll}
              searchPlaceholder="Search payroll by employee name..."
              searchFields={['employeeName']}
              getRowId={(row) => row.id}
              emptyMessage={`No payroll records found for ${selectedDate.format('MMMM YYYY')}`}
              defaultRowsPerPage={10}
              rowsPerPageOptions={[5, 10, 15, 25]}
            />

            {/* Additional Info */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Showing payroll for {selectedDate.format('MMMM YYYY')} • 
                Payment completion rate: {summaryStats.total > 0 ? ((summaryStats.paid / summaryStats.total) * 100).toFixed(1) : 0}% • 
                Average net pay: {summaryStats.total > 0 ? formatCurrency(summaryStats.totalNetPay / summaryStats.total) : formatCurrency(0)}
              </Typography>
            </Box>
          </>
        )}

        {/* Payroll Form Dialog */}
        <PayrollForm
          open={payrollFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          payroll={selectedPayroll}
          mode={formMode}
        />
      </Box>
    </LocalizationProvider>
  );
}