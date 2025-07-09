package com.hrmanagement.hr_management_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, String> {

    // Find all non-deleted departments
    List<Department> findByIsDeletedFalse();
    
    // Find by ID and not deleted
    Optional<Department> findByIdAndIsDeletedFalse(String id);

    // Find departments by name (case insensitive, non-deleted)
    List<Department> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name);

    // Find departments with managers (non-deleted)
    @Query("SELECT d FROM Department d WHERE d.managerId IS NOT NULL AND d.isDeleted = false")
    List<Department> findDepartmentsWithManagers();

    // Find departments without managers (non-deleted)
    @Query("SELECT d FROM Department d WHERE d.managerId IS NULL AND d.isDeleted = false")
    List<Department> findDepartmentsWithoutManagers();

    // Find department with employees (using JOIN FETCH, non-deleted)
    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.employees e WHERE d.id = :id AND d.isDeleted = false AND e.isDeleted = false")
    Optional<Department> findByIdWithEmployees(@Param("id") String id);

    // Find department with positions (using JOIN FETCH, non-deleted)
    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.positions p WHERE d.id = :id AND d.isDeleted = false AND p.isDeleted = false")
    Optional<Department> findByIdWithPositions(@Param("id") String id);

    // Find department by name (non-deleted)
    Optional<Department> findByNameAndIsDeletedFalse(String name);

    // Check if department exists by name (non-deleted)
    Boolean existsByNameAndIsDeletedFalse(String name);

    // Count departments with managers (non-deleted)
    @Query("SELECT COUNT(d) FROM Department d WHERE d.managerId IS NOT NULL AND d.isDeleted = false")
    Long countDepartmentsWithManagers();

    // Count departments without managers (non-deleted)
    @Query("SELECT COUNT(d) FROM Department d WHERE d.managerId IS NULL AND d.isDeleted = false")
    Long countDepartmentsWithoutManagers();

    // Count non-deleted departments
    @Query("SELECT COUNT(d) FROM Department d WHERE d.isDeleted = false")
    Long countByIsDeletedFalse();

    // Find departments by manager ID (non-deleted)
    @Query("SELECT d FROM Department d WHERE d.managerId = :managerId AND d.isDeleted = false")
    List<Department> findByManagerIdAndIsDeletedFalse(@Param("managerId") String managerId);

    // Search departments by name or description
    @Query("SELECT d FROM Department d WHERE d.isDeleted = false AND " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Department> searchDepartments(@Param("searchTerm") String searchTerm);
}
