package com.hrmanagement.hr_management_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrmanagement.hr_management_api.model.entity.Department;
import com.hrmanagement.hr_management_api.repository.DepartmentRepository;
import com.hrmanagement.hr_management_api.util.ApiResponse;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    public DepartmentController(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // Get all departments (non-deleted)
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllDepartments() {
        List<Department> departments = departmentRepository.findByIsDeletedFalse();
        ApiResponse response = new ApiResponse(true, "Departments retrieved successfully", departments);
        return ResponseEntity.ok(response);
    }

    // Get all departments including deleted
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllDepartmentsIncludingDeleted() {
        List<Department> departments = departmentRepository.findAll();
        ApiResponse response = new ApiResponse(true, "All departments retrieved successfully", departments);
        return ResponseEntity.ok(response);
    }

    // Get department by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getDepartmentById(@PathVariable String id) {
        Optional<Department> department = departmentRepository.findByIdAndIsDeletedFalse(id);
        return department.map(dep -> {
            ApiResponse response = new ApiResponse(true, "Department retrieved successfully", dep);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Department not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Create new department
    @PostMapping("/")
    public ResponseEntity<ApiResponse> createDepartment(@RequestBody Department department) {
        try {
            // Ensure the department is not marked as deleted when creating
            department.setDeleted(false);
            Department savedDepartment = departmentRepository.save(department);
            ApiResponse response = new ApiResponse(true, "Department created successfully", savedDepartment);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error creating department: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update department
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateDepartment(@PathVariable String id,
            @RequestBody Department departmentDetails) {
        Optional<Department> existingDepartment = departmentRepository.findByIdAndIsDeletedFalse(id);

        if (existingDepartment.isPresent()) {
            Department department = existingDepartment.get();

            // Update fields
            department.setName(departmentDetails.getName());
            department.setDescription(departmentDetails.getDescription());
            department.setManagerId(departmentDetails.getManagerId());

            Department updatedDepartment = departmentRepository.save(department);
            ApiResponse response = new ApiResponse(true, "Department updated successfully", updatedDepartment);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Department not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Partial update department (PATCH)
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> partialUpdateDepartment(@PathVariable String id,
            @RequestBody Department departmentDetails) {
        Optional<Department> existingDepartment = departmentRepository.findByIdAndIsDeletedFalse(id);

        if (existingDepartment.isPresent()) {
            Department department = existingDepartment.get();

            // Update only non-null fields
            if (departmentDetails.getName() != null) {
                department.setName(departmentDetails.getName());
            }
            if (departmentDetails.getDescription() != null) {
                department.setDescription(departmentDetails.getDescription());
            }
            if (departmentDetails.getManagerId() != null) {
                department.setManagerId(departmentDetails.getManagerId());
            }

            Department updatedDepartment = departmentRepository.save(department);
            ApiResponse response = new ApiResponse(true, "Department partially updated successfully", updatedDepartment);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Department not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Delete department (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDepartment(@PathVariable String id) {
        Optional<Department> existingDepartment = departmentRepository.findByIdAndIsDeletedFalse(id);

        if (existingDepartment.isPresent()) {
            Department department = existingDepartment.get();
            department.setDeleted(true); // Soft delete
            departmentRepository.save(department);
            ApiResponse response = new ApiResponse(true, "Department deleted successfully", null);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Department not found", null);
            return ResponseEntity.ok(response);
        }
    }

    // Hard delete department (permanently remove from database)
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse> hardDeleteDepartment(@PathVariable String id) {
        if (departmentRepository.existsById(id)) {
            departmentRepository.deleteById(id);
            ApiResponse response = new ApiResponse(true, "Department deleted successfully", null);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Department not found", null);
            return ResponseEntity.ok(response);
        }
    }

    // Search departments by name
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchDepartments(@RequestParam String query) {
        List<Department> departments = departmentRepository.searchDepartments(query);
        ApiResponse response = new ApiResponse(true, "Departments retrieved successfully", departments);
        return ResponseEntity.ok(response);
    }

    // Get department count (non-deleted only)
    @GetMapping("/count")
    public ResponseEntity<ApiResponse> getDepartmentCount() {
        long count = departmentRepository.countByIsDeletedFalse();
        ApiResponse response = new ApiResponse(true, "Department count retrieved successfully", count);
        return ResponseEntity.ok(response);
    }

    // Assign manager to department
    @PutMapping("/{id}/manager/{managerId}")
    public ResponseEntity<ApiResponse> assignManager(@PathVariable String id, @PathVariable String managerId) {
        Optional<Department> existingDepartment = departmentRepository.findByIdAndIsDeletedFalse(id);

        if (existingDepartment.isPresent()) {
            Department department = existingDepartment.get();
            department.setManagerId(managerId);
            Department updatedDepartment = departmentRepository.save(department);
            ApiResponse response = new ApiResponse(true, "Manager assigned successfully", updatedDepartment);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Department not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Remove manager from department
    @DeleteMapping("/{id}/manager")
    public ResponseEntity<ApiResponse> removeManager(@PathVariable String id) {
        Optional<Department> existingDepartment = departmentRepository.findByIdAndIsDeletedFalse(id);

        if (existingDepartment.isPresent()) {
            Department department = existingDepartment.get();
            department.setManagerId(null);
            Department updatedDepartment = departmentRepository.save(department);
            ApiResponse response = new ApiResponse(true, "Manager removed successfully", updatedDepartment);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, "Department not found", null));
        }
    }
}
