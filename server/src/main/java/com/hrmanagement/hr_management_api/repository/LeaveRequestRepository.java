package com.hrmanagement.hr_management_api.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.LeaveRequest;
import com.hrmanagement.hr_management_api.model.enums.LeaveRequestStatus;
import com.hrmanagement.hr_management_api.model.enums.LeaveRequestType;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {

    // Find all non-deleted leave requests
    List<LeaveRequest> findByIsDeletedFalse();
    
    // Find by ID and not deleted
    Optional<LeaveRequest> findByIdAndIsDeletedFalse(String id);

    // Find leave requests by employee ID (non-deleted)
    List<LeaveRequest> findByEmployeeIdAndIsDeletedFalse(String employeeId);

    // Find leave requests by status (non-deleted)
    List<LeaveRequest> findByLeaveRequestStatusAndIsDeletedFalse(LeaveRequestStatus status);

    // Find leave requests by type (non-deleted)
    List<LeaveRequest> findByLeaveRequestTypeAndIsDeletedFalse(LeaveRequestType type);

    // Find leave requests by employee and status (non-deleted)
    List<LeaveRequest> findByEmployeeIdAndLeaveRequestStatusAndIsDeletedFalse(String employeeId, LeaveRequestStatus status);

    // Find leave requests by employee and type (non-deleted)
    List<LeaveRequest> findByEmployeeIdAndLeaveRequestTypeAndIsDeletedFalse(String employeeId, LeaveRequestType type);

    // Find leave requests by date range (non-deleted)
    List<LeaveRequest> findByStartDateBetweenAndIsDeletedFalse(LocalDate startDate, LocalDate endDate);

    // Find leave requests by employee and date range (non-deleted)
    List<LeaveRequest> findByEmployeeIdAndStartDateBetweenAndIsDeletedFalse(String employeeId, LocalDate startDate, LocalDate endDate);

    // Find leave requests by approver (non-deleted)
    List<LeaveRequest> findByApprovedByAndIsDeletedFalse(String approverId);

    // Find pending leave requests (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.leaveRequestStatus = 'PENDING' AND lr.isDeleted = false")
    List<LeaveRequest> findPendingRequests();

    // Find approved leave requests (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.leaveRequestStatus = 'APPROVED' AND lr.isDeleted = false")
    List<LeaveRequest> findApprovedRequests();

    // Find rejected leave requests (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.leaveRequestStatus = 'REJECTED' AND lr.isDeleted = false")
    List<LeaveRequest> findRejectedRequests();

    // Find cancelled leave requests (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.leaveRequestStatus = 'CANCELLED' AND lr.isDeleted = false")
    List<LeaveRequest> findCancelledRequests();

    // Find overlapping leave requests for an employee (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employeeId = :employeeId " +
           "AND lr.leaveRequestStatus = 'APPROVED' " +
           "AND ((lr.startDate <= :endDate AND lr.endDate >= :startDate)) " +
           "AND lr.isDeleted = false")
    List<LeaveRequest> findOverlappingLeaveRequests(@Param("employeeId") String employeeId,
                                                    @Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);

    // Count leave requests by employee (non-deleted)
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.employeeId = :employeeId AND lr.isDeleted = false")
    long countByEmployeeIdAndIsDeletedFalse(@Param("employeeId") String employeeId);

    // Count leave requests by status (non-deleted)
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.leaveRequestStatus = :status AND lr.isDeleted = false")
    long countByLeaveRequestStatusAndIsDeletedFalse(@Param("status") LeaveRequestStatus status);

    // Count leave requests by type (non-deleted)
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.leaveRequestType = :type AND lr.isDeleted = false")
    long countByLeaveRequestTypeAndIsDeletedFalse(@Param("type") LeaveRequestType type);

    // Count non-deleted leave requests
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.isDeleted = false")
    long countByIsDeletedFalse();

    // Get total leave days taken by employee and type in a year (non-deleted, approved)
    @Query("SELECT COALESCE(SUM(lr.totalDays), 0) FROM LeaveRequest lr " +
           "WHERE lr.employeeId = :employeeId " +
           "AND lr.leaveRequestType = :type " +
           "AND lr.leaveRequestStatus = 'APPROVED' " +
           "AND YEAR(lr.startDate) = :year " +
           "AND lr.isDeleted = false")
    int getTotalLeaveDaysByEmployeeTypeAndYear(@Param("employeeId") String employeeId,
                                               @Param("type") LeaveRequestType type,
                                               @Param("year") int year);

    // Find leave requests by year (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE YEAR(lr.startDate) = :year AND lr.isDeleted = false")
    List<LeaveRequest> findByYear(@Param("year") int year);

    // Find leave requests by employee and year (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employeeId = :employeeId " +
           "AND YEAR(lr.startDate) = :year AND lr.isDeleted = false")
    List<LeaveRequest> findByEmployeeIdAndYear(@Param("employeeId") String employeeId, @Param("year") int year);

    // Find upcoming approved leaves (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.leaveRequestStatus = 'APPROVED' " +
           "AND lr.startDate >= CURRENT_DATE AND lr.isDeleted = false " +
           "ORDER BY lr.startDate ASC")
    List<LeaveRequest> findUpcomingApprovedLeaves();

    // Find current active leaves (non-deleted)
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.leaveRequestStatus = 'APPROVED' " +
           "AND lr.startDate <= CURRENT_DATE AND lr.endDate >= CURRENT_DATE " +
           "AND lr.isDeleted = false")
    List<LeaveRequest> findCurrentActiveLeaves();

}
