import { MoreHoriz } from "@mui/icons-material";
import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";

export default function PayrollTable() {
  return (
    <React.Fragment>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Gross Pay</TableCell>
                        <TableCell>Deductions</TableCell>
                        <TableCell>Net Pay</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>IT</TableCell>
                        <TableCell>$1000</TableCell>
                        <TableCell>$100</TableCell>
                        <TableCell>$900</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>
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
                                <MenuItem value="view">View pay stub</MenuItem>
                                <MenuItem value="edit">Process payroll</MenuItem>
                                {/* <MenuItem value="delete">Delete</MenuItem> */}
                            </Select>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </React.Fragment>
  );
}