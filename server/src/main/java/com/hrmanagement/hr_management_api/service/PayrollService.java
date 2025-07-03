package com.hrmanagement.hr_management_api.service;

import com.hrmanagement.hr_management_api.model.entity.Payroll;
import com.hrmanagement.hr_management_api.model.enums.PayrollStatus;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import com.hrmanagement.hr_management_api.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public PayrollService(PayrollRepository payrollRepository, EmployeeRepository employeeRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Get all payroll records
     */
    @Transactional(readOnly = true)
    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    /**
     * Get payroll by ID
     */
    @Transactional(readOnly = true)
    public Optional<Payroll> getPayrollById(String id) {
        return payrollRepository.findById(id);
    }

    /**
     * Get payroll records for employee
     */
    @Transactional(readOnly = true)
    public List<Payroll> getPayrollByEmployee(String employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    /**
     * Get payroll records for employee with pagination
     */
    @Transactional(readOnly = true)
    public Page<Payroll> getPayrollByEmployee(String employeeId, Pageable pageable) {
        return payrollRepository.findByEmployeeId(employeeId, pageable);
    }

    /**
     * Get payroll by employee and pay period
     */
    @Transactional(readOnly = true)
    public Optional<Payroll> getPayrollByEmployeeAndPeriod(String employeeId, LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        return payrollRepository.findByEmployeeIdAndPayPeriodStartAndPayPeriodEnd(employeeId, payPeriodStart, payPeriodEnd);
    }

    /**
     * Get payroll records by status
     */
    @Transactional(readOnly = true)
    public List<Payroll> getPayrollByStatus(PayrollStatus status) {
        return payrollRepository.findByStatus(status);
    }

    /**
     * Get payroll records for pay period
     */
    @Transactional(readOnly = true)
    public List<Payroll> getPayrollByPeriod(LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        return payrollRepository.findByPayPeriodStartAndPayPeriodEnd(payPeriodStart, payPeriodEnd);
    }

    /**
     * Create payroll record
     */
    public Payroll createPayroll(Payroll payroll) {
        validateEmployeeExists(payroll.getEmployeeId());
        validatePayPeriod(payroll.getPayPeriodStart(), payroll.getPayPeriodEnd());

        // Check if payroll already exists for this employee and period
        if (payrollRepository.existsByEmployeeIdAndPayPeriodStartAndPayPeriodEnd(
                payroll.getEmployeeId(), payroll.getPayPeriodStart(), payroll.getPayPeriodEnd())) {
            throw new RuntimeException("Payroll already exists for employee in this pay period");
        }

        payroll.setStatus(PayrollStatus.DRAFT);
        payroll.calculatePay();

        return payrollRepository.save(payroll);
    }

    /**
     * Update payroll record
     */
    public Payroll updatePayroll(String id, Payroll payroll) {
        Payroll existingPayroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        // Only allow updates if payroll is in draft status
        if (existingPayroll.getStatus() != PayrollStatus.DRAFT) {
            throw new RuntimeException("Cannot update payroll that has already been processed");
        }

        validateEmployeeExists(payroll.getEmployeeId());
        validatePayPeriod(payroll.getPayPeriodStart(), payroll.getPayPeriodEnd());

        existingPayroll.setEmployeeId(payroll.getEmployeeId());
        existingPayroll.setPayPeriodStart(payroll.getPayPeriodStart());
        existingPayroll.setPayPeriodEnd(payroll.getPayPeriodEnd());
        existingPayroll.setBaseSalary(payroll.getBaseSalary());
        existingPayroll.setOvertime(payroll.getOvertime());
        existingPayroll.setBonuses(payroll.getBonuses());
        existingPayroll.setDeductions(payroll.getDeductions());

        existingPayroll.calculatePay();

        return payrollRepository.save(existingPayroll);
    }

    /**
     * Process payroll (change status from draft to processed)
     */
    public Payroll processPayroll(String id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        if (payroll.getStatus() != PayrollStatus.DRAFT) {
            throw new RuntimeException("Payroll must be in draft status to process");
        }

        payroll.process();
        return payrollRepository.save(payroll);
    }

    /**
     * Mark payroll as paid
     */
    public Payroll markPayrollAsPaid(String id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        if (payroll.getStatus() != PayrollStatus.PROCESSED) {
            throw new RuntimeException("Payroll must be processed before marking as paid");
        }

        payroll.markAsPaid();
        return payrollRepository.save(payroll);
    }

    /**
     * Delete payroll record
     */
    public void deletePayroll(String id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with id: " + id));

        // Only allow deletion if payroll is in draft status
        if (payroll.getStatus() != PayrollStatus.DRAFT) {
            throw new RuntimeException("Cannot delete payroll that has already been processed");
        }

        payrollRepository.delete(payroll);
    }

    /**
     * Get payroll records for month and year
     */
    @Transactional(readOnly = true)
    public List<Payroll> getPayrollByMonthAndYear(int month, int year) {
        return payrollRepository.findByMonthAndYear(month, year);
    }

    /**
     * Get payroll records for employee in month and year
     */
    @Transactional(readOnly = true)
    public List<Payroll> getPayrollByEmployeeAndMonthAndYear(String employeeId, int month, int year) {
        return payrollRepository.findByEmployeeAndMonthAndYear(employeeId, month, year);
    }

    /**
     * Get payroll with employee details
     */
    @Transactional(readOnly = true)
    public List<Object[]> getPayrollWithEmployeeDetails(LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        return payrollRepository.findPayrollWithEmployeeDetails(payPeriodStart, payPeriodEnd);
    }

    /**
     * Get payroll summary by status
     */
    @Transactional(readOnly = true)
    public List<Object[]> getPayrollSummaryByStatus(LocalDate startDate, LocalDate endDate) {
        return payrollRepository.getPayrollSummaryByStatus(startDate, endDate);
    }

    /**
     * Get payroll summary by department
     */
    @Transactional(readOnly = true)
    public List<Object[]> getPayrollSummaryByDepartment(LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        return payrollRepository.getPayrollSummaryByDepartment(payPeriodStart, payPeriodEnd);
    }

    /**
     * Get total payroll amount by status
     */
    @Transactional(readOnly = true)
    public BigDecimal getTotalPayrollByStatus(PayrollStatus status, LocalDate startDate, LocalDate endDate) {
        return payrollRepository.getTotalPayrollByStatusInDateRange(status, startDate, endDate);
    }

    /**
     * Get employee annual pay
     */
    @Transactional(readOnly = true)
    public BigDecimal getEmployeeAnnualPay(String employeeId, int year) {
        return payrollRepository.getEmployeeAnnualPay(employeeId, year);
    }

    /**
     * Get unprocessed payroll records older than specified days
     */
    @Transactional(readOnly = true)
    public List<Payroll> getUnprocessedPayrollOlderThan(int days) {
        LocalDate cutoffDate = LocalDate.now().minusDays(days);
        return payrollRepository.findUnprocessedPayrollOlderThan(cutoffDate);
    }

    /**
     * Get processed but unpaid payroll records
     */
    @Transactional(readOnly = true)
    public List<Payroll> getProcessedUnpaidPayroll() {
        return payrollRepository.findByStatusAndPaidDateIsNull(PayrollStatus.PROCESSED);
    }

    /**
     * Get recent payroll records
     */
    @Transactional(readOnly = true)
    public List<Payroll> getRecentPayroll() {
        return payrollRepository.findTop10ByOrderByPayPeriodStartDescCreatedAtDesc();
    }

    /**
     * Count payroll records by status
     */
    @Transactional(readOnly = true)
    public long countPayrollByStatus(PayrollStatus status) {
        return payrollRepository.countByStatus(status);
    }

    /**
     * Process all draft payrolls for a pay period
     */
    public List<Payroll> processAllPayrollsForPeriod(LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        List<Payroll> payrolls = payrollRepository.findByPayPeriodStartAndPayPeriodEnd(payPeriodStart, payPeriodEnd);
        
        List<Payroll> processedPayrolls = payrolls.stream()
                .filter(payroll -> payroll.getStatus() == PayrollStatus.DRAFT)
                .map(payroll -> {
                    payroll.process();
                    return payrollRepository.save(payroll);
                })
                .toList();

        return processedPayrolls;
    }

    /**
     * Mark all processed payrolls as paid for a pay period
     */
    public List<Payroll> markAllPayrollsAsPaidForPeriod(LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        List<Payroll> payrolls = payrollRepository.findByPayPeriodStartAndPayPeriodEnd(payPeriodStart, payPeriodEnd);
        
        List<Payroll> paidPayrolls = payrolls.stream()
                .filter(payroll -> payroll.getStatus() == PayrollStatus.PROCESSED)
                .map(payroll -> {
                    payroll.markAsPaid();
                    return payrollRepository.save(payroll);
                })
                .toList();

        return paidPayrolls;
    }

    /**
     * Validate employee exists
     */
    private void validateEmployeeExists(String employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException("Employee not found with id: " + employeeId);
        }
    }

    /**
     * Validate pay period dates
     */
    private void validatePayPeriod(LocalDate payPeriodStart, LocalDate payPeriodEnd) {
        if (payPeriodEnd.isBefore(payPeriodStart)) {
            throw new RuntimeException("Pay period end date cannot be before start date");
        }

        if (payPeriodStart.isAfter(LocalDate.now())) {
            throw new RuntimeException("Pay period start date cannot be in the future");
        }
    }
}
