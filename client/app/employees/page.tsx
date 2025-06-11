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
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Image from "next/image";
import React from "react";
import AddEmployeeDialog from "./add-employee-dialog";
import { MoreHoriz } from "@mui/icons-material";
import ViewEmployeeDetail from "./view-employee-dialog";
import EditEmployeeDialog from "./edit-employee-dialog";

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

const employeesData = [
  {
    id: 1,
    picture: "/profile.jpg",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    position: "Software Engineer",
    department: "IT",
    salary: 60000,
    hireDate: "2023-01-15",
    status: "Active",
  },
  {
    id: 2,
    picture: "/profile.jpg",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    position: "Project Manager",
    department: "Management",
    salary: 75000,
    hireDate: "2023-02-01",
    status: "Active",
  },
  {
    id: 3,
    picture: "/profile.jpg",
    name: "Peter Jones",
    email: "peter.jones@example.com",
    phone: "555-123-4567",
    position: "HR Specialist",
    department: "Human Resources",
    salary: 55000,
    hireDate: "2023-03-10",
    status: "Inactive",
  },
];

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
      <TableRow>
        <TableCell>Picture</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
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
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function Employees() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Employee>("name");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const [openDetails, setOpenDetails] = React.useState(false);
  const handleOpenDetails = () =>  setOpenDetails(true);
  const handleCloseDetails = () => setOpenDetails(false);

  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpenEdit = () =>  setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);


  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

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
    setPage(newPage - 1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      rows
        .filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, searchTerm]
  );

  return (
    <div className="mx-8 my-4">
      
      <AddEmployeeDialog open={isDialogOpen} onClose={handleDialogClose} />
      <div className="flex justify-end items-center">
        <button
          onClick={handleDialogOpen}
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-4 transition duration-300 ease-in-out"
        >
          Add Employee
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-center items-center">
        <input
          className="p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-1/2 my-4 transition duration-300 ease-in-out"
          type="text"
          placeholder="Search employees"
          value={searchTerm}
          onChange={handleSearch}
          // sx={{ m: 2 }}
        />
      </div>

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer className="p-4">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
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
                      hover
                      // onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      // sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        align="center"
                      >
                        <Image
                          src={row.picture}
                          alt="Profile
                          picture"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.phone}</TableCell>
                      <TableCell align="left">{row.position}</TableCell>
                      <TableCell align="left">{row.department}</TableCell>
                      <TableCell align="right">{row.salary}</TableCell>
                      <TableCell align="left">{row.hireDate}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="center">
                        
                        <Select
                          value=""
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          size="small"
                          variant="standard"
                          disableUnderline
                          IconComponent={MoreHoriz}
                          sx={{
                            "& .MuiSelect-icon": {
                              color: "gray",
                            },
                          }}
                        
                        >
                          {/* <MenuItem value="">
                            <em>Actions</em>
                          </MenuItem> */}
                          
                          <MenuItem value="view" onClick={handleOpenDetails}>View Details</MenuItem>
                          <MenuItem value="edit" onClick={handleOpenEdit}>Edit Employee</MenuItem>
                          {/* <MenuItem value="delete">Delete</MenuItem> */}
                          
                        </Select>
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
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="flex justify-center items-center">
            <Stack spacing={2} sx={{ p: 2 }}>
              <Pagination
                count={Math.ceil(
                  rows.filter((row) =>
                    Object.values(row).some((value) =>
                      String(value)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                  ).length / rowsPerPage
                )}
                page={page + 1}
                onChange={handleChangePage}
                color="primary"
              />
            </Stack>
          </div>
        </Paper>
      </Box>
      <ViewEmployeeDetail open={openDetails} onClose={handleCloseDetails} />
      <EditEmployeeDialog open={openEdit} onClose={handleCloseEdit} />
    </div>
  );
}
