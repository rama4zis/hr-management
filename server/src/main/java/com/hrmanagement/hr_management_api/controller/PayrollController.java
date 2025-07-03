package com.hrmanagement.hr_management_api.controller;

import com.hrmanagement.hr_management_api.model.entity.Payroll;
import com.hrmanagement.hr_management_api.model.enums.PayrollStatus;
import com.hrmanagement.hr_management_api.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    private final PayrollService payrollService;

    @Autowired
    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    /**
     * Get all payroll records
     */
    @GetMapping
    public ResponseEntity<List<Payroll>> getAllPayrolls() {
        try {
            List<Payroll> payrolls = payrollService.getAllPayrolls();
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayrollById(@PathVariable String id) {
        try {
            Optional<Payroll> payroll = payrollService.getPayrollById(id);
            return payroll.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll records for employee
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollByEmployee(@PathVariable String employeeId) {
        try {
            List<Payroll> payrolls = payrollService.getPayrollByEmployee(employeeId);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll records for employee with pagination
     */
    @GetMapping("/employee/{employeeId}/paginated")
    public ResponseEntity<Page<Payroll>> getPayrollByEmployeePaginated(
            @PathVariable String employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Payroll> payrolls = payrollService.getPayrollByEmployee(employeeId, pageable);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll by employee and pay period
     */
    @GetMapping("/employee/{employeeId}/period")
    public ResponseEntity<Payroll> getPayrollByEmployeeAndPeriod(@PathVariable String employeeId,
                                                                @RequestParam LocalDate payPeriodStart,
                                                                @RequestParam LocalDate payPeriodEnd) {
        try {
            Optional<Payroll> payroll = payrollService.getPayrollByEmployeeAndPeriod(employeeId, payPeriodStart, payPeriodEnd);
            return payroll.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll records by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payroll>> getPayrollByStatus(@PathVariable PayrollStatus status) {
        try {
            List<Payroll> payrolls = payrollService.getPayrollByStatus(status);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll records for pay period
     */
    @GetMapping("/period")
    public ResponseEntity<List<Payroll>> getPayrollByPeriod(@RequestParam LocalDate payPeriodStart,
                                                           @RequestParam LocalDate payPeriodEnd) {
        try {
            List<Payroll> payrolls = payrollService.getPayrollByPeriod(payPeriodStart, payPeriodEnd);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create payroll record
     */
    @PostMapping
    public ResponseEntity<Payroll> createPayroll(@Valid @RequestBody Payroll payroll) {
        try {
            Payroll createdPayroll = payrollService.createPayroll(payroll);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update payroll record
     */
    @PutMapping("/{id}")
    public ResponseEntity<Payroll> updatePayroll(@PathVariable String id,
                                                @Valid @RequestBody Payroll payroll) {
        try {
            Payroll updatedPayroll = payrollService.updatePayroll(id, payroll);
            return ResponseEntity.ok(updatedPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Process payroll (change status from draft to processed)
     */
    @PutMapping("/{id}/process")
    public ResponseEntity<Payroll> processPayroll(@PathVariable String id) {
        try {
            Payroll processedPayroll = payrollService.processPayroll(id);
            return ResponseEntity.ok(processedPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Mark payroll as paid
     */
    @PutMapping("/{id}/pay")
    public ResponseEntity<Payroll> markPayrollAsPaid(@PathVariable String id) {
        try {
            Payroll paidPayroll = payrollService.markPayrollAsPaid(id);
            return ResponseEntity.ok(paidPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete payroll record
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable String id) {
        try {
            payrollService.deletePayroll(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll records for month and year
     */
    @GetMapping("/month/{month}/year/{year}")
    public ResponseEntity<List<Payroll>> getPayrollByMonthAndYear(@PathVariable int month,
                                                                 @PathVariable int year) {
        try {
            List<Payroll> payrolls = payrollService.getPayrollByMonthAndYear(month, year);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll records for employee in month and year
     */
    @GetMapping("/employee/{employeeId}/month/{month}/year/{year}")
    public ResponseEntity<List<Payroll>> getPayrollByEmployeeAndMonthAndYear(@PathVariable String employeeId,
                                                                            @PathVariable int month,
                                                                            @PathVariable int year) {
        try {
            List<Payroll> payrolls = payrollService.getPayrollByEmployeeAndMonthAndYear(employeeId, month, year);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll with employee details
     */
    @GetMapping("/with-details")
    public ResponseEntity<List<Object[]>> getPayrollWithEmployeeDetails(@RequestParam LocalDate payPeriodStart,
                                                                       @RequestParam LocalDate payPeriodEnd) {
        try {
            List<Object[]> payrolls = payrollService.getPayrollWithEmployeeDetails(payPeriodStart, payPeriodEnd);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll summary by status
     */
    @GetMapping("/summary/status")
    public ResponseEntity<List<Object[]>> getPayrollSummaryByStatus(@RequestParam LocalDate startDate,
                                                                   @RequestParam LocalDate endDate) {
        try {
            List<Object[]> summary = payrollService.getPayrollSummaryByStatus(startDate, endDate);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payroll summary by department
     */
    @GetMapping("/summary/department")
    public ResponseEntity<List<Object[]>> getPayrollSummaryByDepartment(@RequestParam LocalDate payPeriodStart,
                                                                       @RequestParam LocalDate payPeriodEnd) {
        try {
            List<Object[]> summary = payrollService.getPayrollSummaryByDepartment(payPeriodStart, payPeriodEnd);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total payroll amount by status
     */
    @GetMapping("/total/{status}")
    public ResponseEntity<BigDecimal> getTotalPayrollByStatus(@PathVariable PayrollStatus status,
                                                             @RequestParam LocalDate startDate,
                                                             @RequestParam LocalDate endDate) {
        try {
            BigDecimal total = payrollService.getTotalPayrollByStatus(status, startDate, endDate);
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employee annual pay
     */
    @GetMapping("/employee/{employeeId}/annual/{year}")
    public ResponseEntity<BigDecimal> getEmployeeAnnualPay(@PathVariable String employeeId,
                                                          @PathVariable int year) {
        try {
            BigDecimal annualPay = payrollService.getEmployeeAnnualPay(employeeId, year);
            return ResponseEntity.ok(annualPay);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get unprocessed payroll records older than specified days
     */
    @GetMapping("/unprocessed/older-than/{days}")
    public ResponseEntity<List<Payroll>> getUnprocessedPayrollOlderThan(@PathVariable int days) {
        try {
            List<Payroll> payrolls = payrollService.getUnprocessedPayrollOlderThan(days);
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get processed but unpaid payroll records
     */
    @GetMapping("/processed-unpaid")
    public ResponseEntity<List<Payroll>> getProcessedUnpaidPayroll() {
        try {
            List<Payroll> payrolls = payrollService.getProcessedUnpaidPayroll();
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recent payroll records
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Payroll>> getRecentPayroll() {
        try {
            List<Payroll> payrolls = payrollService.getRecentPayroll();
            return ResponseEntity.ok(payrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Count payroll records by status
     */
    @GetMapping("/count/{status}")
    public ResponseEntity<Long> countPayrollByStatus(@PathVariable PayrollStatus status) {
        try {
            long count = payrollService.countPayrollByStatus(status);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Process all draft payrolls for a pay period
     */
    @PutMapping("/process-all/period")
    public ResponseEntity<List<Payroll>> processAllPayrollsForPeriod(@RequestParam LocalDate payPeriodStart,
                                                                    @RequestParam LocalDate payPeriodEnd) {
        try {
            List<Payroll> processedPayrolls = payrollService.processAllPayrollsForPeriod(payPeriodStart, payPeriodEnd);
            return ResponseEntity.ok(processedPayrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Mark all processed payrolls as paid for a pay period
     */
    @PutMapping("/pay-all/period")
    public ResponseEntity<List<Payroll>> markAllPayrollsAsPaidForPeriod(@RequestParam LocalDate payPeriodStart,
                                                                       @RequestParam LocalDate payPeriodEnd) {
        try {
            List<Payroll> paidPayrolls = payrollService.markAllPayrollsAsPaidForPeriod(payPeriodStart, payPeriodEnd);
            return ResponseEntity.ok(paidPayrolls);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
