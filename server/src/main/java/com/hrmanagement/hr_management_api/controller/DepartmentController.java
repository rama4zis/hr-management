package com.hrmanagement.hr_management_api.controller;

import com.hrmanagement.hr_management_api.model.dto.DepartmentDTO;
import com.hrmanagement.hr_management_api.model.entity.Department;
import com.hrmanagement.hr_management_api.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * Get all departments
     */
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        try {
            List<Department> departments = departmentService.getAllDepartments();
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all departments with details (employee counts, etc.)
     */
    @GetMapping("/details")
    public ResponseEntity<List<DepartmentDTO>> getAllDepartmentsWithDetails() {
        try {
            List<DepartmentDTO> departments = departmentService.getAllDepartmentsWithDetails();
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get department by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable String id) {
        try {
            Optional<Department> department = departmentService.getDepartmentById(id);
            return department.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get department with details by ID
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<DepartmentDTO> getDepartmentWithDetailsById(@PathVariable String id) {
        try {
            Optional<DepartmentDTO> department = departmentService.getDepartmentWithDetailsById(id);
            return department.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create new department
     */
    @PostMapping
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody Department department) {
        try {
            Department createdDepartment = departmentService.createDepartment(department);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update existing department
     */
    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable String id, 
                                                      @Valid @RequestBody Department department) {
        try {
            Department updatedDepartment = departmentService.updateDepartment(id, department);
            return ResponseEntity.ok(updatedDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete department
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String id) {
        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search departments by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Department>> searchDepartments(@RequestParam String name) {
        try {
            List<Department> departments = departmentService.searchDepartmentsByName(name);
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get departments by manager
     */
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<Department>> getDepartmentsByManager(@PathVariable String managerId) {
        try {
            List<Department> departments = departmentService.getDepartmentsByManager(managerId);
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get departments without manager
     */
    @GetMapping("/without-manager")
    public ResponseEntity<List<Department>> getDepartmentsWithoutManager() {
        try {
            List<Department> departments = departmentService.getDepartmentsWithoutManager();
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Assign manager to department
     */
    @PutMapping("/{departmentId}/manager/{managerId}")
    public ResponseEntity<Department> assignManager(@PathVariable String departmentId, 
                                                   @PathVariable String managerId) {
        try {
            Department department = departmentService.assignManager(departmentId, managerId);
            return ResponseEntity.ok(department);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Remove manager from department
     */
    @DeleteMapping("/{departmentId}/manager")
    public ResponseEntity<Department> removeManager(@PathVariable String departmentId) {
        try {
            Department department = departmentService.assignManager(departmentId, null);
            return ResponseEntity.ok(department);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if department name is available
     */
    @GetMapping("/check-name")
    public ResponseEntity<Boolean> checkDepartmentNameAvailability(@RequestParam String name, 
                                                                  @RequestParam(required = false) String excludeId) {
        try {
            boolean available = departmentService.isDepartmentNameAvailable(name, excludeId);
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
