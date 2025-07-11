package com.hrmanagement.hr_management_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.User;
import com.hrmanagement.hr_management_api.model.enums.UserRole;

public interface UserRepository extends JpaRepository<User, String> {

    // Find all non-deleted users
    List<User> findByIsDeletedFalse();
    
    // Find by ID and not deleted
    Optional<User> findByIdAndIsDeletedFalse(String id);

    // Find by username (non-deleted)
    Optional<User> findByUsernameAndIsDeletedFalse(String username);

    // Find by employee ID (non-deleted)
    Optional<User> findByEmployeeIdAndIsDeletedFalse(String employeeId);

    // Find by user role (non-deleted)
    List<User> findByUserRoleAndIsDeletedFalse(UserRole userRole);

    // Find active users only (non-deleted and active)
    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.isDeleted = false")
    List<User> findActiveUsers();

    // Find inactive users (non-deleted but inactive)
    @Query("SELECT u FROM User u WHERE u.isActive = false AND u.isDeleted = false")
    List<User> findInactiveUsers();

    // Check if username exists (non-deleted)
    Boolean existsByUsernameAndIsDeletedFalse(String username);

    // Check if employee ID exists (non-deleted)
    Boolean existsByEmployeeIdAndIsDeletedFalse(String employeeId);

    // Find users by username containing (search, non-deleted)
    List<User> findByUsernameContainingIgnoreCaseAndIsDeletedFalse(String username);

    // Count users by role (non-deleted)
    @Query("SELECT COUNT(u) FROM User u WHERE u.userRole = :role AND u.isDeleted = false")
    Long countByUserRoleAndIsDeletedFalse(@Param("role") UserRole role);

    // Count active users (non-deleted)
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.isDeleted = false")
    Long countActiveUsers();

    // Count non-deleted users
    @Query("SELECT COUNT(u) FROM User u WHERE u.isDeleted = false")
    Long countByIsDeletedFalse();

    // Find users with employee details (JOIN FETCH)
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.employee WHERE u.isDeleted = false")
    List<User> findAllWithEmployeeDetails();

    // Find user by username with employee details
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.employee WHERE u.username = :username AND u.isDeleted = false")
    Optional<User> findByUsernameWithEmployeeDetails(@Param("username") String username);

}
