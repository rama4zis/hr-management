package com.hrmanagement.hr_management_api.repository;

import com.hrmanagement.hr_management_api.model.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, String> {
    
    /**
     * Find all positions by department ID
     */
    List<Position> findByDepartmentId(String departmentId);
    
    /**
     * Find position by title (case-insensitive)
     */
    Optional<Position> findByTitleIgnoreCase(String title);
    
    /**
     * Find positions with titles containing the search term (case-insensitive)
     */
    List<Position> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Find positions by department ID and title containing search term
     */
    List<Position> findByDepartmentIdAndTitleContainingIgnoreCase(String departmentId, String title);
    
    /**
     * Check if position title exists in a department (excluding current position ID for updates)
     */
    boolean existsByTitleIgnoreCaseAndDepartmentIdAndIdNot(String title, String departmentId, String id);
    
    /**
     * Check if position title exists in a department
     */
    boolean existsByTitleIgnoreCaseAndDepartmentId(String title, String departmentId);
    
    /**
     * Get position with employee count
     */
    @Query("SELECT p, COUNT(e) as employeeCount " +
           "FROM Position p LEFT JOIN p.employees e " +
           "WHERE p.id = :positionId " +
           "GROUP BY p")
    Optional<Object[]> findPositionWithEmployeeCount(@Param("positionId") String positionId);
    
    /**
     * Get all positions with their employee counts
     */
    @Query("SELECT p, COUNT(e) as employeeCount " +
           "FROM Position p LEFT JOIN p.employees e " +
           "GROUP BY p " +
           "ORDER BY p.title")
    List<Object[]> findAllPositionsWithEmployeeCount();
    
    /**
     * Get positions by department with employee counts
     */
    @Query("SELECT p, COUNT(e) as employeeCount " +
           "FROM Position p LEFT JOIN p.employees e " +
           "WHERE p.departmentId = :departmentId " +
           "GROUP BY p " +
           "ORDER BY p.title")
    List<Object[]> findPositionsByDepartmentWithEmployeeCount(@Param("departmentId") String departmentId);
    
    /**
     * Find positions ordered by title
     */
    List<Position> findAllByOrderByTitle();
    
    /**
     * Find positions by department ordered by title
     */
    List<Position> findByDepartmentIdOrderByTitle(String departmentId);
}
