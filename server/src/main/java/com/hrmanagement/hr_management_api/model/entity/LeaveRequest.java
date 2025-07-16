package com.hrmanagement.hr_management_api.model.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hrmanagement.hr_management_api.model.enums.LeaveRequestStatus;
import com.hrmanagement.hr_management_api.model.enums.LeaveRequestType;

import jakarta.persistence.*;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_request_type")
    private LeaveRequestType leaveRequestType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "total_days")
    private Integer totalDays;

    @Column(name = "reason", length = 255)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_request_status")
    private LeaveRequestStatus leaveRequestStatus;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Column(name = "response_date")
    private LocalDate responseDate;

    @Column(name = "comments", length = 500)
    private String comments;

    // ManyToOne relationship with Employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    private Employee employee;

    // ManyToOne relationship with Employee for approval
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by", referencedColumnName = "id", insertable = false, updatable = false)
    private Employee approver;

    // Constructors
    public LeaveRequest() {}

    public LeaveRequest(String employee_id, LeaveRequestType leaveRequestType, LocalDate startDate, LocalDate endDate, Integer totalDays, String reason, LocalDate requestDate) {
        this.employeeId = employee_id;
        this.leaveRequestType = leaveRequestType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalDays = totalDays;
        this.reason = reason;
        this.requestDate = requestDate;
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

    public LeaveRequestType getLeaveRequestType() {
        return leaveRequestType;
    }

    public void setLeaveRequestType(LeaveRequestType leaveRequestType) {
        this.leaveRequestType = leaveRequestType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LeaveRequestStatus getLeaveRequestStatus() {
        return leaveRequestStatus;
    }

    public void setLeaveRequestStatus(LeaveRequestStatus leaveRequestStatus) {
        this.leaveRequestStatus = leaveRequestStatus;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDate getResponseDate() {
        return responseDate;
    }

    public void setResponseDate(LocalDate responseDate) {
        this.responseDate = responseDate;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    @JsonIgnore
    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @JsonIgnore
    public Employee getApprover() {
        return approver;
    }

    public void setApprover(Employee approver) {
        this.approver = approver;
    }

    @PrePersist
    private void prePersist() {
        if (this.leaveRequestStatus == null) {
            this.leaveRequestStatus = LeaveRequestStatus.PENDING; // Default to pending if not set
        }
        if (this.requestDate == null) {
            this.requestDate = LocalDate.now(); // Default to current date if not set
        }

        // Total Days
        if (this.startDate != null && this.endDate != null) {
            this.totalDays = (int) (this.endDate.toEpochDay() - this.startDate.toEpochDay()) + 1; // Inclusive of start and end dates
        } else {
            this.totalDays = 0; // Default to 0 if dates are not set
        }
    }
    
}
