package com.hrmanagement.hr_management_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.model.enums.EmployeeStatus;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    // Find all non-deleted employees
    List<Employee> findByIsDeletedFalse();
    
    // Find by ID and not deleted
    Optional<Employee> findByIdAndIsDeletedFalse(String id);

    // Find employees by department ID (non-deleted)
    List<Employee> findByDepartmentIdAndIsDeletedFalse(String departmentId);

    // Find employees by position ID (non-deleted)
    List<Employee> findByPositionIdAndIsDeletedFalse(String positionId);

    // Find employees by status (non-deleted)
    List<Employee> findByEmployeeStatusAndIsDeletedFalse(EmployeeStatus employeeStatus);

    // Find employees by name (case insensitive, non-deleted)
    List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseAndIsDeletedFalse(String firstName, String lastName);

    // Search employees by name with soft delete
    @Query("SELECT e FROM Employee e WHERE e.isDeleted = false AND " +
           "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Employee> searchByNameAndIsDeleted(@Param("query") String query);

    // Find active employees only (non-deleted)
    @Query("SELECT e FROM Employee e WHERE e.employeeStatus = 'ACTIVE' AND e.isDeleted = false")
    List<Employee> findActiveEmployees();

    // Find employees by department and status (non-deleted)
    List<Employee> findByDepartmentIdAndEmployeeStatusAndIsDeletedFalse(String departmentId, EmployeeStatus employeeStatus);

    // Find employees by email (non-deleted)
    Optional<Employee> findByEmailAndIsDeletedFalse(String email);

    // Check if employee exists by email (non-deleted)
    Boolean existsByEmailAndIsDeletedFalse(String email);

    // Count employees by department (non-deleted)
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.departmentId = :departmentId AND e.isDeleted = false")
    Long countByDepartmentIdAndIsDeletedFalse(@Param("departmentId") String departmentId);

    // Count active employees (non-deleted)
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.employeeStatus = 'ACTIVE' AND e.isDeleted = false")
    Long countActiveEmployees();

    // Count non-deleted employees
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.isDeleted = false")
    Long countByIsDeletedFalse();
}
