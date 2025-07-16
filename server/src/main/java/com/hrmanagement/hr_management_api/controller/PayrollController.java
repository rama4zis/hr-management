package com.hrmanagement.hr_management_api.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrmanagement.hr_management_api.util.ApiResponse;
import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.model.entity.Payroll;
import com.hrmanagement.hr_management_api.model.enums.PayrollStatus;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import com.hrmanagement.hr_management_api.repository.PayrollRepository;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // GET all payroll records
    @GetMapping
    public ResponseEntity<ApiResponse> getAllPayrolls() {
        try {
            List<Payroll> payrolls = payrollRepository.findByIsDeletedFalse();
            return ResponseEntity.ok(new ApiResponse(true, "Payroll records retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving payroll records: " + e.getMessage(), null));
        }
    }

    // GET payroll by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getPayrollById(@PathVariable String id) {
        try {
            Optional<Payroll> payroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (payroll.isPresent()) {
                return ResponseEntity.ok(new ApiResponse(true, "Payroll record retrieved successfully", payroll.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving payroll record: " + e.getMessage(), null));
        }
    }

    // GET payroll records by employee ID
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse> getPayrollsByEmployeeId(@PathVariable String employeeId) {
        try {
            List<Payroll> payrolls = payrollRepository.findByEmployeeIdAndIsDeletedFalse(employeeId);
            return ResponseEntity.ok(new ApiResponse(true, "Employee payroll records retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving employee payroll records: " + e.getMessage(), null));
        }
    }

    // GET payroll records by status
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getPayrollsByStatus(@PathVariable PayrollStatus status) {
        try {
            List<Payroll> payrolls = payrollRepository.findByPayrollStatusAndIsDeletedFalse(status);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll records retrieved by status successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving payroll records by status: " + e.getMessage(), null));
        }
    }

    // GET pending payroll records
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse> getPendingPayrolls() {
        try {
            List<Payroll> payrolls = payrollRepository.findPendingPayrolls();
            return ResponseEntity.ok(new ApiResponse(true, "Pending payroll records retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving pending payroll records: " + e.getMessage(), null));
        }
    }

    // GET approved payroll records
    @GetMapping("/approved")
    public ResponseEntity<ApiResponse> getApprovedPayrolls() {
        try {
            List<Payroll> payrolls = payrollRepository.findApprovedPayrolls();
            return ResponseEntity.ok(new ApiResponse(true, "Approved payroll records retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving approved payroll records: " + e.getMessage(), null));
        }
    }

    // GET completed payroll records
    @GetMapping("/completed")
    public ResponseEntity<ApiResponse> getCompletedPayrolls() {
        try {
            List<Payroll> payrolls = payrollRepository.findCompletedPayrolls();
            return ResponseEntity.ok(new ApiResponse(true, "Completed payroll records retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving completed payroll records: " + e.getMessage(), null));
        }
    }

    // GET draft payroll records
    @GetMapping("/draft")
    public ResponseEntity<ApiResponse> getDraftPayrolls() {
        try {
            List<Payroll> payrolls = payrollRepository.findDraftPayrolls();
            return ResponseEntity.ok(new ApiResponse(true, "Draft payroll records retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving draft payroll records: " + e.getMessage(), null));
        }
    }

    // GET failed payroll records
    @GetMapping("/failed")
    public ResponseEntity<ApiResponse> getFailedPayrolls() {
        try {
            List<Payroll> payrolls = payrollRepository.findFailedPayrolls();
            return ResponseEntity.ok(new ApiResponse(true, "Failed payroll records retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving failed payroll records: " + e.getMessage(), null));
        }
    }

    // GET overdue payroll records
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse> getOverduePayrolls() {
        try {
            LocalDate cutoffDate = LocalDate.now().minusDays(30);
            List<Payroll> payrolls = payrollRepository.findOverduePayrolls(cutoffDate);
            return ResponseEntity.ok(new ApiResponse(true, "Overdue payroll records retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving overdue payroll records: " + e.getMessage(), null));
        }
    }

    // GET payroll records by date range
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse> getPayrollsByDateRange(
            @RequestParam LocalDate startDate, 
            @RequestParam LocalDate endDate) {
        try {
            List<Payroll> payrolls = payrollRepository.findByPayPeriodStartBetweenAndIsDeletedFalse(startDate, endDate);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll records retrieved by date range successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving payroll records by date range: " + e.getMessage(), null));
        }
    }

    // GET payroll records by employee and date range
    @GetMapping("/employee/{employeeId}/date-range")
    public ResponseEntity<ApiResponse> getPayrollsByEmployeeAndDateRange(
            @PathVariable String employeeId,
            @RequestParam LocalDate startDate, 
            @RequestParam LocalDate endDate) {
        try {
            List<Payroll> payrolls = payrollRepository.findByEmployeeIdAndPayPeriodStartBetweenAndIsDeletedFalse(employeeId, startDate, endDate);
            return ResponseEntity.ok(new ApiResponse(true, "Employee payroll records retrieved by date range successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving employee payroll records by date range: " + e.getMessage(), null));
        }
    }

    // GET payroll records by year
    @GetMapping("/year/{year}")
    public ResponseEntity<ApiResponse> getPayrollsByYear(@PathVariable int year) {
        try {
            List<Payroll> payrolls = payrollRepository.findByYear(year);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll records retrieved by year successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving payroll records by year: " + e.getMessage(), null));
        }
    }

    // GET payroll records by month and year
    @GetMapping("/month/{month}/year/{year}")
    public ResponseEntity<ApiResponse> getPayrollsByMonthAndYear(
            @PathVariable int month, 
            @PathVariable int year) {
        try {
            List<Payroll> payrolls = payrollRepository.findByMonthAndYear(month, year);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll records retrieved by month and year successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving payroll records by month and year: " + e.getMessage(), null));
        }
    }

    // GET payroll count by status
    @GetMapping("/count/status/{status}")
    public ResponseEntity<ApiResponse> getPayrollCountByStatus(@PathVariable PayrollStatus status) {
        try {
            long count = payrollRepository.countByPayrollStatusAndIsDeletedFalse(status);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll count retrieved by status successfully", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving payroll count by status: " + e.getMessage(), null));
        }
    }

    // GET total payroll amount by status
    @GetMapping("/total/status/{status}")
    public ResponseEntity<ApiResponse> getTotalPayrollAmountByStatus(@PathVariable PayrollStatus status) {
        try {
            BigDecimal total = payrollRepository.getTotalPayrollAmountByStatus(status);
            return ResponseEntity.ok(new ApiResponse(true, "Total payroll amount retrieved by status successfully", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving total payroll amount by status: " + e.getMessage(), null));
        }
    }

    // GET total salary paid by employee
    @GetMapping("/employee/{employeeId}/total-paid")
    public ResponseEntity<ApiResponse> getTotalSalaryPaidByEmployee(@PathVariable String employeeId) {
        try {
            BigDecimal total = payrollRepository.getTotalSalaryPaidByEmployee(employeeId);
            return ResponseEntity.ok(new ApiResponse(true, "Total salary paid retrieved for employee successfully", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving total salary paid for employee: " + e.getMessage(), null));
        }
    }

    // GET total salary paid by employee and year
    @GetMapping("/employee/{employeeId}/year/{year}/total-paid")
    public ResponseEntity<ApiResponse> getTotalSalaryPaidByEmployeeAndYear(
            @PathVariable String employeeId, 
            @PathVariable int year) {
        try {
            BigDecimal total = payrollRepository.getTotalSalaryPaidByEmployeeAndYear(employeeId, year);
            return ResponseEntity.ok(new ApiResponse(true, "Total salary paid retrieved for employee and year successfully", total));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving total salary paid for employee and year: " + e.getMessage(), null));
        }
    }

    // POST create new payroll record
    @PostMapping
    public ResponseEntity<ApiResponse> createPayroll(@RequestBody Payroll payroll) {
        try {
            // Validate employee exists
            Optional<Employee> employee = employeeRepository.findByIdAndIsDeletedFalse(payroll.getEmployeeId());
            if (!employee.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Employee not found", null));
            }

            // Check for duplicate payroll for same employee and pay period
            boolean exists = payrollRepository.existsByEmployeeIdAndPayPeriod(
                    payroll.getEmployeeId(), 
                    payroll.getPayPeriodStart(), 
                    payroll.getPayPeriodEnd());
            
            if (exists) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiResponse(false, "Payroll already exists for this employee and pay period", null));
            }

            // Set default values (don't set ID manually - let Hibernate generate it)
            if (payroll.getPayrollStatus() == null) {
                payroll.setPayrollStatus(PayrollStatus.DRAFT);
            }
            if (payroll.getNetPay() == null) {
                // Calculate net pay: salary + bonus - deductions
                BigDecimal salary = payroll.getSalary() != null ? payroll.getSalary() : BigDecimal.ZERO;
                BigDecimal bonus = payroll.getBonus() != null ? payroll.getBonus() : BigDecimal.ZERO;
                BigDecimal deductions = payroll.getDeductions() != null ? payroll.getDeductions() : BigDecimal.ZERO;
                payroll.setNetPay(salary.add(bonus).subtract(deductions));
            }

            payroll.setDeleted(false);
            
            Payroll savedPayroll = payrollRepository.save(payroll);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Payroll record created successfully", savedPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error creating payroll record: " + e.getMessage(), null));
        }
    }

    // PUT update payroll record
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePayroll(@PathVariable String id, @RequestBody Payroll payrollDetails) {
        try {
            Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (!existingPayroll.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }

            Payroll payroll = existingPayroll.get();
            
            // Update fields
            if (payrollDetails.getEmployeeId() != null) {
                // Validate employee exists
                Optional<Employee> employee = employeeRepository.findByIdAndIsDeletedFalse(payrollDetails.getEmployeeId());
                if (!employee.isPresent()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new ApiResponse(false, "Employee not found", null));
                }
                payroll.setEmployeeId(payrollDetails.getEmployeeId());
            }
            if (payrollDetails.getPayPeriodStart() != null) {
                payroll.setPayPeriodStart(payrollDetails.getPayPeriodStart());
            }
            if (payrollDetails.getPayPeriodEnd() != null) {
                payroll.setPayPeriodEnd(payrollDetails.getPayPeriodEnd());
            }
            if (payrollDetails.getSalary() != null) {
                payroll.setSalary(payrollDetails.getSalary());
            }
            if (payrollDetails.getBonus() != null) {
                payroll.setBonus(payrollDetails.getBonus());
            }
            if (payrollDetails.getDeductions() != null) {
                payroll.setDeductions(payrollDetails.getDeductions());
            }
            if (payrollDetails.getNetPay() != null) {
                payroll.setNetPay(payrollDetails.getNetPay());
            } else {
                // Recalculate net pay if not provided
                BigDecimal salary = payroll.getSalary() != null ? payroll.getSalary() : BigDecimal.ZERO;
                BigDecimal bonus = payroll.getBonus() != null ? payroll.getBonus() : BigDecimal.ZERO;
                BigDecimal deductions = payroll.getDeductions() != null ? payroll.getDeductions() : BigDecimal.ZERO;
                payroll.setNetPay(salary.add(bonus).subtract(deductions));
            }
            if (payrollDetails.getPayrollStatus() != null) {
                payroll.setPayrollStatus(payrollDetails.getPayrollStatus());
            }
            if (payrollDetails.getProcessedDate() != null) {
                payroll.setProcessedDate(payrollDetails.getProcessedDate());
            }
            if (payrollDetails.getPaidDate() != null) {
                payroll.setPaidDate(payrollDetails.getPaidDate());
            }

            Payroll updatedPayroll = payrollRepository.save(payroll);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll record updated successfully", updatedPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating payroll record: " + e.getMessage(), null));
        }
    }

    // PUT approve payroll
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approvePayroll(@PathVariable String id) {
        try {
            Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (!existingPayroll.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }

            Payroll payroll = existingPayroll.get();
            
            if (payroll.getPayrollStatus() != PayrollStatus.PENDING) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Only pending payroll records can be approved", null));
            }

            payroll.setPayrollStatus(PayrollStatus.APPROVED);
            payroll.setProcessedDate(LocalDate.now());
            
            Payroll approvedPayroll = payrollRepository.save(payroll);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll record approved successfully", approvedPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error approving payroll record: " + e.getMessage(), null));
        }
    }

    // PUT reject payroll
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> rejectPayroll(@PathVariable String id) {
        try {
            Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (!existingPayroll.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }

            Payroll payroll = existingPayroll.get();
            
            if (payroll.getPayrollStatus() != PayrollStatus.PENDING) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Only pending payroll records can be rejected", null));
            }

            payroll.setPayrollStatus(PayrollStatus.REJECTED);
            
            Payroll rejectedPayroll = payrollRepository.save(payroll);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll record rejected successfully", rejectedPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error rejecting payroll record: " + e.getMessage(), null));
        }
    }

    // PUT submit payroll for approval
    @PutMapping("/{id}/submit")
    public ResponseEntity<ApiResponse> submitPayroll(@PathVariable String id) {
        try {
            Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (!existingPayroll.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }

            Payroll payroll = existingPayroll.get();
            
            if (payroll.getPayrollStatus() != PayrollStatus.DRAFT) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Only draft payroll records can be submitted", null));
            }

            payroll.setPayrollStatus(PayrollStatus.PENDING);
            
            Payroll submittedPayroll = payrollRepository.save(payroll);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll record submitted for approval successfully", submittedPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error submitting payroll record: " + e.getMessage(), null));
        }
    }

    // PUT process payroll
    @PutMapping("/{id}/process")
    public ResponseEntity<ApiResponse> processPayroll(@PathVariable String id) {
        try {
            Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (!existingPayroll.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }

            Payroll payroll = existingPayroll.get();
            
            if (payroll.getPayrollStatus() != PayrollStatus.APPROVED) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Only approved payroll records can be processed", null));
            }

            payroll.setPayrollStatus(PayrollStatus.PROCESSING);
            
            Payroll processingPayroll = payrollRepository.save(payroll);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll record is being processed", processingPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error processing payroll record: " + e.getMessage(), null));
        }
    }

    // PUT complete payroll
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse> completePayroll(@PathVariable String id) {
        try {
            Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (!existingPayroll.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }

            Payroll payroll = existingPayroll.get();
            
            if (payroll.getPayrollStatus() != PayrollStatus.PROCESSING) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Only processing payroll records can be completed", null));
            }

            payroll.setPayrollStatus(PayrollStatus.COMPLETED);
            payroll.setPaidDate(LocalDateTime.now());
            
            Payroll completedPayroll = payrollRepository.save(payroll);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll record completed successfully", completedPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error completing payroll record: " + e.getMessage(), null));
        }
    }

    // PUT mark payroll as failed
    @PutMapping("/{id}/fail")
    public ResponseEntity<ApiResponse> failPayroll(@PathVariable String id) {
        try {
            Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (!existingPayroll.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }

            Payroll payroll = existingPayroll.get();
            
            if (payroll.getPayrollStatus() != PayrollStatus.PROCESSING) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Only processing payroll records can be marked as failed", null));
            }

            payroll.setPayrollStatus(PayrollStatus.FAILED);
            
            Payroll failedPayroll = payrollRepository.save(payroll);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll record marked as failed", failedPayroll));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error marking payroll record as failed: " + e.getMessage(), null));
        }
    }

    // DELETE payroll record (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deletePayroll(@PathVariable String id) {
        try {
            Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
            if (!existingPayroll.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse(false, "Payroll record not found", null));
            }

            Payroll payroll = existingPayroll.get();
            
            // Check if payroll can be deleted
            if (payroll.getPayrollStatus() == PayrollStatus.COMPLETED || 
                payroll.getPayrollStatus() == PayrollStatus.PROCESSING) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse(false, "Cannot delete completed or processing payroll records", null));
            }

            payroll.setDeleted(true);
            payrollRepository.save(payroll);
            
            return ResponseEntity.ok(new ApiResponse(true, "Payroll record deleted successfully", "Payroll with ID " + id + " deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting payroll record: " + e.getMessage(), null));
        }
    }

    // POST bulk create payroll records for multiple employees
    @PostMapping("/bulk-create")
    public ResponseEntity<ApiResponse> bulkCreatePayrolls(@RequestBody List<Payroll> payrolls) {
        try {
            List<Payroll> createdPayrolls = new java.util.ArrayList<>();
            
            for (Payroll payroll : payrolls) {
                // Validate employee exists
                Optional<Employee> employee = employeeRepository.findByIdAndIsDeletedFalse(payroll.getEmployeeId());
                if (!employee.isPresent()) {
                    continue; // Skip invalid employees
                }

                // Check for duplicate payroll
                boolean exists = payrollRepository.existsByEmployeeIdAndPayPeriod(
                        payroll.getEmployeeId(), 
                        payroll.getPayPeriodStart(), 
                        payroll.getPayPeriodEnd());
                
                if (exists) {
                    continue; // Skip duplicates
                }

                // Set default values (don't set ID manually - let Hibernate generate it)
                if (payroll.getPayrollStatus() == null) {
                    payroll.setPayrollStatus(PayrollStatus.DRAFT);
                }
                if (payroll.getNetPay() == null) {
                    // Calculate net pay
                    BigDecimal salary = payroll.getSalary() != null ? payroll.getSalary() : BigDecimal.ZERO;
                    BigDecimal bonus = payroll.getBonus() != null ? payroll.getBonus() : BigDecimal.ZERO;
                    BigDecimal deductions = payroll.getDeductions() != null ? payroll.getDeductions() : BigDecimal.ZERO;
                    payroll.setNetPay(salary.add(bonus).subtract(deductions));
                }

                payroll.setDeleted(false);
                
                createdPayrolls.add(payroll);
            }
            
            List<Payroll> savedPayrolls = payrollRepository.saveAll(createdPayrolls);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Payroll records created successfully", savedPayrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error creating payroll records: " + e.getMessage(), null));
        }
    }

    // PUT bulk approve payroll records
    @PutMapping("/bulk-approve")
    public ResponseEntity<ApiResponse> bulkApprovePayrolls(@RequestBody List<String> payrollIds) {
        try {
            List<Payroll> approvedPayrolls = new java.util.ArrayList<>();
            
            for (String id : payrollIds) {
                Optional<Payroll> existingPayroll = payrollRepository.findByIdAndIsDeletedFalse(id);
                if (existingPayroll.isPresent() && existingPayroll.get().getPayrollStatus() == PayrollStatus.PENDING) {
                    Payroll payroll = existingPayroll.get();
                    payroll.setPayrollStatus(PayrollStatus.APPROVED);
                    payroll.setProcessedDate(LocalDate.now());
                    approvedPayrolls.add(payroll);
                }
            }
            
            List<Payroll> savedPayrolls = payrollRepository.saveAll(approvedPayrolls);
            return ResponseEntity.ok(new ApiResponse(true, "Payroll records approved successfully", savedPayrolls));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error approving payroll records: " + e.getMessage(), null));
        }
    }

}
