"use client"

import {
  AttachMoney,
  Download,
  CheckCircle,
  Warning,
  Schedule,
  Person,
  TrendingUp,
  Payment,
  Search,
  Visibility,
  Close,
  Email,
  Print,
  CalendarToday,
  Receipt
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
  Alert,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Grid,
  Avatar
} from "@mui/material";
import React, { useState, useMemo } from "react";
import { payrollData } from "../../../../data/payroll-data";
import { employeesData } from "../../../../data/employees-data";

export default function CurrentPayroll() {
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  // Filter current month payroll (June 2025)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // June = 6
  const currentYear = currentDate.getFullYear(); // 2025
  const currentMonthString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  
  const currentMonthPayroll = payrollData.filter(pay => 
    pay.payPeriod.includes(currentMonthString)
  );

  // Calculate statistics
  const totalEmployees = employeesData.filter(emp => emp.status === "Active").length;
  const processedPayroll = currentMonthPayroll.filter(pay => pay.status === "Paid").length;
  const pendingPayroll = currentMonthPayroll.filter(pay => pay.status === "Pending").length;
  const processingPayroll = currentMonthPayroll.filter(pay => pay.status === "Processed").length;

  const grossPay = currentMonthPayroll.reduce((acc, pay) => acc + pay.baseSalary + pay.overtimePay + pay.bonus, 0);
  const netPay = currentMonthPayroll.reduce((acc, pay) => acc + pay.netPay, 0);
  const totalDeductions = currentMonthPayroll.reduce((acc, pay) => acc + pay.deductions, 0);

  // Filter data
  const filteredPayroll = useMemo(() => {
    return currentMonthPayroll.filter(payroll => {
      const matchesSearch = payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payroll.payPeriod.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payroll.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [currentMonthPayroll, searchTerm, statusFilter]);

  const handleProcessPayroll = () => {
    setProcessingStatus('processing');
    // Simulate processing
    setTimeout(() => {
      setProcessingStatus('completed');
    }, 3000);
  };

  const handleViewDetails = (payroll: any) => {
    setSelectedPayroll(payroll);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedPayroll(null);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Current Payroll - June 2025</h1>
        <p className="text-sm text-gray-500 mt-1">Manage current month payroll processing</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-blue-600">
                  {totalEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Staff
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
                  Ready to Pay
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
                  Awaiting Review
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
                  Total Payout
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {formatCurrency(netPay)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Net Amount
                </Typography>
              </div>
              <AttachMoney className="text-green-500" />
            </div>
          </CardContent>
        </Card>
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

            <Button
              variant="contained"
              startIcon={<Download />}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AttachMoney />}

            >
              PROCESS PAYROLL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <Typography variant="body2" color="text.secondary">
          Showing {filteredPayroll.length} of {currentMonthPayroll.length} payroll records
        </Typography>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-semibold text-gray-700">Employee</TableCell>
                  <TableCell className="font-semibold text-gray-700">Pay Period</TableCell>
                  <TableCell className="font-semibold text-gray-700">Base Salary</TableCell>
                  <TableCell className="font-semibold text-gray-700">Overtime</TableCell>
                  <TableCell className="font-semibold text-gray-700">Bonus</TableCell>
                  <TableCell className="font-semibold text-gray-700">Deductions</TableCell>
                  <TableCell className="font-semibold text-gray-700">Net Pay</TableCell>
                  <TableCell className="font-semibold text-gray-700">Status</TableCell>
                  <TableCell className="font-semibold text-gray-700">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayroll.map((payroll) => (
                  <TableRow
                    key={payroll.id}
                    hover
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => handleViewDetails(payroll)}
                  >
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{payroll.employeeName}</div>
                      <div className="text-xs text-gray-500">ID: {payroll.employeeId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{payroll.payPeriod}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(payroll.payDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatCurrency(payroll.baseSalary)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatCurrency(payroll.overtimePay)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatCurrency(payroll.bonus)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-red-600 font-medium">-{formatCurrency(payroll.deductions)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-green-600">{formatCurrency(payroll.netPay)}</div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(payroll.status)}
                        label={payroll.status}
                        color={getStatusColor(payroll.status) as any}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(payroll);
                        }}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        View
                      </Button>
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

      {/* Simplified Payroll Detail Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Payroll Details</Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedPayroll && (
            <div className="space-y-4">
              {/* Employee Info */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                  {selectedPayroll.employeeName.charAt(0)}
                </Avatar>
                <div>
                  <Typography variant="h6" className="text-blue-900">
                    {selectedPayroll.employeeName}
                  </Typography>
                  <Typography variant="body2" className="text-blue-700">
                    ID: {selectedPayroll.employeeId} • {selectedPayroll.payPeriod}
                  </Typography>
                </div>
              </div>

              {/* Pay Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Salary:</span>
                  <span className="font-medium">{formatCurrency(selectedPayroll.baseSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime:</span>
                  <span className="font-medium">{formatCurrency(selectedPayroll.overtimePay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus:</span>
                  <span className="font-medium">{formatCurrency(selectedPayroll.bonus)}</span>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <span className="text-gray-600">Deductions:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions)}</span>
                </div>
                <Divider />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Net Pay:</span>
                  <span className="font-bold text-green-600">{formatCurrency(selectedPayroll.netPay)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                <Chip
                  icon={getStatusIcon(selectedPayroll.status)}
                  label={selectedPayroll.status}
                  color={getStatusColor(selectedPayroll.status) as any}
                  size="medium"
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseModal} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={() => {
              console.log('Print payslip for:', selectedPayroll?.employeeName);
              handleCloseModal();
            }}
          >
            Print Payslip
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
} 