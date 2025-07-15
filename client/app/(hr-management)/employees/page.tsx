'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import DataTable, { TableColumn, StatusChip, formatCurrency, formatDate } from '@/components/DataTable';
import { Employee, Department, Position, EmployeeStatus } from '../../../types';
import { EmployeeService } from '@/services/employeeService';
import { DepartmentService } from '@/services/departmentService';
import { PositionService } from '@/services/positionService';
import { useAsync, useAsyncCallback } from '@/hooks/useAsync';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch data from API
  const { 
    data: employees = [], 
    loading: employeesLoading, 
    error: employeesError, 
    refetch: refetchEmployees 
  } = useAsync(() => EmployeeService.getAllEmployees(), []);

  const { data: departments = [] } = useAsync(() => DepartmentService.getAllDepartments(), []);
  const { data: positions = [] } = useAsync(() => PositionService.getAllPositions(), []);

  // Async operations
  const { execute: createEmployee, loading: createLoading } = useAsyncCallback(EmployeeService.createEmployee);
  const { execute: updateEmployee, loading: updateLoading } = useAsyncCallback(EmployeeService.updateEmployee);
  const { execute: deleteEmployee, loading: deleteLoading } = useAsyncCallback(EmployeeService.deleteEmployee);

  // Helper functions
  const getDepartmentName = (departmentId: string) => {
    return departments?.find(dept => dept.id === departmentId)?.name || 'Unknown Department';
  };

  const getPositionTitle = (positionId: string) => {
    return positions?.find(pos => pos.id === positionId)?.title || 'Unknown Position';
  };

  const getDepartment = (departmentId: string) => {
    return departments?.find(dept => dept.id === departmentId);
  };

  const getPosition = (positionId: string) => {
    return positions?.find(pos => pos.id === positionId);
  };

  // Event handlers
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailsOpen(true);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      return;
    }

    setDeleteError(null);
    const result = await deleteEmployee(employee.id);
    if (result !== null) {
      await refetchEmployees();
    } else {
      setDeleteError('Failed to delete employee');
    }
  };

  const handleFormSubmit = async (data: any) => {
    let result;
    if (selectedEmployee) {
      result = await updateEmployee(selectedEmployee.id, data);
    } else {
      result = await createEmployee(data);
    }

    if (result !== null) {
      await refetchEmployees();
      setFormOpen(false);
    }
  };

  const handleEditFromDetails = () => {
    setDetailsOpen(false);
    setFormOpen(true);
  };

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
            alt={row.fullName}
            sx={{ width: 40, height: 40 }}
          >
            {row.firstName[0]}{row.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {row.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id.substring(0, 8)}...
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
          {row.phoneNumber && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">{row.phoneNumber}</Typography>
            </Box>
          )}
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
      id: 'employeeStatus',
      label: 'Status',
      format: (value) => (
        <StatusChip
          status={value.toLowerCase()}
          colorMap={{
            active: 'success',
            inactive: 'default',
            terminated: 'error',
            on_leave: 'warning',
            probation: 'info',
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
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              color="info"
              onClick={() => handleViewEmployee(row)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Employee">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => handleEditEmployee(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Employee">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleDeleteEmployee(row)}
              disabled={deleteLoading}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (employeesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (employeesError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load employees: {employeesError}
      </Alert>
    );
  }

  return (
    <Box>
      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddEmployee}
        >
          Add Employee
        </Button>
      </Box>

      <DataTable
        title="Employees"
        subtitle="Manage and view all employee information"
        columns={columns}
        data={employees}
        searchPlaceholder="Search employees by name, email, department, or position..."
        searchFields={['firstName', 'lastName', 'email', 'fullName']}
        getRowId={(row) => row.id}
        emptyMessage="No employees found"
      />

      {/* Summary Stats */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="h6" color="primary">
            {employees.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Employees
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="h6" color="success.main">
            {employees.filter(emp => emp.employeeStatus === EmployeeStatus.ACTIVE).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Employees
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="h6" color="warning.main">
            {employees.filter(emp => emp.employeeStatus === EmployeeStatus.INACTIVE).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Inactive Employees
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="h6" color="error.main">
            {employees.filter(emp => emp.employeeStatus === EmployeeStatus.TERMINATED).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Terminated
          </Typography>
        </Paper>
      </Box>

      {/* Employee Form Dialog */}
      <EmployeeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        employee={selectedEmployee}
        loading={createLoading || updateLoading}
      />

      {/* Employee Details Dialog */}
      <EmployeeDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        employee={selectedEmployee}
        department={selectedEmployee ? getDepartment(selectedEmployee.departmentId) : undefined}
        position={selectedEmployee ? getPosition(selectedEmployee.positionId) : undefined}
        onEdit={handleEditFromDetails}
      />
    </Box>
  );
}