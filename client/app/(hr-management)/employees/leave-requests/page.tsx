"use client";

import { 
  DeviceThermostat, 
  SelfImprovement, 
  Add, 
  Search, 
  FilterList,
  CheckCircle,
  Warning,
  Cancel,
  TrendingUp,
  CalendarMonth,
  AccessTime,
  Edit
} from "@mui/icons-material";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import React, { useState, useMemo } from "react";
import { leaveRequestsData } from "../../../../data/leave-requests-data";
import { employeesData } from "../../../../data/employees-data";

export default function LeaveRequest() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");

  // Filter and search functionality
  const filteredLeaveRequests = useMemo(() => {
    return leaveRequestsData.filter((request) => {
      const matchesSearch = 
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      const matchesLeaveType = leaveTypeFilter === "all" || request.leaveType === leaveTypeFilter;
      
      return matchesSearch && matchesStatus && matchesLeaveType;
    });
  }, [searchTerm, statusFilter, leaveTypeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRequests = leaveRequestsData.length;
    const approvedRequests = leaveRequestsData.filter(req => req.status === "Approved").length;
    const pendingRequests = leaveRequestsData.filter(req => req.status === "Pending").length;
    const rejectedRequests = leaveRequestsData.filter(req => req.status === "Rejected").length;

    return {
      totalRequests,
      approvedRequests,
      pendingRequests,
      rejectedRequests
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle fontSize="small" />;
      case 'Pending': return <Warning fontSize="small" />;
      case 'Rejected': return <Cancel fontSize="small" />;
      default: return <CalendarMonth fontSize="small" />;
    }
  };

  const getLeaveTypeIcon = (leaveType: string) => {
    switch (leaveType) {
      case 'Sick': return <DeviceThermostat />;
      case 'Personal': return <SelfImprovement />;
      case 'Vacation': return <CalendarMonth />;
      default: return <AccessTime />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Manage employee leave requests and approvals</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Requests
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {stats.totalRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All Time
                </Typography>
              </div>
              <CalendarMonth className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Approved
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {stats.approvedRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accepted
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
                  Pending
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-orange-600">
                  {stats.pendingRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Awaiting Review
                </Typography>
              </div>
              <Warning className="text-orange-500" />
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
                label="Search requests"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" className="min-w-32">
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={leaveTypeFilter}
                  label="Leave Type"
                  onChange={(e) => setLeaveTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Sick">Sick</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Vacation">Vacation</MenuItem>
                  <MenuItem value="Maternity">Maternity</MenuItem>
                  <MenuItem value="Paternity">Paternity</MenuItem>
                  <MenuItem value="Bereavement">Bereavement</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Button 
              variant="contained" 
              startIcon={<Add />}
              className="whitespace-nowrap"
            >
              Apply Leave
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <Typography variant="body2" color="text.secondary">
          Showing {filteredLeaveRequests.length} of {leaveRequestsData.length} leave requests
        </Typography>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold">Employee</TableCell>
                  <TableCell className="font-semibold">Leave Type</TableCell>
                  <TableCell className="font-semibold">Start Date</TableCell>
                  <TableCell className="font-semibold">End Date</TableCell>
                  <TableCell className="font-semibold">Days</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {request.employeeName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-2`}>
                        {/* {getLeaveTypeIcon(request.leaveType)} */}
                        <Typography variant="body2" className={` ${request.leaveType == 'Vacation' ? 'bg-blue-500' : request.leaveType == 'Sick' ? 'bg-red-500' : request.leaveType == 'Personal' ? 'bg-yellow-500' : 'bg-gray-500'} text-white text-xs font-semibold mr-2 px-2.5 py-0.5} rounded-md px-2 py-1`}>
                          {request.leaveType}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(request.startDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(request.endDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {request.totalDays} days
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(request.status)}
                        label={request.status}
                        color={getStatusColor(request.status) as any}
                        size="small"
                        variant="outlined"
                        
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {request.status === "Pending" && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton size="small" color="success">
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton size="small" color="error">
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="View Details">
                          <IconButton size="small">
                            <FilterList />
                          </IconButton>
                        </Tooltip> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredLeaveRequests.length === 0 && (
            <Box className="text-center py-8">
              <Typography variant="body1" color="text.secondary">
                No leave requests found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
