package com.hrmanagement.hr_management_api.service;

import com.hrmanagement.hr_management_api.model.entity.LeaveRequest;
import com.hrmanagement.hr_management_api.model.enums.LeaveType;
import com.hrmanagement.hr_management_api.model.enums.RequestStatus;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import com.hrmanagement.hr_management_api.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository, EmployeeRepository employeeRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Get all leave requests
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    /**
     * Get leave request by ID
     */
    @Transactional(readOnly = true)
    public Optional<LeaveRequest> getLeaveRequestById(String id) {
        return leaveRequestRepository.findById(id);
    }

    /**
     * Get leave requests for employee
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByEmployee(String employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    /**
     * Get leave requests for employee with pagination
     */
    @Transactional(readOnly = true)
    public Page<LeaveRequest> getLeaveRequestsByEmployee(String employeeId, Pageable pageable) {
        return leaveRequestRepository.findByEmployeeId(employeeId, pageable);
    }

    /**
     * Get leave requests by status
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByStatus(RequestStatus status) {
        return leaveRequestRepository.findByStatusOrderByRequestDateAsc(status);
    }

    /**
     * Get pending leave requests
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getPendingLeaveRequests() {
        return leaveRequestRepository.findByStatusOrderByRequestDateAsc(RequestStatus.PENDING);
    }

    /**
     * Create leave request
     */
    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        validateEmployeeExists(leaveRequest.getEmployeeId());
        validateLeaveRequest(leaveRequest);

        // Calculate total days
        int totalDays = (int) ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
        leaveRequest.setTotalDays(totalDays);
        leaveRequest.setStatus(RequestStatus.PENDING);
        leaveRequest.setRequestDate(LocalDate.now());

        return leaveRequestRepository.save(leaveRequest);
    }

    /**
     * Update leave request
     */
    public LeaveRequest updateLeaveRequest(String id, LeaveRequest leaveRequest) {
        LeaveRequest existingRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));

        // Only allow updates if request is still pending
        if (existingRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Cannot update leave request that has already been processed");
        }

        validateEmployeeExists(leaveRequest.getEmployeeId());
        validateLeaveRequest(leaveRequest);

        existingRequest.setEmployeeId(leaveRequest.getEmployeeId());
        existingRequest.setType(leaveRequest.getType());
        existingRequest.setStartDate(leaveRequest.getStartDate());
        existingRequest.setEndDate(leaveRequest.getEndDate());
        existingRequest.setReason(leaveRequest.getReason());

        // Recalculate total days
        int totalDays = (int) ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
        existingRequest.setTotalDays(totalDays);

        return leaveRequestRepository.save(existingRequest);
    }

    /**
     * Approve leave request
     */
    public LeaveRequest approveLeaveRequest(String id, String approverId, String comments) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Leave request has already been processed");
        }

        validateEmployeeExists(approverId);
        leaveRequest.approve(approverId, comments);

        return leaveRequestRepository.save(leaveRequest);
    }

    /**
     * Reject leave request
     */
    public LeaveRequest rejectLeaveRequest(String id, String approverId, String comments) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Leave request has already been processed");
        }

        validateEmployeeExists(approverId);
        leaveRequest.reject(approverId, comments);

        return leaveRequestRepository.save(leaveRequest);
    }

    /**
     * Delete leave request
     */
    public void deleteLeaveRequest(String id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));

        // Only allow deletion if request is pending
        if (leaveRequest.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Cannot delete leave request that has already been processed");
        }

        leaveRequestRepository.delete(leaveRequest);
    }

    /**
     * Get leave requests by type
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByType(LeaveType type) {
        return leaveRequestRepository.findByType(type);
    }

    /**
     * Get leave requests for employee by status
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByEmployeeAndStatus(String employeeId, RequestStatus status) {
        return leaveRequestRepository.findByEmployeeIdAndStatus(employeeId, status);
    }

    /**
     * Get leave requests for month and year
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByMonthAndYear(int month, int year) {
        return leaveRequestRepository.findByMonthAndYear(month, year);
    }

    /**
     * Get leave requests for employee in month and year
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByEmployeeAndMonthAndYear(String employeeId, int month, int year) {
        return leaveRequestRepository.findByEmployeeAndMonthAndYear(employeeId, month, year);
    }

    /**
     * Get leave requests with employee details
     */
    @Transactional(readOnly = true)
    public List<Object[]> getLeaveRequestsWithEmployeeDetails(RequestStatus status) {
        return leaveRequestRepository.findLeaveRequestsWithEmployeeDetails(status);
    }

    /**
     * Get leave request summary by type
     */
    @Transactional(readOnly = true)
    public List<Object[]> getLeaveRequestSummaryByType(LocalDate startDate, LocalDate endDate) {
        return leaveRequestRepository.getLeaveRequestSummaryByType(startDate, endDate);
    }

    /**
     * Get total leave days for employee by type and year
     */
    @Transactional(readOnly = true)
    public Integer getTotalLeaveDaysByTypeAndYear(String employeeId, LeaveType leaveType, int year) {
        return leaveRequestRepository.getTotalLeaveDaysByTypeAndYear(employeeId, leaveType, year);
    }

    /**
     * Get overlapping approved leaves for date range
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getOverlappingApprovedLeaves(LocalDate startDate, LocalDate endDate) {
        return leaveRequestRepository.findOverlappingApprovedLeaves(startDate, endDate);
    }

    /**
     * Get requests approved by specific employee
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsApprovedBy(String approverId) {
        return leaveRequestRepository.findByApprovedBy(approverId);
    }

    /**
     * Get pending requests older than specified days
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getPendingRequestsOlderThan(int days) {
        LocalDate cutoffDate = LocalDate.now().minusDays(days);
        return leaveRequestRepository.findPendingLeaveRequestsOlderThan(cutoffDate);
    }

    /**
     * Get recent leave requests
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getRecentLeaveRequests() {
        return leaveRequestRepository.findTop10ByOrderByRequestDateDescCreatedAtDesc();
    }

    /**
     * Count leave requests by status for employee
     */
    @Transactional(readOnly = true)
    public long countLeaveRequestsByStatus(String employeeId, RequestStatus status) {
        return leaveRequestRepository.countByEmployeeIdAndStatus(employeeId, status);
    }

    /**
     * Validate leave request
     */
    private void validateLeaveRequest(LeaveRequest leaveRequest) {
        // Validate dates
        if (leaveRequest.getEndDate().isBefore(leaveRequest.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        // Check for overlapping leave requests for the same employee
        List<LeaveRequest> overlapping = leaveRequestRepository.findEmployeeOverlappingLeaves(
                leaveRequest.getEmployeeId(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate()
        );

        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Employee already has overlapping leave request for this period");
        }

        // Validate start date is not in the past (except for today)
        if (leaveRequest.getStartDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Leave start date cannot be in the past");
        }
    }

    /**
     * Validate employee exists
     */
    private void validateEmployeeExists(String employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException("Employee not found with id: " + employeeId);
        }
    }
}
