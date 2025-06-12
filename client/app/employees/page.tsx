"use client";

import {
  Backdrop,
  Box,
  Button,
  ClickAwayListener,
  Container,
  Fade,
  Input,
  MenuItem,
  Modal,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  TextField,
  Grid
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import AddEmployeeDialog from "./add-employee-dialog";
import { 
  MoreHoriz, 
  Search, 
  FilterList, 
  Add, 
  People, 
  TrendingUp, 
  AttachMoney,
  Apartment
} from "@mui/icons-material";
import ViewEmployeeDetail from "./view-employee-dialog";
import EditEmployeeDialog from "./edit-employee-dialog";
import { employeesData } from "../../data/employees-data";
import { departmentsData } from "../../data/departments-data";
import { performanceData } from "../../data/performance-data";

interface Employee {
  id: number;
  picture: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: string;
}

function createData(
  id: number,
  picture: string,
  name: string,
  email: string,
  phone: string,
  position: string,
  department: string,
  salary: number,
  hireDate: string,
  status: string
): Employee {
  return {
    id,
    picture,
    name,
    email,
    phone,
    position,
    department,
    salary,
    hireDate,
    status,
  };
}

let rows = [];
for (const employee of employeesData) {
  rows.push(
    createData(
      employee.id,
      employee.picture,
      employee.name,
      employee.email,
      employee.phone,
      employee.position,
      employee.department,
      employee.salary,
      employee.hireDate,
      employee.status
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
  id: keyof Employee;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: "Phone",
  },
  {
    id: "position",
    numeric: false,
    disablePadding: false,
    label: "Position",
  },
  {
    id: "department",
    numeric: false,
    disablePadding: false,
    label: "Department",
  },
  {
    id: "salary",
    numeric: true,
    disablePadding: false,
    label: "Salary",
  },
  {
    id: "hireDate",
    numeric: false,
    disablePadding: false,
    label: "Hire Date",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Employee
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Employee) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead>
      <TableRow className="bg-gray-900">
        <TableCell>Picture</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            className="font-semibold text-gray-700"
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

export default function Employees() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Employee>("name");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleOpenDetails = () => setOpenDetails(true);
  const handleCloseDetails = () => setOpenDetails(false);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Employee
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Filter and search functionality
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === "all" || row.department === departmentFilter;
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, departmentFilter, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEmployees = employeesData.length;
    const activeEmployees = employeesData.filter(emp => emp.status === "Active").length;
    const totalSalary = employeesData.reduce((acc, emp) => acc + emp.salary, 0);
    const avgSalary = totalSalary / totalEmployees;
    const departments = departmentsData.length;

    return {
      totalEmployees,
      activeEmployees,
      totalSalary,
      avgSalary,
      departments
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your organization's employees and their information</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {stats.totalEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All Staff
                </Typography>
              </div>
              <People className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Active Employees
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {stats.activeEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently Working
                </Typography>
              </div>
              <TrendingUp className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Average Salary
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {formatCurrency(stats.avgSalary)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Per Employee
                </Typography>
              </div>
              <AttachMoney className="text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Departments
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {stats.departments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Teams
                </Typography>
              </div>
              <Apartment className="text-purple-500" />
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
              
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                size="small"
                className="min-w-32"
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departmentsData.map((dept) => (
                  <MenuItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
                className="min-w-32"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </div>

            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={handleDialogOpen}
              className="whitespace-nowrap"
            >
              Add Employee
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <Typography variant="body2" color="text.secondary">
          Showing {filteredRows.length} of {rows.length} employees
        </Typography>
      </div>

      {/* Employee Table */}
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
                rowCount={rows.length}
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
                      <TableCell>
                        <Avatar src={row.picture} alt={row.name}>
                          {row.name.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <Typography variant="body2" className="font-medium">
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.position}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.department}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" className="font-medium">
                          {formatCurrency(row.salary)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(row.hireDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          color={getStatusColor(row.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={handleOpenDetails}>
                              <MoreHoriz />
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
                    <TableCell colSpan={10} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {visibleRows.length === 0 && (
            <Box className="text-center py-8">
              <Typography variant="body1" color="text.secondary">
                No employees found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <Box className="flex justify-between items-center mt-4">
        <Typography variant="body2" color="text.secondary">
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} results
        </Typography>
        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page + 1}
          onChange={(e, newPage) => handleChangePage(e, newPage - 1)}
          color="primary"
        />
      </Box>

      {/* Dialogs */}
      <AddEmployeeDialog open={isDialogOpen} onClose={handleDialogClose} />
      <ViewEmployeeDetail open={openDetails} onClose={handleCloseDetails} />
      <EditEmployeeDialog open={openEdit} onClose={handleCloseEdit} />
    </div>
  );
}
