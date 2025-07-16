'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Pending as PendingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DataTable, { TableColumn, StatusChip, formatDate } from '@/components/DataTable';
import { LeaveRequest, CreateLeaveRequestRequest, LeaveRequestType, LeaveRequestStatus } from '../../../../types';
import { LeaveRequestService } from '@/services/leaveRequestService';
import { EmployeeService } from '@/services/employeeService';
import { Employee } from '../../../../types';
import { useAsync } from '../../../../hooks/useAsync';
import ConfirmationDialog from './ConfirmationDialog';
import LeaveRequestForm from './LeaveRequestForm';
import LeaveRequestDetails from './LeaveRequestDetails';

export default function LeaveRequestsPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Current month
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<{ [key: string]: Employee }>({});
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalDays: number;
  }>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalDays: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | 'cancel';
    leaveRequest: LeaveRequest | null;
  }>({
    open: false,
    action: 'approve',
    leaveRequest: null,
  });

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    leaveRequest: LeaveRequest | null;
  }>({
    open: false,
    mode: 'create',
    leaveRequest: null,
  });

  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    leaveRequest: LeaveRequest | null;
  }>({
    open: false,
    leaveRequest: null,
  });

  const [actionLoading, setActionLoading] = useState(false);

  // Load leave requests from API
  useEffect(() => {
    loadLeaveRequests();
  }, [selectedDate]);

  const loadLeaveRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get filtered leave requests by request date month/year
      const filters = {
        month: selectedDate.month() + 1, // dayjs months are 0-indexed
        year: selectedDate.year(),
      };
      
      const [requestsData, statsData] = await Promise.all([
        LeaveRequestService.getFiltered(filters),
        LeaveRequestService.getStats(filters),
      ]);
      
      setLeaveRequests(requestsData);
      setStats(statsData);
      
      // Fetch employee details for all unique employee IDs and approver IDs
      const employeeIds = new Set<string>();
      requestsData.forEach((request) => {
        employeeIds.add(request.employeeId);
        if (request.approvedBy) {
          employeeIds.add(request.approvedBy);
        }
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
      console.error('Error loading leave requests:', err);
      setError('Failed to load leave requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve/reject/cancel actions
  const handleStatusChange = (action: 'approve' | 'reject' | 'cancel', leaveRequest: LeaveRequest) => {
    setConfirmDialog({
      open: true,
      action,
      leaveRequest,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.leaveRequest) return;

    try {
      setActionLoading(true);
      const { action, leaveRequest } = confirmDialog;
      // Get approver employeeId from localStorage via authService
      const { authService } = await import('@/services/authService');
      const currentEmployeeId = authService.getCurrentEmployeeId();
      if (!currentEmployeeId && (action === 'approve' || action === 'reject')) {
        throw new Error('No approver employee ID found. Please log in again.');
      }
      let updatedRequest: LeaveRequest;
      switch (action) {
        case 'approve':
          updatedRequest = await LeaveRequestService.approve(leaveRequest.id, currentEmployeeId!);
          break;
        case 'reject':
          updatedRequest = await LeaveRequestService.reject(leaveRequest.id, currentEmployeeId!);
          break;
        case 'cancel':
          updatedRequest = await LeaveRequestService.cancel(leaveRequest.id);
          break;
        default:
          throw new Error('Invalid action');
      }

      // Update the local state
      setLeaveRequests(prev => 
        prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
      );
      
      // Refresh stats
      await loadLeaveRequests();
      
      setConfirmDialog({ open: false, action: 'approve', leaveRequest: null });
    } catch (err) {
      console.error('Error updating leave request:', err);
      setError('Failed to update leave request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: CreateLeaveRequestRequest | LeaveRequest) => {
    try {
      if (formDialog.mode === 'create') {
        await LeaveRequestService.create(data as CreateLeaveRequestRequest);
      } else if (formDialog.leaveRequest) {
        await LeaveRequestService.update(formDialog.leaveRequest.id, data as LeaveRequest);
      }
      
      // Refresh data
      await loadLeaveRequests();
      setFormDialog({ open: false, mode: 'create', leaveRequest: null });
    } catch (err) {
      console.error('Error saving leave request:', err);
      throw err; // Let the form handle the error
    }
  };

  // Filter leave requests by selected month and year and add employee names
  const filteredLeaveRequests = useMemo(() => {
    return leaveRequests.map((leaveRequest) => {
      const employee = employees[leaveRequest.employeeId];
      const approver = leaveRequest.approvedBy ? employees[leaveRequest.approvedBy] : null;
      
      return {
        ...leaveRequest,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : `Employee ID: ${leaveRequest.employeeId}`,
        employeeProfileImage: employee?.profileImage || '',
        approverName: approver ? `${approver.firstName} ${approver.lastName}` : 
                     leaveRequest.approvedBy ? `Employee ID: ${leaveRequest.approvedBy}` : null,
      };
    });
  }, [leaveRequests, employees]);

  // Calculate summary statistics (using stats from API)
  const summaryStats = useMemo(() => {
    return {
      total: stats.total,
      pending: stats.pending,
      approved: stats.approved,
      rejected: stats.rejected,
      totalDays: stats.totalDays,
    };
  }, [stats]);
  // Get leave type color
  const getLeaveTypeColor = (type: LeaveRequestType) => {
    switch (type) {
      case LeaveRequestType.ANNUAL: return 'primary';
      case LeaveRequestType.SICK: return 'error';
      case LeaveRequestType.PERSONAL: return 'info';
      case LeaveRequestType.MATERNITY:
      case LeaveRequestType.PATERNITY: return 'secondary';
      case LeaveRequestType.EMERGENCY: return 'warning';
      case LeaveRequestType.BEREAVEMENT: return 'default';
      default: return 'default';
    }
  };

  const getLeaveTypeDisplay = (type: LeaveRequestType) => {
    const typeMap = {
      [LeaveRequestType.ANNUAL]: 'Annual',
      [LeaveRequestType.SICK]: 'Sick',
      [LeaveRequestType.PERSONAL]: 'Personal',
      [LeaveRequestType.MATERNITY]: 'Maternity',
      [LeaveRequestType.PATERNITY]: 'Paternity',
      [LeaveRequestType.BEREAVEMENT]: 'Bereavement',
      [LeaveRequestType.EMERGENCY]: 'Emergency',
    };
    return typeMap[type] || type;
  };

  // Handle view details
  const handleViewDetails = (leaveRequest: LeaveRequest) => {
    setDetailsDialog({
      open: true,
      leaveRequest,
    });
  };

  // Handle edit
  const handleEdit = (leaveRequest: LeaveRequest) => {
    setFormDialog({
      open: true,
      mode: 'edit',
      leaveRequest,
    });
  };

  // Define table columns
  const columns: TableColumn<LeaveRequest & { employeeName: string, employeeProfileImage: string , approverName: string | null }>[] = [
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
            <Avatar sx={{ width: 35, height: 35 }}>
              {initials}
            </Avatar>
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
      id: 'leaveRequestType',
      label: 'Leave Type',
      format: (value) => (
        <Chip
          label={getLeaveTypeDisplay(value as LeaveRequestType)}
          color={getLeaveTypeColor(value as LeaveRequestType)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'requestDate',
      label: 'Request Date',
      format: (value) => formatDate(value as string),
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
          title={value as string}
        >
          {value as string}
        </Typography>
      ),
    },
    {
      id: 'leaveRequestStatus',
      label: 'Status',
      format: (value) => (
        <StatusChip
          status={(value as string).toLowerCase()}
          colorMap={{
            pending: 'warning',
            approved: 'success',
            rejected: 'error',
            cancelled: 'default',
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
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              color="info"
              onClick={() => handleViewDetails(row)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {row.leaveRequestStatus === LeaveRequestStatus.PENDING && (
            <>
              <Tooltip title="Edit Request">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleEdit(row)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Approve Request">
                <IconButton 
                  size="small" 
                  color="success"
                  onClick={() => handleStatusChange('approve', row)}
                >
                  <ApproveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject Request">
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleStatusChange('reject', row)}
                >
                  <RejectIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          {row.leaveRequestStatus !== LeaveRequestStatus.PENDING && row.leaveRequestStatus !== LeaveRequestStatus.CANCELLED && (
            <Typography variant="caption" color="text.secondary">
              {row.leaveRequestStatus === LeaveRequestStatus.APPROVED ? 'Approved' : 'Rejected'}
            </Typography>
          )}
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
              Leave Requests
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and review employee leave requests
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Add Leave Request Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormDialog({ open: true, mode: 'create', leaveRequest: null })}
            >
              Add Request
            </Button>

            {/* Month/Year Picker */}
            <Box sx={{ minWidth: 200 }}>
              <DatePicker
                label="Filter by Request Month/Year"
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
            {/* Summary Statistics */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {summaryStats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Requests
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {summaryStats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {summaryStats.approved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">
                  {summaryStats.rejected}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rejected
                </Typography>
              </Paper>
            </Box>

            {/* Additional Stats Row */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {summaryStats.totalDays}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Approved Days
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="secondary.main">
                  {summaryStats.approved > 0 ? (summaryStats.totalDays / summaryStats.approved).toFixed(1) : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Days per Request
                </Typography>
              </Paper>
            </Box>

            {/* Leave Requests Table */}
            <DataTable
              columns={columns}
              data={filteredLeaveRequests}
              searchPlaceholder="Search leave requests by employee name or reason..."
              searchFields={['employeeName', 'reason', 'leaveRequestType']}
              getRowId={(row) => row.id}
              emptyMessage={`No leave requests found for ${selectedDate.format('MMMM YYYY')} (by request date)`}
              defaultRowsPerPage={10}
              rowsPerPageOptions={[5, 10, 15, 25]}
            />

            {/* Additional Info */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Showing leave requests for {selectedDate.format('MMMM YYYY')} (filtered by request date) • 
                Approval rate: {summaryStats.total > 0 ? ((summaryStats.approved / summaryStats.total) * 100).toFixed(1) : 0}% • 
                Pending requests require action
              </Typography>
            </Box>
          </>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, action: 'approve', leaveRequest: null })}
          onConfirm={handleConfirmAction}
          action={confirmDialog.action}
          leaveRequestId={confirmDialog.leaveRequest?.id || ''}
          employeeName={confirmDialog.leaveRequest ? 
            (employees[confirmDialog.leaveRequest.employeeId] 
              ? `${employees[confirmDialog.leaveRequest.employeeId].firstName} ${employees[confirmDialog.leaveRequest.employeeId].lastName}`
              : `Employee ID: ${confirmDialog.leaveRequest.employeeId}`)
            : ''}
          loading={actionLoading}
        />

        {/* Form Dialog */}
        <LeaveRequestForm
          open={formDialog.open}
          onClose={() => setFormDialog({ open: false, mode: 'create', leaveRequest: null })}
          onSubmit={handleFormSubmit}
          leaveRequest={formDialog.leaveRequest}
          mode={formDialog.mode}
        />

        {/* Details Dialog */}
        <LeaveRequestDetails
          open={detailsDialog.open}
          onClose={() => setDetailsDialog({ open: false, leaveRequest: null })}
          leaveRequest={detailsDialog.leaveRequest}
          onEdit={() => {
            if (detailsDialog.leaveRequest) {
              setDetailsDialog({ open: false, leaveRequest: null });
              setFormDialog({ open: true, mode: 'edit', leaveRequest: detailsDialog.leaveRequest });
            }
          }}
          canEdit={detailsDialog.leaveRequest?.leaveRequestStatus === LeaveRequestStatus.PENDING}
        />
      </Box>
    </LocalizationProvider>
  );
}