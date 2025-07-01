package com.hrmanagement.hr_management_api.model.entity;

import com.hrmanagement.hr_management_api.model.enums.PayrollStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payrolls")
public class Payroll {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotNull(message = "Employee ID is required")
    @Column(name = "employee_id", nullable = false)
    private String employeeId;
    
    @NotNull(message = "Pay period start date is required")
    @Column(name = "pay_period_start", nullable = false)
    private LocalDate payPeriodStart;
    
    @NotNull(message = "Pay period end date is required")
    @Column(name = "pay_period_end", nullable = false)
    private LocalDate payPeriodEnd;
    
    @NotNull(message = "Base salary is required")
    @Column(name = "base_salary", nullable = false, precision = 15, scale = 2)
    private BigDecimal baseSalary;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal overtime = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal bonuses = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal deductions = BigDecimal.ZERO;
    
    @NotNull(message = "Gross pay is required")
    @Column(name = "gross_pay", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossPay;
    
    @NotNull(message = "Net pay is required")
    @Column(name = "net_pay", nullable = false, precision = 15, scale = 2)
    private BigDecimal netPay;
    
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayrollStatus status = PayrollStatus.DRAFT;
    
    @Column(name = "processed_date")
    private LocalDate processedDate;
    
    @Column(name = "paid_date")
    private LocalDate paidDate;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Many-to-One relationship with Employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    private Employee employee;
    
    // Constructors
    public Payroll() {}
    
    public Payroll(String employeeId, LocalDate payPeriodStart, LocalDate payPeriodEnd, 
                   BigDecimal baseSalary, BigDecimal overtime, BigDecimal bonuses, BigDecimal deductions) {
        this.employeeId = employeeId;
        this.payPeriodStart = payPeriodStart;
        this.payPeriodEnd = payPeriodEnd;
        this.baseSalary = baseSalary;
        this.overtime = overtime;
        this.bonuses = bonuses;
        this.deductions = deductions;
        this.calculatePay();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }
    
    public LocalDate getPayPeriodStart() {
        return payPeriodStart;
    }
    
    public void setPayPeriodStart(LocalDate payPeriodStart) {
        this.payPeriodStart = payPeriodStart;
    }
    
    public LocalDate getPayPeriodEnd() {
        return payPeriodEnd;
    }
    
    public void setPayPeriodEnd(LocalDate payPeriodEnd) {
        this.payPeriodEnd = payPeriodEnd;
    }
    
    public BigDecimal getBaseSalary() {
        return baseSalary;
    }
    
    public void setBaseSalary(BigDecimal baseSalary) {
        this.baseSalary = baseSalary;
    }
    
    public BigDecimal getOvertime() {
        return overtime;
    }
    
    public void setOvertime(BigDecimal overtime) {
        this.overtime = overtime;
    }
    
    public BigDecimal getBonuses() {
        return bonuses;
    }
    
    public void setBonuses(BigDecimal bonuses) {
        this.bonuses = bonuses;
    }
    
    public BigDecimal getDeductions() {
        return deductions;
    }
    
    public void setDeductions(BigDecimal deductions) {
        this.deductions = deductions;
    }
    
    public BigDecimal getGrossPay() {
        return grossPay;
    }
    
    public void setGrossPay(BigDecimal grossPay) {
        this.grossPay = grossPay;
    }
    
    public BigDecimal getNetPay() {
        return netPay;
    }
    
    public void setNetPay(BigDecimal netPay) {
        this.netPay = netPay;
    }
    
    public PayrollStatus getStatus() {
        return status;
    }
    
    public void setStatus(PayrollStatus status) {
        this.status = status;
    }
    
    public LocalDate getProcessedDate() {
        return processedDate;
    }
    
    public void setProcessedDate(LocalDate processedDate) {
        this.processedDate = processedDate;
    }
    
    public LocalDate getPaidDate() {
        return paidDate;
    }
    
    public void setPaidDate(LocalDate paidDate) {
        this.paidDate = paidDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Employee getEmployee() {
        return employee;
    }
    
    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
    
    // Helper methods
    public void calculatePay() {
        this.grossPay = baseSalary.add(overtime).add(bonuses);
        this.netPay = grossPay.subtract(deductions);
    }
    
    public void process() {
        this.status = PayrollStatus.PROCESSED;
        this.processedDate = LocalDate.now();
        this.calculatePay();
    }
    
    public void markAsPaid() {
        this.status = PayrollStatus.PAID;
        this.paidDate = LocalDate.now();
    }
}
