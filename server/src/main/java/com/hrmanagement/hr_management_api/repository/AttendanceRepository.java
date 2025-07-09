package com.hrmanagement.hr_management_api.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hrmanagement.hr_management_api.model.entity.Attendance;
import com.hrmanagement.hr_management_api.model.enums.AttendanceStatus;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {

    // Find all non-deleted attendance records
    List<Attendance> findByIsDeletedFalse();
    
    // Find by ID and not deleted
    Optional<Attendance> findByIdAndIsDeletedFalse(String id);

    // Find attendance by employee ID (non-deleted)
    List<Attendance> findByEmployeeIdAndIsDeletedFalse(String employeeId);

    // Find attendance by date (non-deleted)
    List<Attendance> findByDateAndIsDeletedFalse(LocalDate date);

    // Find attendance by employee and date (non-deleted)
    Optional<Attendance> findByEmployeeIdAndDateAndIsDeletedFalse(String employeeId, LocalDate date);

    // Find attendance by date range (non-deleted)
    List<Attendance> findByDateBetweenAndIsDeletedFalse(LocalDate startDate, LocalDate endDate);

    // Find attendance by employee and date range (non-deleted)
    List<Attendance> findByEmployeeIdAndDateBetweenAndIsDeletedFalse(String employeeId, LocalDate startDate, LocalDate endDate);

    // Find attendance by status (non-deleted)
    List<Attendance> findByAttendanceStatusAndIsDeletedFalse(AttendanceStatus status);

    // Find attendance by employee and status (non-deleted)
    List<Attendance> findByEmployeeIdAndAttendanceStatusAndIsDeletedFalse(String employeeId, AttendanceStatus status);

    // Count attendance by employee (non-deleted)
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employeeId = :employeeId AND a.isDeleted = false")
    long countByEmployeeIdAndIsDeletedFalse(@Param("employeeId") String employeeId);

    // Count attendance by status (non-deleted)
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceStatus = :status AND a.isDeleted = false")
    long countByAttendanceStatusAndIsDeletedFalse(@Param("status") AttendanceStatus status);

    // Count attendance by date (non-deleted)
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.isDeleted = false")
    long countByDateAndIsDeletedFalse(@Param("date") LocalDate date);

    // Count non-deleted attendance records
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.isDeleted = false")
    long countByIsDeletedFalse();

    // Find attendance by employee with date range and status
    @Query("SELECT a FROM Attendance a WHERE a.employeeId = :employeeId " +
           "AND a.date BETWEEN :startDate AND :endDate " +
           "AND a.attendanceStatus = :status AND a.isDeleted = false")
    List<Attendance> findByEmployeeIdAndDateRangeAndStatus(@Param("employeeId") String employeeId,
                                                           @Param("startDate") LocalDate startDate,
                                                           @Param("endDate") LocalDate endDate,
                                                           @Param("status") AttendanceStatus status);

    // Find late arrivals
    @Query("SELECT a FROM Attendance a WHERE a.attendanceStatus = 'LATE' AND a.isDeleted = false")
    List<Attendance> findLateArrivals();

    // Find overtime records
    @Query("SELECT a FROM Attendance a WHERE a.attendanceStatus = 'OVERTIME' AND a.isDeleted = false")
    List<Attendance> findOvertimeRecords();

    // Find work from home records
    @Query("SELECT a FROM Attendance a WHERE a.attendanceStatus = 'WORK_FROM_HOME' AND a.isDeleted = false")
    List<Attendance> findWorkFromHomeRecords();

    // Monthly attendance report
    @Query("SELECT a FROM Attendance a WHERE YEAR(a.date) = :year AND MONTH(a.date) = :month AND a.isDeleted = false")
    List<Attendance> findMonthlyAttendance(@Param("year") int year, @Param("month") int month);

    // Employee monthly attendance report
    @Query("SELECT a FROM Attendance a WHERE a.employeeId = :employeeId " +
           "AND YEAR(a.date) = :year AND MONTH(a.date) = :month AND a.isDeleted = false")
    List<Attendance> findEmployeeMonthlyAttendance(@Param("employeeId") String employeeId,
                                                   @Param("year") int year,
                                                   @Param("month") int month);

}
