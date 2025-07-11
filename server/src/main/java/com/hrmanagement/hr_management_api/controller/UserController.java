package com.hrmanagement.hr_management_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrmanagement.hr_management_api.model.entity.User;
import com.hrmanagement.hr_management_api.model.enums.UserRole;
import com.hrmanagement.hr_management_api.repository.UserRepository;
import com.hrmanagement.hr_management_api.util.ApiResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users (non-deleted)
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<User> users = userRepository.findByIsDeletedFalse();
        ApiResponse response = new ApiResponse(true, "Users retrieved successfully", users);
        return ResponseEntity.ok(response);
    }

    // Get all users including deleted
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllUsersIncludingDeleted() {
        List<User> users = userRepository.findAll();
        ApiResponse response = new ApiResponse(true, "All users retrieved successfully", users);
        return ResponseEntity.ok(response);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable String id) {
        Optional<User> user = userRepository.findByIdAndIsDeletedFalse(id);
        return user.map(u -> {
            ApiResponse response = new ApiResponse(true, "User retrieved successfully", u);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsernameAndIsDeletedFalse(username);
        return user.map(u -> {
            ApiResponse response = new ApiResponse(true, "User retrieved successfully", u);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Create new user
    @PostMapping("/")
    public ResponseEntity<ApiResponse> createUser(@RequestBody User user) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsernameAndIsDeletedFalse(user.getUsername())) {
                ApiResponse response = new ApiResponse(false, "Username already exists", null);
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if employee ID already has a user
            if (userRepository.existsByEmployeeIdAndIsDeletedFalse(user.getEmployeeId())) {
                ApiResponse response = new ApiResponse(false, "Employee already has a user account", null);
                return ResponseEntity.badRequest().body(response);
            }
            
            // Ensure the user is not marked as deleted when creating
            user.setDeleted(false);
            // Set default active status if not provided
            if (user.isActive() == false) {
                user.setActive(true);
            }
            
            User savedUser = userRepository.save(user);
            ApiResponse response = new ApiResponse(true, "User created successfully", savedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error creating user: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        return userRepository.findByIdAndIsDeletedFalse(id).map(user -> {
            try {
                // Check if username is being changed and if it already exists
                if (!user.getUsername().equals(userDetails.getUsername()) && 
                    userRepository.existsByUsernameAndIsDeletedFalse(userDetails.getUsername())) {
                    ApiResponse response = new ApiResponse(false, "Username already exists", null);
                    return ResponseEntity.badRequest().body(response);
                }
                
                // Check if employee ID is being changed and if it already has a user
                if (!user.getEmployeeId().equals(userDetails.getEmployeeId()) && 
                    userRepository.existsByEmployeeIdAndIsDeletedFalse(userDetails.getEmployeeId())) {
                    ApiResponse response = new ApiResponse(false, "Employee already has a user account", null);
                    return ResponseEntity.badRequest().body(response);
                }
                
                user.setUsername(userDetails.getUsername());
                if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                    user.setPassword(userDetails.getPassword());
                }
                user.setEmployeeId(userDetails.getEmployeeId());
                user.setUserRole(userDetails.getUserRole());
                user.setActive(userDetails.isActive());
                
                User updatedUser = userRepository.save(user);
                ApiResponse response = new ApiResponse(true, "User updated successfully", updatedUser);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error updating user: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Partial update user
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> partialUpdateUser(@PathVariable String id, @RequestBody User userDetails) {
        return userRepository.findByIdAndIsDeletedFalse(id).map(user -> {
            try {
                if (userDetails.getUsername() != null) {
                    // Check if username already exists
                    if (!user.getUsername().equals(userDetails.getUsername()) && 
                        userRepository.existsByUsernameAndIsDeletedFalse(userDetails.getUsername())) {
                        ApiResponse response = new ApiResponse(false, "Username already exists", null);
                        return ResponseEntity.badRequest().body(response);
                    }
                    user.setUsername(userDetails.getUsername());
                }
                if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                    user.setPassword(userDetails.getPassword());
                }
                if (userDetails.getEmployeeId() != null) {
                    // Check if employee ID already has a user
                    if (!user.getEmployeeId().equals(userDetails.getEmployeeId()) && 
                        userRepository.existsByEmployeeIdAndIsDeletedFalse(userDetails.getEmployeeId())) {
                        ApiResponse response = new ApiResponse(false, "Employee already has a user account", null);
                        return ResponseEntity.badRequest().body(response);
                    }
                    user.setEmployeeId(userDetails.getEmployeeId());
                }
                if (userDetails.getUserRole() != null) {
                    user.setUserRole(userDetails.getUserRole());
                }
                // Note: isActive is a boolean, so we need to handle it carefully
                user.setActive(userDetails.isActive());
                
                User updatedUser = userRepository.save(user);
                ApiResponse response = new ApiResponse(true, "User updated successfully", updatedUser);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error updating user: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Soft delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String id) {
        return userRepository.findByIdAndIsDeletedFalse(id).map(user -> {
            try {
                user.setDeleted(true);
                userRepository.save(user);
                ApiResponse response = new ApiResponse(true, "User deleted successfully", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error deleting user: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Hard delete user (permanent)
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse> permanentDeleteUser(@PathVariable String id) {
        return userRepository.findById(id).map(user -> {
            try {
                userRepository.delete(user);
                ApiResponse response = new ApiResponse(true, "User permanently deleted", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error permanently deleting user: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Restore soft deleted user
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse> restoreUser(@PathVariable String id) {
        return userRepository.findById(id).map(user -> {
            if (!user.isDeleted()) {
                ApiResponse response = new ApiResponse(false, "User is not deleted", null);
                return ResponseEntity.badRequest().body(response);
            }
            try {
                user.setDeleted(false);
                User restoredUser = userRepository.save(user);
                ApiResponse response = new ApiResponse(true, "User restored successfully", restoredUser);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error restoring user: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse> getUsersByRole(@PathVariable UserRole role) {
        try {
            List<User> users = userRepository.findByUserRoleAndIsDeletedFalse(role);
            ApiResponse response = new ApiResponse(true, "Users retrieved by role successfully", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving users by role: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get active users
    @GetMapping("/active")
    public ResponseEntity<ApiResponse> getActiveUsers() {
        try {
            List<User> users = userRepository.findActiveUsers();
            ApiResponse response = new ApiResponse(true, "Active users retrieved successfully", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving active users: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get inactive users
    @GetMapping("/inactive")
    public ResponseEntity<ApiResponse> getInactiveUsers() {
        try {
            List<User> users = userRepository.findInactiveUsers();
            ApiResponse response = new ApiResponse(true, "Inactive users retrieved successfully", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving inactive users: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Search users by username
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchUsers(@RequestParam String query) {
        try {
            List<User> users = userRepository.findByUsernameContainingIgnoreCaseAndIsDeletedFalse(query);
            ApiResponse response = new ApiResponse(true, "Users search completed successfully", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error searching users: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Activate user
    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable String id) {
        return userRepository.findByIdAndIsDeletedFalse(id).map(user -> {
            try {
                user.setActive(true);
                User updatedUser = userRepository.save(user);
                ApiResponse response = new ApiResponse(true, "User activated successfully", updatedUser);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error activating user: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Deactivate user
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable String id) {
        return userRepository.findByIdAndIsDeletedFalse(id).map(user -> {
            try {
                user.setActive(false);
                User updatedUser = userRepository.save(user);
                ApiResponse response = new ApiResponse(true, "User deactivated successfully", updatedUser);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error deactivating user: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Change password
    @PutMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse> changePassword(@PathVariable String id, @RequestBody PasswordChangeRequest request) {
        return userRepository.findByIdAndIsDeletedFalse(id).map(user -> {
            try {
                // In a real application, you would verify the old password here
                // and hash the new password before storing
                user.setPassword(request.getNewPassword());
                userRepository.save(user);
                ApiResponse response = new ApiResponse(true, "Password changed successfully", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error changing password: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "User not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Get users with employee details
    @GetMapping("/with-employee-details")
    public ResponseEntity<ApiResponse> getUsersWithEmployeeDetails() {
        try {
            List<User> users = userRepository.findAllWithEmployeeDetails();
            ApiResponse response = new ApiResponse(true, "Users with employee details retrieved successfully", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving users with employee details: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get user count
    @GetMapping("/count")
    public ResponseEntity<ApiResponse> getUserCount() {
        try {
            long count = userRepository.countByIsDeletedFalse();
            ApiResponse response = new ApiResponse(true, "User count retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error getting user count: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get user count by role
    @GetMapping("/count/role/{role}")
    public ResponseEntity<ApiResponse> getUserCountByRole(@PathVariable UserRole role) {
        try {
            long count = userRepository.countByUserRoleAndIsDeletedFalse(role);
            ApiResponse response = new ApiResponse(true, "User count by role retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error getting user count by role: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get active user count
    @GetMapping("/count/active")
    public ResponseEntity<ApiResponse> getActiveUserCount() {
        try {
            long count = userRepository.countActiveUsers();
            ApiResponse response = new ApiResponse(true, "Active user count retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error getting active user count: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get deleted users
    @GetMapping("/deleted")
    public ResponseEntity<ApiResponse> getDeletedUsers() {
        try {
            List<User> deletedUsers = userRepository.findAll().stream()
                .filter(User::isDeleted)
                .toList();
            ApiResponse response = new ApiResponse(true, "Deleted users retrieved successfully", deletedUsers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving deleted users: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Bulk delete users
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse> bulkDeleteUsers(@RequestBody List<String> userIds) {
        try {
            List<User> users = userRepository.findAllById(userIds);
            users.forEach(user -> user.setDeleted(true));
            userRepository.saveAll(users);
            
            ApiResponse response = new ApiResponse(true, 
                "Bulk delete completed. " + users.size() + " users deleted.", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error in bulk delete: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // DTO class for password change request
    public static class PasswordChangeRequest {
        private String oldPassword;
        private String newPassword;

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
