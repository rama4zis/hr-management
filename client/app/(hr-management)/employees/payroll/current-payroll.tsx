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
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <Typography variant="h4" component="h1" className="font-bold text-gray-900">
              Current Payroll
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mt-1">
              Manage and process current payroll period
            </Typography>
          </div>
          <div className="flex gap-2">
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
                  {formatCurrency(netPay)}
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
          Showing {filteredPayroll.length} of {currentMonthPayroll.length} payroll records
        </Typography>
      </div>

      {/* Payroll Table */}
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
                  <TableCell className="font-semibold">Deductions</TableCell>
                  <TableCell className="font-semibold">Net Pay</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayroll.map((payroll) => (
                  <TableRow 
                    key={payroll.id}
                    hover
                    className="cursor-pointer hover:bg-gray-50"
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
                      <div className="text-sm font-medium text-green-600">{formatCurrency(payroll.netPay)}</div>
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
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(payroll);
                        }}
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

      {/* Payroll Detail Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Payroll Details</Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedPayroll && (
            <div className="space-y-6">
              {/* Employee Information */}
              <Card>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                      {selectedPayroll.employeeName.charAt(0)}
                    </Avatar>
                    <div>
                      <Typography variant="h6">{selectedPayroll.employeeName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Employee ID: {selectedPayroll.employeeId}
                      </Typography>
                      <Chip 
                        icon={getStatusIcon(selectedPayroll.status)}
                        label={selectedPayroll.status} 
                        color={getStatusColor(selectedPayroll.status) as any}
                        size="small"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pay Period Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4 flex items-center gap-2">
                    <CalendarToday fontSize="small" />
                    Pay Period Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Typography variant="body2" color="text.secondary">Pay Period:</Typography>
                          <Typography variant="body2" className="font-medium">
                            {selectedPayroll.payPeriod}
                          </Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="body2" color="text.secondary">Pay Date:</Typography>
                          <Typography variant="body2" className="font-medium">
                            {new Date(selectedPayroll.payDate).toLocaleDateString()}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Typography variant="body2" color="text.secondary">Status:</Typography>
                          <Chip 
                            icon={getStatusIcon(selectedPayroll.status)}
                            label={selectedPayroll.status} 
                            color={getStatusColor(selectedPayroll.status) as any}
                            size="small"
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Payroll Breakdown */}
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4 flex items-center gap-2">
                    <Receipt fontSize="small" />
                    Payroll Breakdown
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Typography variant="body1">Base Salary</Typography>
                      <Typography variant="body1" className="font-medium">
                        {formatCurrency(selectedPayroll.baseSalary)}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body1">Overtime Pay</Typography>
                      <Typography variant="body1" className="font-medium">
                        {formatCurrency(selectedPayroll.overtimePay)}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body1">Bonus</Typography>
                      <Typography variant="body1" className="font-medium">
                        {formatCurrency(selectedPayroll.bonus)}
                      </Typography>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center">
                      <Typography variant="body1" className="font-medium">Gross Pay</Typography>
                      <Typography variant="body1" className="font-bold">
                        {formatCurrency(selectedPayroll.baseSalary + selectedPayroll.overtimePay + selectedPayroll.bonus)}
                      </Typography>
                    </div>
                    <div className="flex justify-between items-center">
                      <Typography variant="body1" color="error">Deductions</Typography>
                      <Typography variant="body1" color="error" className="font-medium">
                        -{formatCurrency(selectedPayroll.deductions)}
                      </Typography>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center">
                      <Typography variant="h6" className="font-bold">Net Pay</Typography>
                      <Typography variant="h6" className="font-bold text-green-600">
                        {formatCurrency(selectedPayroll.netPay)}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Email />}
            onClick={() => {
              console.log('Send payslip to:', selectedPayroll?.employeeName);
              handleCloseModal();
            }}
          >
            Send Payslip
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Print />}
            onClick={() => {
              console.log('Print payslip for:', selectedPayroll?.employeeName);
              handleCloseModal();
            }}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>

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
                <span className="font-medium">{formatCurrency(grossPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Deductions:</span>
                <span className="font-medium text-red-600">{formatCurrency(totalDeductions)}</span>
              </div>
              <Divider />
              <div className="flex justify-between font-semibold">
                <span>Net Pay:</span>
                <span className="text-green-600">{formatCurrency(netPay)}</span>
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