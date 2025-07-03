package com.hrmanagement.hr_management_api.service;

import com.hrmanagement.hr_management_api.model.entity.Position;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import com.hrmanagement.hr_management_api.repository.PositionRepository;
import com.hrmanagement.hr_management_api.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PositionService {

    private final PositionRepository positionRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public PositionService(PositionRepository positionRepository, 
                          EmployeeRepository employeeRepository,
                          DepartmentRepository departmentRepository) {
        this.positionRepository = positionRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    /**
     * Get all positions
     */
    @Transactional(readOnly = true)
    public List<Position> getAllPositions() {
        return positionRepository.findAllByOrderByTitle();
    }

    /**
     * Get position by ID
     */
    @Transactional(readOnly = true)
    public Optional<Position> getPositionById(String id) {
        return positionRepository.findById(id);
    }

    /**
     * Get positions by department
     */
    @Transactional(readOnly = true)
    public List<Position> getPositionsByDepartment(String departmentId) {
        return positionRepository.findByDepartmentIdOrderByTitle(departmentId);
    }

    /**
     * Create new position
     */
    public Position createPosition(Position position) {
        validateDepartmentExists(position.getDepartmentId());
        validatePositionTitle(position.getTitle(), position.getDepartmentId(), null);
        return positionRepository.save(position);
    }

    /**
     * Update existing position
     */
    public Position updatePosition(String id, Position position) {
        Position existingPosition = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found with id: " + id));

        validateDepartmentExists(position.getDepartmentId());
        validatePositionTitle(position.getTitle(), position.getDepartmentId(), id);

        existingPosition.setTitle(position.getTitle());
        existingPosition.setDescription(position.getDescription());
        existingPosition.setDepartmentId(position.getDepartmentId());

        return positionRepository.save(existingPosition);
    }

    /**
     * Delete position
     */
    public void deletePosition(String id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found with id: " + id));

        // Check if position has employees
        long employeeCount = employeeRepository.countByPositionId(id);
        if (employeeCount > 0) {
            throw new RuntimeException("Cannot delete position with existing employees");
        }

        positionRepository.delete(position);
    }

    /**
     * Search positions by title
     */
    @Transactional(readOnly = true)
    public List<Position> searchPositionsByTitle(String title) {
        return positionRepository.findByTitleContainingIgnoreCase(title);
    }

    /**
     * Search positions by title within department
     */
    @Transactional(readOnly = true)
    public List<Position> searchPositionsByTitleInDepartment(String departmentId, String title) {
        return positionRepository.findByDepartmentIdAndTitleContainingIgnoreCase(departmentId, title);
    }

    /**
     * Get positions with employee counts
     */
    @Transactional(readOnly = true)
    public List<Object[]> getPositionsWithEmployeeCount() {
        return positionRepository.findAllPositionsWithEmployeeCount();
    }

    /**
     * Get positions by department with employee counts
     */
    @Transactional(readOnly = true)
    public List<Object[]> getPositionsByDepartmentWithEmployeeCount(String departmentId) {
        return positionRepository.findPositionsByDepartmentWithEmployeeCount(departmentId);
    }

    /**
     * Get position with employee count
     */
    @Transactional(readOnly = true)
    public Optional<Object[]> getPositionWithEmployeeCount(String id) {
        return positionRepository.findPositionWithEmployeeCount(id);
    }

    /**
     * Check if position title is available in department
     */
    @Transactional(readOnly = true)
    public boolean isPositionTitleAvailable(String title, String departmentId, String excludeId) {
        if (excludeId != null) {
            return !positionRepository.existsByTitleIgnoreCaseAndDepartmentIdAndIdNot(title, departmentId, excludeId);
        }
        return !positionRepository.existsByTitleIgnoreCaseAndDepartmentId(title, departmentId);
    }

    /**
     * Get employee count for position
     */
    @Transactional(readOnly = true)
    public long getEmployeeCountForPosition(String positionId) {
        return employeeRepository.countByPositionId(positionId);
    }

    /**
     * Validate department exists
     */
    private void validateDepartmentExists(String departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new RuntimeException("Department not found with id: " + departmentId);
        }
    }

    /**
     * Validate position title uniqueness within department
     */
    private void validatePositionTitle(String title, String departmentId, String excludeId) {
        if (!isPositionTitleAvailable(title, departmentId, excludeId)) {
            throw new RuntimeException("Position title already exists in this department: " + title);
        }
    }
}
