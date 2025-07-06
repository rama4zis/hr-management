package com.hrmanagement.hr_management_api.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.hrmanagement.hr_management_api.model.entity.Attendance;
import com.hrmanagement.hr_management_api.model.entity.Department;
import com.hrmanagement.hr_management_api.model.entity.Employee;
import com.hrmanagement.hr_management_api.model.entity.LeaveRequest;
import com.hrmanagement.hr_management_api.model.entity.Payroll;
import com.hrmanagement.hr_management_api.model.entity.Position;
import com.hrmanagement.hr_management_api.model.entity.User;
import com.hrmanagement.hr_management_api.model.enums.AttendanceStatus;
import com.hrmanagement.hr_management_api.model.enums.EmployeeStatus;
import com.hrmanagement.hr_management_api.model.enums.LeaveRequestType;
import com.hrmanagement.hr_management_api.model.enums.UserRole;
import com.hrmanagement.hr_management_api.repository.AttendanceRepository;
import com.hrmanagement.hr_management_api.repository.DepartmentRepository;
import com.hrmanagement.hr_management_api.repository.EmployeeRepository;
import com.hrmanagement.hr_management_api.repository.LeaveRequestRepository;
import com.hrmanagement.hr_management_api.repository.PayrollRepository;
import com.hrmanagement.hr_management_api.repository.PositionRepository;
import com.hrmanagement.hr_management_api.repository.UserRepository;

@Component
public class DataLoder {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private UserRepository userRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void loadData() {
        if (departmentRepository.count() == 0) {
            loadDepartments();
            loadPositions();
            loadEmployees();
            loadUsers();
            loadAttendanceData();
            loadLeaveRequestsData();
            loadPayrollData();
        }
    }

    private Department createDepartment(String id, String name, String description) {
        Department dept = new Department(name, description);
        dept.setId(id);
        return departmentRepository.save(dept);
    }

    private void loadDepartments() {
        List<Department> departments = List.of(
                createDepartment("dep-001", "Human Resources", "Handles employee relations and benefits"),
                createDepartment("dep-002", "Information Technology", "Manages IT infrastructure and support"),
                createDepartment("dep-003", "Design", "Responsible for product design and user experience"),
                createDepartment("dep-004", "Marketing", "Oversees marketing strategies and campaigns"));
        departmentRepository.saveAll(departments);
    }

    private void loadPositions() {
        List<Position> positions = List.of(
                new Position("Software Engineer", "Develops and maintains software applications", "IT"),
                new Position("HR Manager", "Manages HR operations and employee relations", "Human Resources"),
                new Position("UI/UX Designer", "Designs user interfaces and experiences", "Design"),
                new Position("Marketing Specialist", "Develops marketing campaigns and strategies", "Marketing"));

        positions.get(0).setId("pos-001");
        positions.get(1).setId("pos-002");
        positions.get(2).setId("pos-003");
        positions.get(3).setId("pos-004");

        positionRepository.saveAll(positions);
    }

    private Employee createEmployee(String id, String firstName, String lastName, String email, String phoneNumber,
            String address, String departmentId, String positionId, String hireDateStr, BigDecimal salary) {
        Employee emp = new Employee();
        emp.setId(id);
        emp.setFirstName(firstName);
        emp.setLastName(lastName);
        emp.setEmail(email);
        emp.setPhoneNumber(phoneNumber);
        emp.setAddress(address);
        emp.setDepartmentId(departmentId);
        emp.setPositionId(positionId);
        emp.setHireDate(LocalDate.parse(hireDateStr));
        emp.setSalary(salary);
        emp.setEmployeeStatus(EmployeeStatus.ACTIVE);

        return emp;
    }

