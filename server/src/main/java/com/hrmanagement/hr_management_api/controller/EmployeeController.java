package com.hrmanagement.hr_management_api.controller;

import com.hrmanagement.hr_management_api.model.dto.CreateEmployeeRequest;
import com.hrmanagement.hr_management_api.model.dto.EmployeeDTO;
import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.model.enums.Status;
import com.hrmanagement.hr_management_api.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * Get all employees
     */
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        try {
            List<EmployeeDTO> employees = employeeService.getAllEmployees();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all employees with pagination
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<EmployeeDTO>> getAllEmployeesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                       Sort.by(sortBy).descending() : 
                       Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<EmployeeDTO> employees = employeeService.getAllEmployees(pageable);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employee by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        try {
            Optional<Employee> employee = employeeService.getEmployeeById(id);
            return employee.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employee with details by ID
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<EmployeeDTO> getEmployeeWithDetailsById(@PathVariable String id) {
        try {
            Optional<EmployeeDTO> employee = employeeService.getEmployeeWithDetailsById(id);
            return employee.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create new employee
     */
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        try {
            Employee createdEmployee = employeeService.createEmployee(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update existing employee
     */
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable String id, 
                                                  @Valid @RequestBody Employee employee) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employee);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete employee (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Hard delete employee
     */
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDeleteEmployee(@PathVariable String id) {
        try {
            employeeService.hardDeleteEmployee(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search employees by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(@RequestParam String searchTerm) {
        try {
            List<Employee> employees = employeeService.searchEmployeesByName(searchTerm);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search employees with pagination
     */
    @GetMapping("/search/paginated")
    public ResponseEntity<Page<Employee>> searchEmployeesPaginated(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Employee> employees = employeeService.searchEmployees(searchTerm, pageable);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employees by department
     */
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByDepartment(@PathVariable String departmentId) {
        try {
            List<EmployeeDTO> employees = employeeService.getEmployeesByDepartment(departmentId);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employees by position
     */
    @GetMapping("/position/{positionId}")
    public ResponseEntity<List<Employee>> getEmployeesByPosition(@PathVariable String positionId) {
        try {
            List<Employee> employees = employeeService.getEmployeesByPosition(positionId);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employees by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Employee>> getEmployeesByStatus(@PathVariable Status status) {
        try {
            List<Employee> employees = employeeService.getEmployeesByStatus(status);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get active employees
     */
    @GetMapping("/active")
    public ResponseEntity<List<Employee>> getActiveEmployees() {
        try {
            List<Employee> employees = employeeService.getActiveEmployees();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employees hired between dates
     */
    @GetMapping("/hired-between")
    public ResponseEntity<List<Employee>> getEmployeesHiredBetween(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            List<Employee> employees = employeeService.getEmployeesHiredBetween(startDate, endDate);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employees by salary range
     */
    @GetMapping("/salary-range")
    public ResponseEntity<List<Employee>> getEmployeesBySalaryRange(
            @RequestParam BigDecimal minSalary,
            @RequestParam BigDecimal maxSalary) {
        try {
            List<Employee> employees = employeeService.getEmployeesBySalaryRange(minSalary, maxSalary);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employees hired in specific year
     */
    @GetMapping("/hired-in-year/{year}")
    public ResponseEntity<List<Employee>> getEmployeesHiredInYear(@PathVariable int year) {
        try {
            List<Employee> employees = employeeService.getEmployeesHiredInYear(year);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update employee status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Employee> updateEmployeeStatus(@PathVariable String id, 
                                                        @RequestParam Status status) {
        try {
            Employee employee = employeeService.updateEmployeeStatus(id, status);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employee count by department
     */
    @GetMapping("/count/department/{departmentId}")
    public ResponseEntity<Long> getEmployeeCountByDepartment(@PathVariable String departmentId) {
        try {
            long count = employeeService.getEmployeeCountByDepartment(departmentId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employee count by position
     */
    @GetMapping("/count/position/{positionId}")
    public ResponseEntity<Long> getEmployeeCountByPosition(@PathVariable String positionId) {
        try {
            long count = employeeService.getEmployeeCountByPosition(positionId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employee count by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> getEmployeeCountByStatus(@PathVariable Status status) {
        try {
            long count = employeeService.getEmployeeCountByStatus(status);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if email is available
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailAvailability(@RequestParam String email,
                                                         @RequestParam(required = false) String excludeId) {
        try {
            boolean available = employeeService.isEmailAvailable(email, excludeId);
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
