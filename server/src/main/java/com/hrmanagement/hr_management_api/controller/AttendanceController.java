package com.hrmanagement.hr_management_api.controller;

import com.hrmanagement.hr_management_api.model.entity.Attendance;
import com.hrmanagement.hr_management_api.model.enums.AttendanceStatus;
import com.hrmanagement.hr_management_api.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /**
     * Get all attendance records
     */
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        try {
            List<Attendance> attendance = attendanceService.getAllAttendance();
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable String id) {
        try {
            Optional<Attendance> attendance = attendanceService.getAttendanceById(id);
            return attendance.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance by employee and date
     */
    @GetMapping("/employee/{employeeId}/date/{date}")
    public ResponseEntity<Attendance> getAttendanceByEmployeeAndDate(@PathVariable String employeeId, 
                                                                    @PathVariable LocalDate date) {
        try {
            Optional<Attendance> attendance = attendanceService.getAttendanceByEmployeeAndDate(employeeId, date);
            return attendance.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records for employee
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployee(@PathVariable String employeeId) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByEmployee(employeeId);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records for employee with pagination
     */
    @GetMapping("/employee/{employeeId}/paginated")
    public ResponseEntity<Page<Attendance>> getAttendanceByEmployeePaginated(
            @PathVariable String employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Attendance> attendance = attendanceService.getAttendanceByEmployee(employeeId, pageable);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<Attendance>> getAttendanceByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByDateRange(startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records for employee in date range
     */
    @GetMapping("/employee/{employeeId}/date-range")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployeeAndDateRange(
            @PathVariable String employeeId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByEmployeeAndDateRange(employeeId, startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Attendance>> getAttendanceByStatus(@PathVariable AttendanceStatus status) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByStatus(status);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Clock in (create attendance record)
     */
    @PostMapping("/clock-in")
    public ResponseEntity<Attendance> clockIn(@RequestParam String employeeId,
                                             @RequestParam LocalDate date,
                                             @RequestParam LocalDateTime clockIn,
                                             @RequestParam AttendanceStatus status,
                                             @RequestParam(required = false) String notes) {
        try {
            Attendance attendance = attendanceService.clockIn(employeeId, date, clockIn, status, notes);
            return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Clock out (update existing attendance)
     */
    @PutMapping("/{attendanceId}/clock-out")
    public ResponseEntity<Attendance> clockOut(@PathVariable String attendanceId,
                                              @RequestParam LocalDateTime clockOut) {
        try {
            Attendance attendance = attendanceService.clockOut(attendanceId, clockOut);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create or save attendance record
     */
    @PostMapping
    public ResponseEntity<Attendance> saveAttendance(@Valid @RequestBody Attendance attendance) {
        try {
            Attendance savedAttendance = attendanceService.saveAttendance(attendance);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAttendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update attendance record
     */
    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(@PathVariable String id,
                                                      @Valid @RequestBody Attendance attendance) {
        try {
            Attendance updatedAttendance = attendanceService.updateAttendance(id, attendance);
            return ResponseEntity.ok(updatedAttendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete attendance record
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable String id) {
        try {
            attendanceService.deleteAttendance(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records for specific date
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(@PathVariable LocalDate date) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByDate(date);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records for month and year
     */
    @GetMapping("/month/{month}/year/{year}")
    public ResponseEntity<List<Attendance>> getAttendanceByMonthAndYear(@PathVariable int month, 
                                                                       @PathVariable int year) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByMonthAndYear(month, year);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records for employee in month and year
     */
    @GetMapping("/employee/{employeeId}/month/{month}/year/{year}")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployeeAndMonthAndYear(@PathVariable String employeeId,
                                                                                  @PathVariable int month, 
                                                                                  @PathVariable int year) {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceByEmployeeAndMonthAndYear(employeeId, month, year);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance with employee details
     */
    @GetMapping("/with-details")
    public ResponseEntity<List<Object[]>> getAttendanceWithEmployeeDetails(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            List<Object[]> attendance = attendanceService.getAttendanceWithEmployeeDetails(startDate, endDate);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance summary by status
     */
    @GetMapping("/summary/status")
    public ResponseEntity<List<Object[]>> getAttendanceSummaryByStatus(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            List<Object[]> summary = attendanceService.getAttendanceSummaryByStatus(startDate, endDate);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total hours for employee in date range
     */
    @GetMapping("/employee/{employeeId}/total-hours")
    public ResponseEntity<BigDecimal> getTotalHoursByEmployee(@PathVariable String employeeId,
                                                             @RequestParam LocalDate startDate,
                                                             @RequestParam LocalDate endDate) {
        try {
            BigDecimal totalHours = attendanceService.getTotalHoursByEmployee(employeeId, startDate, endDate);
            return ResponseEntity.ok(totalHours);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Count attendance by status for employee in date range
     */
    @GetMapping("/employee/{employeeId}/count/{status}")
    public ResponseEntity<Long> countAttendanceByStatus(@PathVariable String employeeId,
                                                       @PathVariable AttendanceStatus status,
                                                       @RequestParam LocalDate startDate,
                                                       @RequestParam LocalDate endDate) {
        try {
            long count = attendanceService.countAttendanceByStatus(employeeId, startDate, endDate, status);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get employees without attendance on specific date
     */
    @GetMapping("/missing/{date}")
    public ResponseEntity<List<Object>> getEmployeesWithoutAttendance(@PathVariable LocalDate date) {
        try {
            List<Object> employees = attendanceService.getEmployeesWithoutAttendance(date);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get attendance records that need clock out
     */
    @GetMapping("/needs-clock-out")
    public ResponseEntity<List<Attendance>> getAttendanceNeedingClockOut() {
        try {
            List<Attendance> attendance = attendanceService.getAttendanceNeedingClockOut();
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recent attendance records
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Attendance>> getRecentAttendance() {
        try {
            List<Attendance> attendance = attendanceService.getRecentAttendance();
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
