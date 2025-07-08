package com.hrmanagement.hr_management_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Get all employees
    @GetMapping("/")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return ResponseEntity.ok(employees);
    }

    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        return employee.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // Create new employee
    @PostMapping("/")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        try {
            Employee savedEmployee = employeeRepository.save(employee);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEmployee);
        } catch (Exception e) {
            // return ResponseEntity.badRequest().build();
            // return error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new Employee()); // Return an empty employee or handle error appropriately
        }
    }

    // Update employee
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable String id, @RequestBody Employee employeeDetails) {
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
            return ResponseEntity.ok(updatedEmployee);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Partial update employee (PATCH)
    @PatchMapping("/{id}")
    public ResponseEntity<Employee> partialUpdateEmployee(@PathVariable String id, @RequestBody Employee employeeDetails) {
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
            return ResponseEntity.ok(updatedEmployee);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete employee (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        Optional<Employee> existingEmployee = employeeRepository.findById(id);
        
        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();
            employee.setDeleted(true); // Soft delete
            employeeRepository.save(employee);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Hard delete employee (permanently remove from database)
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDeleteEmployee(@PathVariable String id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get employees by department
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String departmentId) {
        List<Employee> employees = employeeRepository.findByDepartmentId(departmentId);
        return ResponseEntity.ok(employees);
    }

    // Get employees by position
    @GetMapping("/position/{positionId}")
    public ResponseEntity<List<Employee>> getEmployeesByPosition(@PathVariable String positionId) {
        List<Employee> employees = employeeRepository.findByPositionId(positionId);
        return ResponseEntity.ok(employees);
    }

    // Get active employees only
    @GetMapping("/active")
    public ResponseEntity<List<Employee>> getActiveEmployees() {
        List<Employee> employees = employeeRepository.findByEmployeeStatus(
            com.hrmanagement.hr_management_api.model.enums.EmployeeStatus.ACTIVE
        );
        return ResponseEntity.ok(employees);
    }

    // Search employees by name
    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(@RequestParam String query) {
        List<Employee> employees = employeeRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
        return ResponseEntity.ok(employees);
    }

    // Get employee count
    @GetMapping("/count")
    public ResponseEntity<Long> getEmployeeCount() {
        long count = employeeRepository.count();
        return ResponseEntity.ok(count);
    }
}
