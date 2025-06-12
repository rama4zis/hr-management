"use client"

import { AttachMoney, CalendarMonth, People, TrendingUp, Download } from "@mui/icons-material";
import { Tab, Tabs, Button, Card, CardContent, Typography, Box, Chip } from "@mui/material";
import React, { useState } from "react";
import { payrollData } from "../../../data/payroll-data";
import { employeesData } from "../../../data/employees-data";

export default function Payroll() {
  const [currentTab, setCurrentTab] = useState("Current Payroll");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  // Calculate payroll statistics
  const totalEmployees = employeesData.filter(emp => emp.status === "Active").length;
  const currentMonthPayroll = payrollData.filter(pay => pay.payPeriod.includes("2024-01"));
  const grossPay = currentMonthPayroll.reduce((acc, pay) => acc + pay.baseSalary + pay.overtimePay + pay.bonus, 0);
  const netPay = currentMonthPayroll.reduce((acc, pay) => acc + pay.netPay, 0);
  const totalDeductions = currentMonthPayroll.reduce((acc, pay) => acc + pay.deductions, 0);

  const renderCurrentPayroll = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Current Payroll Period</h2>
        <Button variant="contained" startIcon={<Download />} color="primary">
          Export Payroll
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentMonthPayroll.map((payroll) => (
          <Card key={payroll.id} className="hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="flex justify-between items-start mb-2">
                <Typography variant="h6" component="div">
                  {payroll.employeeName}
                </Typography>
                <Chip 
                  label={payroll.status} 
                  color={payroll.status === "Paid" ? "success" : "warning"}
                  size="small"
                />
              </div>
              <Typography color="text.secondary" gutterBottom>
                {payroll.payPeriod}
              </Typography>
              <div className="space-y-1 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Salary:</span>
                  <span className="font-medium">${payroll.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overtime:</span>
                  <span className="font-medium">${payroll.overtimePay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bonus:</span>
                  <span className="font-medium">${payroll.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deductions:</span>
                  <span className="font-medium text-red-600">-${payroll.deductions.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Net Pay:</span>
                    <span className="text-green-600">${payroll.netPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPayrollHistory = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Payroll History</h2>
        <Button variant="outlined" startIcon={<Download />}>
          Export History
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pay Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overtime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bonus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollData.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payroll.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payroll.payPeriod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${payroll.baseSalary.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${payroll.overtimePay.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${payroll.bonus.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">${payroll.netPay.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Chip 
                      label={payroll.status} 
                      color={payroll.status === "Paid" ? "success" : "warning"}
                      size="small"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Payroll Reports</h2>
        <div className="space-x-2">
          <Button variant="outlined" startIcon={<Download />}>
            Export PDF
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Export Excel
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Payroll Summary Report */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Payroll Summary
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Employees:</span>
                <span className="font-medium">{totalEmployees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gross Pay:</span>
                <span className="font-medium">${grossPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Deductions:</span>
                <span className="font-medium text-red-600">${totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Net Pay:</span>
                <span className="font-medium text-green-600">${netPay.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Department Breakdown
            </Typography>
            <div className="space-y-2">
              {Array.from(new Set(payrollData.map(p => p.employeeName))).slice(0, 5).map((employeeName, index) => {
                const employeePayroll = payrollData.find(p => p.employeeName === employeeName);
                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{employeeName}</span>
                    <span className="font-medium">${employeePayroll?.netPay.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Payment Status
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Paid:</span>
                <span className="font-medium text-green-600">
                  {payrollData.filter(p => p.status === "Paid").length}
                </span>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <p className="text-sm text-gray-500 mt-1">Process payroll, manage payments, and generate reports.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Current Period
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </Typography>
                <Typography variant="body2" color="error" className="mt-1">
                  Processing
                </Typography>
              </div>
              <CalendarMonth className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
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
                  Active Employees
                </Typography>
              </div>
              <People className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Gross Pay
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  ${grossPay.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Before Deductions
                </Typography>
              </div>
              <AttachMoney className="text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
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
                  After Deductions
                </Typography>
              </div>
              <TrendingUp className="text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="payroll tabs"
        >
          <Tab value="Current Payroll" label="Current Payroll" />
          <Tab value="Payroll History" label="Payroll History" />
          <Tab value="Reports" label="Reports" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === "Current Payroll" && renderCurrentPayroll()}
      {currentTab === "Payroll History" && renderPayrollHistory()}
      {currentTab === "Reports" && renderReports()}
    </div>
  );
}
