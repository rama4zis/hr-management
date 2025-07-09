package com.hrmanagement.hr_management_api.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hrmanagement.hr_management_api.model.enums.AttendanceStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "attendances")
public class Attendance extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "clock_in", nullable = false)
    private LocalDateTime clockIn;

    @Column(name = "clock_out")
    private LocalDateTime clockOut;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false)
    private AttendanceStatus attendanceStatus;

    @Column(name = "notes")
    private String notes;

    // ManyToOne relationship with Employee
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    private Employee employee;

    // Constructors
    public Attendance() {}

    public Attendance(String employeeId, LocalDate date, LocalDateTime clockIn) {
        this.employeeId = employeeId;
        this.date = date;
        this.clockIn = clockIn;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDateTime getClockIn() {
        return clockIn;
    }

    public void setClockIn(LocalDateTime clockIn) {
        this.clockIn = clockIn;
    }

    public LocalDateTime getClockOut() {
        return clockOut;
    }

    public void setClockOut(LocalDateTime clockOut) {
        this.clockOut = clockOut;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

        // Present fot 09:00 AM or earlier
        if (this.clockIn != null && this.clockIn.toLocalTime().isBefore(LocalDateTime.of(this.date, LocalTime.of(9, 0)).toLocalTime())) {
            this.attendanceStatus = AttendanceStatus.PRESENT;
        } else if (this.clockIn != null && this.clockIn.toLocalTime().isAfter(LocalDateTime.of(this.date, LocalTime.of(9, 0)).toLocalTime())) {
            this.attendanceStatus = AttendanceStatus.LATE;
        } else {
            this.attendanceStatus = AttendanceStatus.ABSENT; // Default to ABSENT if clockIn is null
        }

    }

}
