package com.hrmanagement.hr_management_api.service;

import com.hrmanagement.hr_management_api.model.entity.Attendance;
import com.hrmanagement.hr_management_api.model.enums.AttendanceStatus;
import com.hrmanagement.hr_management_api.repository.AttendanceRepository;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * Get all attendance records
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    /**
     * Get attendance by ID
     */
    @Transactional(readOnly = true)
    public Optional<Attendance> getAttendanceById(String id) {
        return attendanceRepository.findById(id);
    }

    /**
     * Get attendance by employee and date
     */
    @Transactional(readOnly = true)
    public Optional<Attendance> getAttendanceByEmployeeAndDate(String employeeId, LocalDate date) {
        return attendanceRepository.findByEmployeeIdAndDate(employeeId, date);
    }

    /**
     * Get attendance records for employee
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByEmployee(String employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    /**
     * Get attendance records for employee with pagination
     */
    @Transactional(readOnly = true)
    public Page<Attendance> getAttendanceByEmployee(String employeeId, Pageable pageable) {
        return attendanceRepository.findByEmployeeId(employeeId, pageable);
    }

    /**
     * Get attendance records by date range
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByDateBetween(startDate, endDate);
    }

    /**
     * Get attendance records for employee in date range
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByEmployeeAndDateRange(String employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
    }

    /**
     * Get attendance records by status
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByStatus(AttendanceStatus status) {
        return attendanceRepository.findByStatus(status);
    }

    /**
     * Create attendance record (clock in)
     */
    public Attendance clockIn(String employeeId, LocalDate date, LocalDateTime clockIn, AttendanceStatus status, String notes) {
        validateEmployeeExists(employeeId);
        
        // Check if attendance already exists for this date
        if (attendanceRepository.existsByEmployeeIdAndDate(employeeId, date)) {
            throw new RuntimeException("Attendance already exists for employee on date: " + date);
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setDate(date);
        attendance.setClockIn(clockIn);
        attendance.setStatus(status);
        attendance.setNotes(notes);

        return attendanceRepository.save(attendance);
    }

    /**
     * Clock out (update existing attendance)
     */
    public Attendance clockOut(String attendanceId, LocalDateTime clockOut) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + attendanceId));

        if (attendance.getClockOut() != null) {
            throw new RuntimeException("Employee already clocked out for this attendance record");
        }

        if (clockOut.isBefore(attendance.getClockIn())) {
            throw new RuntimeException("Clock out time cannot be before clock in time");
        }

        attendance.setClockOut(clockOut);
        attendance.calculateTotalHours();

        return attendanceRepository.save(attendance);
    }

    /**
     * Create or update attendance record
     */
    public Attendance saveAttendance(Attendance attendance) {
        validateEmployeeExists(attendance.getEmployeeId());

        // If updating existing record, check if it exists
        if (attendance.getId() != null) {
            Optional<Attendance> existing = attendanceRepository.findById(attendance.getId());
            if (existing.isEmpty()) {
                throw new RuntimeException("Attendance record not found with id: " + attendance.getId());
            }
        } else {
            // For new records, check if attendance already exists for this date
            if (attendanceRepository.existsByEmployeeIdAndDate(attendance.getEmployeeId(), attendance.getDate())) {
                throw new RuntimeException("Attendance already exists for employee on date: " + attendance.getDate());
            }
        }

        // Calculate total hours if both clock in and out are set
        if (attendance.getClockIn() != null && attendance.getClockOut() != null) {
            attendance.calculateTotalHours();
        }

        return attendanceRepository.save(attendance);
    }

    /**
     * Update attendance record
     */
    public Attendance updateAttendance(String id, Attendance attendance) {
        Attendance existingAttendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + id));

        validateEmployeeExists(attendance.getEmployeeId());

        existingAttendance.setEmployeeId(attendance.getEmployeeId());
        existingAttendance.setDate(attendance.getDate());
        existingAttendance.setClockIn(attendance.getClockIn());
        existingAttendance.setClockOut(attendance.getClockOut());
        existingAttendance.setStatus(attendance.getStatus());
        existingAttendance.setNotes(attendance.getNotes());

        // Calculate total hours
        if (existingAttendance.getClockIn() != null && existingAttendance.getClockOut() != null) {
            existingAttendance.calculateTotalHours();
        }

        return attendanceRepository.save(existingAttendance);
    }

    /**
     * Delete attendance record
     */
    public void deleteAttendance(String id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + id));

        attendanceRepository.delete(attendance);
    }

    /**
     * Get attendance records for specific date
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    /**
     * Get attendance records for month and year
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByMonthAndYear(int month, int year) {
        return attendanceRepository.findByMonthAndYear(month, year);
    }

    /**
     * Get attendance records for employee in month and year
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByEmployeeAndMonthAndYear(String employeeId, int month, int year) {
        return attendanceRepository.findByEmployeeAndMonthAndYear(employeeId, month, year);
    }

    /**
     * Get attendance with employee details
     */
    @Transactional(readOnly = true)
    public List<Object[]> getAttendanceWithEmployeeDetails(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findAttendanceWithEmployeeDetails(startDate, endDate);
    }

    /**
     * Get attendance summary by status
     */
    @Transactional(readOnly = true)
    public List<Object[]> getAttendanceSummaryByStatus(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.getAttendanceSummaryByStatus(startDate, endDate);
    }

    /**
     * Get total hours for employee in date range
     */
    @Transactional(readOnly = true)
    public BigDecimal getTotalHoursByEmployee(String employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.getTotalHoursByEmployeeInDateRange(employeeId, startDate, endDate);
    }

    /**
     * Count attendance by status for employee in date range
     */
    @Transactional(readOnly = true)
    public long countAttendanceByStatus(String employeeId, LocalDate startDate, LocalDate endDate, AttendanceStatus status) {
        return attendanceRepository.countByEmployeeAndStatusInDateRange(employeeId, startDate, endDate, status);
    }

    /**
     * Get employees without attendance on specific date
     */
    @Transactional(readOnly = true)
    public List<Object> getEmployeesWithoutAttendance(LocalDate date) {
        return attendanceRepository.findEmployeesWithoutAttendance(date);
    }

    /**
     * Get attendance records that need clock out
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceNeedingClockOut() {
        return attendanceRepository.findByClockInIsNotNullAndClockOutIsNull();
    }

    /**
     * Get recent attendance records
     */
    @Transactional(readOnly = true)
    public List<Attendance> getRecentAttendance() {
        return attendanceRepository.findTop10ByOrderByDateDescCreatedAtDesc();
    }

    /**
     * Validate employee exists
     */
    private void validateEmployeeExists(String employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException("Employee not found with id: " + employeeId);
        }
    }
}
