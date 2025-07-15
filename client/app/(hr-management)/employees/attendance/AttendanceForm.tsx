"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  MenuItem,
  Box,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Attendance, AttendanceStatus, CreateAttendanceRequest, Employee } from "../../../../types";
import { EmployeeService } from "@/services/employeeService";
import { useAsync } from "@/hooks/useAsync";

interface AttendanceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAttendanceRequest) => Promise<void>;
  attendance?: Attendance | null;
  loading?: boolean;
}

export default function AttendanceForm({
  open,
  onClose,
  onSubmit,
  attendance,
  loading = false,
}: AttendanceFormProps) {
  const [formData, setFormData] = useState<{
    employeeId: string;
    date: Dayjs | null;
    clockIn: Dayjs | null;
    clockOut: Dayjs | null;
    status: AttendanceStatus;
    notes: string;
  }>({
    employeeId: "",
    date: dayjs(),
    clockIn: dayjs().hour(8).minute(0),
    clockOut: dayjs().hour(17).minute(0),
    status: AttendanceStatus.PRESENT,
    notes: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Fetch employees from API
  const { data: employees = [], loading: employeesLoading } = useAsync(
    () => EmployeeService.getAllEmployees(),
    []
  );

  // Reset form when dialog opens/closes or attendance changes
  useEffect(() => {
    if (attendance) {
      setFormData({
        employeeId: attendance.employeeId,
        date: dayjs(attendance.date),
        clockIn: dayjs(attendance.clockIn),
        clockOut: attendance.clockOut ? dayjs(attendance.clockOut) : null,
        status: attendance.attendanceStatus,
        notes: attendance.notes || "",
      });
      setSelectedEmployee(
        employees?.find((emp) => emp.id === attendance.employeeId) || null
      );
    } else {
      setFormData({
        employeeId: "",
        date: dayjs(),
        clockIn: dayjs().hour(8).minute(0),
        clockOut: dayjs().hour(17).minute(0),
        status: AttendanceStatus.PRESENT,
        notes: "",
      });
      setSelectedEmployee(null);
    }
    setError(null);
  }, [attendance, open, employees]);

  // Update selected employee when employeeId changes
  useEffect(() => {
    if (formData.employeeId) {
      const employee = employees?.find(
        (emp) => emp.id === formData.employeeId
      );
      setSelectedEmployee(employee || null);
    } else {
      setSelectedEmployee(null);
    }
  }, [formData.employeeId, employees]);

  const handleEmployeeChange = (employeeId: string) => {
    setFormData((prev) => ({ ...prev, employeeId }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleClockInChange = (time: Dayjs | null) => {
    setFormData((prev) => ({ ...prev, clockIn: time }));
  };

  const handleClockOutChange = (time: Dayjs | null) => {
    setFormData((prev) => ({ ...prev, clockOut: time }));
  };

  const handleStatusChange = (
    status: AttendanceStatus
  ) => {
    setFormData((prev) => ({
      ...prev,
      status,
      // Clear clock times for absent status
      clockIn: status === AttendanceStatus.ABSENT ? null : prev.clockIn,
      clockOut: status === AttendanceStatus.ABSENT ? null : prev.clockOut,
    }));
  };

  const handleNotesChange = (notes: string) => {
    setFormData((prev) => ({ ...prev, notes }));
  };

  const calculateTotalHours = (): number => {
    if (
      !formData.clockIn ||
      !formData.clockOut ||
      formData.status === AttendanceStatus.ABSENT
    ) {
      return 0;
    }

    const diffInHours = formData.clockOut.diff(formData.clockIn, "hour", true);
    return Math.max(0, Math.round(diffInHours * 100) / 100); // Round to 2 decimal places
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!formData.employeeId) {
      setError("Employee is required");
      return;
    }
    if (!formData.date) {
      setError("Date is required");
      return;
    }
    if (formData.status !== AttendanceStatus.ABSENT && !formData.clockIn) {
      setError("Clock in time is required for non-absent status");
      return;
    }
    if (formData.status === AttendanceStatus.PRESENT && !formData.clockOut) {
      setError("Clock out time is required for present status");
      return;
    }
    if (
      formData.clockIn &&
      formData.clockOut &&
      formData.clockOut.isBefore(formData.clockIn)
    ) {
      setError("Clock out time must be after clock in time");
      return;
    }

    try {
      const attendanceData: CreateAttendanceRequest = {
        employeeId: formData.employeeId,
        date: formData.date!.format('YYYY-MM-DD'),
        clockIn: formData.clockIn?.toISOString() || new Date().toISOString(),
        clockOut: formData.clockOut?.toISOString(),
        attendanceStatus: formData.status,
        notes: formData.notes || undefined,
      };

      await onSubmit(attendanceData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const totalHours = calculateTotalHours();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>
          {attendance ? "Edit Attendance Record" : "Add Attendance Record"}
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Employee Selection */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={formData.employeeId}
                  label="Employee"
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  disabled={loading || employeesLoading}
                >
                  {employees?.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={employee.profileImage}
                          sx={{ width: 32, height: 32 }}
                        >
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {employee.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.email}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Selected Employee Preview */}
            {selectedEmployee && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: "background.paper",
                  }}
                >
                  <Avatar
                    src={selectedEmployee.profileImage}
                    sx={{ width: 48, height: 48 }}
                  >
                    {selectedEmployee.firstName[0]}
                    {selectedEmployee.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {selectedEmployee.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEmployee.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Date */}
            <Grid size={{xs:12, md: 6}}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
                disabled={loading}
              />
            </Grid>

            {/* Status */}
            <Grid size={{xs:12, md: 6}}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value as AttendanceStatus)}
                  disabled={loading}
                >
                  <MenuItem value={AttendanceStatus.PRESENT}>Present</MenuItem>
                  <MenuItem value={AttendanceStatus.LATE}>Late</MenuItem>
                  <MenuItem value={AttendanceStatus.ABSENT}>Absent</MenuItem>
                  <MenuItem value={AttendanceStatus.HALF_DAY}>Half Day</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clock In Time */}
            {formData.status !== AttendanceStatus.ABSENT && (
              <Grid size={{xs:12, md: 6}}>
                <TimePicker
                  label="Clock In"
                  value={formData.clockIn}
                  onChange={handleClockInChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                  disabled={loading}
                />
              </Grid>
            )}

            {/* Clock Out Time */}
            {formData.status !== AttendanceStatus.ABSENT && (
              <Grid size={{xs:12, md: 6}}>
                <TimePicker
                  label="Clock Out"
                  value={formData.clockOut}
                  onChange={handleClockOutChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: formData.status === AttendanceStatus.PRESENT,
                    },
                  }}
                  disabled={loading}
                />
              </Grid>
            )}

            {/* Total Hours Display */}
            {formData.status !== AttendanceStatus.ABSENT && (
              <Grid size={{xs:12, md: 6}}>
                <TextField
                  fullWidth
                  label="Total Hours"
                  value={`${totalHours}h`}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="filled"
                />
              </Grid>
            )}

            {/* Notes */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Optional notes about this attendance record..."
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : attendance ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
