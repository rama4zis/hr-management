package com.hrmanagement.hr_management_api.repository;

import com.hrmanagement.hr_management_api.model.entity.LeaveRequest;
import com.hrmanagement.hr_management_api.model.enums.LeaveType;
import com.hrmanagement.hr_management_api.model.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {
    
    /**
     * Find all leave requests for an employee
     */
    List<LeaveRequest> findByEmployeeId(String employeeId);
    
    /**
     * Find leave requests by status
     */
    List<LeaveRequest> findByStatus(RequestStatus status);
    
    /**
     * Find leave requests by type
     */
    List<LeaveRequest> findByType(LeaveType type);
    
    /**
     * Find leave requests by employee and status
     */
    List<LeaveRequest> findByEmployeeIdAndStatus(String employeeId, RequestStatus status);
    
    /**
     * Find leave requests by employee and type
     */
    List<LeaveRequest> findByEmployeeIdAndType(String employeeId, LeaveType type);
    
    /**
     * Find leave requests within date range
     */
    List<LeaveRequest> findByStartDateBetweenOrEndDateBetween(LocalDate startDate1, LocalDate endDate1,
                                                            LocalDate startDate2, LocalDate endDate2);
    
    /**
     * Find leave requests that overlap with given date range
     */
    @Query("SELECT lr FROM LeaveRequest lr WHERE " +
           "(lr.startDate <= :endDate AND lr.endDate >= :startDate) " +
           "AND lr.status = 'APPROVED'")
    List<LeaveRequest> findOverlappingApprovedLeaves(@Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);
    
    /**
     * Find leave requests for employee that overlap with date range
     */
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employeeId = :employeeId " +
           "AND (lr.startDate <= :endDate AND lr.endDate >= :startDate) " +
           "AND lr.status IN ('PENDING', 'APPROVED')")
    List<LeaveRequest> findEmployeeOverlappingLeaves(@Param("employeeId") String employeeId,
                                                    @Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);
    
    /**
     * Find pending leave requests
     */
    List<LeaveRequest> findByStatusOrderByRequestDateAsc(RequestStatus status);
    
    /**
     * Find leave requests with pagination
     */
    Page<LeaveRequest> findByEmployeeId(String employeeId, Pageable pageable);
    
    /**
     * Find leave requests approved by specific employee
     */
    List<LeaveRequest> findByApprovedBy(String approverId);
    
    /**
     * Count leave requests by status for employee
     */
    long countByEmployeeIdAndStatus(String employeeId, RequestStatus status);
    
    /**
     * Count total leave days for employee in year by type
     */
    @Query("SELECT COALESCE(SUM(lr.totalDays), 0) FROM LeaveRequest lr WHERE lr.employeeId = :employeeId " +
           "AND lr.type = :leaveType AND lr.status = 'APPROVED' " +
           "AND YEAR(lr.startDate) = :year")
    Integer getTotalLeaveDaysByTypeAndYear(@Param("employeeId") String employeeId,
                                         @Param("leaveType") LeaveType leaveType,
                                         @Param("year") int year);
    
    /**
     * Get leave requests with employee details
     */
    @Query("SELECT lr, e.firstName, e.lastName, d.name as departmentName " +
           "FROM LeaveRequest lr " +
           "LEFT JOIN Employee e ON lr.employeeId = e.id " +
           "LEFT JOIN Department d ON e.departmentId = d.id " +
           "WHERE lr.status = :status " +
           "ORDER BY lr.requestDate ASC")
    List<Object[]> findLeaveRequestsWithEmployeeDetails(@Param("status") RequestStatus status);
    
    /**
     * Get leave request summary by type for date range
     */
    @Query("SELECT lr.type, COUNT(lr), SUM(lr.totalDays) " +
           "FROM LeaveRequest lr " +
           "WHERE lr.startDate BETWEEN :startDate AND :endDate " +
           "AND lr.status = 'APPROVED' " +
           "GROUP BY lr.type")
    List<Object[]> getLeaveRequestSummaryByType(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);
    
    /**
     * Find leave requests for month and year
     */
    @Query("SELECT lr FROM LeaveRequest lr WHERE " +
           "YEAR(lr.startDate) = :year AND MONTH(lr.startDate) = :month")
    List<LeaveRequest> findByMonthAndYear(@Param("month") int month, @Param("year") int year);
    
    /**
     * Find leave requests by employee in month and year
     */
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employeeId = :employeeId " +
           "AND ((YEAR(lr.startDate) = :year AND MONTH(lr.startDate) = :month) " +
           "OR (YEAR(lr.endDate) = :year AND MONTH(lr.endDate) = :month)) " +
           "ORDER BY lr.startDate")
    List<LeaveRequest> findByEmployeeAndMonthAndYear(@Param("employeeId") String employeeId,
                                                    @Param("month") int month,
                                                    @Param("year") int year);
    
    /**
     * Find recent leave requests ordered by request date
     */
    List<LeaveRequest> findTop10ByOrderByRequestDateDescCreatedAtDesc();
    
    /**
     * Find leave requests that need approval (pending for more than X days)
     */
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.status = 'PENDING' " +
           "AND lr.requestDate < :cutoffDate")
    List<LeaveRequest> findPendingLeaveRequestsOlderThan(@Param("cutoffDate") LocalDate cutoffDate);
}
