import {
  Container,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Image from "next/image";

export default function employees() {
  return (
    <Container>
      {/* Search Employee */}
      <div className="flex items-center justify-center mb-8">
        <input
          type="text"
          className="w-full max-w-md p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder="Search Employee"
        />
      </div>
      {/* Table Employee List */}
      <div className="mt-4">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Picture</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Phone</TableCell>
                <TableCell align="right">Position</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Actions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Image
                    src="/profile.jpg"
                    alt="Picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  John Doe
                </TableCell>
                <TableCell align="right">john.doe@example.com</TableCell>
                <TableCell align="right">123-456-7890</TableCell>
                <TableCell align="right">Software Engineer</TableCell>
                <TableCell align="right">IT</TableCell>
                <TableCell align="right">Edit</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Image
                    src="/profile.jpg"
                    alt="Picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  Jane Smith
                </TableCell>
                <TableCell align="right">jane.smith@example.com</TableCell>
                <TableCell align="right">987-654-3210</TableCell>
                <TableCell align="right">Project Manager</TableCell>
                <TableCell align="right">Management</TableCell>
                <TableCell align="right">Edit</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Image
                    src="/profile.jpg"
                    alt="Picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  Peter Jones
                </TableCell>
                <TableCell align="right">peter.jones@example.com</TableCell>
                <TableCell align="right">555-123-4567</TableCell>
                <TableCell align="right">HR Specialist</TableCell>
                <TableCell align="right">Human Resources</TableCell>
                <TableCell align="right">Edit</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* Add Employee Button */}
    </Container>
  );
}
