package com.hrmanagement.hr_management_api.controller;

import com.hrmanagement.hr_management_api.model.entity.LeaveRequest;
import com.hrmanagement.hr_management_api.model.enums.LeaveType;
import com.hrmanagement.hr_management_api.model.enums.RequestStatus;
import com.hrmanagement.hr_management_api.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @Autowired
    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    /**
     * Get all leave requests
     */
    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getAllLeaveRequests();
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave request by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable String id) {
        try {
            Optional<LeaveRequest> leaveRequest = leaveRequestService.getLeaveRequestById(id);
            return leaveRequest.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave requests for employee
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByEmployee(@PathVariable String employeeId) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByEmployee(employeeId);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave requests for employee with pagination
     */
    @GetMapping("/employee/{employeeId}/paginated")
    public ResponseEntity<Page<LeaveRequest>> getLeaveRequestsByEmployeePaginated(
            @PathVariable String employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByEmployee(employeeId, pageable);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave requests by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByStatus(@PathVariable RequestStatus status) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByStatus(status);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get pending leave requests
     */
    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaveRequests() {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getPendingLeaveRequests();
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create leave request
     */
    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(@Valid @RequestBody LeaveRequest leaveRequest) {
        try {
            LeaveRequest createdRequest = leaveRequestService.createLeaveRequest(leaveRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update leave request
     */
    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequest> updateLeaveRequest(@PathVariable String id,
                                                          @Valid @RequestBody LeaveRequest leaveRequest) {
        try {
            LeaveRequest updatedRequest = leaveRequestService.updateLeaveRequest(id, leaveRequest);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Approve leave request
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveRequest> approveLeaveRequest(@PathVariable String id,
                                                           @RequestParam String approverId,
                                                           @RequestParam(required = false) String comments) {
        try {
            LeaveRequest approvedRequest = leaveRequestService.approveLeaveRequest(id, approverId, comments);
            return ResponseEntity.ok(approvedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Reject leave request
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveRequest> rejectLeaveRequest(@PathVariable String id,
                                                          @RequestParam String approverId,
                                                          @RequestParam(required = false) String comments) {
        try {
            LeaveRequest rejectedRequest = leaveRequestService.rejectLeaveRequest(id, approverId, comments);
            return ResponseEntity.ok(rejectedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete leave request
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveRequest(@PathVariable String id) {
        try {
            leaveRequestService.deleteLeaveRequest(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave requests by type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByType(@PathVariable LeaveType type) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByType(type);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave requests for employee by status
     */
    @GetMapping("/employee/{employeeId}/status/{status}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByEmployeeAndStatus(@PathVariable String employeeId,
                                                                                 @PathVariable RequestStatus status) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByEmployeeAndStatus(employeeId, status);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave requests for month and year
     */
    @GetMapping("/month/{month}/year/{year}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByMonthAndYear(@PathVariable int month,
                                                                            @PathVariable int year) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByMonthAndYear(month, year);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave requests for employee in month and year
     */
    @GetMapping("/employee/{employeeId}/month/{month}/year/{year}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByEmployeeAndMonthAndYear(@PathVariable String employeeId,
                                                                                       @PathVariable int month,
                                                                                       @PathVariable int year) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByEmployeeAndMonthAndYear(employeeId, month, year);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave requests with employee details
     */
    @GetMapping("/with-details/status/{status}")
    public ResponseEntity<List<Object[]>> getLeaveRequestsWithEmployeeDetails(@PathVariable RequestStatus status) {
        try {
            List<Object[]> leaveRequests = leaveRequestService.getLeaveRequestsWithEmployeeDetails(status);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get leave request summary by type
     */
    @GetMapping("/summary/type")
    public ResponseEntity<List<Object[]>> getLeaveRequestSummaryByType(@RequestParam LocalDate startDate,
                                                                      @RequestParam LocalDate endDate) {
        try {
            List<Object[]> summary = leaveRequestService.getLeaveRequestSummaryByType(startDate, endDate);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total leave days for employee by type and year
     */
    @GetMapping("/employee/{employeeId}/total-days")
    public ResponseEntity<Integer> getTotalLeaveDaysByTypeAndYear(@PathVariable String employeeId,
                                                                 @RequestParam LeaveType leaveType,
                                                                 @RequestParam int year) {
        try {
            Integer totalDays = leaveRequestService.getTotalLeaveDaysByTypeAndYear(employeeId, leaveType, year);
            return ResponseEntity.ok(totalDays);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get overlapping approved leaves for date range
     */
    @GetMapping("/overlapping")
    public ResponseEntity<List<LeaveRequest>> getOverlappingApprovedLeaves(@RequestParam LocalDate startDate,
                                                                          @RequestParam LocalDate endDate) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getOverlappingApprovedLeaves(startDate, endDate);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get requests approved by specific employee
     */
    @GetMapping("/approved-by/{approverId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsApprovedBy(@PathVariable String approverId) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsApprovedBy(approverId);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get pending requests older than specified days
     */
    @GetMapping("/pending/older-than/{days}")
    public ResponseEntity<List<LeaveRequest>> getPendingRequestsOlderThan(@PathVariable int days) {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getPendingRequestsOlderThan(days);
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recent leave requests
     */
    @GetMapping("/recent")
    public ResponseEntity<List<LeaveRequest>> getRecentLeaveRequests() {
        try {
            List<LeaveRequest> leaveRequests = leaveRequestService.getRecentLeaveRequests();
            return ResponseEntity.ok(leaveRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Count leave requests by status for employee
     */
    @GetMapping("/employee/{employeeId}/count/{status}")
    public ResponseEntity<Long> countLeaveRequestsByStatus(@PathVariable String employeeId,
                                                          @PathVariable RequestStatus status) {
        try {
            long count = leaveRequestService.countLeaveRequestsByStatus(employeeId, status);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
