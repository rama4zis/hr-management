package com.hrmanagement.hr_management_api.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrmanagement.hr_management_api.model.entity.Attendance;
import com.hrmanagement.hr_management_api.model.enums.AttendanceStatus;
import com.hrmanagement.hr_management_api.repository.AttendanceRepository;
import com.hrmanagement.hr_management_api.util.ApiResponse;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    public AttendanceController(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // Get all attendance records (non-deleted)
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllAttendance() {
        List<Attendance> attendanceRecords = attendanceRepository.findByIsDeletedFalse();
        ApiResponse response = new ApiResponse(true, "Attendance records retrieved successfully", attendanceRecords);
        return ResponseEntity.ok(response);
    }

    // Get all attendance records including deleted
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllAttendanceIncludingDeleted() {
        List<Attendance> attendanceRecords = attendanceRepository.findAll();
        ApiResponse response = new ApiResponse(true, "All attendance records retrieved successfully", attendanceRecords);
        return ResponseEntity.ok(response);
    }

    // Get attendance record by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getAttendanceById(@PathVariable String id) {
        Optional<Attendance> attendance = attendanceRepository.findByIdAndIsDeletedFalse(id);
        return attendance.map(record -> {
            ApiResponse response = new ApiResponse(true, "Attendance record retrieved successfully", record);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Attendance record not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Create new attendance record
    @PostMapping("/")
    public ResponseEntity<ApiResponse> createAttendance(@RequestBody Attendance attendance) {
        try {
            // Ensure the attendance is not marked as deleted when creating
            attendance.setDeleted(false);
            
            // Check if attendance already exists for this employee on this date
            Optional<Attendance> existingAttendance = attendanceRepository
                .findByEmployeeIdAndDateAndIsDeletedFalse(attendance.getEmployeeId(), attendance.getDate());
            
            if (existingAttendance.isPresent()) {
                ApiResponse response = new ApiResponse(false, 
                    "Attendance record already exists for this employee on this date", null);
                return ResponseEntity.badRequest().body(response);
            }
            
            Attendance savedAttendance = attendanceRepository.save(attendance);
            ApiResponse response = new ApiResponse(true, "Attendance record created successfully", savedAttendance);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error creating attendance record: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update attendance record
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateAttendance(@PathVariable String id, @RequestBody Attendance attendanceDetails) {
        return attendanceRepository.findByIdAndIsDeletedFalse(id).map(attendance -> {
            try {
                attendance.setEmployeeId(attendanceDetails.getEmployeeId());
                attendance.setDate(attendanceDetails.getDate());
                attendance.setClockIn(attendanceDetails.getClockIn());
                attendance.setClockOut(attendanceDetails.getClockOut());
                attendance.setAttendanceStatus(attendanceDetails.getAttendanceStatus());
                attendance.setNotes(attendanceDetails.getNotes());
                
                Attendance updatedAttendance = attendanceRepository.save(attendance);
                ApiResponse response = new ApiResponse(true, "Attendance record updated successfully", updatedAttendance);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error updating attendance record: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Attendance record not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Partial update attendance record
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> partialUpdateAttendance(@PathVariable String id, @RequestBody Attendance attendanceDetails) {
        return attendanceRepository.findByIdAndIsDeletedFalse(id).map(attendance -> {
            try {
                if (attendanceDetails.getEmployeeId() != null) {
                    attendance.setEmployeeId(attendanceDetails.getEmployeeId());
                }
                if (attendanceDetails.getDate() != null) {
                    attendance.setDate(attendanceDetails.getDate());
                }
                if (attendanceDetails.getClockIn() != null) {
                    attendance.setClockIn(attendanceDetails.getClockIn());
                }
                if (attendanceDetails.getClockOut() != null) {
                    attendance.setClockOut(attendanceDetails.getClockOut());
                }
                if (attendanceDetails.getAttendanceStatus() != null) {
                    attendance.setAttendanceStatus(attendanceDetails.getAttendanceStatus());
                }
                if (attendanceDetails.getNotes() != null) {
                    attendance.setNotes(attendanceDetails.getNotes());
                }
                
                Attendance updatedAttendance = attendanceRepository.save(attendance);
                ApiResponse response = new ApiResponse(true, "Attendance record updated successfully", updatedAttendance);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error updating attendance record: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Attendance record not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Soft delete attendance record
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAttendance(@PathVariable String id) {
        return attendanceRepository.findByIdAndIsDeletedFalse(id).map(attendance -> {
            try {
                attendance.setDeleted(true);
                attendanceRepository.save(attendance);
                ApiResponse response = new ApiResponse(true, "Attendance record deleted successfully", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error deleting attendance record: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Attendance record not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Hard delete attendance record (permanent)
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse> permanentDeleteAttendance(@PathVariable String id) {
        return attendanceRepository.findById(id).map(attendance -> {
            try {
                attendanceRepository.delete(attendance);
                ApiResponse response = new ApiResponse(true, "Attendance record permanently deleted", null);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error permanently deleting attendance record: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Attendance record not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Restore soft deleted attendance record
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse> restoreAttendance(@PathVariable String id) {
        return attendanceRepository.findById(id).map(attendance -> {
            if (!attendance.isDeleted()) {
                ApiResponse response = new ApiResponse(false, "Attendance record is not deleted", null);
                return ResponseEntity.badRequest().body(response);
            }
            try {
                attendance.setDeleted(false);
                Attendance restoredAttendance = attendanceRepository.save(attendance);
                ApiResponse response = new ApiResponse(true, "Attendance record restored successfully", restoredAttendance);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                ApiResponse response = new ApiResponse(false, "Error restoring attendance record: " + e.getMessage(), null);
                return ResponseEntity.badRequest().body(response);
            }
        }).orElseGet(() -> {
            ApiResponse response = new ApiResponse(false, "Attendance record not found", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        });
    }

    // Get attendance by employee ID
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse> getAttendanceByEmployee(@PathVariable String employeeId) {
        try {
            List<Attendance> attendanceRecords = attendanceRepository.findByEmployeeIdAndIsDeletedFalse(employeeId);
            ApiResponse response = new ApiResponse(true, "Employee attendance records retrieved successfully", attendanceRecords);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving employee attendance: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get attendance by date
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<Attendance> attendanceRecords = attendanceRepository.findByDateAndIsDeletedFalse(date);
            ApiResponse response = new ApiResponse(true, "Attendance records for date retrieved successfully", attendanceRecords);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving attendance by date: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get attendance by date range
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse> getAttendanceByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Attendance> attendanceRecords = attendanceRepository.findByDateBetweenAndIsDeletedFalse(startDate, endDate);
            ApiResponse response = new ApiResponse(true, "Attendance records for date range retrieved successfully", attendanceRecords);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving attendance by date range: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get employee attendance by date range
    @GetMapping("/employee/{employeeId}/date-range")
    public ResponseEntity<ApiResponse> getEmployeeAttendanceByDateRange(
            @PathVariable String employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Attendance> attendanceRecords = attendanceRepository
                .findByEmployeeIdAndDateBetweenAndIsDeletedFalse(employeeId, startDate, endDate);
            ApiResponse response = new ApiResponse(true, "Employee attendance records for date range retrieved successfully", attendanceRecords);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving employee attendance by date range: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get attendance by status
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getAttendanceByStatus(@PathVariable AttendanceStatus status) {
        try {
            List<Attendance> attendanceRecords = attendanceRepository.findByAttendanceStatusAndIsDeletedFalse(status);
            ApiResponse response = new ApiResponse(true, "Attendance records by status retrieved successfully", attendanceRecords);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving attendance by status: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get late arrivals
    @GetMapping("/late-arrivals")
    public ResponseEntity<ApiResponse> getLateArrivals() {
        try {
            List<Attendance> lateArrivals = attendanceRepository.findLateArrivals();
            ApiResponse response = new ApiResponse(true, "Late arrival records retrieved successfully", lateArrivals);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving late arrivals: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get overtime records
    @GetMapping("/overtime")
    public ResponseEntity<ApiResponse> getOvertimeRecords() {
        try {
            List<Attendance> overtimeRecords = attendanceRepository.findOvertimeRecords();
            ApiResponse response = new ApiResponse(true, "Overtime records retrieved successfully", overtimeRecords);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving overtime records: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get work from home records
    @GetMapping("/work-from-home")
    public ResponseEntity<ApiResponse> getWorkFromHomeRecords() {
        try {
            List<Attendance> wfhRecords = attendanceRepository.findWorkFromHomeRecords();
            ApiResponse response = new ApiResponse(true, "Work from home records retrieved successfully", wfhRecords);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving work from home records: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get monthly attendance report
    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<ApiResponse> getMonthlyAttendance(@PathVariable int year, @PathVariable int month) {
        try {
            List<Attendance> monthlyAttendance = attendanceRepository.findMonthlyAttendance(year, month);
            ApiResponse response = new ApiResponse(true, "Monthly attendance report retrieved successfully", monthlyAttendance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving monthly attendance: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get employee monthly attendance report
    @GetMapping("/employee/{employeeId}/monthly/{year}/{month}")
    public ResponseEntity<ApiResponse> getEmployeeMonthlyAttendance(
            @PathVariable String employeeId,
            @PathVariable int year,
            @PathVariable int month) {
        try {
            List<Attendance> employeeMonthlyAttendance = attendanceRepository
                .findEmployeeMonthlyAttendance(employeeId, year, month);
            ApiResponse response = new ApiResponse(true, "Employee monthly attendance report retrieved successfully", employeeMonthlyAttendance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving employee monthly attendance: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Clock in
    @PostMapping("/clock-in")
    public ResponseEntity<ApiResponse> clockIn(@RequestBody ClockInRequest request) {
        try {
            LocalDate today = LocalDate.now();
            
            // Check if employee already clocked in today
            Optional<Attendance> existingAttendance = attendanceRepository
                .findByEmployeeIdAndDateAndIsDeletedFalse(request.getEmployeeId(), today);
            
            if (existingAttendance.isPresent()) {
                ApiResponse response = new ApiResponse(false, "Employee already clocked in today", null);
                return ResponseEntity.badRequest().body(response);
            }
            
            Attendance attendance = new Attendance();
            attendance.setEmployeeId(request.getEmployeeId());
            attendance.setDate(today);
            attendance.setClockIn(LocalDateTime.now());
            attendance.setAttendanceStatus(AttendanceStatus.PRESENT);
            attendance.setDeleted(false);
            
            Attendance savedAttendance = attendanceRepository.save(attendance);
            ApiResponse response = new ApiResponse(true, "Clocked in successfully", savedAttendance);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error clocking in: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Clock out
    @PutMapping("/clock-out")
    public ResponseEntity<ApiResponse> clockOut(@RequestBody ClockOutRequest request) {
        try {
            LocalDate today = LocalDate.now();
            
            Optional<Attendance> attendanceOpt = attendanceRepository
                .findByEmployeeIdAndDateAndIsDeletedFalse(request.getEmployeeId(), today);
            
            if (attendanceOpt.isEmpty()) {
                ApiResponse response = new ApiResponse(false, "No clock-in record found for today", null);
                return ResponseEntity.badRequest().body(response);
            }
            
            Attendance attendance = attendanceOpt.get();
            if (attendance.getClockOut() != null) {
                ApiResponse response = new ApiResponse(false, "Employee already clocked out today", null);
                return ResponseEntity.badRequest().body(response);
            }
            
            attendance.setClockOut(LocalDateTime.now());
            if (request.getNotes() != null) {
                attendance.setNotes(request.getNotes());
            }
            
            Attendance updatedAttendance = attendanceRepository.save(attendance);
            ApiResponse response = new ApiResponse(true, "Clocked out successfully", updatedAttendance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error clocking out: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get attendance count
    @GetMapping("/count")
    public ResponseEntity<ApiResponse> getAttendanceCount() {
        try {
            long count = attendanceRepository.countByIsDeletedFalse();
            ApiResponse response = new ApiResponse(true, "Attendance count retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error getting attendance count: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get attendance count by status
    @GetMapping("/count/status/{status}")
    public ResponseEntity<ApiResponse> getAttendanceCountByStatus(@PathVariable AttendanceStatus status) {
        try {
            long count = attendanceRepository.countByAttendanceStatusAndIsDeletedFalse(status);
            ApiResponse response = new ApiResponse(true, "Attendance count by status retrieved successfully", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error getting attendance count by status: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get deleted attendance records
    @GetMapping("/deleted")
    public ResponseEntity<ApiResponse> getDeletedAttendance() {
        try {
            List<Attendance> deletedAttendance = attendanceRepository.findAll().stream()
                .filter(Attendance::isDeleted)
                .toList();
            ApiResponse response = new ApiResponse(true, "Deleted attendance records retrieved successfully", deletedAttendance);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error retrieving deleted attendance records: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Bulk delete attendance records
    @DeleteMapping("/bulk")
    public ResponseEntity<ApiResponse> bulkDeleteAttendance(@RequestBody List<String> attendanceIds) {
        try {
            List<Attendance> attendanceRecords = attendanceRepository.findAllById(attendanceIds);
            attendanceRecords.forEach(attendance -> attendance.setDeleted(true));
            attendanceRepository.saveAll(attendanceRecords);
            
            ApiResponse response = new ApiResponse(true, 
                "Bulk delete completed. " + attendanceRecords.size() + " attendance records deleted.", attendanceRecords.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(false, "Error in bulk delete: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // DTO classes for clock in/out requests
    public static class ClockInRequest {
        private String employeeId;

        public String getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }
    }

    public static class ClockOutRequest {
        private String employeeId;
        private String notes;

        public String getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}
