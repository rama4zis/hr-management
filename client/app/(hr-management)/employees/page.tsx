'use client';

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { dummyEmployees, getDepartmentName, getPositionTitle } from '../../../data';
import DataTable, { TableColumn, StatusChip, formatCurrency, formatDate } from '@/components/DataTable';
import { Employee } from '@/model/Employee';

export default function EmployeesPage() {
  // Define table columns
  const columns: TableColumn<Employee>[] = [
    {
      id: 'employee',
      label: 'Employee',
      minWidth: 200,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={row.profileImage}
            alt={`${row.firstName} ${row.lastName}`}
            sx={{ width: 40, height: 40 }}
          >
            {row.firstName[0]}{row.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {row.firstName} {row.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      minWidth: 200,
      format: (value, row) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.phone}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'departmentId',
      label: 'Department',
      format: (value) => getDepartmentName(value),
    },
    {
      id: 'positionId',
      label: 'Position',
      format: (value) => getPositionTitle(value),
    },
    {
      id: 'hireDate',
      label: 'Hire Date',
      format: (value) => formatDate(value),
    },
    {
      id: 'salary',
      label: 'Salary',
      align: 'right',
      format: (value) => (
        <Typography variant="body2" fontWeight="medium">
          {formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      format: (value) => (
        <StatusChip
          status={value}
          colorMap={{
            active: 'success',
            inactive: 'default',
          }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      format: (value, row) => (
        <Box>
          <Tooltip title="Edit Employee">
            <IconButton size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Employee">
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        title="Employees"
        subtitle="Manage and view all employee information"
        columns={columns}
        data={dummyEmployees}
        searchPlaceholder="Search employees by name, email, department, or position..."
        searchFields={['firstName', 'lastName', 'email']}
        getRowId={(row) => row.id}
        emptyMessage="No employees found"
      />

      {/* Summary Stats */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="h6" color="primary">
            {dummyEmployees.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Employees
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="h6" color="success.main">
            {dummyEmployees.filter(emp => emp.status === 'active').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Employees
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="h6" color="warning.main">
            {dummyEmployees.filter(emp => emp.status === 'inactive').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Inactive Employees
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}