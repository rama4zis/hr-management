import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function AddEmployeeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              console.log(email);
              onClose();
            },
          },
        }}
        className="border-2 border-gray-300 rounded-md"
        
      >
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details of the new employee. Click save when you're done.
          </DialogContentText>
          <form method="post" encType="multipart/form-data">
            <div className="grid grid-cols-2 gap-4 items-center mt-4">
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
              />
              <TextField
                required
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
              />
              <TextField
                required
                margin="dense"
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                fullWidth
                variant="outlined"
              />
              <TextField
                required
                margin="dense"
                id="position"
                name="position"
                label="Position"
                type="text"
                fullWidth
                variant="outlined"
              />
              <FormControl>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  required
                  id="department"
                  name="department"
                  label="Department"
                  label-id="department-label"
                  fullWidth
                  variant="outlined"
                >
                  {/* Add MenuItem components for department options */}
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                  <MenuItem value="Human Resources">Human Resources</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>

              <TextField
                required
                margin="dense"
                id="salary"
                name="salary"
                label="Salary"
                type="number"
                fullWidth
                variant="outlined"
              />
              <TextField
                required
                margin="dense"
                id="hireDate"
                name="hireDate"
                label="Hire Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  required
                  id="status"
                  name="status"
                  label="Status"
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              {/* Attachment for image */}
              <FormControl>
                <span className="block text-sm font-medium text-gray-200">
                  Upload Image
                </span>
                <Input
                  type="file"
                  id="picture"
                  name="picture"
                  inputProps={{ accept: "image/*" }}
                />
              </FormControl>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
