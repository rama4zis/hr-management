package com.hrmanagement.hr_management_api.service;

import com.hrmanagement.hr_management_api.model.dto.DepartmentDTO;
import com.hrmanagement.hr_management_api.model.entity.Department;
import com.hrmanagement.hr_management_api.repository.DepartmentRepository;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Get all departments
     */
    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        return departmentRepository.findAllByOrderByName();
    }

    /**
     * Get all departments with employee counts
     */
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getAllDepartmentsWithDetails() {
        List<Object[]> results = departmentRepository.findAllDepartmentsWithEmployeeCount();
        return results.stream()
                .map(this::mapToDepartmentDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get department by ID
     */
    @Transactional(readOnly = true)
    public Optional<Department> getDepartmentById(String id) {
        return departmentRepository.findById(id);
    }

    /**
     * Get department with details by ID
     */
    @Transactional(readOnly = true)
    public Optional<DepartmentDTO> getDepartmentWithDetailsById(String id) {
        Optional<Object[]> result = departmentRepository.findDepartmentWithEmployeeCount(id);
        return result.map(this::mapToDepartmentDTO);
    }

    /**
     * Create new department
     */
    public Department createDepartment(Department department) {
        validateDepartmentName(department.getName(), null);
        return departmentRepository.save(department);
    }

    /**
     * Update existing department
     */
    public Department updateDepartment(String id, Department department) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        validateDepartmentName(department.getName(), id);

        existingDepartment.setName(department.getName());
        existingDepartment.setDescription(department.getDescription());
        existingDepartment.setManagerId(department.getManagerId());

        return departmentRepository.save(existingDepartment);
    }

    /**
     * Delete department
     */
    public void deleteDepartment(String id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        // Check if department has employees
        long employeeCount = employeeRepository.countByDepartmentId(id);
        if (employeeCount > 0) {
            throw new RuntimeException("Cannot delete department with existing employees");
        }

        departmentRepository.delete(department);
    }

    /**
     * Search departments by name
     */
    @Transactional(readOnly = true)
    public List<Department> searchDepartmentsByName(String name) {
        return departmentRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Get departments by manager
     */
    @Transactional(readOnly = true)
    public List<Department> getDepartmentsByManager(String managerId) {
        return departmentRepository.findByManagerId(managerId);
    }

    /**
     * Get departments without manager
     */
    @Transactional(readOnly = true)
    public List<Department> getDepartmentsWithoutManager() {
        return departmentRepository.findByManagerIdIsNull();
    }

    /**
     * Assign manager to department
     */
    public Department assignManager(String departmentId, String managerId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));

        // Validate that manager exists and belongs to this department
        if (managerId != null && !employeeRepository.existsById(managerId)) {
            throw new RuntimeException("Employee not found with id: " + managerId);
        }

        department.setManagerId(managerId);
        return departmentRepository.save(department);
    }

    /**
     * Check if department name is available
     */
    @Transactional(readOnly = true)
    public boolean isDepartmentNameAvailable(String name, String excludeId) {
        if (excludeId != null) {
            return !departmentRepository.existsByNameIgnoreCaseAndIdNot(name, excludeId);
        }
        return !departmentRepository.existsByNameIgnoreCase(name);
    }

    /**
     * Validate department name uniqueness
     */
    private void validateDepartmentName(String name, String excludeId) {
        if (!isDepartmentNameAvailable(name, excludeId)) {
            throw new RuntimeException("Department name already exists: " + name);
        }
    }

    /**
     * Map database result to DTO
     */
    private DepartmentDTO mapToDepartmentDTO(Object[] result) {
        Department department = (Department) result[0];
        Long employeeCount = (Long) result[1];

        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setManagerId(department.getManagerId());
        dto.setEmployeeCount(employeeCount);
        dto.setCreatedAt(department.getCreatedAt());

        // Get manager name if exists
        if (department.getManagerId() != null) {
            employeeRepository.findById(department.getManagerId())
                    .ifPresent(manager -> dto.setManagerName(manager.getFullName()));
        }

        return dto;
    }
}
