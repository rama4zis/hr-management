"use client";

import {
  Description,
  Search,
  FilterList,
  Schedule,
  CheckCircle,
  Warning,
  Cancel,
  TrendingUp,
  People,
  AccessTime,
  Person,
  Edit
} from "@mui/icons-material";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  Checkbox
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { attendanceData } from "../../../../data/attendance-data";
import { employeesData } from "../../../../data/employees-data";
import EditAttendanceDialog from "./edit-attendance-dialog";
import ExportEmployeesAttendance from "./export-employees-attendance";

interface Data {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  totalHours: number | null;
  status: string;
}

function createAttendance(
  id: number,
  employeeId: number,
  employeeName: string,
  date: string,
  clockIn: string,
  clockOut: string | null,
  totalHours: number | null,
  status: string
): Data {
  return { id, employeeId, employeeName, date, clockIn, clockOut, totalHours, status };
}

let attendanceRows = [];
for (const attendance of attendanceData) {
  attendanceRows.push(
    createAttendance(
      attendance.id,
      attendance.employeeId,
      attendance.employeeName,
      attendance.date,
      attendance.clockIn,
      attendance.clockOut,
      attendance.totalHours,
      attendance.status,
    )
  );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "employeeName", numeric: false, disablePadding: false, label: "Employee" },
  { id: "date", numeric: false, disablePadding: false, label: "Date" },
  { id: "clockIn", numeric: false, disablePadding: false, label: "Clock In" },
  { id: "clockOut", numeric: false, disablePadding: false, label: "Clock Out" },
  { id: "totalHours", numeric: true, disablePadding: false, label: "Hours" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={props.numSelected > 0 && props.numSelected < props.rowCount}
            checked={props.rowCount > 0 && props.numSelected === props.rowCount}
            onChange={props.onSelectAllClick}
            inputProps={{
              'aria-label': 'select all employees',
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            className="font-semibold"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function Attendance() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("date");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Dayjs | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Data | undefined>();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = attendanceRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleEditAttendance = (attendance: Data) => {
    setSelectedAttendance(attendance);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedAttendance(undefined);
  };

  // Filter and search functionality
  const filteredRows = useMemo(() => {
    return attendanceRows.filter((row) => {
      const matchesSearch = row.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter) {
        const rowDate = dayjs(row.date);
        matchesDate = rowDate.isSame(dateFilter, 'month') && rowDate.isSame(dateFilter, 'year');
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchTerm, statusFilter, dateFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRecordsThisMonth = attendanceData.filter(record => {
      const recordDate = dayjs(record.date);
      const today = dayjs();
      return recordDate.isSame(today, 'month') && recordDate.isSame(today, 'year');
    }).length;
    
    const presentCountToday = attendanceData.filter(record => {
      const recordDate = dayjs(record.date);
      const today = dayjs();
      return recordDate.isSame(today, 'day') && record.status === "Present";
    }).length;
    const absentCountToday = attendanceData.filter(record => {
      const recordDate = dayjs(record.date);
      const today = dayjs();
      return recordDate.isSame(today, 'day') && record.status === "Absent";
    }).length;
    const lateCountToday = attendanceData.filter(record => {
      const recordDate = dayjs(record.date);
      const today = dayjs();
      return recordDate.isSame(today, 'day') && record.status === "Late";
    }).length;
    const remoteCountToday = attendanceData.filter(record => {
      const recordDate = dayjs(record.date);
      const today = dayjs();
      return recordDate.isSame(today, 'day') && record.status === "Remote";
    }).length;
    const totalHoursToday =  attendanceData.filter(record => {
      const recordDate = dayjs(record.date);
      const today = dayjs();
      return recordDate.isSame(today, 'day') && record.totalHours !== null;
    }).reduce((sum, record) => sum + (record.totalHours || 0), 0);

    return {
      totalRecordsThisMonth,
      presentCountToday,
      absentCountToday,
      lateCountToday,
      remoteCountToday,
      totalHoursToday
    };
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      filteredRows
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      case 'Remote': return 'info';
      case 'Half Day': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle fontSize="small" />;
      case 'Absent': return <Cancel fontSize="small" />;
      case 'Late': return <Warning fontSize="small" />;
      case 'Remote': return <AccessTime fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-500">Attendance Management</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage employee attendance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Records
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {stats.totalRecordsThisMonth}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Month
                </Typography>
              </div>
              <Person className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Present
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {stats.presentCountToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Time
                </Typography>
              </div>
              <CheckCircle className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Late
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-orange-600">
                  {stats.lateCountToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Delayed
                </Typography>
              </div>
              <Warning className="text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Hours
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-purple-600">
                  {stats.totalHoursToday.toFixed(1)}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Worked
                </Typography>
              </div>
              <TrendingUp className="text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <TextField
                label="Search employees"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <Search className="text-gray-400 mr-2" />,
                }}
                className="flex-1"
              />
              
              <FormControl size="small" className="min-w-32">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                  <MenuItem value="Late">Late</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Half Day">Half Day</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Filter by Month"
                  value={dateFilter}
                  views={['month', 'year']}
                  onChange={(newValue) => setDateFilter(newValue)}
                  slotProps={{
                    textField: {
                      size: "small",
                      className: "min-w-40"
                    }
                  }}
                />
              </LocalizationProvider>
            </div>

            <Button 
              variant="contained" 
              startIcon={<FilterList />}
              className="whitespace-nowrap"
              onClick={() => ExportEmployeesAttendance(filteredRows)}
            >
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <Typography variant="body2" color="text.secondary">
          Showing {visibleRows.length} of {filteredRows.length} attendance records
        </Typography>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={attendanceRows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell> */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            {row.employeeName.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" className="font-medium">
                            {row.employeeName}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(row.date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.clockIn}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.clockOut || '-'}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {row.totalHours ? `${row.totalHours}h` : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(row.status)}
                          label={row.status}
                          color={getStatusColor(row.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Tooltip title="Edit Attendance">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditAttendance(row)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {visibleRows.length === 0 && (
            <Box className="text-center py-8">
              <Typography variant="body1" color="text.secondary">
                No attendance records found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Attendance Dialog */}
      <EditAttendanceDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        attendance={selectedAttendance}
      />
    </div>
  );
}
