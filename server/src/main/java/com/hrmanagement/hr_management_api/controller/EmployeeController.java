package com.hrmanagement.hr_management_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import com.hrmanagement.hr_management_api.util.ApiResponse;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Get all employees (non-deleted)
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllEmployees() {
        List<Employee> employees = employeeRepository.findByIsDeletedFalse();
        ApiResponse response = new ApiResponse(true, "Employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get all employees including deleted
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllEmployeesIncludingDeleted() {
        List<Employee> employees = employeeRepository.findAll();
        ApiResponse response = new ApiResponse(true, "All employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getEmployeeById(@PathVariable String id) {
        Optional<Employee> employee = employeeRepository.findByIdAndIsDeletedFalse(id);
        return employee.map(emp -> {
            ApiResponse response = new ApiResponse(true, "Employee retrieved successfully", emp);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Employee not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Create new employee
    @PostMapping("/")
    public ResponseEntity<ApiResponse> createEmployee(@RequestBody Employee employee) {
        try {
            Employee savedEmployee = employeeRepository.save(employee);
            ApiResponse response = new ApiResponse(true, "Employee created successfully", savedEmployee);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error creating employee: " + e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update employee
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateEmployee(@PathVariable String id, @RequestBody Employee employeeDetails) {
        Optional<Employee> existingEmployee = employeeRepository.findByIdAndIsDeletedFalse(id);

        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();

            // Update fields
            employee.setFirstName(employeeDetails.getFirstName());
            employee.setLastName(employeeDetails.getLastName());
            employee.setEmail(employeeDetails.getEmail());
            employee.setPhoneNumber(employeeDetails.getPhoneNumber());
            employee.setAddress(employeeDetails.getAddress());
            employee.setDepartmentId(employeeDetails.getDepartmentId());
            employee.setPositionId(employeeDetails.getPositionId());
            employee.setHireDate(employeeDetails.getHireDate());
            employee.setSalary(employeeDetails.getSalary());
            employee.setEmployeeStatus(employeeDetails.getEmployeeStatus());
            employee.setProfileImage(employeeDetails.getProfileImage());

            Employee updatedEmployee = employeeRepository.save(employee);
            ApiResponse response = new ApiResponse(true, "Employee updated successfully", updatedEmployee);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Employee not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Partial update employee (PATCH)
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> partialUpdateEmployee(@PathVariable String id,
            @RequestBody Employee employeeDetails) {
        Optional<Employee> existingEmployee = employeeRepository.findByIdAndIsDeletedFalse(id);

        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();

            // Update only non-null fields
            if (employeeDetails.getFirstName() != null) {
                employee.setFirstName(employeeDetails.getFirstName());
            }
            if (employeeDetails.getLastName() != null) {
                employee.setLastName(employeeDetails.getLastName());
            }
            if (employeeDetails.getEmail() != null) {
                employee.setEmail(employeeDetails.getEmail());
            }
            if (employeeDetails.getPhoneNumber() != null) {
                employee.setPhoneNumber(employeeDetails.getPhoneNumber());
            }
            if (employeeDetails.getAddress() != null) {
                employee.setAddress(employeeDetails.getAddress());
            }
            if (employeeDetails.getDepartmentId() != null) {
                employee.setDepartmentId(employeeDetails.getDepartmentId());
            }
            if (employeeDetails.getPositionId() != null) {
                employee.setPositionId(employeeDetails.getPositionId());
            }
            if (employeeDetails.getHireDate() != null) {
                employee.setHireDate(employeeDetails.getHireDate());
            }
            if (employeeDetails.getSalary() != null) {
                employee.setSalary(employeeDetails.getSalary());
            }
            if (employeeDetails.getEmployeeStatus() != null) {
                employee.setEmployeeStatus(employeeDetails.getEmployeeStatus());
            }
            if (employeeDetails.getProfileImage() != null) {
                employee.setProfileImage(employeeDetails.getProfileImage());
            }

            Employee updatedEmployee = employeeRepository.save(employee);
            ApiResponse response = new ApiResponse(true, "Employee updated successfully", updatedEmployee);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Employee not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Delete employee (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteEmployee(@PathVariable String id) {
        Optional<Employee> existingEmployee = employeeRepository.findByIdAndIsDeletedFalse(id);

        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();
            employee.setDeleted(true); // Soft delete
            employeeRepository.save(employee);
            ApiResponse response = new ApiResponse(true, "Employee deleted successfully", null);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Employee not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Hard delete employee (permanently remove from database)
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse> permanentDeleteEmployee(@PathVariable String id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            ApiResponse response = new ApiResponse(true, "Employee deleted permanently", null);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Employee not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Restore soft deleted employee
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse> restoreEmployee(@PathVariable String id) {
        return employeeRepository.findById(id).map(employee -> {
            if (!employee.isDeleted()) {
                ApiResponse response = new ApiResponse(false, "Employee is not deleted", null);
                return ResponseEntity.badRequest().body(response);
            }
            try {
                employee.setDeleted(false);
                Employee restoredEmployee = employeeRepository.save(employee);
                ApiResponse response = new ApiResponse(true, "Employee restored successfully", restoredEmployee);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error restoring employee: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Employee not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Get employees by department
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse> getEmployeesByDepartment(@PathVariable String departmentId) {
        List<Employee> employees = employeeRepository.findByDepartmentIdAndIsDeletedFalse(departmentId);
        ApiResponse response = new ApiResponse(true, "Employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get employees by position
    @GetMapping("/position/{positionId}")
    public ResponseEntity<ApiResponse> getEmployeesByPosition(@PathVariable String positionId) {
        List<Employee> employees = employeeRepository.findByPositionIdAndIsDeletedFalse(positionId);
        ApiResponse response = new ApiResponse(true, "Employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get active employees only
    @GetMapping("/active")
    public ResponseEntity<ApiResponse> getActiveEmployees() {
        List<Employee> employees = employeeRepository.findActiveEmployees();
        ApiResponse response = new ApiResponse(true, "Active employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Search employees by name
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchEmployees(@RequestParam String query) {
        List<Employee> employees = employeeRepository.searchByNameAndIsDeleted(query);
        ApiResponse response = new ApiResponse(true, "Employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get employee count (non-deleted only)
    @GetMapping("/count")
    public ResponseEntity<ApiResponse> getEmployeeCount() {
        long count = employeeRepository.countByIsDeletedFalse();
        ApiResponse response = new ApiResponse(true, "Employee count retrieved successfully", count);
        return ResponseEntity.ok(response);
    }

    // Get deleted employees
    @GetMapping("/deleted")
    public ResponseEntity<ApiResponse> getDeletedEmployees() {
        try {
            List<Employee> deletedEmployees = employeeRepository.findAll().stream()
                .filter(Employee::isDeleted)
                .toList();
            ApiResponse response = new ApiResponse(true, "Deleted employees retrieved successfully", deletedEmployees);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving deleted employees: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Bulk delete employees
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse> bulkDeleteEmployees(@RequestBody List<String> employeeIds) {
        try {
            List<Employee> employees = employeeRepository.findAllById(employeeIds);
            employees.forEach(employee -> employee.setDeleted(true));
            employeeRepository.saveAll(employees);
            
            ApiResponse response = new ApiResponse(true, 
                "Bulk delete completed. " + employees.size() + " employees deleted.", employees.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error in bulk delete: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }
}
