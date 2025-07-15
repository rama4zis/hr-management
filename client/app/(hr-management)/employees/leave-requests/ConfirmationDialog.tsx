'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as CancelIcon,
} from '@mui/icons-material';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'approve' | 'reject' | 'cancel';
  leaveRequestId: string;
  employeeName: string;
  loading?: boolean;
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  action,
  leaveRequestId,
  employeeName,
  loading = false,
}: ConfirmationDialogProps) {
  const getActionConfig = () => {
    switch (action) {
      case 'approve':
        return {
          title: 'Approve Leave Request',
          message: `Are you sure you want to approve this leave request for ${employeeName}?`,
          color: 'success' as const,
          icon: <ApproveIcon />,
          confirmText: 'Approve',
        };
      case 'reject':
        return {
          title: 'Reject Leave Request',
          message: `Are you sure you want to reject this leave request for ${employeeName}?`,
          color: 'error' as const,
          icon: <RejectIcon />,
          confirmText: 'Reject',
        };
      case 'cancel':
        return {
          title: 'Cancel Leave Request',
          message: `Are you sure you want to cancel this leave request for ${employeeName}?`,
          color: 'warning' as const,
          icon: <CancelIcon />,
          confirmText: 'Cancel Request',
        };
      default:
        return {
          title: 'Confirm Action',
          message: 'Are you sure you want to perform this action?',
          color: 'primary' as const,
          icon: null,
          confirmText: 'Confirm',
        };
    }
  };

  const config = getActionConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {config.icon}
          <Typography variant="h6">{config.title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {config.message}
        </DialogContentText>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Request ID:</strong> {leaveRequestId}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={config.color}
          variant="contained"
          disabled={loading}
          startIcon={config.icon}
        >
          {loading ? 'Processing...' : config.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
