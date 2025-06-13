"use client"

import { AttachMoney, CalendarMonth, People, TrendingUp, Download } from "@mui/icons-material";
import { Tab, Tabs, Button, Card, CardContent, Typography, Box, Chip } from "@mui/material";
import React, { useState } from "react";
import { payrollData } from "../../../../data/payroll-data";
import { employeesData } from "../../../../data/employees-data";
import CurrentPayroll from "./current-payroll";
import PayrollHistory from "./payroll-history";
import Reports from "./reports";

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
    <CurrentPayroll />
  );

  const renderPayrollHistory = () => (
    <PayrollHistory />
  );

  const renderReports = () => (
    <Reports/>
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
          {/* <Tab value="Reports" label="Reports" /> */}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === "Current Payroll" && renderCurrentPayroll()}
      {currentTab === "Payroll History" && renderPayrollHistory()}
      {currentTab === "Reports" && renderReports()}
    </div>
  );
}
