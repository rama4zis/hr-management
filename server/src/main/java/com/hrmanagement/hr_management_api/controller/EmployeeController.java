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

    // Get all employees
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        ApiResponse response = new ApiResponse(true, "Employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getEmployeeById(@PathVariable String id) {
        Optional<Employee> employee = employeeRepository.findById(id);
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
        Optional<Employee> existingEmployee = employeeRepository.findById(id);

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
        Optional<Employee> existingEmployee = employeeRepository.findById(id);

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
        Optional<Employee> existingEmployee = employeeRepository.findById(id);

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
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse> hardDeleteEmployee(@PathVariable String id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            ApiResponse response = new ApiResponse(true, "Employee deleted permanently", null);
            return ResponseEntity.ok(response);
        } else {
            ApiResponse response = new ApiResponse(false, "Employee not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Get employees by department
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse> getEmployeesByDepartment(@PathVariable String departmentId) {
        List<Employee> employees = employeeRepository.findByDepartmentId(departmentId);
        ApiResponse response = new ApiResponse(true, "Employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get employees by position
    @GetMapping("/position/{positionId}")
    public ResponseEntity<ApiResponse> getEmployeesByPosition(@PathVariable String positionId) {
        List<Employee> employees = employeeRepository.findByPositionId(positionId);
        ApiResponse response = new ApiResponse(true, "Employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get active employees only
    @GetMapping("/active")
    public ResponseEntity<ApiResponse> getActiveEmployees() {
        List<Employee> employees = employeeRepository.findByEmployeeStatus(
                com.hrmanagement.hr_management_api.model.enums.EmployeeStatus.ACTIVE);
        ApiResponse response = new ApiResponse(true, "Active employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Search employees by name
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchEmployees(@RequestParam String query) {
        List<Employee> employees = employeeRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
        ApiResponse response = new ApiResponse(true, "Employees retrieved successfully", employees);
        return ResponseEntity.ok(response);
    }

    // Get employee count
    @GetMapping("/count")
    public ResponseEntity<ApiResponse> getEmployeeCount() {
        long count = employeeRepository.count();
        ApiResponse response = new ApiResponse(true, "Employee count retrieved successfully", count);
        return ResponseEntity.ok(response);
    }
}
