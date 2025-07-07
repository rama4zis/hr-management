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

    private void loadDepartments() {
        // Save departments one by one to avoid ID conflicts
        Department dept1 = new Department("Human Resources", "Handles employee relations and benefits");
        dept1 = departmentRepository.save(dept1);

        Department dept2 = new Department("Information Technology", "Manages IT infrastructure and support");
        dept2 = departmentRepository.save(dept2);

        Department dept3 = new Department("Design", "Responsible for product design and user experience");
        dept3 = departmentRepository.save(dept3);

        Department dept4 = new Department("Marketing", "Oversees marketing strategies and campaigns");
        dept4 = departmentRepository.save(dept4);
    }

    private void loadPositions() {
        // Get the saved departments first
        List<Department> departments = departmentRepository.findAll();
        Department itDept = departments.stream().filter(d -> d.getName().equals("Information Technology")).findFirst().orElse(null);
        Department hrDept = departments.stream().filter(d -> d.getName().equals("Human Resources")).findFirst().orElse(null);
        Department designDept = departments.stream().filter(d -> d.getName().equals("Design")).findFirst().orElse(null);
        Department marketingDept = departments.stream().filter(d -> d.getName().equals("Marketing")).findFirst().orElse(null);

        List<Position> positions = List.of(
                new Position("Software Engineer", "Develops and maintains software applications", itDept != null ? itDept.getId() : "IT"),
                new Position("HR Manager", "Manages HR operations and employee relations", hrDept != null ? hrDept.getId() : "Human Resources"),
                new Position("UI/UX Designer", "Designs user interfaces and experiences", designDept != null ? designDept.getId() : "Design"),
                new Position("Marketing Specialist", "Develops marketing campaigns and strategies", marketingDept != null ? marketingDept.getId() : "Marketing"));

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
        // Get the saved departments and positions
        List<Department> departments = departmentRepository.findAll();
        List<Position> positions = positionRepository.findAll();
        
        Department hrDept = departments.stream().filter(d -> d.getName().equals("Human Resources")).findFirst().orElse(null);
        Department itDept = departments.stream().filter(d -> d.getName().equals("Information Technology")).findFirst().orElse(null);
        Department designDept = departments.stream().filter(d -> d.getName().equals("Design")).findFirst().orElse(null);
        Department marketingDept = departments.stream().filter(d -> d.getName().equals("Marketing")).findFirst().orElse(null);
        
        Position swEngineerPos = positions.stream().filter(p -> p.getTitle().equals("Software Engineer")).findFirst().orElse(null);
        Position hrManagerPos = positions.stream().filter(p -> p.getTitle().equals("HR Manager")).findFirst().orElse(null);
        Position designerPos = positions.stream().filter(p -> p.getTitle().equals("UI/UX Designer")).findFirst().orElse(null);
        Position marketingPos = positions.stream().filter(p -> p.getTitle().equals("Marketing Specialist")).findFirst().orElse(null);

        List<Employee> employees = List.of(
                createEmployee(null, "John", "Doe", "john.doe@example.com", "1234567890",
                        "123 Main St, Anytown, USA", hrDept != null ? hrDept.getId() : null, swEngineerPos != null ? swEngineerPos.getId() : null, "2020-01-15", new BigDecimal("13000000.00")),
                createEmployee(null, "Jane", "Smith", "jane.smith@example.com", "0987654321",
                        "456 Elm St, Othertown, USA", itDept != null ? itDept.getId() : null, hrManagerPos != null ? hrManagerPos.getId() : null, "2019-03-22",
                        new BigDecimal("13000000.00")),
                createEmployee(null, "Alice", "Johnson", "alice.johnson@example.com", "5555555555",
                        "789 Oak St, Sometown, USA", designDept != null ? designDept.getId() : null, designerPos != null ? designerPos.getId() : null, "2021-07-30", new BigDecimal("13000000.00")),
                createEmployee(null, "Bob", "Brown", "bob.brown@example.com", "4444444444",
                        "321 Pine St, Anycity, USA", marketingDept != null ? marketingDept.getId() : null, marketingPos != null ? marketingPos.getId() : null, "2018-11-05",
                        new BigDecimal("13000000.00")));
        employeeRepository.saveAll(employees);
    }

    private User createUser(String id, String username, String password, String employeeId, UserRole role) {
        User user = new User();
        if (id != null) {
            user.setId(id);
        }
        user.setUsername(username);
        user.setPassword(password);
        user.setEmployeeId(employeeId);
        user.setUserRole(role);
        user.setActive(true);
        return user;
    }

    private void loadUsers() {
        // Get the saved employees
        List<Employee> employees = employeeRepository.findAll();
        Employee johnDoe = employees.stream().filter(e -> e.getFirstName().equals("John") && e.getLastName().equals("Doe")).findFirst().orElse(null);
        Employee janeSmith = employees.stream().filter(e -> e.getFirstName().equals("Jane") && e.getLastName().equals("Smith")).findFirst().orElse(null);
        Employee aliceJohnson = employees.stream().filter(e -> e.getFirstName().equals("Alice") && e.getLastName().equals("Johnson")).findFirst().orElse(null);
        Employee bobBrown = employees.stream().filter(e -> e.getFirstName().equals("Bob") && e.getLastName().equals("Brown")).findFirst().orElse(null);

        List<User> users = List.of(
                createUser(null, "admin", "admin123", johnDoe != null ? johnDoe.getId() : null, UserRole.ADMIN),
                createUser(null, "hr_user", "hr123", janeSmith != null ? janeSmith.getId() : null, UserRole.HR),
                createUser(null, "employee_user", "emp123", aliceJohnson != null ? aliceJohnson.getId() : null, UserRole.EMPLOYEE),
                createUser(null, "marketing_user", "marketing123", bobBrown != null ? bobBrown.getId() : null, UserRole.EMPLOYEE));
        userRepository.saveAll(users);
    }

    private Attendance createAttendance(String id, String employeeId, LocalDate date, LocalDateTime clockIn,
            LocalDateTime clockOut, String status, String notes) {
        Attendance attendance = new Attendance();
        if (id != null) {
            attendance.setId(id);
        }
        attendance.setEmployeeId(employeeId);
        attendance.setDate(date);
        attendance.setClockIn(clockIn);
        attendance.setClockOut(clockOut);
        attendance.setAttendanceStatus(AttendanceStatus.valueOf(status));
        attendance.setNotes(notes);
        return attendance;
    }

    private void loadAttendanceData() {
        // Get the saved employees
        List<Employee> employees = employeeRepository.findAll();
        Employee johnDoe = employees.stream().filter(e -> e.getFirstName().equals("John") && e.getLastName().equals("Doe")).findFirst().orElse(null);
        Employee janeSmith = employees.stream().filter(e -> e.getFirstName().equals("Jane") && e.getLastName().equals("Smith")).findFirst().orElse(null);
        Employee aliceJohnson = employees.stream().filter(e -> e.getFirstName().equals("Alice") && e.getLastName().equals("Johnson")).findFirst().orElse(null);
        Employee bobBrown = employees.stream().filter(e -> e.getFirstName().equals("Bob") && e.getLastName().equals("Brown")).findFirst().orElse(null);

        List<Attendance> attendances = List.of(
                createAttendance(null, johnDoe != null ? johnDoe.getId() : null, LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance(null, janeSmith != null ? janeSmith.getId() : null, LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance(null, aliceJohnson != null ? aliceJohnson.getId() : null, LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"),
                createAttendance(null, bobBrown != null ? bobBrown.getId() : null, LocalDate.of(2023, 1, 1), LocalDateTime.of(2023, 1, 1, 9, 0),
                        LocalDateTime.of(2023, 1, 1, 17, 0), "PRESENT", "On time"));
        attendanceRepository.saveAll(attendances);
    }

    private void loadLeaveRequestsData() {
        // Get the saved employees
        List<Employee> employees = employeeRepository.findAll();
        Employee johnDoe = employees.stream().filter(e -> e.getFirstName().equals("John") && e.getLastName().equals("Doe")).findFirst().orElse(null);
        Employee janeSmith = employees.stream().filter(e -> e.getFirstName().equals("Jane") && e.getLastName().equals("Smith")).findFirst().orElse(null);
        Employee aliceJohnson = employees.stream().filter(e -> e.getFirstName().equals("Alice") && e.getLastName().equals("Johnson")).findFirst().orElse(null);
        Employee bobBrown = employees.stream().filter(e -> e.getFirstName().equals("Bob") && e.getLastName().equals("Brown")).findFirst().orElse(null);

        List<LeaveRequest> leaveRequests = List.of(
                new LeaveRequest(johnDoe != null ? johnDoe.getId() : null, LeaveRequestType.SICK, LocalDate.of(2023, 1, 10),
                        LocalDate.of(2023, 1, 12), 3, "Flu symptoms", LocalDate.now()),
                new LeaveRequest(janeSmith != null ? janeSmith.getId() : null, LeaveRequestType.PERSONAL, LocalDate.of(2023, 2, 5),
                        LocalDate.of(2023, 2, 10), 6, "Tournament Valorant", LocalDate.now()),
                new LeaveRequest(aliceJohnson != null ? aliceJohnson.getId() : null, LeaveRequestType.PERSONAL, LocalDate.of(2023, 3, 15),
                        LocalDate.of(2023, 3, 16), 2, "Personal matters", LocalDate.now()),
                new LeaveRequest(bobBrown != null ? bobBrown.getId() : null, LeaveRequestType.SICK, LocalDate.of(2023, 4, 20),
                        LocalDate.of(2023, 4, 22), 3, "Medical appointment", LocalDate.now()));
        leaveRequestRepository.saveAll(leaveRequests);
    }

    private void loadPayrollData() {
        // Get the saved employees
        List<Employee> employees = employeeRepository.findAll();
        Employee johnDoe = employees.stream().filter(e -> e.getFirstName().equals("John") && e.getLastName().equals("Doe")).findFirst().orElse(null);
        Employee janeSmith = employees.stream().filter(e -> e.getFirstName().equals("Jane") && e.getLastName().equals("Smith")).findFirst().orElse(null);
        Employee aliceJohnson = employees.stream().filter(e -> e.getFirstName().equals("Alice") && e.getLastName().equals("Johnson")).findFirst().orElse(null);
        Employee bobBrown = employees.stream().filter(e -> e.getFirstName().equals("Bob") && e.getLastName().equals("Brown")).findFirst().orElse(null);

        List<Payroll> payrolls = List.of(
                new Payroll(johnDoe != null ? johnDoe.getId() : null, LocalDate.of(2023, 1, 1), LocalDate.of(2023, 2, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll(janeSmith != null ? janeSmith.getId() : null, LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll(aliceJohnson != null ? aliceJohnson.getId() : null, LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll(bobBrown != null ? bobBrown.getId() : null, LocalDate.of(2023, 1, 31), LocalDate.of(2023, 2, 28),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1000000.00"), new BigDecimal("500000.00")),
                new Payroll(johnDoe != null ? johnDoe.getId() : null, LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll(janeSmith != null ? janeSmith.getId() : null, LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll(aliceJohnson != null ? aliceJohnson.getId() : null, LocalDate.of(2023, 2, 28), LocalDate.of(2023, 3, 31),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll(bobBrown != null ? bobBrown.getId() : null, LocalDate.of(2023, 2, 1), LocalDate.of(2023, 3, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1200000.00"), new BigDecimal("600000.00")),
                new Payroll(johnDoe != null ? johnDoe.getId() : null, LocalDate.of(2023, 3, 1), LocalDate.of(2023, 4, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1100000.00"), new BigDecimal("550000.00")),
                new Payroll(janeSmith != null ? janeSmith.getId() : null, LocalDate.of(2023, 3, 1), LocalDate.of(2023, 4, 1),
                        new BigDecimal("13000000.00"),
                        new BigDecimal("1100000.00"), new BigDecimal("550000.00")));
        payrollRepository.saveAll(payrolls);

    }
}
