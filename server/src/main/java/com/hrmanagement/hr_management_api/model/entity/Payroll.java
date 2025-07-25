package com.hrmanagement.hr_management_api.model.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hrmanagement.hr_management_api.model.enums.PayrollStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "payrolls")
public class Payroll extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "pay_period_start", nullable = false)
    private LocalDate payPeriodStart;

    @Column(name = "pay_period_end")
    private LocalDate payPeriodEnd;

    @Column(name = "salary", precision = 19, scale = 2)
    private BigDecimal salary;

    @Column(name = "bonus", precision = 19, scale = 2)
    private BigDecimal bonus;

    @Column(name = "deductions", precision = 19, scale = 2)
    private BigDecimal deductions;

    @Column(name = "net_pay", precision = 19, scale = 2)
    private BigDecimal netPay;

    @Enumerated(EnumType.STRING)
    @Column(name = "payroll_status")
    private PayrollStatus payrollStatus;

    @Column(name = "processed_date")
    private LocalDate processedDate;

    @Column(name = "paid_date")
    private LocalDateTime paidDate;

    // ManyToOne relationship with Employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    private Employee employee;

    // Constructors
    public Payroll() {}

    public Payroll(String employeeId, LocalDate payPeriodStart, LocalDate payPeriodEnd, BigDecimal salary,
            BigDecimal bonus, BigDecimal deductions) {
        this.employeeId = employeeId;
        this.payPeriodStart = payPeriodStart;
        this.payPeriodEnd = payPeriodEnd;
        this.salary = salary;
        this.bonus = bonus;
        this.deductions = deductions;
    }

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

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public BigDecimal getBonus() {
        return bonus;
    }

    public void setBonus(BigDecimal bonus) {
        this.bonus = bonus;
    }

    public BigDecimal getDeductions() {
        return deductions;
    }

    public void setDeductions(BigDecimal deductions) {
        this.deductions = deductions;
    }

    public BigDecimal getNetPay() {
        return netPay;
    }

    public void setNetPay(BigDecimal netPay) {
        this.netPay = netPay;
    }

    public PayrollStatus getPayrollStatus() {
        return payrollStatus;
    }

    public void setPayrollStatus(PayrollStatus payrollStatus) {
        this.payrollStatus = payrollStatus;
    }

    public LocalDate getProcessedDate() {
        return processedDate;
    }

    public void setProcessedDate(LocalDate processedDate) {
        this.processedDate = processedDate;
    }

    public LocalDateTime getPaidDate() {
        return paidDate;
    }

    public void setPaidDate(LocalDateTime paidDate) {
        this.paidDate = paidDate;
    }

    @JsonIgnore
    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @PrePersist
    private void prePersist() {
        // Default values
        if (this.payrollStatus == null) {
            this.payrollStatus = PayrollStatus.PENDING; // Default to PENDING if not set
        }
        if (this.netPay == null) {
            this.netPay = (salary.add(bonus)).subtract(deductions); // Calculate net pay
        }
    }
}
