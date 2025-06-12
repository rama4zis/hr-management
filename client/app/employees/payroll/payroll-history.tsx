"use client"

import { 
  Search, 
  FilterList, 
  Download, 
  CalendarMonth,
  TrendingUp,
  TrendingDown,
  AttachMoney
} from "@mui/icons-material";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid
} from "@mui/material";
import React, { useState, useMemo } from "react";
import { payrollData } from "../../../data/payroll-data";

export default function PayrollHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Filter payroll data based on search and filters
  const filteredPayroll = useMemo(() => {
    return payrollData.filter(payroll => {
      const matchesSearch = payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payroll.payPeriod.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || payroll.status === statusFilter;
      
      const matchesPeriod = periodFilter === "all" || payroll.payPeriod.includes(periodFilter);
      
      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [searchTerm, statusFilter, periodFilter]);

  // Calculate statistics
  const totalPayrolls = payrollData.length;
  const totalPaid = payrollData.filter(p => p.status === "Paid").length;
  const totalGrossPay = payrollData.reduce((acc, p) => acc + p.baseSalary + p.overtimePay + p.bonus, 0);
  const totalNetPay = payrollData.reduce((acc, p) => acc + p.netPay, 0);
  const totalDeductions = payrollData.reduce((acc, p) => acc + p.deductions, 0);

  // Get unique periods for filter
  const uniquePeriods = [...new Set(payrollData.map(p => p.payPeriod.split(" ")[2]))]; // Extract year

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Processed': return 'info';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll History</h1>
        <p className="text-sm text-gray-500 mt-1">View and analyze historical payroll data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Payrolls
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {totalPayrolls}
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
                  Total Paid
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {totalPaid}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed Payments
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
                  Total Gross Pay
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {formatCurrency(totalGrossPay)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Before Deductions
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
                  Total Net Pay
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {formatCurrency(totalNetPay)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  After Deductions
                </Typography>
              </div>
              <TrendingDown className="text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <TextField
              label="Search employees or periods"
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
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processed">Processed</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" className="min-w-32">
              <InputLabel>Period</InputLabel>
              <Select
                value={periodFilter}
                label="Period"
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <MenuItem value="all">All Periods</MenuItem>
                {uniquePeriods.map(period => (
                  <MenuItem key={period} value={period}>{period}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button 
              variant="contained" 
              startIcon={<Download />}
              onClick={() => window.print()}
            >
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <Typography variant="body2" color="text.secondary">
          Showing {filteredPayroll.length} of {totalPayrolls} payroll records
        </Typography>
      </div>

      {/* Payroll History Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold">Employee</TableCell>
                  <TableCell className="font-semibold">Pay Period</TableCell>
                  <TableCell className="font-semibold">Base Salary</TableCell>
                  <TableCell className="font-semibold">Overtime</TableCell>
                  <TableCell className="font-semibold">Bonus</TableCell>
                  <TableCell className="font-semibold">Net Pay</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Pay Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayroll.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{payroll.employeeName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{payroll.payPeriod}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">${payroll.baseSalary.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">${payroll.overtimePay.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">${payroll.bonus.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-green-600">${payroll.netPay.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={payroll.status} 
                        color={getStatusColor(payroll.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {new Date(payroll.payDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredPayroll.length === 0 && (
            <Box className="text-center py-8">
              <Typography variant="body1" color="text.secondary">
                No payroll records found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Financial Summary
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Gross Pay:</span>
                <span className="font-medium">{formatCurrency(totalGrossPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Deductions:</span>
                <span className="font-medium text-red-600">{formatCurrency(totalDeductions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Net Pay:</span>
                <span className="font-medium text-green-600">{formatCurrency(totalNetPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Net Pay:</span>
                <span className="font-medium">{formatCurrency(totalNetPay / totalPayrolls)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Status Distribution
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Paid:</span>
                <span className="font-medium text-green-600">{totalPaid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="font-medium text-yellow-600">
                  {payrollData.filter(p => p.status === "Pending").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Processing:</span>
                <span className="font-medium text-blue-600">
                  {payrollData.filter(p => p.status === "Processed").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate:</span>
                <span className="font-medium text-green-600">
                  {((totalPaid / totalPayrolls) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 