package com.hrmanagement.hr_management_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.Position;

public interface PositionRepository extends JpaRepository<Position, String>{
    
    // Find all non-deleted positions
    List<Position> findByIsDeletedFalse();
    
    // Find by ID and not deleted
    Optional<Position> findByIdAndIsDeletedFalse(String id);
    
    // Find by title (case-insensitive)
    List<Position> findByTitleContainingIgnoreCaseAndIsDeletedFalse(String title);
    
    // Find by department ID
    List<Position> findByDepartmentIdAndIsDeletedFalse(String departmentId);
    
    // Custom query to search positions by title or description
    @Query("SELECT p FROM Position p WHERE p.isDeleted = false AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Position> searchPositions(@Param("searchTerm") String searchTerm);
    
    // Count positions by department
    @Query("SELECT COUNT(p) FROM Position p WHERE p.departmentId = :departmentId AND p.isDeleted = false")
    Long countByDepartmentId(@Param("departmentId") String departmentId);
    
    // Find positions with employee count
    @Query("SELECT p, COUNT(e) as employeeCount FROM Position p " +
           "LEFT JOIN p.employees e ON e.isDeleted = false " +
           "WHERE p.isDeleted = false " +
           "GROUP BY p.id")
    List<Object[]> findPositionsWithEmployeeCount();

}
