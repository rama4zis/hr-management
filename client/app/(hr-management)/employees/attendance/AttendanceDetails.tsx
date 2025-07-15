"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  AccessTime as TimeIcon,
  EventNote as EventIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Attendance } from '@/model/Attendance';
import { Employee } from '@/model/Employee';
import { formatDate } from '@/components/DataTable';

interface AttendanceDetailsProps {
  open: boolean;
  onClose: () => void;
  attendance: Attendance | null;
  employee: Employee | null;
  onEdit?: () => void;
}

export default function AttendanceDetails({
  open,
  onClose,
  attendance,
  employee,
  onEdit,
}: AttendanceDetailsProps) {
  if (!attendance || !employee) {
    return null;
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'error';
      case 'half-day': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'late': return 'Late';
      case 'absent': return 'Absent';
      case 'half-day': return 'Half Day';
      default: return status;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Attendance Details
          </Typography>
          {onEdit && (
            <IconButton 
              onClick={onEdit}
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Employee Information */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6">Employee Information</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={employee.profileImage}
                  sx={{ width: 64, height: 64 }}
                >
                  {employee.firstName[0]}{employee.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {employee.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Employee ID: {employee.id}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Attendance Overview */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <EventIcon color="primary" />
                <Typography variant="h6">Attendance Overview</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(attendance.date)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={getStatusLabel(attendance.status)}
                      color={getStatusColor(attendance.status) as any}
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Hours
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {attendance.status === 'absent' ? '-' : `${attendance.totalHours}h`}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Record ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {attendance.id}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Time Details */}
          {attendance.status !== 'absent' && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <ScheduleIcon color="primary" />
                  <Typography variant="h6">Time Details</Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <TimeIcon color="success" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Clock In
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {formatTime(attendance.clockIn)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <TimeIcon color="error" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Clock Out
                        </Typography>
                        <Typography variant="h6" color="error.main">
                          {attendance.clockOut ? formatTime(attendance.clockOut) : 'Not clocked out'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Working Hours Breakdown */}
                {attendance.clockOut && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Working Duration
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {attendance.totalHours} hours
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      From {formatTime(attendance.clockIn)} to {formatTime(attendance.clockOut)}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          )}

          {/* Notes */}
          {attendance.notes && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {attendance.notes}
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Additional Information */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                This attendance record was created for {employee.firstName} {employee.lastName} on {formatDate(attendance.date)}.
                {attendance.status === 'late' && ' Employee arrived late to work.'}
                {attendance.status === 'absent' && ' Employee was marked as absent.'}
                {attendance.status === 'half-day' && ' Employee worked a half day.'}
                {attendance.status === 'present' && ' Employee had a regular working day.'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {onEdit && (
          <Button 
            onClick={onEdit} 
            variant="outlined"
            startIcon={<EditIcon />}
          >
            Edit Record
          </Button>
        )}
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
