package com.hrmanagement.hr_management_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.model.enums.EmployeeStatus;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    // Find employees by department ID
    List<Employee> findByDepartmentId(String departmentId);

    // Find employees by position ID
    List<Employee> findByPositionId(String positionId);

    // Find employees by status
    List<Employee> findByEmployeeStatus(EmployeeStatus employeeStatus);

    // Find employees by name (case insensitive)
    List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    // Find active employees only
    @Query("SELECT e FROM Employee e WHERE e.employeeStatus = 'ACTIVE' AND e.isDeleted = false")
    List<Employee> findActiveEmployees();

    // Find employees by department and status
    List<Employee> findByDepartmentIdAndEmployeeStatus(String departmentId, EmployeeStatus employeeStatus);

    // Find employees by email
    Employee findByEmail(String email);

    // Check if employee exists by email
    boolean existsByEmail(String email);

    // Count employees by department
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.departmentId = :departmentId AND e.isDeleted = false")
    long countByDepartmentId(@Param("departmentId") String departmentId);

    // Count active employees
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.employeeStatus = 'ACTIVE' AND e.isDeleted = false")
    long countActiveEmployees();
}
