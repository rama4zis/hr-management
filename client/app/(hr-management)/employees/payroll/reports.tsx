"use client"

import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  AttachMoney, 
  People, 
  Assessment,
  PieChart,
  BarChart,
  Timeline
} from "@mui/icons-material";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from "@mui/material";
import React, { useState, useMemo } from "react";
import { payrollData } from "../../../../data/payroll-data";
import { employeesData } from "../../../../data/employees-data";
import { departmentsData } from "../../../../data/departments-data";

export default function Reports() {
  const [reportType, setReportType] = useState("summary");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const totalEmployees = employeesData.filter(emp => emp.status === "Active").length;
    const totalPayrolls = payrollData.length;
    const totalGrossPay = payrollData.reduce((acc, p) => acc + p.baseSalary + p.overtimePay + p.bonus, 0);
    const totalNetPay = payrollData.reduce((acc, p) => acc + p.netPay, 0);
    const totalDeductions = payrollData.reduce((acc, p) => acc + p.deductions, 0);
    const totalOvertime = payrollData.reduce((acc, p) => acc + p.overtimePay, 0);
    const totalBonuses = payrollData.reduce((acc, p) => acc + p.bonus, 0);
    
    const avgSalary = totalGrossPay / totalPayrolls;
    const avgNetPay = totalNetPay / totalPayrolls;
    const avgDeductions = totalDeductions / totalPayrolls;

    return {
      totalEmployees,
      totalPayrolls,
      totalGrossPay,
      totalNetPay,
      totalDeductions,
      totalOvertime,
      totalBonuses,
      avgSalary,
      avgNetPay,
      avgDeductions
    };
  }, []);

  // Department breakdown
  const departmentStats = useMemo(() => {
    const deptMap = new Map();
    
    employeesData.forEach(emp => {
      const dept = emp.department;
      if (!deptMap.has(dept)) {
        deptMap.set(dept, { count: 0, totalSalary: 0 });
      }
      deptMap.get(dept).count++;
      deptMap.get(dept).totalSalary += emp.salary;
    });

    return Array.from(deptMap.entries()).map(([dept, data]: [string, any]) => ({
      department: dept,
      employeeCount: data.count,
      totalSalary: data.totalSalary,
      avgSalary: data.totalSalary / data.count
    })).sort((a, b) => b.totalSalary - a.totalSalary);
  }, []);

  // Status distribution
  const statusDistribution = useMemo(() => {
    const statuses = payrollData.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statuses).map(([status, count]) => ({
      status,
      count,
      percentage: (count / payrollData.length) * 100
    }));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderSummaryReport = () => (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12} md={6} lg={3}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {stats.totalEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Staff
                </Typography>
              </div>
              <People className="text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Gross Pay
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {formatCurrency(stats.totalGrossPay)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Before Deductions
                </Typography>
              </div>
              <AttachMoney className="text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Net Pay
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {formatCurrency(stats.totalNetPay)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  After Deductions
                </Typography>
              </div>
              <TrendingUp className="text-green-500" />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Deductions
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-red-600">
                  {formatCurrency(stats.totalDeductions)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Taxes & Benefits
                </Typography>
              </div>
              <TrendingDown className="text-red-500" />
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Detailed Statistics */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Payroll Averages
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Salary:</span>
                <span className="font-medium">{formatCurrency(stats.avgSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Net Pay:</span>
                <span className="font-medium">{formatCurrency(stats.avgNetPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Deductions:</span>
                <span className="font-medium text-red-600">{formatCurrency(stats.avgDeductions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Overtime:</span>
                <span className="font-medium">{formatCurrency(stats.totalOvertime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Bonuses:</span>
                <span className="font-medium">{formatCurrency(stats.totalBonuses)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Payment Status
            </Typography>
            <div className="space-y-3">
              {statusDistribution.map((item) => (
                <div key={item.status} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Chip 
                      label={item.status} 
                      color={item.status === "Paid" ? "success" : "warning"}
                      size="small"
                    />
                    <span className="text-sm text-gray-600">{item.count} payments</span>
                  </div>
                  <span className="font-medium">{item.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDepartmentReport = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Department Payroll Breakdown
            </Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentStats.map((dept, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{dept.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dept.employeeCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(dept.totalSalary)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(dept.avgSalary)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {((dept.totalSalary / stats.totalGrossPay) * 100).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTrendsReport = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Payroll Trends
            </Typography>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Timeline className="text-gray-400 text-6xl mb-4" />
                <Typography variant="body1" color="text.secondary">
                  Payroll trend analysis will be displayed here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly comparisons and growth metrics
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Cost Analysis
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Salary Costs:</span>
                <span className="font-medium">{formatCurrency(stats.totalGrossPay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overtime Costs:</span>
                <span className="font-medium">{formatCurrency(stats.totalOvertime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bonus Costs:</span>
                <span className="font-medium">{formatCurrency(stats.totalBonuses)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Labor Cost:</span>
                  <span className="text-green-600">
                    {formatCurrency(stats.totalGrossPay + stats.totalOvertime + stats.totalBonuses)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive payroll analytics and insights</p>
      </div>

      {/* Report Controls */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <FormControl size="small">
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="summary">Summary Report</MenuItem>
                  <MenuItem value="department">Department Report</MenuItem>
                  <MenuItem value="trends">Trends Report</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel>Period</InputLabel>
                <Select
                  value={periodFilter}
                  label="Period"
                  onChange={(e) => setPeriodFilter(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex gap-2">
              <Button variant="outlined" startIcon={<Download />}>
                Export PDF
              </Button>
              <Button variant="contained" startIcon={<Download />}>
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {reportType === "summary" && renderSummaryReport()}
      {reportType === "department" && renderDepartmentReport()}
      {reportType === "trends" && renderTrendsReport()}
    </div>
  );
} 