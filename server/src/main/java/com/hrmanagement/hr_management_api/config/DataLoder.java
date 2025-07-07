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
            // Load departments first and get their generated IDs
            List<Department> departments = loadDepartments();
            
            // Load positions with generated IDs
            List<Position> positions = loadPositions(departments);
            
            // Load employees using the actual department and position IDs and get their IDs
            List<Employee> employees = loadEmployees(departments, positions);
            
            // Load users and attendance using actual employee IDs
            loadUsers(employees);
            loadAttendanceData(employees);
            loadLeaveRequestsData(employees);
            loadPayrollData(employees);
        }
    }

    private Department createDepartment(String name, String description) {
        Department dept = new Department(name, description);
        return dept;
    }

    private List<Department> loadDepartments() {
        List<Department> departments = List.of(
                createDepartment("Human Resources", "Handles employee relations and benefits"),
                createDepartment("Information Technology", "Manages IT infrastructure and support"),
                createDepartment("Design", "Responsible for product design and user experience"),
                createDepartment("Marketing", "Oversees marketing strategies and campaigns"));
        return departmentRepository.saveAll(departments);
    }

    private List<Position> loadPositions(List<Department> departments) {
        List<Position> positions = List.of(
                new Position("Software Engineer", "Develops and maintains software applications", departments.get(1).getId()), // IT dept
                new Position("HR Manager", "Manages HR operations and employee relations", departments.get(0).getId()), // HR dept
                new Position("UI/UX Designer", "Designs user interfaces and experiences", departments.get(2).getId()), // Design dept
                new Position("Marketing Specialist", "Develops marketing campaigns and strategies", departments.get(3).getId())); // Marketing dept

        return positionRepository.saveAll(positions);
    }

    private Employee createEmployee(String firstName, String lastName, String email, String phoneNumber,
            String address, String departmentId, String positionId, String hireDateStr, BigDecimal salary) {
        Employee emp = new Employee();
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

    private List<Employee> loadEmployees(List<Department> departments, List<Position> positions) {
        List<Employee> employees = List.of(
                createEmployee("John", "Doe", "john.doe@example.com", "1234567890",
                        "123 Main St, Anytown, USA", departments.get(0).getId(), positions.get(0).getId(), "2020-01-15", new BigDecimal("13000000.00")),
                createEmployee("Jane", "Smith", "jane.smith@example.com", "0987654321",
                        "456 Elm St, Othertown, USA", departments.get(1).getId(), positions.get(1).getId(), "2019-03-22",
                        new BigDecimal("13000000.00")),
                createEmployee("Alice", "Johnson", "alice.johnson@example.com", "5555555555",
                        "789 Oak St, Sometown, USA", departments.get(2).getId(), positions.get(2).getId(), "2021-07-30", new BigDecimal("13000000.00")),
                createEmployee("Bob", "Brown", "bob.brown@example.com", "4444444444",
                        "321 Pine St, Anycity, USA", departments.get(3).getId(), positions.get(3).getId(), "2018-11-05",
                        new BigDecimal("13000000.00")));
        return employeeRepository.saveAll(employees);
    }

    private User createUser(String username, String password, String employeeId, UserRole role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmployeeId(employeeId);
        user.setUserRole(role);
        user.setActive(true);
        return user;
    }

    private void loadUsers(List<Employee> employees) {
        List<User> users = List.of(
                createUser("admin", "admin123", employees.get(0).getId(), UserRole.ADMIN),
                createUser("hr_user", "hr123", employees.get(1).getId(), UserRole.HR),
                createUser("employee_user", "emp123", employees.get(2).getId(), UserRole.EMPLOYEE),
                createUser("marketing_user", "marketing123", employees.get(3).getId(), UserRole.EMPLOYEE));
        userRepository.saveAll(users);
    }

    private Attendance createAttendance(String employeeId, LocalDate date, LocalDateTime clockIn,
            LocalDateTime clockOut, String status, String notes) {
        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setDate(date);
        attendance.setClockIn(clockIn);
        attendance.setClockOut(clockOut);
        attendance.setAttendanceStatus(AttendanceStatus.valueOf(status));
        attendance.setNotes(notes);
        return attendance;
    }

    private void loadAttendanceData(List<Employee> employees) {
        List<Attendance> attendances = List.of(
                createAttendance(employees.get(0).getId(), LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance(employees.get(1).getId(), LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance(employees.get(2).getId(), LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance(employees.get(3).getId(), LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"));
        attendanceRepository.saveAll(attendances);
    }

    private void loadLeaveRequestsData(List<Employee> employees) {
        List<LeaveRequest> leaveRequests = List.of(
                new LeaveRequest(employees.get(0).getId(), LeaveRequestType.SICK, LocalDate.of(2023, 1, 10),
                        LocalDate.of(2023, 1, 12), 3, "Flu symptoms", LocalDate.now()),
                new LeaveRequest(employees.get(1).getId(), LeaveRequestType.PERSONAL, LocalDate.of(2023, 2, 5),
                        LocalDate.of(2023, 2, 10), 6, "Tournament Valorant", LocalDate.now()),
                new LeaveRequest(employees.get(2).getId(), LeaveRequestType.PERSONAL, LocalDate.of(2023, 3, 15),
                        LocalDate.of(2023, 3, 16), 2, "Personal matters", LocalDate.now()),
                new LeaveRequest(employees.get(3).getId(), LeaveRequestType.SICK, LocalDate.of(2023, 4, 20),
                        LocalDate.of(2023, 4, 22), 3, "Medical appointment", LocalDate.now()));
        leaveRequestRepository.saveAll(leaveRequests);
    }

    private void loadPayrollData(List<Employee> employees) {
        List<Payroll> payrolls = List.of(
                new Payroll(employees.get(0).getId(), LocalDate.of(2023, 1, 1), LocalDate.of(2023, 2, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll(employees.get(1).getId(), LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll(employees.get(2).getId(), LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll(employees.get(3).getId(), LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll(employees.get(0).getId(), LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll(employees.get(1).getId(), LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll(employees.get(2).getId(), LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll(employees.get(3).getId(), LocalDate.of(2023, 2, 1), LocalDate.of(2023, 3, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll(employees.get(0).getId(), LocalDate.of(2023, 3, 1), LocalDate.of(2023, 4, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1100000.00"), new BigDecimal("550000.00")),
                new Payroll(employees.get(1).getId(), LocalDate.of(2023, 3, 1), LocalDate.of(2023, 4, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1100000.00"), new BigDecimal("550000.00")));
        payrollRepository.saveAll(payrolls);

    }
}
