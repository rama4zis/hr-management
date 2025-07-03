package com.hrmanagement.hr_management_api.repository;

import com.hrmanagement.hr_management_api.model.entity.Payroll;
import com.hrmanagement.hr_management_api.model.enums.PayrollStatus;
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
public interface PayrollRepository extends JpaRepository<Payroll, String> {
    
    /**
     * Find all payroll records for an employee
     */
    List<Payroll> findByEmployeeId(String employeeId);
    
    /**
     * Find payroll by employee and pay period
     */
    Optional<Payroll> findByEmployeeIdAndPayPeriodStartAndPayPeriodEnd(String employeeId,
                                                                       LocalDate payPeriodStart,
                                                                       LocalDate payPeriodEnd);
    
    /**
     * Find payroll records by status
     */
    List<Payroll> findByStatus(PayrollStatus status);
    
    /**
     * Find payroll records by employee and status
     */
    List<Payroll> findByEmployeeIdAndStatus(String employeeId, PayrollStatus status);
    
    /**
     * Find payroll records within pay period range
     */
    List<Payroll> findByPayPeriodStartBetweenOrPayPeriodEndBetween(LocalDate startDate1, LocalDate endDate1,
                                                                  LocalDate startDate2, LocalDate endDate2);
    
    /**
     * Find payroll records for specific pay period
     */
    List<Payroll> findByPayPeriodStartAndPayPeriodEnd(LocalDate payPeriodStart, LocalDate payPeriodEnd);
    
    /**
     * Find payroll records with pagination
     */
    Page<Payroll> findByEmployeeId(String employeeId, Pageable pageable);
    
    /**
     * Check if payroll exists for employee in pay period
     */
    boolean existsByEmployeeIdAndPayPeriodStartAndPayPeriodEnd(String employeeId,
                                                              LocalDate payPeriodStart,
                                                              LocalDate payPeriodEnd);
    
    /**
     * Count payroll records by status
     */
    long countByStatus(PayrollStatus status);
    
    /**
     * Get total payroll amount by status in date range
     */
    @Query("SELECT COALESCE(SUM(p.netPay), 0) FROM Payroll p WHERE p.status = :status " +
           "AND p.payPeriodStart BETWEEN :startDate AND :endDate")
    BigDecimal getTotalPayrollByStatusInDateRange(@Param("status") PayrollStatus status,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);
    
    /**
     * Get payroll with employee details
     */
    @Query("SELECT p, e.firstName, e.lastName, d.name as departmentName, pos.title as positionTitle " +
           "FROM Payroll p " +
           "LEFT JOIN Employee e ON p.employeeId = e.id " +
           "LEFT JOIN Department d ON e.departmentId = d.id " +
           "LEFT JOIN Position pos ON e.positionId = pos.id " +
           "WHERE p.payPeriodStart = :payPeriodStart AND p.payPeriodEnd = :payPeriodEnd " +
           "ORDER BY e.firstName, e.lastName")
    List<Object[]> findPayrollWithEmployeeDetails(@Param("payPeriodStart") LocalDate payPeriodStart,
                                                 @Param("payPeriodEnd") LocalDate payPeriodEnd);
    
    /**
     * Get payroll summary by status
     */
    @Query("SELECT p.status, COUNT(p), SUM(p.grossPay), SUM(p.netPay) " +
           "FROM Payroll p " +
           "WHERE p.payPeriodStart BETWEEN :startDate AND :endDate " +
           "GROUP BY p.status")
    List<Object[]> getPayrollSummaryByStatus(@Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);
    
    /**
     * Get payroll summary by department for pay period
     */
    @Query("SELECT d.name, COUNT(p), SUM(p.grossPay), SUM(p.netPay) " +
           "FROM Payroll p " +
           "LEFT JOIN Employee e ON p.employeeId = e.id " +
           "LEFT JOIN Department d ON e.departmentId = d.id " +
           "WHERE p.payPeriodStart = :payPeriodStart AND p.payPeriodEnd = :payPeriodEnd " +
           "GROUP BY d.id, d.name " +
           "ORDER BY d.name")
    List<Object[]> getPayrollSummaryByDepartment(@Param("payPeriodStart") LocalDate payPeriodStart,
                                                @Param("payPeriodEnd") LocalDate payPeriodEnd);
    
    /**
     * Find payroll records for month and year
     */
    @Query("SELECT p FROM Payroll p WHERE " +
           "YEAR(p.payPeriodStart) = :year AND MONTH(p.payPeriodStart) = :month")
    List<Payroll> findByMonthAndYear(@Param("month") int month, @Param("year") int year);
    
    /**
     * Find payroll records by employee in month and year
     */
    @Query("SELECT p FROM Payroll p WHERE p.employeeId = :employeeId " +
           "AND YEAR(p.payPeriodStart) = :year AND MONTH(p.payPeriodStart) = :month " +
           "ORDER BY p.payPeriodStart")
    List<Payroll> findByEmployeeAndMonthAndYear(@Param("employeeId") String employeeId,
                                               @Param("month") int month,
                                               @Param("year") int year);
    
    /**
     * Find latest payroll records ordered by pay period
     */
    List<Payroll> findTop10ByOrderByPayPeriodStartDescCreatedAtDesc();
    
    /**
     * Find unprocessed payroll records (draft status older than X days)
     */
    @Query("SELECT p FROM Payroll p WHERE p.status = 'DRAFT' " +
           "AND p.createdAt < :cutoffDate")
    List<Payroll> findUnprocessedPayrollOlderThan(@Param("cutoffDate") LocalDate cutoffDate);
    
    /**
     * Find processed but unpaid payroll records
     */
    List<Payroll> findByStatusAndPaidDateIsNull(PayrollStatus status);
    
    /**
     * Get employee annual salary summary
     */
    @Query("SELECT COALESCE(SUM(p.netPay), 0) FROM Payroll p WHERE p.employeeId = :employeeId " +
           "AND YEAR(p.payPeriodStart) = :year AND p.status = 'PAID'")
    BigDecimal getEmployeeAnnualPay(@Param("employeeId") String employeeId, @Param("year") int year);
}
