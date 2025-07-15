'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Avatar,
    Box,
    InputAdornment,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeStatus, Department, Position } from '../../../types';
import { DepartmentService } from '@/services/departmentService';
import { PositionService } from '@/services/positionService';
import { useAsync } from '@/hooks/useAsync';

interface EmployeeFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateEmployeeRequest | UpdateEmployeeRequest) => Promise<void>;
    employee?: Employee | null;
    loading?: boolean;
}

export default function EmployeeForm({ open, onClose, onSubmit, employee, loading = false }: EmployeeFormProps) {
    const [formData, setFormData] = useState<CreateEmployeeRequest>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        departmentId: '',
        positionId: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: 0,
        employeeStatus: EmployeeStatus.ACTIVE,
        profileImage: '',
    });

    const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch departments and positions
    const { data: departments = [], loading: departmentsLoading } = useAsync(
        () => DepartmentService.getAllDepartments(),
        []
    );

    const { data: positions = [], loading: positionsLoading } = useAsync(
        () => PositionService.getAllPositions(),
        []
    );

    // Filter positions by selected department
    useEffect(() => {
        if (formData.departmentId && positions && positions.length > 0) {
            const filtered = positions.filter(pos => pos.departmentId === formData.departmentId);
            setFilteredPositions(filtered);
            
            // Reset position if current position doesn't belong to selected department
            if (formData.positionId && !filtered.find(pos => pos.id === formData.positionId)) {
                setFormData(prev => ({ ...prev, positionId: '' }));
            }
        } else {
            setFilteredPositions([]);
        }
    }, [formData.departmentId, positions]);

    // Populate form when editing
    useEffect(() => {
        if (employee) {
            setFormData({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phoneNumber: employee.phoneNumber || '',
                address: employee.address || '',
                departmentId: employee.departmentId,
                positionId: employee.positionId,
                hireDate: employee.hireDate.split('T')[0], // Convert to date string
                salary: employee.salary,
                employeeStatus: employee.employeeStatus,
                profileImage: employee.profileImage || '',
            });
        } else {
            // Reset form for new employee
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                address: '',
                departmentId: '',
                positionId: '',
                hireDate: new Date().toISOString().split('T')[0],
                salary: 0,
                employeeStatus: EmployeeStatus.ACTIVE,
                profileImage: '',
            });
        }
        setError(null);
    }, [employee, open]);

    const handleInputChange = (field: keyof CreateEmployeeRequest) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const value = field === 'salary' ? Number(event.target.value) : event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSelectChange = (field: keyof CreateEmployeeRequest) => (
        event: any
    ) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        // Validation
        if (!formData.firstName.trim()) {
            setError('First name is required');
            return;
        }
        if (!formData.lastName.trim()) {
            setError('Last name is required');
            return;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }
        if (!formData.departmentId) {
            setError('Department is required');
            return;
        }
        if (!formData.positionId) {
            setError('Position is required');
            return;
        }
        if (formData.salary <= 0) {
            setError('Salary must be greater than 0');
            return;
        }

        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const isLoading = loading || departmentsLoading || positionsLoading;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit,
            }}
        >
            <DialogTitle>
                {employee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {/* Profile Image */}
                    <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={formData.profileImage}
                                sx={{ width: 80, height: 80 }}
                            >
                                {formData.firstName[0]}{formData.lastName[0]}
                            </Avatar>
                            <Button
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: -8,
                                    right: -8,
                                    minWidth: 'auto',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                }}
                                size="small"
                                variant="contained"
                            >
                                <PhotoCamera fontSize="small" />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // In a real app, you'd upload this to a server
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    profileImage: event.target?.result as string
                                                }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </Button>
                        </Box>
                    </Grid>

                    {/* Personal Information */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange('firstName')}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange('lastName')}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleInputChange('phoneNumber')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Address"
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={handleInputChange('address')}
                        />
                    </Grid>

                    {/* Work Information */}
                    <Grid size={{xs:12, md:6}}>
                        <FormControl fullWidth required>
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={formData.departmentId}
                                label="Department"
                                onChange={handleSelectChange('departmentId')}
                                disabled={isLoading}
                            >
                                {departments?.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Position</InputLabel>
                            <Select
                                value={formData.positionId}
                                label="Position"
                                onChange={handleSelectChange('positionId')}
                                disabled={isLoading || !formData.departmentId}
                            >
                                {filteredPositions.map((pos) => (
                                    <MenuItem key={pos.id} value={pos.id}>
                                        {pos.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Hire Date"
                            type="date"
                            value={formData.hireDate}
                            onChange={handleInputChange('hireDate')}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Salary"
                            type="number"
                            value={formData.salary}
                            onChange={handleInputChange('salary')}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.employeeStatus}
                                label="Status"
                                onChange={handleSelectChange('employeeStatus')}
                            >
                                {Object.values(EmployeeStatus).map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status.replace('_', ' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading || isLoading}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    {employee ? 'Update' : 'Create'} Employee
                </Button>
            </DialogActions>
        </Dialog>
    );
}