    private void loadEmployees() {
        List<Employee> employees = List.of(
                createEmployee("emp-001", "John", "Doe", "john.doe@example.com", "1234567890",
                        "123 Main St, Anytown, USA", "dep-001", "pos-001", "2020-01-15", new BigDecimal("13000000.00")),
                createEmployee("emp-002", "Jane", "Smith", "jane.smith@example.com", "0987654321",
                        "456 Elm St, Othertown, USA", "dep-002", "pos-002", "2019-03-22",
                        new BigDecimal("13000000.00")),
                createEmployee("emp-003", "Alice", "Johnson", "alice.johnson@example.com", "5555555555",
                        "789 Oak St, Sometown, USA", "dep-003", "pos-003", "2021-07-30", new BigDecimal("13000000.00")),
                createEmployee("emp-004", "Bob", "Brown", "bob.brown@example.com", "4444444444",
                        "321 Pine St, Anycity, USA", "dep-004", "pos-004", "2018-11-05",
                        new BigDecimal("13000000.00")));
        employeeRepository.saveAll(employees);
    }

    private User createUser(String id, String username, String password, String employeeId, UserRole role) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setPassword(password);
        user.setEmployeeId(employeeId);
        user.setUserRole(role);
        user.setActive(true);
        return userRepository.save(user);
    }

    private void loadUsers() {
        List<User> users = List.of(
                createUser("user-001", "admin", "admin123", "emp-001", UserRole.ADMIN),
                createUser("user-002", "hr_user", "hr123", "emp-002", UserRole.HR),
                createUser("user-003", "employee_user", "emp123", "emp-003", UserRole.EMPLOYEE),
                createUser("user-004", "marketing_user", "marketing123", "emp-004", UserRole.EMPLOYEE));
        userRepository.saveAll(users);
    }

    private Attendance createAttendance(String id, String employeeId, LocalDate date, LocalDateTime clockIn,
            LocalDateTime clockOut, String status, String notes) {
        Attendance attendance = new Attendance();
        attendance.setId(id);
        attendance.setEmployeeId(employeeId);
        attendance.setDate(date);
        attendance.setClockIn(clockIn);
        attendance.setClockOut(clockOut);
        attendance.setAttendanceStatus(AttendanceStatus.valueOf(status));
        attendance.setNotes(notes);
        return attendanceRepository.save(attendance);
    }

    private void loadAttendanceData() {
        List<Attendance> attendances = List.of(
                createAttendance("att-001", "emp-001", LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance("att-002", "emp-002", LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance("att-003", "emp-003", LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance("att-004", "emp-004", LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"));
        attendanceRepository.saveAll(attendances);
    }

    private void loadLeaveRequestsData() {
        List<LeaveRequest> leaveRequests = List.of(
                new LeaveRequest("emp-001", LeaveRequestType.SICK, LocalDate.of(2023, 1, 10),
                        LocalDate.of(2023, 1, 12), 3, "Flu symptoms", LocalDate.now()),
                new LeaveRequest("emp-002", LeaveRequestType.PERSONAL, LocalDate.of(2023, 2, 5),
                        LocalDate.of(2023, 2, 10), 6, "Tournament Valorant", LocalDate.now()),
                new LeaveRequest("emp-003", LeaveRequestType.PERSONAL, LocalDate.of(2023, 3, 15),
                        LocalDate.of(2023, 3, 16), 2, "Personal matters", LocalDate.now()),
                new LeaveRequest("emp-004", LeaveRequestType.SICK, LocalDate.of(2023, 4, 20),
                        LocalDate.of(2023, 4, 22), 3, "Medical appointment", LocalDate.now()));
        leaveRequestRepository.saveAll(leaveRequests);
    }

    private void loadPayrollData() {
        List<Payroll> payrolls = List.of(
                new Payroll("emp-001", LocalDate.of(2023, 1, 1), LocalDate.of(2023, 2, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll("emp-002", LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll("emp-003", LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll("emp-004", LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll("emp-001", LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll("emp-002", LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll("emp-003", LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll("emp-004", LocalDate.of(2023, 2, 1), LocalDate.of(2023, 3, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll("emp-001", LocalDate.of(2023, 3, 1), LocalDate.of(2023, 4, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1100000.00"), new BigDecimal("550000.00")),
                new Payroll("emp-002", LocalDate.of(2023, 3, 1), LocalDate.of(2023, 4, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1100000.00"), new BigDecimal("550000.00")));
        payrollRepository.saveAll(payrolls);

    }
}
