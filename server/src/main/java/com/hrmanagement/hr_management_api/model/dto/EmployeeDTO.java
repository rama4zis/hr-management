package com.hrmanagement.hr_management_api.model.dto;

import com.hrmanagement.hr_management_api.model.enums.Status;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EmployeeDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String departmentId;
    private String departmentName;
    private String positionId;
    private String positionTitle;
    private LocalDate hireDate;
    private BigDecimal salary;
    private Status status;
    private String profileImage;
    
    // Constructors
    public EmployeeDTO() {}
    
    public EmployeeDTO(String id, String firstName, String lastName, String email, String phone,
                      String departmentId, String departmentName, String positionId, String positionTitle,
                      LocalDate hireDate, BigDecimal salary, Status status, String profileImage) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionTitle = positionTitle;
        this.hireDate = hireDate;
        this.salary = salary;
        this.status = status;
        this.profileImage = profileImage;
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
    
    public String getDepartmentId() {
        return departmentId;
    }
    
    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }
    
    public String getDepartmentName() {
        return departmentName;
    }
    
    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
    
    public String getPositionId() {
        return positionId;
    }
    
    public void setPositionId(String positionId) {
        this.positionId = positionId;
    }
    
    public String getPositionTitle() {
        return positionTitle;
    }
    
    public void setPositionTitle(String positionTitle) {
        this.positionTitle = positionTitle;
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
    
    // Helper method
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
