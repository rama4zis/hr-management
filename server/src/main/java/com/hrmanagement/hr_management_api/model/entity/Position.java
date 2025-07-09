package com.hrmanagement.hr_management_api.model.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "positions")
public class Position extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 255)
    private String description;

    @Column(name = "department_id", nullable = false)
    private String departmentId;

    // Many-to-one relationship with Department
    @ManyToOne
    @JoinColumn(name = "department_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Department department;

    // One-to-many relationship with Employee
    @OneToMany(mappedBy = "position", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employee> employees = new ArrayList<>();

    // Contruct, getters, and setters
    public Position() {}
    
    public Position(String title, String description, String departmentId) {
        this.title = title;
        this.description = description;
        this.departmentId = departmentId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    @JsonIgnore
    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    @JsonIgnore
    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }
    
    
}
