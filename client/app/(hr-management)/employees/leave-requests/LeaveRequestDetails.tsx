'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Category,
  Description,
  CheckCircle,
  Cancel,
  Pending,
  AccessTime,
} from '@mui/icons-material';
import { LeaveRequest, LeaveRequestStatus, LeaveRequestType, Employee } from '../../../../types';
import { EmployeeService } from '../../../../services/employeeService';
import dayjs from 'dayjs';

interface LeaveRequestDetailsProps {
  open: boolean;
  onClose: () => void;
  leaveRequest: LeaveRequest | null;
  onEdit?: () => void;
  canEdit?: boolean;
}

export default function LeaveRequestDetails({
  open,
  onClose,
  leaveRequest,
  onEdit,
  canEdit = false,
}: LeaveRequestDetailsProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [approver, setApprover] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch employee and approver details when dialog opens
  useEffect(() => {
    if (open && leaveRequest) {
      fetchEmployeeDetails();
    }
  }, [open, leaveRequest]);

  const fetchEmployeeDetails = async () => {
    if (!leaveRequest) return;
    
    try {
      setLoading(true);
      
      // Fetch employee details
      const employeeData = await EmployeeService.getEmployeeById(leaveRequest.employeeId);
      setEmployee(employeeData);
      
      // Fetch approver details if available
      if (leaveRequest.approvedBy) {
        const approverData = await EmployeeService.getEmployeeById(leaveRequest.approvedBy);
        setApprover(approverData);
      } else {
        setApprover(null);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setEmployee(null);
      setApprover(null);
    } finally {
      setLoading(false);
    }
  };

  if (!leaveRequest) return null;

  const getStatusColor = (status: LeaveRequestStatus) => {
    switch (status) {
      case LeaveRequestStatus.APPROVED:
        return 'success';
      case LeaveRequestStatus.REJECTED:
        return 'error';
      case LeaveRequestStatus.CANCELLED:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: LeaveRequestStatus) => {
    switch (status) {
      case LeaveRequestStatus.APPROVED:
        return <CheckCircle />;
      case LeaveRequestStatus.REJECTED:
        return <Cancel />;
      case LeaveRequestStatus.CANCELLED:
        return <Cancel />;
      default:
        return <Pending />;
    }
  };

  const getLeaveTypeDisplay = (type: LeaveRequestType) => {
    const typeMap = {
      [LeaveRequestType.ANNUAL]: 'Annual Leave',
      [LeaveRequestType.SICK]: 'Sick Leave',
      [LeaveRequestType.PERSONAL]: 'Personal Leave',
      [LeaveRequestType.MATERNITY]: 'Maternity Leave',
      [LeaveRequestType.PATERNITY]: 'Paternity Leave',
      [LeaveRequestType.BEREAVEMENT]: 'Bereavement Leave',
      [LeaveRequestType.EMERGENCY]: 'Emergency Leave',
    };
    return typeMap[type] || type;
  };

  const getLeaveTypeColor = (type: LeaveRequestType) => {
    switch (type) {
      case LeaveRequestType.ANNUAL:
        return 'primary';
      case LeaveRequestType.SICK:
        return 'error';
      case LeaveRequestType.PERSONAL:
        return 'info';
      case LeaveRequestType.MATERNITY:
      case LeaveRequestType.PATERNITY:
        return 'secondary';
      case LeaveRequestType.EMERGENCY:
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY [at] hh:mm A');
  };

  const getEmployeeName = () => {
    if (employee) {
      return `${employee.firstName} ${employee.lastName}`;
    }
    return `Employee ID: ${leaveRequest.employeeId}`;
  };

  const getApproverName = () => {
    if (approver) {
      return `${approver.firstName} ${approver.lastName}`;
    }
    return leaveRequest.approvedBy ? `Employee ID: ${leaveRequest.approvedBy}` : '-';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Leave Request Details</Typography>
          <Chip
            icon={getStatusIcon(leaveRequest.leaveRequestStatus)}
            label={leaveRequest.leaveRequestStatus}
            color={getStatusColor(leaveRequest.leaveRequestStatus)}
            variant="outlined"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            {/* Employee Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Person color="primary" />
                  <Typography variant="h6">Employee Information</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    sx={{ width: 48, height: 48 }}
                  >
                    {getInitials(getEmployeeName())}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {getEmployeeName()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {leaveRequest.employeeId}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Leave Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Category color="primary" />
                  <Typography variant="h6">Leave Information</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Leave Type
                  </Typography>
                  <Chip
                    label={getLeaveTypeDisplay(leaveRequest.leaveRequestType)}
                    color={getLeaveTypeColor(leaveRequest.leaveRequestType)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Days
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {leaveRequest.totalDays} {leaveRequest.totalDays === 1 ? 'day' : 'days'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Date Information */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CalendarToday color="primary" />
                  <Typography variant="h6">Date Information</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Start Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(leaveRequest.startDate)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      End Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(leaveRequest.endDate)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Request Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(leaveRequest.requestDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Reason */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Description color="primary" />
                  <Typography variant="h6">Reason</Typography>
                </Box>
                <Typography variant="body1">
                  {leaveRequest.reason}
                </Typography>
              </Paper>
            </Grid>

            {/* Approval Information */}
            {(leaveRequest.leaveRequestStatus !== LeaveRequestStatus.PENDING || leaveRequest.responseDate) && (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <AccessTime color="primary" />
                    <Typography variant="h6">Approval Information</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {leaveRequest.approvedBy && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {leaveRequest.leaveRequestStatus === LeaveRequestStatus.APPROVED ? 'Approved By' : 
                           leaveRequest.leaveRequestStatus === LeaveRequestStatus.REJECTED ? 'Rejected By' : 'Processed By'}
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {getApproverName()}
                        </Typography>
                      </Grid>
                    )}
                    {leaveRequest.responseDate && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Response Date
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDateTime(leaveRequest.responseDate)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  {leaveRequest.comments && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Comments
                      </Typography>
                      <Typography variant="body1">
                        {leaveRequest.comments}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
        )}
      </DialogContent>
      <DialogActions>
        {canEdit && leaveRequest.leaveRequestStatus === LeaveRequestStatus.PENDING && (
          <Button onClick={onEdit} variant="outlined">
            Edit Request
          </Button>
        )}
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
