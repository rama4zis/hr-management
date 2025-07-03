package com.hrmanagement.hr_management_api.repository;

import com.hrmanagement.hr_management_api.model.entity.Attendance;
import com.hrmanagement.hr_management_api.model.enums.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    
    /**
     * Find attendance by employee ID and date
     */
    Optional<Attendance> findByEmployeeIdAndDate(String employeeId, LocalDate date);
    
    /**
     * Find all attendance records for an employee
     */
    List<Attendance> findByEmployeeId(String employeeId);
    
    /**
     * Find attendance records for an employee within date range
     */
    List<Attendance> findByEmployeeIdAndDateBetween(String employeeId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Find attendance records by date range
     */
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Find attendance records by status
     */
    List<Attendance> findByStatus(AttendanceStatus status);
    
    /**
     * Find attendance records by employee and status
     */
    List<Attendance> findByEmployeeIdAndStatus(String employeeId, AttendanceStatus status);
    
    /**
     * Find attendance records by date and status
     */
    List<Attendance> findByDateAndStatus(LocalDate date, AttendanceStatus status);
    
    /**
     * Find attendance records for a specific date
     */
    List<Attendance> findByDate(LocalDate date);
    
    /**
     * Find attendance records with pagination
     */
    Page<Attendance> findByEmployeeId(String employeeId, Pageable pageable);
    
    /**
     * Check if attendance exists for employee on date
     */
    boolean existsByEmployeeIdAndDate(String employeeId, LocalDate date);
    
    /**
     * Count attendance by status for an employee in date range
     */
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employeeId = :employeeId " +
           "AND a.date BETWEEN :startDate AND :endDate AND a.status = :status")
    long countByEmployeeAndStatusInDateRange(@Param("employeeId") String employeeId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate,
                                           @Param("status") AttendanceStatus status);
    
    /**
     * Calculate total hours for employee in date range
     */
    @Query("SELECT COALESCE(SUM(a.totalHours), 0) FROM Attendance a WHERE a.employeeId = :employeeId " +
           "AND a.date BETWEEN :startDate AND :endDate")
    BigDecimal getTotalHoursByEmployeeInDateRange(@Param("employeeId") String employeeId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);
    
    /**
     * Get attendance with employee details
     */
    @Query("SELECT a, e.firstName, e.lastName, d.name as departmentName " +
           "FROM Attendance a " +
           "LEFT JOIN Employee e ON a.employeeId = e.id " +
           "LEFT JOIN Department d ON e.departmentId = d.id " +
           "WHERE a.date BETWEEN :startDate AND :endDate " +
           "ORDER BY a.date DESC, e.firstName")
    List<Object[]> findAttendanceWithEmployeeDetails(@Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);
    
    /**
     * Get attendance summary by status for date range
     */
    @Query("SELECT a.status, COUNT(a) " +
           "FROM Attendance a " +
           "WHERE a.date BETWEEN :startDate AND :endDate " +
           "GROUP BY a.status")
    List<Object[]> getAttendanceSummaryByStatus(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);
    
    /**
     * Find employees with no attendance on specific date
     */
    @Query("SELECT e FROM Employee e WHERE e.status = 'ACTIVE' " +
           "AND e.id NOT IN (SELECT a.employeeId FROM Attendance a WHERE a.date = :date)")
    List<Object> findEmployeesWithoutAttendance(@Param("date") LocalDate date);
    
    /**
     * Find attendance records for month and year
     */
    @Query("SELECT a FROM Attendance a WHERE YEAR(a.date) = :year AND MONTH(a.date) = :month")
    List<Attendance> findByMonthAndYear(@Param("month") int month, @Param("year") int year);
    
    /**
     * Find attendance records for employee in month and year
     */
    @Query("SELECT a FROM Attendance a WHERE a.employeeId = :employeeId " +
           "AND YEAR(a.date) = :year AND MONTH(a.date) = :month " +
           "ORDER BY a.date")
    List<Attendance> findByEmployeeAndMonthAndYear(@Param("employeeId") String employeeId,
                                                  @Param("month") int month,
                                                  @Param("year") int year);
    
    /**
     * Find latest attendance records ordered by date
     */
    List<Attendance> findTop10ByOrderByDateDescCreatedAtDesc();
    
    /**
     * Find attendance records that need clock out (clock in but no clock out)
     */
    List<Attendance> findByClockInIsNotNullAndClockOutIsNull();
}
