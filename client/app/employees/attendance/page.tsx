"use client";

import { Description } from "@mui/icons-material";
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
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Image from "next/image";
import React, { useEffect } from "react";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface Attendance {
  id: number;
  picture: string;
  name: string;
  departement: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: string;
}

function createAttendance(
  id: number,
  picture: string,
  name: string,
  departement: string,
  date: string,
  timeIn: string,
  timeOut: string,
  status: string
): Attendance {
  return { id, picture, name, departement, date, timeIn, timeOut, status };
}

const attendanceData = [
  {
    id: 1,
    picture: "/profile.jpg",
    name: "John Doe",
    departement: "IT",
    date: "2023-10-27",
    timeIn: "08:00",
    timeOut: "17:00",
    status: "Present",
  },
  {
    id: 2,
    picture: "/profile.jpg",
    name: "Jane Smith",
    departement: "HR",
    date: "2023-10-27",
    timeIn: "08:30",
    timeOut: "17:30",
    status: "Present",
  },
  {
    id: 3,
    picture: "/profile.jpg",
    name: "Peter Jones",
    departement: "IT",
    date: "2023-10-27",
    timeIn: "09:00",
    timeOut: "18:00",
    status: "Late",
  },
];

let attendanceRows = [];
for (const attendance of attendanceData) {
  attendanceRows.push(
    createAttendance(
      attendance.id,
      attendance.picture,
      attendance.name,
      attendance.departement,
      attendance.date,
      attendance.timeIn,
      attendance.timeOut,
      attendance.status
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
  id: keyof Attendance;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "picture", numeric: false, disablePadding: true, label: "Picture" },
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  {
    id: "departement",
    numeric: false,
    disablePadding: false,
    label: "Departement",
  },
  { id: "date", numeric: false, disablePadding: false, label: "Date" },
  { id: "timeIn", numeric: false, disablePadding: false, label: "Time In" },
  { id: "timeOut", numeric: false, disablePadding: false, label: "Time Out" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Attendance
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Attendance) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead>
      <TableRow>
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
      </TableRow>
    </TableHead>
  );
}

export default function attendance() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Attendance>("name");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateValue, setDateValue] = React.useState<Date | null>(null);
  const [departement, setDepartement] = useState("");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Attendance
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
    console.log(searchTerm);
    console.log("searchTerm");
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - attendanceRows.length)
      : 0;

  const visibleRows = React.useMemo(
    () =>
      attendanceRows
        .filter((row) => {
          const matchesSearch = Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
          const matchesDepartement = departement
            ? row.departement === departement
            : true;
          const matchesDate = dateValue
            ? dayjs(row.date).isSame(dayjs(dateValue), "day")
            : true;
          return matchesSearch && matchesDepartement && matchesDate;
        })
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, searchTerm, departement, dateValue]

    // () =>
    //   attendanceRows
    //     .filter((row) =>
    //       Object.values(row).some((value) =>
    //         String(value).toLowerCase().includes(searchTerm.toLowerCase())
    //       )
    //     )
    //     .sort(getComparator(order, orderBy))
    //     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    // [order, orderBy, page, rowsPerPage, searchTerm]
  );
  const handleChange = (event: SelectChangeEvent) => {
    setDepartement(event.target.value as string);
  };
  return (
    <Container className="">
      {/* Heading */}
      <div className="flex justify-items-center gap-2">
        <Description />
        <span className="heading text-xl font-bold ml-2">
          Attendance History
        </span>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="flex justify-start items-center gap-4">
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Departement</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={departement}
              label="Departement"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"IT"}>IT</MenuItem>
              <MenuItem value={"HR"}>HR</MenuItem>
              <MenuItem value={"MARKETING"}>Marketing</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Basic date picker"
              onChange={(newValue: Dayjs) => {
                setDateValue(newValue?.toDate());
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </LocalizationProvider>
          {/* Button Show all */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setDepartement("");
              setDateValue(null);
            }}
          >
            Show All
          </button>
        </div>
        <input
          type="text"
          placeholder="Search attendance"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* table */}
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer className="p-4">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
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
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="left">
                        <Image
                          src={row.picture}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.departement}</TableCell>
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell align="left">{row.timeIn}</TableCell>
                      <TableCell align="left">{row.timeOut}</TableCell>
                      <TableCell align="left">
                        <div
                          className={`p-2 w-[60%] rounded-full text-center ${
                            row.status === "Present"
                              ? "bg-green-200 text-green-600"
                              : "bg-red-200 text-red-600"
                          }`}
                        >
                          {row.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={attendanceRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Container>
  );
}
