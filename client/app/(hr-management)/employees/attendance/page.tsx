"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { dummyAttendance, getEmployeeName } from "../../../../data";
import DataTable,
  { TableColumn, StatusChip, formatDate }
from "@/components/DataTable";
import { Attendance } from "@/model/Attendance";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Current month

  // Filter attendance data by selected month and year and add employee names
  const filteredAttendance = useMemo(() => {
    return dummyAttendance
      .filter((attendance) => {
        const attendanceDate = dayjs(attendance.date);
        return (
          attendanceDate.month() === selectedDate.month() &&
          attendanceDate.year() === selectedDate.year()
        );
      })
      .map((attendance) => ({
        ...attendance,
        employeeName: getEmployeeName(attendance.employeeId) || "Unknown Employee",
      }));
  }, [selectedDate]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(
      (att) => att.status === "present"
    ).length;
    const late = filteredAttendance.filter(
      (att) => att.status === "late"
    ).length;
    const absent = filteredAttendance.filter(
      (att) => att.status === "absent"
    ).length;
    const halfDay = filteredAttendance.filter(
      (att) => att.status === "half-day"
    ).length;
    const totalHours = filteredAttendance.reduce(
      (sum, att) => sum + att.totalHours,
      0
    );

    return { total, present, late, absent, halfDay, totalHours };
  }, [filteredAttendance]);

  // Format time function
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Define table columns
  const columns: TableColumn<Attendance & { employeeName: string }>[] = [
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
      id: "date",
      label: "Date",
      format: (value) => formatDate(value),
    },
    {
      id: "clockIn",
      label: "Clock In",
      format: (value, row) => {
        if (row.status === "absent") return "-";
        return formatTime(value);
      },
    },
    {
      id: "clockOut",
      label: "Clock Out",
      format: (value, row) => {
        if (row.status === "absent" || !value) return "-";
        return formatTime(value);
      },
    },
    {
      id: "totalHours",
      label: "Total Hours",
      align: "center",
      format: (value, row) => {
        if (row.status === "absent") return "-";
        return (
          <Typography variant="body2" fontWeight="medium">
            {value}h
          </Typography>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      format: (value) => (
        <StatusChip
          status={value}
          colorMap={{
            present: "success",
            late: "warning",
            absent: "error",
            "half-day": "info",
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
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="primary">
                {summaryStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="success.main">
                {summaryStats.present}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Present
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="warning.main">
                {summaryStats.late}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Late
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="error.main">
                {summaryStats.absent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Absent
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="info.main">
                {summaryStats.totalHours}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Hours
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Attendance Table */}
        <DataTable
          columns={columns}
          data={filteredAttendance}
          searchPlaceholder="Search attendance records by employee name..."
          searchFields={["employeeName"]} // Now this field exists in the data
          getRowId={(row) => row.id}
          emptyMessage={`No attendance records found for ${selectedDate.format(
            "MMMM YYYY"
          )}`}
          defaultRowsPerPage={15}
          rowsPerPageOptions={[10, 15, 25, 50]}
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
