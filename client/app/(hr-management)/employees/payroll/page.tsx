'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  GetApp as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { dummyPayroll, getEmployeeName, getEmployeeProfileImage } from '../../../../data';
import DataTable, { TableColumn, StatusChip, formatCurrency, formatDate } from '../../../../components/DataTable';
import { Payroll } from '../../../../model/Payroll';

export default function PayrollPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Current month

  // Filter payroll data by selected month and year and add employee names
  const filteredPayroll = useMemo(() => {
    return dummyPayroll
      .filter((payroll) => {
        const payrollDate = dayjs(payroll.payPeriodStart);
        return (
          payrollDate.month() === selectedDate.month() &&
          payrollDate.year() === selectedDate.year()
        );
      })
      .map((payroll) => ({
        ...payroll,
        employeeName: getEmployeeName(payroll.employeeId) || 'Unknown Employee',
        employeeProfileImage: getEmployeeProfileImage(payroll.employeeId) || '',
      }));
  }, [selectedDate]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredPayroll.length;
    const draft = filteredPayroll.filter(pay => pay.status === 'draft').length;
    const processed = filteredPayroll.filter(pay => pay.status === 'processed').length;
    const paid = filteredPayroll.filter(pay => pay.status === 'paid').length;
    
    const totalGrossPay = filteredPayroll.reduce((sum, pay) => sum + pay.grossPay, 0);
    const totalNetPay = filteredPayroll.reduce((sum, pay) => sum + pay.netPay, 0);
    const totalDeductions = filteredPayroll.reduce((sum, pay) => sum + pay.deductions, 0);
    const totalOvertimePay = filteredPayroll.reduce((sum, pay) => sum + pay.overtime, 0);

    return { 
      total, 
      draft, 
      processed, 
      paid, 
      totalGrossPay, 
      totalNetPay, 
      totalDeductions,
      totalOvertimePay 
    };
  }, [filteredPayroll]);

  // Handle payroll actions
  const handleProcessPayroll = (payroll: Payroll & { employeeName: string }) => {
    console.log('Process payroll:', payroll.id);
    // In a real app, this would make an API call to process the payroll
  };

  const handleMarkAsPaid = (payroll: Payroll & { employeeName: string }) => {
    console.log('Mark as paid:', payroll.id);
    // In a real app, this would make an API call to mark as paid
  };

  const handleDownloadPayslip = (payroll: Payroll & { employeeName: string }) => {
    console.log('Download payslip:', payroll.id);
    // In a real app, this would generate and download a PDF payslip
  };

  const handleViewDetails = (payroll: Payroll & { employeeName: string }) => {
    console.log('View payroll details:', payroll.id);
    // In a real app, this would open a detailed view modal
  };

  // Define table columns
  const columns: TableColumn<Payroll & { employeeName: string, employeeProfileImage: string }>[] = [
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
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => handleViewDetails(row)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {row.status === 'draft' && (
            <Tooltip title="Process Payroll">
              <IconButton 
                size="small" 
                color="warning"
                onClick={() => handleProcessPayroll(row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {row.status === 'processed' && (
            <Tooltip title="Mark as Paid">
              <IconButton 
                size="small" 
                color="success"
                onClick={() => handleMarkAsPaid(row)}
              >
                <PaymentIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {(row.status === 'processed' || row.status === 'paid') && (
            <Tooltip title="Download Payslip">
              <IconButton 
                size="small" 
                color="info"
                onClick={() => handleDownloadPayslip(row)}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
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
      </Box>
    </LocalizationProvider>
  );
}