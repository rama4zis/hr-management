"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DataTable, { TableColumn, StatusChip, formatDate } from "@/components/DataTable";
import { Attendance, Employee, AttendanceStatus, CreateAttendanceRequest } from "../../../../types";
import { AttendanceService } from "@/services/attendanceService";
import { EmployeeService } from "@/services/employeeService";
import { useAsync, useAsyncCallback } from "@/hooks/useAsync";
import AttendanceForm from "./AttendanceForm";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Current month
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance data from API
  const { 
    data: attendanceData = [], 
    loading: attendanceLoading, 
    error: attendanceError, 
    refetch: refetchAttendance 
  } = useAsync(() => {
    const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
    const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');
    return AttendanceService.getAttendanceByDateRange(startDate, endDate);
  }, [selectedDate]);

  // Fetch employees data
  const { data: employees = [] } = useAsync(() => EmployeeService.getAllEmployees(), []);

  // Async operations
  const { execute: createAttendance, loading: createLoading } = useAsyncCallback(AttendanceService.createAttendance);

  // Helper functions
  const getEmployeeName = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    return employee ? employee.fullName : 'Unknown Employee';
  };

  const getEmployeeProfileImage = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    return employee?.profileImage || '';
  };

  // Filter attendance data by selected month and year and add employee names
  const filteredAttendance = useMemo(() => {
    return attendanceData?.map((attendance) => ({
      ...attendance,
      employeeName: getEmployeeName(attendance.employeeId),
      employeeProfileImage: getEmployeeProfileImage(attendance.employeeId),
    }));
  }, [attendanceData, employees]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredAttendance?.length;
    const present = filteredAttendance?.filter(
      (att) => att.attendanceStatus === AttendanceStatus.PRESENT
    ).length;
    const late = filteredAttendance?.filter(
      (att) => att.attendanceStatus === AttendanceStatus.LATE
    ).length;
    const absent = filteredAttendance?.filter(
      (att) => att.attendanceStatus === AttendanceStatus.ABSENT
    ).length;
    const halfDay = filteredAttendance?.filter(
      (att) => att.attendanceStatus === AttendanceStatus.HALF_DAY
    ).length;
    const totalHours = filteredAttendance?.reduce(
      (sum, att) => sum + (att.hoursWorked || 0),
      0
    );

    return { total, present, late, absent, halfDay, totalHours };
  }, [filteredAttendance]);

  // Event handlers
  const handleAddAttendance = () => {
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateAttendanceRequest) => {
    setError(null);
    const result = await createAttendance(data);
    if (result !== null) {
      await refetchAttendance();
      setFormOpen(false);
    } else {
      setError('Failed to create attendance record');
    }
  };

  // Format time function
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Define table columns
  const columns: TableColumn<Attendance & { employeeName: string, employeeProfileImage: string }>[] = [
    {
      id: "employee",
      label: "Employee",
      minWidth: 200,
      format: (value, row) => {
        const employeeName = row.employeeName;
        const initials = employeeName
          .split(" ")
          .map((n) => n[0])
          .join("");

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 35, height: 35 }} src={row.employeeProfileImage}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="medium">
                {employeeName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {row.employeeId.substring(0, 8)}...
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: "date",
      label: "Date",
      format: (value) => formatDate(value),
    },
    {
      id: "clockIn",
      label: "Clock In",
      format: (value, row) => {
        if (row.clockIn === null) return "-";
        return value ? formatTime(value) : "-";
      },
    },
    {
      id: "clockOut",
      label: "Clock Out",
      format: (value, row) => {
        if (row.clockOut === null || !value) return "-";
        return formatTime(value);
      },
    },
    {
      id: "hoursWorked",
      label: "Total Hours",
      align: "center",
      format: (value, row) => {
        if (row.clockOut === null) return "-";
        return (
          <Typography variant="body2" fontWeight="medium">
            {/* get from calculated from clockIn - clockOut */}
            {row.clockIn && row.clockOut
              ? `${dayjs(row.clockOut).diff(dayjs(row.clockIn), 'hour', true).toFixed(2)} hrs`
              : "-"}
          </Typography>
        );
      },
    },
    {
      id: "attendanceStatus",
      label: "Status",
      format: (value) => (
        <StatusChip
          status={value}
          colorMap={{
            "PRESENT": "success",
            "LATE": "warning",
            "ABSENT": "error",
            "HALF_DAY": "info",
          }}
        />
      ),
    },
    {
      id: "notes",
      label: "Notes",
      format: (value) => (
        <Typography variant="body2" color="text.secondary">
          {value || "-"}
        </Typography>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {attendanceError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load attendance data: {attendanceError}
          </Alert>
        )}

        {/* Page Header with Date Filter */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Attendance
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage employee attendance records
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Month/Year Picker */}
            <Box sx={{ minWidth: 200 }}>
              <DatePicker
                label="Select Month/Year"
                value={selectedDate}
                onChange={(newValue) => newValue && setSelectedDate(newValue)}
                views={["year", "month"]}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </Box>

            {/* Add Manual Attendance Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAttendance}
              disabled={attendanceLoading}
            >
              Add Manual Attendance
            </Button>
          </Box>
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="primary">
                {summaryStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="success.main">
                {summaryStats.present}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Present
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="warning.main">
                {summaryStats.late}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Late
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="error.main">
                {summaryStats.absent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Absent
              </Typography>
            </Paper>
          </Grid>
          
        </Grid>

        {/* Attendance Table */}
        {attendanceLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            title="Attendance Records"
            subtitle={`Records for ${selectedDate.format("MMMM YYYY")}`}
            columns={columns}
            data={filteredAttendance}
            searchPlaceholder="Search attendance records by employee name..."
            searchFields={["employeeName"]}
            getRowId={(row) => row.id}
            emptyMessage={`No attendance records found for ${selectedDate.format(
              "MMMM YYYY"
            )}`}
            defaultRowsPerPage={15}
            rowsPerPageOptions={[10, 15, 25, 50]}
          />
        )}

        {/* Attendance Form Dialog */}
        <AttendanceForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          loading={createLoading}
        />

        {/* Additional Info */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Showing attendance records for {selectedDate.format("MMMM YYYY")} •
            Total working hours: {summaryStats.totalHours} hours • Average daily
            attendance:{" "}
            {summaryStats.total > 0
              ? (
                  ((summaryStats.present +
                    summaryStats.late +
                    summaryStats.halfDay) /
                    summaryStats.total) *
                  100
                ).toFixed(1)
              : 0}
            %
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
