import { DeviceThermostat, SelfImprovement } from "@mui/icons-material";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";

export default function LeaveRequest() {

    const leaveData = [
        {
            no: 1,
            employeeName: "John Doe",
            leaveType: "Sick Leave",
            fromDate: "2024-07-20",
            toDate: "2024-07-22",
            reason: "Fever",
            status: "Pending"
        },
        {
            no: 2,
            employeeName: "Jane Smith",
            leaveType: "Casual Leave",
            fromDate: "2024-08-01",
            toDate: "2024-08-01",
            reason: "Personal",
            status: "Approved"
        },
        {
            no: 3,
            employeeName: "Peter Jones",
            leaveType: "Compensatory Leave",
            fromDate: "2024-08-15",
            toDate: "2024-08-16",
            reason: "Worked overtime",
            status: "Rejected"
        }
        
    ]

  return (
    <React.Fragment>
      <Container>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                focus:outline-none focus:shadow-outline"
          >
            Apply Leave
          </button>
        </div>

        {/* Status List */}
        {/* <div className="flex gap-4 my-4">
            <div className="border border-gray-300 rounded-md p-4 w-1/4">
                <div className="flex justify-between">
                    <span>Sick Leaves</span>
                    <DeviceThermostat />
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                    <span>Remaining</span>
                    <span>10</span>
                </div>
            </div>
            <div className="border border-gray-300 rounded-md p-4 w-1/4">
                <div className="flex justify-between">
                    <span>Casual Leaves</span>
                    <SelfImprovement />
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                    <span>Remaining</span>
                    <span>10</span>
                </div>
            </div>
            <div className="border border-gray-300 rounded-md p-4 w-1/4">
                <div className="flex justify-between">
                    <span>Compensatory Leaves</span>
                    <DeviceThermostat />
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                    <span>Remaining</span>
                    <span>10</span>
                </div>
                
            </div>
        </div> */}

        {/* Table Request List */}
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Employee Name</TableCell>
                        <TableCell>Leave Type</TableCell>
                        <TableCell>From Date</TableCell>
                        <TableCell>To Date</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {leaveData.map((data) => (
                        <TableRow key={data.no}>                            <TableCell>{data.no}</TableCell>
                            <TableCell>{data.employeeName}</TableCell>
                            <TableCell>{data.leaveType}</TableCell>
                            <TableCell>{data.fromDate}</TableCell>
                            <TableCell>{data.toDate}</TableCell>
                            <TableCell>{data.reason}</TableCell>
                            <TableCell><span className={`px-2 py-1 rounded-full text-xs ${
                                data.status === 'Approved' ? 'bg-green-200 text-green-800' :
                                data.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                                data.status === 'Rejected' ? 'bg-red-200 text-red-800' : ''
                            }`}>{data.status}</span></TableCell>
                            <TableCell>
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                            </TableCell>
                        </TableRow>
                    ))}
                    
                </TableBody>
            </Table>
        </TableContainer>
      </Container>
    </React.Fragment>
  );
}
