package com.hrmanagement.hr_management_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, String> {

    // Find departments by name (case insensitive)
    List<Department> findByNameContainingIgnoreCase(String name);

    // Find departments with managers
    @Query("SELECT d FROM Department d WHERE d.managerId IS NOT NULL AND d.isDeleted = false")
    List<Department> findDepartmentsWithManagers();

    // Find departments without managers
    @Query("SELECT d FROM Department d WHERE d.managerId IS NULL AND d.isDeleted = false")
    List<Department> findDepartmentsWithoutManagers();

    // Find department with employees (using JOIN FETCH)
    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.employees WHERE d.id = :id AND d.isDeleted = false")
    Optional<Department> findByIdWithEmployees(@Param("id") String id);

    // Find department with positions (using JOIN FETCH)
    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.positions WHERE d.id = :id AND d.isDeleted = false")
    Optional<Department> findByIdWithPositions(@Param("id") String id);

    // Find department by name
    Optional<Department> findByName(String name);

    // Check if department exists by name
    boolean existsByName(String name);

    // Count departments with managers
    @Query("SELECT COUNT(d) FROM Department d WHERE d.managerId IS NOT NULL AND d.isDeleted = false")
    long countDepartmentsWithManagers();

    // Count departments without managers
    @Query("SELECT COUNT(d) FROM Department d WHERE d.managerId IS NULL AND d.isDeleted = false")
    long countDepartmentsWithoutManagers();

    // Find departments by manager ID
    @Query("SELECT d FROM Department d WHERE d.managerId = :managerId AND d.isDeleted = false")
    List<Department> findByManagerId(@Param("managerId") String managerId);
}
