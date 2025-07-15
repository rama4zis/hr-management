'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Avatar,
    Typography,
    Box,
    Chip,
    Divider,
    Paper,
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Employee, Department, Position } from '../../../types';

interface EmployeeDetailsProps {
    open: boolean;
    onClose: () => void;
    employee: Employee | null;
    department?: Department;
    position?: Position;
    onEdit?: () => void;
}

export default function EmployeeDetails({ 
    open, 
    onClose, 
    employee, 
    department, 
    position, 
    onEdit 
}: EmployeeDetailsProps) {
    if (!employee) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'INACTIVE': return 'default';
            case 'TERMINATED': return 'error';
            case 'ON_LEAVE': return 'warning';
            case 'PROBATION': return 'info';
            default: return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={employee.profileImage}
                        sx={{ width: 60, height: 60 }}
                    >
                        {employee.firstName[0]}{employee.lastName[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" component="div">
                            {employee.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Employee ID: {employee.id}
                        </Typography>
                    </Box>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <Chip 
                            label={employee.employeeStatus.replace('_', ' ')}
                            color={getStatusColor(employee.employeeStatus) as any}
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>
                    {/* Contact Information */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Contact Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <EmailIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">
                                        {employee.email}
                                    </Typography>
                                </Box>
                            </Box>

                            {employee.phoneNumber && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <PhoneIcon color="action" />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Phone
                                        </Typography>
                                        <Typography variant="body1">
                                            {employee.phoneNumber}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {employee.address && (
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <LocationIcon color="action" />
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Address
                                        </Typography>
                                        <Typography variant="body1">
                                            {employee.address}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Work Information */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Work Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <WorkIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Department
                                    </Typography>
                                    <Typography variant="body1">
                                        {department?.name || 'Unknown Department'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <WorkIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Position
                                    </Typography>
                                    <Typography variant="body1">
                                        {position?.title || 'Unknown Position'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CalendarIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Hire Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(employee.hireDate)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MoneyIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Salary
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {formatCurrency(employee.salary)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Additional Information */}
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Additional Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Years of Service
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {employee.yearsOfService} {employee.yearsOfService === 1 ? 'year' : 'years'}
                                    </Typography>
                                </Grid>
                                
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Typography variant="h6">
                                        {employee.active ? 'Active' : 'Inactive'}
                                    </Typography>
                                </Grid>

                                
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Close
                </Button>
                {onEdit && (
                    <Button 
                        variant="contained" 
                        onClick={onEdit}
                    >
                        Edit Employee
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
