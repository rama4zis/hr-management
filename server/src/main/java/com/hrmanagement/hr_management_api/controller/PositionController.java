package com.hrmanagement.hr_management_api.controller;

import com.hrmanagement.hr_management_api.model.entity.Position;
import com.hrmanagement.hr_management_api.service.PositionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/positions")
@CrossOrigin(origins = "*")
public class PositionController {

    private final PositionService positionService;

    @Autowired
    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    /**
     * Get all positions
     */
    @GetMapping
    public ResponseEntity<List<Position>> getAllPositions() {
        try {
            List<Position> positions = positionService.getAllPositions();
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get position by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Position> getPositionById(@PathVariable String id) {
        try {
            Optional<Position> position = positionService.getPositionById(id);
            return position.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get positions by department
     */
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Position>> getPositionsByDepartment(@PathVariable String departmentId) {
        try {
            List<Position> positions = positionService.getPositionsByDepartment(departmentId);
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create new position
     */
    @PostMapping
    public ResponseEntity<Position> createPosition(@Valid @RequestBody Position position) {
        try {
            Position createdPosition = positionService.createPosition(position);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPosition);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update existing position
     */
    @PutMapping("/{id}")
    public ResponseEntity<Position> updatePosition(@PathVariable String id, 
                                                  @Valid @RequestBody Position position) {
        try {
            Position updatedPosition = positionService.updatePosition(id, position);
            return ResponseEntity.ok(updatedPosition);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete position
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable String id) {
        try {
            positionService.deletePosition(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search positions by title
     */
    @GetMapping("/search")
    public ResponseEntity<List<Position>> searchPositions(@RequestParam String title) {
        try {
            List<Position> positions = positionService.searchPositionsByTitle(title);
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search positions by title within department
     */
    @GetMapping("/search/department/{departmentId}")
    public ResponseEntity<List<Position>> searchPositionsInDepartment(@PathVariable String departmentId, 
                                                                     @RequestParam String title) {
        try {
            List<Position> positions = positionService.searchPositionsByTitleInDepartment(departmentId, title);
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get positions with employee counts
     */
    @GetMapping("/with-counts")
    public ResponseEntity<List<Object[]>> getPositionsWithEmployeeCount() {
        try {
            List<Object[]> positions = positionService.getPositionsWithEmployeeCount();
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get positions by department with employee counts
     */
    @GetMapping("/department/{departmentId}/with-counts")
    public ResponseEntity<List<Object[]>> getPositionsByDepartmentWithEmployeeCount(@PathVariable String departmentId) {
        try {
            List<Object[]> positions = positionService.getPositionsByDepartmentWithEmployeeCount(departmentId);
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get position with employee count
     */
    @GetMapping("/{id}/with-count")
    public ResponseEntity<Object[]> getPositionWithEmployeeCount(@PathVariable String id) {
        try {
            Optional<Object[]> position = positionService.getPositionWithEmployeeCount(id);
            return position.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employee count for position
     */
    @GetMapping("/{id}/employee-count")
    public ResponseEntity<Long> getEmployeeCountForPosition(@PathVariable String id) {
        try {
            long count = positionService.getEmployeeCountForPosition(id);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if position title is available in department
     */
    @GetMapping("/check-title")
    public ResponseEntity<Boolean> checkPositionTitleAvailability(@RequestParam String title,
                                                                 @RequestParam String departmentId,
                                                                 @RequestParam(required = false) String excludeId) {
        try {
            boolean available = positionService.isPositionTitleAvailable(title, departmentId, excludeId);
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
