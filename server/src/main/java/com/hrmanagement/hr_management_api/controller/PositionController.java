package com.hrmanagement.hr_management_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrmanagement.hr_management_api.model.entity.Position;
import com.hrmanagement.hr_management_api.repository.PositionRepository;
import com.hrmanagement.hr_management_api.util.ApiResponse;

@RestController
@RequestMapping("/api/positions")
public class PositionController {

    private final PositionRepository positionRepository;

    public PositionController(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    // Get all positions (non-deleted)
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllPositions() {
        List<Position> positions = positionRepository.findByIsDeletedFalse();
        ApiResponse response = new ApiResponse(true, "Positions retrieved successfully", positions);
        return ResponseEntity.ok(response);
    }

    // Get all positions including deleted
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllPositionsIncludingDeleted() {
        List<Position> positions = positionRepository.findAll();
        ApiResponse response = new ApiResponse(true, "All positions retrieved successfully", positions);
        return ResponseEntity.ok(response);
    }

    // Get position by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getPositionById(@PathVariable String id) {
        Optional<Position> position = positionRepository.findByIdAndIsDeletedFalse(id);
        return position.map(pos -> {
            ApiResponse response = new ApiResponse(true, "Position retrieved successfully", pos);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Position not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Create new position
    @PostMapping("/")
    public ResponseEntity<ApiResponse> createPosition(@RequestBody Position position) {
        try {
            // Ensure the position is not marked as deleted when creating
            position.setDeleted(false);
            Position savedPosition = positionRepository.save(position);
            ApiResponse response = new ApiResponse(true, "Position created successfully", savedPosition);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error creating position: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update position
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePosition(@PathVariable String id, @RequestBody Position positionDetails) {
        return positionRepository.findByIdAndIsDeletedFalse(id).map(position -> {
            try {
                position.setTitle(positionDetails.getTitle());
                position.setDescription(positionDetails.getDescription());
                position.setDepartmentId(positionDetails.getDepartmentId());
                
                Position updatedPosition = positionRepository.save(position);
                ApiResponse response = new ApiResponse(true, "Position updated successfully", updatedPosition);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error updating position: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Position not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Partial update position
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> partialUpdatePosition(@PathVariable String id, @RequestBody Position positionDetails) {
        return positionRepository.findByIdAndIsDeletedFalse(id).map(position -> {
            try {
                if (positionDetails.getTitle() != null) {
                    position.setTitle(positionDetails.getTitle());
                }
                if (positionDetails.getDescription() != null) {
                    position.setDescription(positionDetails.getDescription());
                }
                if (positionDetails.getDepartmentId() != null) {
                    position.setDepartmentId(positionDetails.getDepartmentId());
                }
                
                Position updatedPosition = positionRepository.save(position);
                ApiResponse response = new ApiResponse(true, "Position updated successfully", updatedPosition);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error updating position: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Position not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Soft delete position
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deletePosition(@PathVariable String id) {
        return positionRepository.findByIdAndIsDeletedFalse(id).map(position -> {
            try {
                position.setDeleted(true);
                positionRepository.save(position);
                ApiResponse response = new ApiResponse(true, "Position deleted successfully", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error deleting position: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Position not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Hard delete position (permanent)
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse> permanentDeletePosition(@PathVariable String id) {
        return positionRepository.findById(id).map(position -> {
            try {
                positionRepository.delete(position);
                ApiResponse response = new ApiResponse(true, "Position permanently deleted", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error permanently deleting position: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Position not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Restore soft deleted position
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse> restorePosition(@PathVariable String id) {
        return positionRepository.findById(id).map(position -> {
            if (!position.isDeleted()) {
                ApiResponse response = new ApiResponse(false, "Position is not deleted", null);
                return ResponseEntity.badRequest().body(response);
            }
            try {
                position.setDeleted(false);
                Position restoredPosition = positionRepository.save(position);
                ApiResponse response = new ApiResponse(true, "Position restored successfully", restoredPosition);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error restoring position: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Position not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Search positions by title or description
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchPositions(@RequestParam String q) {
        try {
            List<Position> positions = positionRepository.searchPositions(q);
            ApiResponse response = new ApiResponse(true, "Search completed successfully", positions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error searching positions: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Filter positions by title
    @GetMapping("/filter/title")
    public ResponseEntity<ApiResponse> filterByTitle(@RequestParam String title) {
        try {
            List<Position> positions = positionRepository.findByTitleContainingIgnoreCaseAndIsDeletedFalse(title);
            ApiResponse response = new ApiResponse(true, "Positions filtered by title successfully", positions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error filtering positions: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get positions by department
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse> getPositionsByDepartment(@PathVariable String departmentId) {
        try {
            List<Position> positions = positionRepository.findByDepartmentIdAndIsDeletedFalse(departmentId);
            ApiResponse response = new ApiResponse(true, "Positions retrieved for department successfully", positions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving positions for department: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get position count by department
    @GetMapping("/department/{departmentId}/count")
    public ResponseEntity<ApiResponse> getPositionCountByDepartment(@PathVariable String departmentId) {
        try {
            Long count = positionRepository.countByDepartmentId(departmentId);
            ApiResponse response = new ApiResponse(true, "Position count retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error counting positions: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get positions with employee count
    @GetMapping("/with-employee-count")
    public ResponseEntity<ApiResponse> getPositionsWithEmployeeCount() {
        try {
            List<Object[]> results = positionRepository.findPositionsWithEmployeeCount();
            ApiResponse response = new ApiResponse(true, "Positions with employee count retrieved successfully", results);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving positions with employee count: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Bulk delete positions
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse> bulkDeletePositions(@RequestBody List<String> positionIds) {
        try {
            List<Position> positions = positionRepository.findAllById(positionIds);
            positions.forEach(position -> position.setDeleted(true));
            positionRepository.saveAll(positions);
            
            ApiResponse response = new ApiResponse(true, 
                "Bulk delete completed. " + positions.size() + " positions deleted.", positions.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error in bulk delete: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get deleted positions
    @GetMapping("/deleted")
    public ResponseEntity<ApiResponse> getDeletedPositions() {
        try {
            List<Position> deletedPositions = positionRepository.findAll().stream()
                .filter(Position::isDeleted)
                .toList();
            ApiResponse response = new ApiResponse(true, "Deleted positions retrieved successfully", deletedPositions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving deleted positions: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

}
