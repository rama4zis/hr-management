package com.hrmanagement.hr_management_api.service;

import com.hrmanagement.hr_management_api.model.dto.CreateEmployeeRequest;
import com.hrmanagement.hr_management_api.model.dto.EmployeeDTO;
import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.model.enums.Status;
import com.hrmanagement.hr_management_api.repository.DepartmentRepository;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import com.hrmanagement.hr_management_api.repository.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository,
                          DepartmentRepository departmentRepository,
                          PositionRepository positionRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
    }

    /**
     * Get all employees
     */
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAllEmployees() {
        List<Object[]> results = employeeRepository.findAllEmployeesWithDetails();
        return results.stream()
                .map(this::mapToEmployeeDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get employees with pagination
     */
    @Transactional(readOnly = true)
    public Page<EmployeeDTO> getAllEmployees(Pageable pageable) {
        Page<Object[]> results = employeeRepository.findAllEmployeesWithDetails(pageable);
        return results.map(this::mapToEmployeeDTO);
    }

    /**
     * Get employee by ID
     */
    @Transactional(readOnly = true)
    public Optional<Employee> getEmployeeById(String id) {
        return employeeRepository.findById(id);
    }

    /**
     * Get employee with details by ID
     */
    @Transactional(readOnly = true)
    public Optional<EmployeeDTO> getEmployeeWithDetailsById(String id) {
        Optional<Object[]> result = employeeRepository.findEmployeeWithDetails(id);
        return result.map(this::mapToEmployeeDTO);
    }

    /**
     * Create new employee
     */
    public Employee createEmployee(CreateEmployeeRequest request) {
        validateEmployeeData(request.getEmail(), request.getDepartmentId(), request.getPositionId(), null);

        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartmentId(request.getDepartmentId());
        employee.setPositionId(request.getPositionId());
        employee.setHireDate(request.getHireDate());
        employee.setSalary(request.getSalary());
        employee.setProfileImage(request.getProfileImage());
        employee.setStatus(Status.ACTIVE);

        return employeeRepository.save(employee);
    }

    /**
     * Update existing employee
     */
    public Employee updateEmployee(String id, Employee employee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        validateEmployeeData(employee.getEmail(), employee.getDepartmentId(), employee.getPositionId(), id);

        existingEmployee.setFirstName(employee.getFirstName());
        existingEmployee.setLastName(employee.getLastName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setPhone(employee.getPhone());
        existingEmployee.setDepartmentId(employee.getDepartmentId());
        existingEmployee.setPositionId(employee.getPositionId());
        existingEmployee.setHireDate(employee.getHireDate());
        existingEmployee.setSalary(employee.getSalary());
        existingEmployee.setStatus(employee.getStatus());
        existingEmployee.setProfileImage(employee.getProfileImage());

        return employeeRepository.save(existingEmployee);
    }

    /**
     * Delete employee
     */
    public void deleteEmployee(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Soft delete by setting status to inactive
        employee.setStatus(Status.INACTIVE);
        employeeRepository.save(employee);
    }

    /**
     * Hard delete employee
     */
    public void hardDeleteEmployee(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employeeRepository.delete(employee);
    }

    /**
     * Search employees by name
     */
    @Transactional(readOnly = true)
    public List<Employee> searchEmployeesByName(String searchTerm) {
        return employeeRepository.findByNameContaining(searchTerm);
    }

    /**
     * Search employees with pagination
     */
    @Transactional(readOnly = true)
    public Page<Employee> searchEmployees(String searchTerm, Pageable pageable) {
        return employeeRepository.findBySearchTerm(searchTerm, pageable);
    }

    /**
     * Get employees by department
     */
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getEmployeesByDepartment(String departmentId) {
        List<Object[]> results = employeeRepository.findEmployeesByDepartmentWithDetails(departmentId);
        return results.stream()
                .map(this::mapToEmployeeDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get employees by position
     */
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesByPosition(String positionId) {
        return employeeRepository.findByPositionId(positionId);
    }

    /**
     * Get employees by status
     */
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesByStatus(Status status) {
        return employeeRepository.findByStatusOrderByFirstNameAscLastNameAsc(status);
    }

    /**
     * Get active employees
     */
    @Transactional(readOnly = true)
    public List<Employee> getActiveEmployees() {
        return employeeRepository.findByStatusOrderByFirstNameAscLastNameAsc(Status.ACTIVE);
    }

    /**
     * Get employees hired between dates
     */
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesHiredBetween(LocalDate startDate, LocalDate endDate) {
        return employeeRepository.findByHireDateBetween(startDate, endDate);
    }

    /**
     * Get employees by salary range
     */
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesBySalaryRange(BigDecimal minSalary, BigDecimal maxSalary) {
        return employeeRepository.findBySalaryBetween(minSalary, maxSalary);
    }

    /**
     * Get employees hired in specific year
     */
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesHiredInYear(int year) {
        return employeeRepository.findByHireYear(year);
    }

    /**
     * Get employee count by department
     */
    @Transactional(readOnly = true)
    public long getEmployeeCountByDepartment(String departmentId) {
        return employeeRepository.countByDepartmentId(departmentId);
    }

    /**
     * Get employee count by position
     */
    @Transactional(readOnly = true)
    public long getEmployeeCountByPosition(String positionId) {
        return employeeRepository.countByPositionId(positionId);
    }

    /**
     * Get employee count by status
     */
    @Transactional(readOnly = true)
    public long getEmployeeCountByStatus(Status status) {
        return employeeRepository.countByStatus(status);
    }

    /**
     * Update employee status
     */
    public Employee updateEmployeeStatus(String id, Status status) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employee.setStatus(status);
        return employeeRepository.save(employee);
    }

    /**
     * Check if email is available
     */
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email, String excludeId) {
        if (excludeId != null) {
            return !employeeRepository.existsByEmailAndIdNot(email, excludeId);
        }
        return !employeeRepository.existsByEmail(email);
    }

    /**
     * Validate employee data
     */
    private void validateEmployeeData(String email, String departmentId, String positionId, String excludeId) {
        // Validate email uniqueness
        if (!isEmailAvailable(email, excludeId)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        // Validate department exists
        if (!departmentRepository.existsById(departmentId)) {
            throw new RuntimeException("Department not found with id: " + departmentId);
        }

        // Validate position exists
        if (!positionRepository.existsById(positionId)) {
            throw new RuntimeException("Position not found with id: " + positionId);
        }
    }

    /**
     * Map database result to DTO
     */
    private EmployeeDTO mapToEmployeeDTO(Object[] result) {
        Employee employee = (Employee) result[0];
        String departmentName = (String) result[1];
        String positionTitle = (String) result[2];

        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setDepartmentId(employee.getDepartmentId());
        dto.setDepartmentName(departmentName);
        dto.setPositionId(employee.getPositionId());
        dto.setPositionTitle(positionTitle);
        dto.setHireDate(employee.getHireDate());
        dto.setSalary(employee.getSalary());
        dto.setStatus(employee.getStatus());
        dto.setProfileImage(employee.getProfileImage());

        return dto;
    }
}
