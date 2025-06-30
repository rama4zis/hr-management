'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { dummyLeaveRequests, getEmployeeName } from '../../../../data';
import DataTable, { TableColumn, StatusChip, formatDate } from '../../../../components/DataTable';
import { LeaveRequest } from '../../../../model/LeaveRequest';

export default function LeaveRequestsPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Current month

  // Filter leave requests by selected month and year and add employee names
  const filteredLeaveRequests = useMemo(() => {
    return dummyLeaveRequests
      .filter((leaveRequest) => {
        const requestDate = dayjs(leaveRequest.requestDate);
        return (
          requestDate.month() === selectedDate.month() &&
          requestDate.year() === selectedDate.year()
        );
      })
      .map((leaveRequest) => ({
        ...leaveRequest,
        employeeName: getEmployeeName(leaveRequest.employeeId) || 'Unknown Employee',
        approverName: leaveRequest.approvedBy ? getEmployeeName(leaveRequest.approvedBy) : null,
      }));
  }, [selectedDate]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredLeaveRequests.length;
    const pending = filteredLeaveRequests.filter(req => req.status === 'pending').length;
    const approved = filteredLeaveRequests.filter(req => req.status === 'approved').length;
    const rejected = filteredLeaveRequests.filter(req => req.status === 'rejected').length;
    const totalDays = filteredLeaveRequests
      .filter(req => req.status === 'approved')
      .reduce((sum, req) => sum + req.totalDays, 0);

    return { total, pending, approved, rejected, totalDays };
  }, [filteredLeaveRequests]);

  // Get leave type color
  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'primary';
      case 'sick': return 'error';
      case 'personal': return 'info';
      case 'maternity': return 'secondary';
      case 'emergency': return 'warning';
      default: return 'default';
    }
  };

  // Handle approve/reject actions
  const handleApprove = (leaveRequest: LeaveRequest & { employeeName: string }) => {
    console.log('Approve leave request:', leaveRequest.id);
    // In a real app, this would make an API call to update the status
  };

  const handleReject = (leaveRequest: LeaveRequest & { employeeName: string }) => {
    console.log('Reject leave request:', leaveRequest.id);
    // In a real app, this would make an API call to update the status
  };

  // Define table columns
  const columns: TableColumn<LeaveRequest & { employeeName: string; approverName: string | null }>[] = [
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
            <Avatar sx={{ width: 35, height: 35 }}>{initials}</Avatar>
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
      id: 'type',
      label: 'Leave Type',
      format: (value) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={getLeaveTypeColor(value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'requestDate',
      label: 'Request Date',
      format: (value) => formatDate(value),
    },
    {
      id: 'period',
      label: 'Leave Period',
      format: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {formatDate(row.startDate)} - {formatDate(row.endDate)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.totalDays} {row.totalDays === 1 ? 'day' : 'days'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'reason',
      label: 'Reason',
      minWidth: 200,
      format: (value) => (
        <Typography 
          variant="body2" 
          sx={{ 
            maxWidth: 200, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={value}
        >
          {value}
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
            pending: 'warning',
            approved: 'success',
            rejected: 'error',
          }}
        />
      ),
    },
    {
      id: 'approver',
      label: 'Approved By',
      format: (value, row) => (
        <Typography variant="body2" color="text.secondary">
          {row.approverName || '-'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      format: (value, row) => (
        <Box>
          {row.status === 'pending' && (
            <>
              <Tooltip title="Approve Request">
                <IconButton 
                  size="small" 
                  color="success"
                  onClick={() => handleApprove(row)}
                >
                  <ApproveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Request">
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleReject(row)}
                >
                  <RejectIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          {row.status !== 'pending' && (
            <Typography variant="caption" color="text.secondary">
              {row.status === 'approved' ? 'Approved' : 'Rejected'}
            </Typography>
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
              Leave Requests
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and review employee leave requests
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

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {summaryStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {summaryStats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {summaryStats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">
                {summaryStats.rejected}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Additional Stats Row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{xs: 12, sm: 6}}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {summaryStats.totalDays}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Approved Days
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="secondary.main">
                {summaryStats.approved > 0 ? (summaryStats.totalDays / summaryStats.approved).toFixed(1) : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Days per Request
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Leave Requests Table */}
        <DataTable
          columns={columns}
          data={filteredLeaveRequests}
          searchPlaceholder="Search leave requests by employee name or reason..."
          searchFields={['employeeName', 'reason', 'type']}
          getRowId={(row) => row.id}
          emptyMessage={`No leave requests found for ${selectedDate.format('MMMM YYYY')}`}
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 15, 25]}
        />

        {/* Additional Info */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Showing leave requests for {selectedDate.format('MMMM YYYY')} • 
            Approval rate: {summaryStats.total > 0 ? ((summaryStats.approved / summaryStats.total) * 100).toFixed(1) : 0}% • 
            Pending requests require action
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}