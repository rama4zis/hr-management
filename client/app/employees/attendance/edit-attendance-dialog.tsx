"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Grid
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import React, { useState, useEffect } from "react";

interface EditAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  attendance?: {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string;
    clockIn: string;
    clockOut: string | null;
    totalHours: number | null;
    status: string;
  };
}

export default function EditAttendanceDialog({ open, onClose, attendance }: EditAttendanceDialogProps) {
  const [formData, setFormData] = useState({
    date: dayjs(),
    clockIn: dayjs().hour(9).minute(0),
    clockOut: dayjs().hour(17).minute(0),
    status: "Present"
  });

  useEffect(() => {
    if (attendance) {
      setFormData({
        date: dayjs(attendance.date),
        clockIn: dayjs(attendance.date + " " + attendance.clockIn),
        clockOut: attendance.clockOut ? dayjs(attendance.date + " " + attendance.clockOut) : dayjs(attendance.date + " 17:00"),
        status: attendance.status
      });
    }
  }, [attendance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total hours
    const clockInTime = formData.clockIn;
    const clockOutTime = formData.clockOut;
    const totalHours = clockOutTime.diff(clockInTime, 'hour', true);

    const updatedAttendance = {
      ...attendance,
      date: formData.date.format('YYYY-MM-DD'),
      clockIn: formData.clockIn.format('HH:mm'),
      clockOut: formData.clockOut.format('HH:mm'),
      totalHours: Math.round(totalHours * 10) / 10,
      status: formData.status
    };

    console.log('Updated attendance:', updatedAttendance);
    // Here you would typically save to your data source
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {attendance?.employeeName?.charAt(0) || 'E'}
          </Avatar>
          <Typography variant="h6">
            Edit Attendance - {attendance?.employeeName}
          </Typography>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3}>
              <Grid>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Employee Information
                </Typography>
                <Box display="flex" alignItems="center" gap={2} p={2} bgcolor="grey.500" borderRadius={1}>
                  <Avatar>{attendance?.employeeName?.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {attendance?.employeeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {attendance?.employeeId}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, date: newValue || dayjs() }))}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>

              <Grid>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                    <MenuItem value="Late">Late</MenuItem>
                    <MenuItem value="Half Day">Half Day</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid>
                <TimePicker
                  label="Clock In Time"
                  value={formData.clockIn}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, clockIn: newValue || dayjs() }))}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>

              <Grid>
                <TimePicker
                  label="Clock Out Time"
                  value={formData.clockOut}
                  onChange={(newValue) => setFormData(prev => ({ ...prev, clockOut: newValue || dayjs() }))}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              </Grid>

              <Grid>
                <Box p={2} bgcolor="primary.50" borderRadius={1}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Calculated Hours
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formData.clockOut.diff(formData.clockIn, 'hour', true).toFixed(1)} hours
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 