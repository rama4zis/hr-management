package com.hrmanagement.hr_management_api.model.entity;

import com.hrmanagement.hr_management_api.model.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employees")
public class Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    @Column(nullable = false)
    private String phone;
    
    @Size(max = 255, message = "Address must not exceed 255 characters")
    @Column(length = 255)
    private String address;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @NotNull(message = "Department ID is required")
    @Column(name = "department_id", nullable = false)
    private String departmentId;
    
    @NotNull(message = "Position ID is required")
    @Column(name = "position_id", nullable = false)
    private String positionId;
    
    @NotNull(message = "Hire date is required")
    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;
    
    @NotNull(message = "Salary is required")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal salary;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;
    
    @Column(name = "profile_image")
    private String profileImage;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Many-to-One relationship with Department
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", insertable = false, updatable = false)
    private Department department;
    
    // Many-to-One relationship with Position
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", insertable = false, updatable = false)
    private Position position;
    
    // One-to-Many relationships
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attendance> attendances = new ArrayList<>();
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LeaveRequest> leaveRequests = new ArrayList<>();
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payroll> payrolls = new ArrayList<>();
    
    // Constructors
    public Employee() {}
    
    public Employee(String firstName, String lastName, String email, String phone, 
                   String departmentId, String positionId, LocalDate hireDate, BigDecimal salary) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.departmentId = departmentId;
        this.positionId = positionId;
        this.hireDate = hireDate;
        this.salary = salary;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public String getDepartmentId() {
        return departmentId;
    }
    
    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }
    
    public String getPositionId() {
        return positionId;
    }
    
    public void setPositionId(String positionId) {
        this.positionId = positionId;
    }
    
    public LocalDate getHireDate() {
        return hireDate;
    }
    
    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }
    
    public BigDecimal getSalary() {
        return salary;
    }
    
    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }
    
    public Status getStatus() {
        return status;
    }
    
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public String getProfileImage() {
        return profileImage;
    }
    
    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
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
    
    public Department getDepartment() {
        return department;
    }
    
    public void setDepartment(Department department) {
        this.department = department;
    }
    
    public Position getPosition() {
        return position;
    }
    
    public void setPosition(Position position) {
        this.position = position;
    }
    
    public List<Attendance> getAttendances() {
        return attendances;
    }
    
    public void setAttendances(List<Attendance> attendances) {
        this.attendances = attendances;
    }
    
    public List<LeaveRequest> getLeaveRequests() {
        return leaveRequests;
    }
    
    public void setLeaveRequests(List<LeaveRequest> leaveRequests) {
        this.leaveRequests = leaveRequests;
    }
    
    public List<Payroll> getPayrolls() {
        return payrolls;
    }
    
    public void setPayrolls(List<Payroll> payrolls) {
        this.payrolls = payrolls;
    }
    
    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public void addAttendance(Attendance attendance) {
        attendances.add(attendance);
        attendance.setEmployee(this);
    }
    
    public void removeAttendance(Attendance attendance) {
        attendances.remove(attendance);
        attendance.setEmployee(null);
    }
    
    public void addLeaveRequest(LeaveRequest leaveRequest) {
        leaveRequests.add(leaveRequest);
        leaveRequest.setEmployee(this);
    }
    
    public void removeLeaveRequest(LeaveRequest leaveRequest) {
        leaveRequests.remove(leaveRequest);
        leaveRequest.setEmployee(null);
    }
    
    public void addPayroll(Payroll payroll) {
        payrolls.add(payroll);
        payroll.setEmployee(this);
    }
    
    public void removePayroll(Payroll payroll) {
        payrolls.remove(payroll);
        payroll.setEmployee(null);
    }
}
