package com.hrmanagement.hr_management_api.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.Payroll;
import com.hrmanagement.hr_management_api.model.enums.PayrollStatus;

public interface PayrollRepository extends JpaRepository<Payroll, String> {

    // Find all non-deleted payroll records
    List<Payroll> findByIsDeletedFalse();
    
    // Find by ID and not deleted
    Optional<Payroll> findByIdAndIsDeletedFalse(String id);

    // Find payroll records by employee ID (non-deleted)
    List<Payroll> findByEmployeeIdAndIsDeletedFalse(String employeeId);

    // Find payroll records by status (non-deleted)
    List<Payroll> findByPayrollStatusAndIsDeletedFalse(PayrollStatus status);

    // Find payroll records by employee and status (non-deleted)
    List<Payroll> findByEmployeeIdAndPayrollStatusAndIsDeletedFalse(String employeeId, PayrollStatus status);

    // Find payroll records by pay period date range (non-deleted)
    List<Payroll> findByPayPeriodStartBetweenAndIsDeletedFalse(LocalDate startDate, LocalDate endDate);

    // Find payroll records by employee and pay period date range (non-deleted)
    List<Payroll> findByEmployeeIdAndPayPeriodStartBetweenAndIsDeletedFalse(String employeeId, LocalDate startDate, LocalDate endDate);

    // Find payroll records by processed date (non-deleted)
    List<Payroll> findByProcessedDateAndIsDeletedFalse(LocalDate processedDate);

    // Find payroll records by processed date range (non-deleted)
    List<Payroll> findByProcessedDateBetweenAndIsDeletedFalse(LocalDate startDate, LocalDate endDate);

    // Find pending payroll records (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE p.payrollStatus = 'PENDING' AND p.isDeleted = false")
    List<Payroll> findPendingPayrolls();

    // Find approved payroll records (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE p.payrollStatus = 'APPROVED' AND p.isDeleted = false")
    List<Payroll> findApprovedPayrolls();

    // Find completed payroll records (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE p.payrollStatus = 'COMPLETED' AND p.isDeleted = false")
    List<Payroll> findCompletedPayrolls();

    // Find draft payroll records (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE p.payrollStatus = 'DRAFT' AND p.isDeleted = false")
    List<Payroll> findDraftPayrolls();

    // Find processing payroll records (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE p.payrollStatus = 'PROCESSING' AND p.isDeleted = false")
    List<Payroll> findProcessingPayrolls();

    // Find failed payroll records (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE p.payrollStatus = 'FAILED' AND p.isDeleted = false")
    List<Payroll> findFailedPayrolls();

    // Count payroll records by employee (non-deleted)
    @Query("SELECT COUNT(p) FROM Payroll p WHERE p.employeeId = :employeeId AND p.isDeleted = false")
    long countByEmployeeIdAndIsDeletedFalse(@Param("employeeId") String employeeId);

    // Count payroll records by status (non-deleted)
    @Query("SELECT COUNT(p) FROM Payroll p WHERE p.payrollStatus = :status AND p.isDeleted = false")
    long countByPayrollStatusAndIsDeletedFalse(@Param("status") PayrollStatus status);

    // Count non-deleted payroll records
    @Query("SELECT COUNT(p) FROM Payroll p WHERE p.isDeleted = false")
    long countByIsDeletedFalse();

    // Get total salary paid by employee (non-deleted, completed)
    @Query("SELECT COALESCE(SUM(p.netPay), 0) FROM Payroll p " +
           "WHERE p.employeeId = :employeeId " +
           "AND p.payrollStatus = 'COMPLETED' " +
           "AND p.isDeleted = false")
    BigDecimal getTotalSalaryPaidByEmployee(@Param("employeeId") String employeeId);

    // Get total salary paid by employee in a year (non-deleted, completed)
    @Query("SELECT COALESCE(SUM(p.netPay), 0) FROM Payroll p " +
           "WHERE p.employeeId = :employeeId " +
           "AND p.payrollStatus = 'COMPLETED' " +
           "AND YEAR(p.payPeriodStart) = :year " +
           "AND p.isDeleted = false")
    BigDecimal getTotalSalaryPaidByEmployeeAndYear(@Param("employeeId") String employeeId, @Param("year") int year);

    // Get total payroll amount by status (non-deleted)
    @Query("SELECT COALESCE(SUM(p.netPay), 0) FROM Payroll p " +
           "WHERE p.payrollStatus = :status AND p.isDeleted = false")
    BigDecimal getTotalPayrollAmountByStatus(@Param("status") PayrollStatus status);

    // Find payroll records by year (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE YEAR(p.payPeriodStart) = :year AND p.isDeleted = false")
    List<Payroll> findByYear(@Param("year") int year);

    // Find payroll records by employee and year (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE p.employeeId = :employeeId " +
           "AND YEAR(p.payPeriodStart) = :year AND p.isDeleted = false")
    List<Payroll> findByEmployeeIdAndYear(@Param("employeeId") String employeeId, @Param("year") int year);

    // Find payroll records by month and year (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE YEAR(p.payPeriodStart) = :year " +
           "AND MONTH(p.payPeriodStart) = :month AND p.isDeleted = false")
    List<Payroll> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    // Find payroll records by employee, month and year (non-deleted)
    @Query("SELECT p FROM Payroll p WHERE p.employeeId = :employeeId " +
           "AND YEAR(p.payPeriodStart) = :year " +
           "AND MONTH(p.payPeriodStart) = :month AND p.isDeleted = false")
    List<Payroll> findByEmployeeIdMonthAndYear(@Param("employeeId") String employeeId, 
                                               @Param("month") int month, 
                                               @Param("year") int year);

    // Check if payroll exists for employee and pay period (non-deleted)
    @Query("SELECT COUNT(p) > 0 FROM Payroll p WHERE p.employeeId = :employeeId " +
           "AND p.payPeriodStart = :startDate AND p.payPeriodEnd = :endDate " +
           "AND p.isDeleted = false")
    boolean existsByEmployeeIdAndPayPeriod(@Param("employeeId") String employeeId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    // Find overdue payrolls (approved but not completed after 30 days)
    @Query("SELECT p FROM Payroll p WHERE p.payrollStatus = 'APPROVED' " +
           "AND p.processedDate < :cutoffDate AND p.isDeleted = false")
    List<Payroll> findOverduePayrolls(@Param("cutoffDate") LocalDate cutoffDate);

}
