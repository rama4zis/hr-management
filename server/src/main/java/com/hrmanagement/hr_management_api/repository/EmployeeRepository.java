package com.hrmanagement.hr_management_api.repository;

import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.model.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    
    /**
     * Find employee by email
     */
    Optional<Employee> findByEmail(String email);
    
    /**
     * Find all employees by department ID
     */
    List<Employee> findByDepartmentId(String departmentId);
    
    /**
     * Find all employees by position ID
     */
    List<Employee> findByPositionId(String positionId);
    
    /**
     * Find all employees by status
     */
    List<Employee> findByStatus(Status status);
    
    /**
     * Find employees by department and status
     */
    List<Employee> findByDepartmentIdAndStatus(String departmentId, Status status);
    
    /**
     * Search employees by name (first name or last name containing search term)
     */
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(CONCAT(e.firstName, ' ', e.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Employee> findByNameContaining(@Param("searchTerm") String searchTerm);
    
    /**
     * Search employees with pagination
     */
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(CONCAT(e.firstName, ' ', e.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Employee> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Find employees hired between dates
     */
    List<Employee> findByHireDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Find employees with salary range
     */
    List<Employee> findBySalaryBetween(BigDecimal minSalary, BigDecimal maxSalary);
    
    /**
     * Check if email exists (excluding current employee ID for updates)
     */
    boolean existsByEmailAndIdNot(String email, String id);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Count employees by department
     */
    long countByDepartmentId(String departmentId);
    
    /**
     * Count employees by position
     */
    long countByPositionId(String positionId);
    
    /**
     * Count employees by status
     */
    long countByStatus(Status status);
    
    /**
     * Get employee with department and position details
     */
    @Query("SELECT e, d.name as departmentName, p.title as positionTitle " +
           "FROM Employee e " +
           "LEFT JOIN Department d ON e.departmentId = d.id " +
           "LEFT JOIN Position p ON e.positionId = p.id " +
           "WHERE e.id = :employeeId")
    Optional<Object[]> findEmployeeWithDetails(@Param("employeeId") String employeeId);
    
    /**
     * Get all employees with department and position details
     */
    @Query("SELECT e, d.name as departmentName, p.title as positionTitle " +
           "FROM Employee e " +
           "LEFT JOIN Department d ON e.departmentId = d.id " +
           "LEFT JOIN Position p ON e.positionId = p.id " +
           "ORDER BY e.firstName, e.lastName")
    List<Object[]> findAllEmployeesWithDetails();
    
    /**
     * Get employees with department and position details (paginated)
     */
    @Query("SELECT e, d.name as departmentName, p.title as positionTitle " +
           "FROM Employee e " +
           "LEFT JOIN Department d ON e.departmentId = d.id " +
           "LEFT JOIN Position p ON e.positionId = p.id")
    Page<Object[]> findAllEmployeesWithDetails(Pageable pageable);
    
    /**
     * Find employees by department with details
     */
    @Query("SELECT e, d.name as departmentName, p.title as positionTitle " +
           "FROM Employee e " +
           "LEFT JOIN Department d ON e.departmentId = d.id " +
           "LEFT JOIN Position p ON e.positionId = p.id " +
           "WHERE e.departmentId = :departmentId " +
           "ORDER BY e.firstName, e.lastName")
    List<Object[]> findEmployeesByDepartmentWithDetails(@Param("departmentId") String departmentId);
    
    /**
     * Find active employees
     */
    List<Employee> findByStatusOrderByFirstNameAscLastNameAsc(Status status);
    
    /**
     * Find employees hired in a specific year
     */
    @Query("SELECT e FROM Employee e WHERE YEAR(e.hireDate) = :year")
    List<Employee> findByHireYear(@Param("year") int year);
}
