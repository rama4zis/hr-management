package com.hrmanagement.hr_management_api.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrmanagement.hr_management_api.model.entity.LeaveRequest;
import com.hrmanagement.hr_management_api.model.enums.LeaveRequestStatus;
import com.hrmanagement.hr_management_api.model.enums.LeaveRequestType;
import com.hrmanagement.hr_management_api.repository.LeaveRequestRepository;
import com.hrmanagement.hr_management_api.util.ApiResponse;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestController(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    // Get all leave requests (non-deleted)
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllLeaveRequests() {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findByIsDeletedFalse();
        ApiResponse response = new ApiResponse(true, "Leave requests retrieved successfully", leaveRequests);
        return ResponseEntity.ok(response);
    }

    // Get all leave requests including deleted
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllLeaveRequestsIncludingDeleted() {
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findAll();
        ApiResponse response = new ApiResponse(true, "All leave requests retrieved successfully", leaveRequests);
        return ResponseEntity.ok(response);
    }

    // Get leave request by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getLeaveRequestById(@PathVariable String id) {
        Optional<LeaveRequest> leaveRequest = leaveRequestRepository.findByIdAndIsDeletedFalse(id);
        return leaveRequest.map(request -> {
            ApiResponse response = new ApiResponse(true, "Leave request retrieved successfully", request);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Create new leave request
    @PostMapping("/")
    public ResponseEntity<ApiResponse> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        try {
            // Check for overlapping approved leave requests
            List<LeaveRequest> overlappingRequests = leaveRequestRepository.findOverlappingLeaveRequests(
                leaveRequest.getEmployeeId(), leaveRequest.getStartDate(), leaveRequest.getEndDate());
            
            if (!overlappingRequests.isEmpty()) {
                ApiResponse response = new ApiResponse(false, 
                    "Leave request overlaps with existing approved leave", overlappingRequests);
                return ResponseEntity.badRequest().body(response);
            }
            
            // Ensure the leave request is not marked as deleted when creating
            leaveRequest.setDeleted(false);
            // Set default status to PENDING if not provided
            if (leaveRequest.getLeaveRequestStatus() == null) {
                leaveRequest.setLeaveRequestStatus(LeaveRequestStatus.PENDING);
            }
            // Set request date to today if not provided
            if (leaveRequest.getRequestDate() == null) {
                leaveRequest.setRequestDate(LocalDate.now());
            }
            
            LeaveRequest savedLeaveRequest = leaveRequestRepository.save(leaveRequest);
            ApiResponse response = new ApiResponse(true, "Leave request created successfully", savedLeaveRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error creating leave request: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update leave request
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateLeaveRequest(@PathVariable String id, @RequestBody LeaveRequest leaveRequestDetails) {
        return leaveRequestRepository.findByIdAndIsDeletedFalse(id).map(leaveRequest -> {
            try {
                // Check for overlapping requests if dates are being changed
                if (!leaveRequest.getStartDate().equals(leaveRequestDetails.getStartDate()) || 
                    !leaveRequest.getEndDate().equals(leaveRequestDetails.getEndDate())) {
                    
                    List<LeaveRequest> overlappingRequests = leaveRequestRepository.findOverlappingLeaveRequests(
                        leaveRequestDetails.getEmployeeId(), leaveRequestDetails.getStartDate(), leaveRequestDetails.getEndDate());
                    
                    // Remove current request from overlapping check
                    overlappingRequests.removeIf(req -> req.getId().equals(id));
                    
                    if (!overlappingRequests.isEmpty()) {
                        ApiResponse response = new ApiResponse(false, 
                            "Leave request overlaps with existing approved leave", overlappingRequests);
                        return ResponseEntity.badRequest().body(response);
                    }
                }
                
                leaveRequest.setEmployeeId(leaveRequestDetails.getEmployeeId());
                leaveRequest.setLeaveRequestType(leaveRequestDetails.getLeaveRequestType());
                leaveRequest.setStartDate(leaveRequestDetails.getStartDate());
                leaveRequest.setEndDate(leaveRequestDetails.getEndDate());
                leaveRequest.setReason(leaveRequestDetails.getReason());
                leaveRequest.setLeaveRequestStatus(leaveRequestDetails.getLeaveRequestStatus());
                leaveRequest.setApprovedBy(leaveRequestDetails.getApprovedBy());
                leaveRequest.setResponseDate(leaveRequestDetails.getResponseDate());
                leaveRequest.setComments(leaveRequestDetails.getComments());
                
                LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
                ApiResponse response = new ApiResponse(true, "Leave request updated successfully", updatedLeaveRequest);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error updating leave request: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Partial update leave request
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> partialUpdateLeaveRequest(@PathVariable String id, @RequestBody LeaveRequest leaveRequestDetails) {
        return leaveRequestRepository.findByIdAndIsDeletedFalse(id).map(leaveRequest -> {
            try {
                if (leaveRequestDetails.getEmployeeId() != null) {
                    leaveRequest.setEmployeeId(leaveRequestDetails.getEmployeeId());
                }
                if (leaveRequestDetails.getLeaveRequestType() != null) {
                    leaveRequest.setLeaveRequestType(leaveRequestDetails.getLeaveRequestType());
                }
                if (leaveRequestDetails.getStartDate() != null) {
                    leaveRequest.setStartDate(leaveRequestDetails.getStartDate());
                }
                if (leaveRequestDetails.getEndDate() != null) {
                    leaveRequest.setEndDate(leaveRequestDetails.getEndDate());
                }
                if (leaveRequestDetails.getReason() != null) {
                    leaveRequest.setReason(leaveRequestDetails.getReason());
                }
                if (leaveRequestDetails.getLeaveRequestStatus() != null) {
                    leaveRequest.setLeaveRequestStatus(leaveRequestDetails.getLeaveRequestStatus());
                }
                if (leaveRequestDetails.getApprovedBy() != null) {
                    leaveRequest.setApprovedBy(leaveRequestDetails.getApprovedBy());
                }
                if (leaveRequestDetails.getResponseDate() != null) {
                    leaveRequest.setResponseDate(leaveRequestDetails.getResponseDate());
                }
                if (leaveRequestDetails.getComments() != null) {
                    leaveRequest.setComments(leaveRequestDetails.getComments());
                }
                
                LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
                ApiResponse response = new ApiResponse(true, "Leave request updated successfully", updatedLeaveRequest);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error updating leave request: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Soft delete leave request
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteLeaveRequest(@PathVariable String id) {
        return leaveRequestRepository.findByIdAndIsDeletedFalse(id).map(leaveRequest -> {
            try {
                leaveRequest.setDeleted(true);
                leaveRequestRepository.save(leaveRequest);
                ApiResponse response = new ApiResponse(true, "Leave request deleted successfully", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error deleting leave request: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Hard delete leave request (permanent)
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse> permanentDeleteLeaveRequest(@PathVariable String id) {
        return leaveRequestRepository.findById(id).map(leaveRequest -> {
            try {
                leaveRequestRepository.delete(leaveRequest);
                ApiResponse response = new ApiResponse(true, "Leave request permanently deleted", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error permanently deleting leave request: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Restore soft deleted leave request
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse> restoreLeaveRequest(@PathVariable String id) {
        return leaveRequestRepository.findById(id).map(leaveRequest -> {
            if (!leaveRequest.isDeleted()) {
                ApiResponse response = new ApiResponse(false, "Leave request is not deleted", null);
                return ResponseEntity.badRequest().body(response);
            }
            try {
                leaveRequest.setDeleted(false);
                LeaveRequest restoredLeaveRequest = leaveRequestRepository.save(leaveRequest);
                ApiResponse response = new ApiResponse(true, "Leave request restored successfully", restoredLeaveRequest);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error restoring leave request: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Get leave requests by employee ID
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse> getLeaveRequestsByEmployee(@PathVariable String employeeId) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByEmployeeIdAndIsDeletedFalse(employeeId);
            ApiResponse response = new ApiResponse(true, "Employee leave requests retrieved successfully", leaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving employee leave requests: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get leave requests by status
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getLeaveRequestsByStatus(@PathVariable LeaveRequestStatus status) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByLeaveRequestStatusAndIsDeletedFalse(status);
            ApiResponse response = new ApiResponse(true, "Leave requests by status retrieved successfully", leaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving leave requests by status: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get leave requests by type
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse> getLeaveRequestsByType(@PathVariable LeaveRequestType type) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByLeaveRequestTypeAndIsDeletedFalse(type);
            ApiResponse response = new ApiResponse(true, "Leave requests by type retrieved successfully", leaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving leave requests by type: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get pending leave requests
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse> getPendingLeaveRequests() {
        try {
            List<LeaveRequest> pendingRequests = leaveRequestRepository.findPendingRequests();
            ApiResponse response = new ApiResponse(true, "Pending leave requests retrieved successfully", pendingRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving pending leave requests: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get approved leave requests
    @GetMapping("/approved")
    public ResponseEntity<ApiResponse> getApprovedLeaveRequests() {
        try {
            List<LeaveRequest> approvedRequests = leaveRequestRepository.findApprovedRequests();
            ApiResponse response = new ApiResponse(true, "Approved leave requests retrieved successfully", approvedRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving approved leave requests: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get rejected leave requests
    @GetMapping("/rejected")
    public ResponseEntity<ApiResponse> getRejectedLeaveRequests() {
        try {
            List<LeaveRequest> rejectedRequests = leaveRequestRepository.findRejectedRequests();
            ApiResponse response = new ApiResponse(true, "Rejected leave requests retrieved successfully", rejectedRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving rejected leave requests: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get cancelled leave requests
    @GetMapping("/cancelled")
    public ResponseEntity<ApiResponse> getCancelledLeaveRequests() {
        try {
            List<LeaveRequest> cancelledRequests = leaveRequestRepository.findCancelledRequests();
            ApiResponse response = new ApiResponse(true, "Cancelled leave requests retrieved successfully", cancelledRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving cancelled leave requests: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get leave requests by date range
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse> getLeaveRequestsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByStartDateBetweenAndIsDeletedFalse(startDate, endDate);
            ApiResponse response = new ApiResponse(true, "Leave requests for date range retrieved successfully", leaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving leave requests by date range: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get employee leave requests by date range
    @GetMapping("/employee/{employeeId}/date-range")
    public ResponseEntity<ApiResponse> getEmployeeLeaveRequestsByDateRange(
            @PathVariable String employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository
                .findByEmployeeIdAndStartDateBetweenAndIsDeletedFalse(employeeId, startDate, endDate);
            ApiResponse response = new ApiResponse(true, "Employee leave requests for date range retrieved successfully", leaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving employee leave requests by date range: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get leave requests by approver
    @GetMapping("/approver/{approverId}")
    public ResponseEntity<ApiResponse> getLeaveRequestsByApprover(@PathVariable String approverId) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByApprovedByAndIsDeletedFalse(approverId);
            ApiResponse response = new ApiResponse(true, "Leave requests by approver retrieved successfully", leaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving leave requests by approver: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Approve leave request
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approveLeaveRequest(@PathVariable String id, @RequestBody ApprovalRequest approvalRequest) {
        return leaveRequestRepository.findByIdAndIsDeletedFalse(id).map(leaveRequest -> {
            try {
                leaveRequest.setLeaveRequestStatus(LeaveRequestStatus.APPROVED);
                leaveRequest.setApprovedBy(approvalRequest.getApproverId());
                leaveRequest.setResponseDate(LocalDate.now());
                if (approvalRequest.getComments() != null) {
                    leaveRequest.setComments(approvalRequest.getComments());
                }
                
                LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
                ApiResponse response = new ApiResponse(true, "Leave request approved successfully", updatedLeaveRequest);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error approving leave request: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Reject leave request
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> rejectLeaveRequest(@PathVariable String id, @RequestBody ApprovalRequest approvalRequest) {
        return leaveRequestRepository.findByIdAndIsDeletedFalse(id).map(leaveRequest -> {
            try {
                leaveRequest.setLeaveRequestStatus(LeaveRequestStatus.REJECTED);
                leaveRequest.setApprovedBy(approvalRequest.getApproverId());
                leaveRequest.setResponseDate(LocalDate.now());
                if (approvalRequest.getComments() != null) {
                    leaveRequest.setComments(approvalRequest.getComments());
                }
                
                LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
                ApiResponse response = new ApiResponse(true, "Leave request rejected successfully", updatedLeaveRequest);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error rejecting leave request: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Cancel leave request
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelLeaveRequest(@PathVariable String id, @RequestBody CancelRequest cancelRequest) {
        return leaveRequestRepository.findByIdAndIsDeletedFalse(id).map(leaveRequest -> {
            try {
                leaveRequest.setLeaveRequestStatus(LeaveRequestStatus.CANCELLED);
                leaveRequest.setResponseDate(LocalDate.now());
                if (cancelRequest.getReason() != null) {
                    leaveRequest.setComments(cancelRequest.getReason());
                }
                
                LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
                ApiResponse response = new ApiResponse(true, "Leave request cancelled successfully", updatedLeaveRequest);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error cancelling leave request: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Leave request not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Get upcoming approved leaves
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse> getUpcomingApprovedLeaves() {
        try {
            List<LeaveRequest> upcomingLeaves = leaveRequestRepository.findUpcomingApprovedLeaves();
            ApiResponse response = new ApiResponse(true, "Upcoming approved leaves retrieved successfully", upcomingLeaves);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving upcoming approved leaves: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get current active leaves
    @GetMapping("/current-active")
    public ResponseEntity<ApiResponse> getCurrentActiveLeaves() {
        try {
            List<LeaveRequest> activeLeaves = leaveRequestRepository.findCurrentActiveLeaves();
            ApiResponse response = new ApiResponse(true, "Current active leaves retrieved successfully", activeLeaves);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving current active leaves: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get leave requests by year
    @GetMapping("/year/{year}")
    public ResponseEntity<ApiResponse> getLeaveRequestsByYear(@PathVariable int year) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByYear(year);
            ApiResponse response = new ApiResponse(true, "Leave requests for year retrieved successfully", leaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving leave requests by year: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get employee leave requests by year
    @GetMapping("/employee/{employeeId}/year/{year}")
    public ResponseEntity<ApiResponse> getEmployeeLeaveRequestsByYear(@PathVariable String employeeId, @PathVariable int year) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findByEmployeeIdAndYear(employeeId, year);
            ApiResponse response = new ApiResponse(true, "Employee leave requests for year retrieved successfully", leaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving employee leave requests by year: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get total leave days taken by employee, type and year
    @GetMapping("/employee/{employeeId}/total-days")
    public ResponseEntity<ApiResponse> getTotalLeaveDays(
            @PathVariable String employeeId,
            @RequestParam LeaveRequestType type,
            @RequestParam int year) {
        try {
            int totalDays = leaveRequestRepository.getTotalLeaveDaysByEmployeeTypeAndYear(employeeId, type, year);
            ApiResponse response = new ApiResponse(true, "Total leave days retrieved successfully", totalDays);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving total leave days: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get leave request count
    @GetMapping("/count")
    public ResponseEntity<ApiResponse> getLeaveRequestCount() {
        try {
            long count = leaveRequestRepository.countByIsDeletedFalse();
            ApiResponse response = new ApiResponse(true, "Leave request count retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error getting leave request count: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get leave request count by status
    @GetMapping("/count/status/{status}")
    public ResponseEntity<ApiResponse> getLeaveRequestCountByStatus(@PathVariable LeaveRequestStatus status) {
        try {
            long count = leaveRequestRepository.countByLeaveRequestStatusAndIsDeletedFalse(status);
            ApiResponse response = new ApiResponse(true, "Leave request count by status retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error getting leave request count by status: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get leave request count by type
    @GetMapping("/count/type/{type}")
    public ResponseEntity<ApiResponse> getLeaveRequestCountByType(@PathVariable LeaveRequestType type) {
        try {
            long count = leaveRequestRepository.countByLeaveRequestTypeAndIsDeletedFalse(type);
            ApiResponse response = new ApiResponse(true, "Leave request count by type retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error getting leave request count by type: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get deleted leave requests
    @GetMapping("/deleted")
    public ResponseEntity<ApiResponse> getDeletedLeaveRequests() {
        try {
            List<LeaveRequest> deletedLeaveRequests = leaveRequestRepository.findAll().stream()
                .filter(LeaveRequest::isDeleted)
                .toList();
            ApiResponse response = new ApiResponse(true, "Deleted leave requests retrieved successfully", deletedLeaveRequests);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving deleted leave requests: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Bulk delete leave requests
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse> bulkDeleteLeaveRequests(@RequestBody List<String> leaveRequestIds) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestRepository.findAllById(leaveRequestIds);
            leaveRequests.forEach(leaveRequest -> leaveRequest.setDeleted(true));
            leaveRequestRepository.saveAll(leaveRequests);
            
            ApiResponse response = new ApiResponse(true, 
                "Bulk delete completed. " + leaveRequests.size() + " leave requests deleted.", leaveRequests.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error in bulk delete: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // DTO classes for requests
    public static class ApprovalRequest {
        private String approverId;
        private String comments;

        public String getApproverId() {
            return approverId;
        }

        public void setApproverId(String approverId) {
            this.approverId = approverId;
        }

        public String getComments() {
            return comments;
        }

        public void setComments(String comments) {
            this.comments = comments;
        }
    }

    public static class CancelRequest {
        private String reason;

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
