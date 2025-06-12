"use client"

import { 
  AttachMoney, 
  Download, 
  CheckCircle, 
  Warning, 
  Schedule,
  Person,
  TrendingUp,
  Payment
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
  Box,
  LinearProgress,
  Alert
} from "@mui/material";
import React, { useState } from "react";
import { payrollData } from "../../../data/payroll-data";
import { employeesData } from "../../../data/employees-data";

export default function CurrentPayroll() {
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed'>('idle');

  // Filter current month payroll
  const currentMonthPayroll = payrollData.filter(pay => pay.payPeriod.includes("2024-01"));
  
  // Calculate statistics
  const totalEmployees = employeesData.filter(emp => emp.status === "Active").length;
  const processedPayroll = currentMonthPayroll.filter(pay => pay.status === "Paid").length;
  const pendingPayroll = currentMonthPayroll.filter(pay => pay.status === "Pending").length;
  const processingPayroll = currentMonthPayroll.filter(pay => pay.status === "Processed").length;
  
  const grossPay = currentMonthPayroll.reduce((acc, pay) => acc + pay.baseSalary + pay.overtimePay + pay.bonus, 0);
  const netPay = currentMonthPayroll.reduce((acc, pay) => acc + pay.netPay, 0);
  const totalDeductions = currentMonthPayroll.reduce((acc, pay) => acc + pay.deductions, 0);

  const handleProcessPayroll = () => {
    setProcessingStatus('processing');
    // Simulate processing
    setTimeout(() => {
      setProcessingStatus('completed');
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Processed': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle fontSize="small" />;
      case 'Pending': return <Schedule fontSize="small" />;
      case 'Processed': return <Payment fontSize="small" />;
      default: return <Warning fontSize="small" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Current Payroll</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and process current payroll period</p>
      </div>

      {/* Processing Status */}
      {processingStatus === 'processing' && (
        <Alert severity="info" className="mb-4">
          <Typography variant="body2">
            Processing payroll... Please wait.
          </Typography>
          <LinearProgress className="mt-2" />
        </Alert>
      )}

      {processingStatus === 'completed' && (
        <Alert severity="success" className="mb-4">
          <Typography variant="body2">
            Payroll processing completed successfully!
          </Typography>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {totalEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Current Period
                </Typography>
              </div>
              <Person className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Processed
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {processedPayroll}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Payments Completed
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
                  {pendingPayroll}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Awaiting Processing
                </Typography>
              </div>
              <Schedule className="text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Net Pay
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  ${netPay.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Disbursed
                </Typography>
              </div>
              <TrendingUp className="text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Typography variant="h6" component="div">
            Payroll Period: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentMonthPayroll.length} employees in current payroll
          </Typography>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outlined" 
            startIcon={<Download />}
            onClick={() => window.print()}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Payment />}
            onClick={handleProcessPayroll}
            disabled={processingStatus === 'processing'}
          >
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Payroll Details Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" className="mb-4">
            Payroll Details
          </Typography>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold">Employee</TableCell>
                  <TableCell className="font-semibold">Pay Period</TableCell>
                  <TableCell className="font-semibold">Base Salary</TableCell>
                  <TableCell className="font-semibold">Overtime</TableCell>
                  <TableCell className="font-semibold">Bonus</TableCell>
                  <TableCell className="font-semibold">Deductions</TableCell>
                  <TableCell className="font-semibold">Net Pay</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentMonthPayroll.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <Typography variant="body2" className="font-medium">
                        {payroll.employeeName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payroll.payPeriod}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${payroll.baseSalary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${payroll.overtimePay.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${payroll.bonus.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error">
                        -${payroll.deductions.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="font-semibold text-green-600">
                        ${payroll.netPay.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(payroll.status)}
                        label={payroll.status}
                        color={getStatusColor(payroll.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-2">
              Payroll Summary
            </Typography>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gross Pay:</span>
                <span className="font-medium">${grossPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Deductions:</span>
                <span className="font-medium text-red-600">${totalDeductions.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Net Pay:</span>
                  <span className="text-green-600">${netPay.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-2">
              Processing Status
            </Typography>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed:</span>
                <span className="font-medium text-green-600">{processedPayroll}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Processing:</span>
                <span className="font-medium text-blue-600">{processingPayroll}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="font-medium text-orange-600">{pendingPayroll}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-2">
              Quick Actions
            </Typography>
            <div className="space-y-2">
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth 
                startIcon={<Download />}
              >
                Export Report
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth 
                startIcon={<AttachMoney />}
              >
                Generate Payslips
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth 
                startIcon={<Payment />}
              >
                Send Payments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 