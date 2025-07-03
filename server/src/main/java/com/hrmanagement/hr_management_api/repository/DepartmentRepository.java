package com.hrmanagement.hr_management_api.repository;

import com.hrmanagement.hr_management_api.model.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    
    /**
     * Find department by name (case-insensitive)
     */
    Optional<Department> findByNameIgnoreCase(String name);
    
    /**
     * Find all departments by manager ID
     */
    List<Department> findByManagerId(String managerId);
    
    /**
     * Find departments with names containing the search term (case-insensitive)
     */
    List<Department> findByNameContainingIgnoreCase(String name);
    
    /**
     * Check if department name exists (excluding current department ID for updates)
     */
    boolean existsByNameIgnoreCaseAndIdNot(String name, String id);
    
    /**
     * Check if department name exists
     */
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Get department with employee count
     */
    @Query("SELECT d, COUNT(e) as employeeCount " +
           "FROM Department d LEFT JOIN d.employees e " +
           "WHERE d.id = :departmentId " +
           "GROUP BY d")
    Optional<Object[]> findDepartmentWithEmployeeCount(@Param("departmentId") String departmentId);
    
    /**
     * Get all departments with their employee counts
     */
    @Query("SELECT d, COUNT(e) as employeeCount " +
           "FROM Department d LEFT JOIN d.employees e " +
           "GROUP BY d " +
           "ORDER BY d.name")
    List<Object[]> findAllDepartmentsWithEmployeeCount();
    
    /**
     * Find departments that have no manager assigned
     */
    List<Department> findByManagerIdIsNull();
    
    /**
     * Find departments ordered by name
     */
    List<Department> findAllByOrderByName();
}
