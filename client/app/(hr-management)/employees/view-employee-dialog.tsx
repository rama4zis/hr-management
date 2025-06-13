import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import Image from "next/image";
import React from "react";

export default function ViewEmployeeDetail({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const employee = {
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
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
      >
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent
          dividers
          sx={{
            "& .MuiDialogContent-root": {
              padding: 2,
            },
            "& .MuiDialogActions-root": {
              padding: 1,
            },
          }}
          style={{
            overflow: "hidden",
          }}
        >
          <DialogContentText>
            Detailed information about {employee.name}
          </DialogContentText>
          <div className="flex items-center gap-4 my-4">
            <Image
              src={employee.picture}
              alt="Profile picture"
              width={100}
              height={100}
              className="rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">{employee.name}</h3>
              <p className="text-gray-500 text-sm">{employee.position}</p>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  employee.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {employee.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p>{employee.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Department</h4>
              <p>{employee.department}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Salary</h4>
              <p>${employee.salary.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Hire Date</h4>
              <p>{employee.hireDate}</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Additional Information
            </h4>
            <div className="rounded-md bg-gray-700 p-4">
              <p className="text-sm">
                Employee ID: {employee.id}
                <br />
                Employee Phone: {employee.phone}
                <br />
                Time with company:{" "}
                {Math.floor(
                  (new Date().getTime() -
                    new Date(employee.hireDate).getTime()) /
                    (1000 * 60 * 60 * 24 * 30.44)
                )} months
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
