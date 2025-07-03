package com.hrmanagement.hr_management_api.service;

import com.hrmanagement.hr_management_api.model.entity.*;
import com.hrmanagement.hr_management_api.model.enums.*;
import com.hrmanagement.hr_management_api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class DataSeederService implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;

    @Autowired
    public DataSeederService(
            DepartmentRepository departmentRepository,
            PositionRepository positionRepository,
            EmployeeRepository employeeRepository,
            AttendanceRepository attendanceRepository,
            LeaveRequestRepository leaveRequestRepository,
            PayrollRepository payrollRepository
    ) {
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (departmentRepository.count() > 0) {
            System.out.println("Database already contains data. Skipping seeding.");
            return;
        }

        System.out.println("Seeding database with dummy data...");
        
        seedDepartments();
        seedPositions();
        seedEmployees();
        seedAttendance();
        seedLeaveRequests();
        seedPayroll();
        
        System.out.println("Database seeding completed successfully!");
    }

    private void seedDepartments() {
        List<Department> departments = Arrays.asList(
            createDepartment("dept-1", "Human Resources", "Manages employee relations, recruitment, and HR policies", LocalDateTime.of(2024, 1, 15, 0, 0)),
            createDepartment("dept-2", "Information Technology", "Handles software development, system maintenance, and tech support", LocalDateTime.of(2024, 1, 15, 0, 0)),
            createDepartment("dept-3", "Finance", "Manages company finances, accounting, and budgeting", LocalDateTime.of(2024, 1, 15, 0, 0)),
            createDepartment("dept-4", "Marketing", "Handles marketing campaigns, brand management, and customer outreach", LocalDateTime.of(2024, 1, 20, 0, 0)),
            createDepartment("dept-5", "Operations", "Manages daily operations, logistics, and process improvement", LocalDateTime.of(2024, 2, 1, 0, 0))
        );
        departmentRepository.saveAll(departments);
        System.out.println("Seeded " + departments.size() + " departments");
    }

    private void seedPositions() {
        List<Position> positions = Arrays.asList(
            // HR Department
            createPosition("pos-1", "HR Manager", "Oversees all HR operations and employee relations", "dept-1", LocalDateTime.of(2024, 1, 15, 0, 0)),
            createPosition("pos-2", "HR Assistant", "Supports HR operations and administrative tasks", "dept-1", LocalDateTime.of(2024, 1, 15, 0, 0)),
            
            // IT Department
            createPosition("pos-3", "IT Manager", "Leads the IT team and manages technology infrastructure", "dept-2", LocalDateTime.of(2024, 1, 15, 0, 0)),
            createPosition("pos-4", "Software Developer", "Develops and maintains software applications", "dept-2", LocalDateTime.of(2024, 1, 15, 0, 0)),
            createPosition("pos-5", "DevOps Engineer", "Manages deployment pipelines and infrastructure", "dept-2", LocalDateTime.of(2024, 1, 20, 0, 0)),
            createPosition("pos-6", "UI/UX Designer", "Designs user interfaces and user experiences", "dept-2", LocalDateTime.of(2024, 1, 25, 0, 0)),
            
            // Finance Department
            createPosition("pos-7", "Finance Manager", "Oversees financial operations and strategy", "dept-3", LocalDateTime.of(2024, 1, 15, 0, 0)),
            createPosition("pos-8", "Accountant", "Handles daily accounting tasks and financial reporting", "dept-3", LocalDateTime.of(2024, 1, 15, 0, 0)),
            createPosition("pos-9", "Financial Analyst", "Analyzes financial data and creates reports", "dept-3", LocalDateTime.of(2024, 1, 22, 0, 0)),
            
            // Marketing Department
            createPosition("pos-10", "Marketing Manager", "Leads marketing strategy and campaigns", "dept-4", LocalDateTime.of(2024, 1, 20, 0, 0)),
            createPosition("pos-11", "Digital Marketing Specialist", "Manages online marketing and social media", "dept-4", LocalDateTime.of(2024, 1, 25, 0, 0)),
            createPosition("pos-12", "Content Creator", "Creates marketing content and materials", "dept-4", LocalDateTime.of(2024, 2, 1, 0, 0)),
            
            // Operations Department
            createPosition("pos-13", "Operations Manager", "Oversees daily operations and processes", "dept-5", LocalDateTime.of(2024, 2, 1, 0, 0)),
            createPosition("pos-14", "Business Analyst", "Analyzes business processes and requirements", "dept-5", LocalDateTime.of(2024, 2, 5, 0, 0)),
            createPosition("pos-15", "Project Coordinator", "Coordinates projects and team activities", "dept-5", LocalDateTime.of(2024, 2, 10, 0, 0))
        );
        positionRepository.saveAll(positions);
        System.out.println("Seeded " + positions.size() + " positions");
    }

    private void seedEmployees() {
        List<Employee> employees = Arrays.asList(
            createEmployee("emp-1", "Alice Johnson", "alice.johnson@company.com", "081234567890", "123 Main St, Jakarta", LocalDate.of(1985, 3, 15), "pos-1", "dept-1", LocalDate.of(2024, 1, 15), new BigDecimal("15000000"), Status.ACTIVE),
            createEmployee("emp-2", "Bob Smith", "bob.smith@company.com", "081234567891", "456 Oak Ave, Jakarta", LocalDate.of(1987, 7, 22), "pos-3", "dept-2", LocalDate.of(2024, 1, 15), new BigDecimal("18000000"), Status.ACTIVE),
            createEmployee("emp-3", "Carol Davis", "carol.davis@company.com", "081234567892", "789 Pine St, Jakarta", LocalDate.of(1990, 11, 8), "pos-7", "dept-3", LocalDate.of(2024, 1, 15), new BigDecimal("16000000"), Status.ACTIVE),
            createEmployee("emp-4", "David Wilson", "david.wilson@company.com", "081234567893", "321 Elm St, Jakarta", LocalDate.of(1988, 4, 30), "pos-10", "dept-4", LocalDate.of(2024, 1, 20), new BigDecimal("14000000"), Status.ACTIVE),
            createEmployee("emp-5", "Eva Brown", "eva.brown@company.com", "081234567894", "654 Maple Ave, Jakarta", LocalDate.of(1992, 9, 12), "pos-13", "dept-5", LocalDate.of(2024, 2, 1), new BigDecimal("13500000"), Status.ACTIVE),
            createEmployee("emp-6", "Frank Miller", "frank.miller@company.com", "081234567895", "987 Cedar St, Jakarta", LocalDate.of(1989, 1, 25), "pos-4", "dept-2", LocalDate.of(2024, 1, 20), new BigDecimal("12000000"), Status.ACTIVE),
            createEmployee("emp-7", "Grace Lee", "grace.lee@company.com", "081234567896", "147 Birch Ave, Jakarta", LocalDate.of(1991, 6, 18), "pos-2", "dept-1", LocalDate.of(2024, 1, 25), new BigDecimal("9000000"), Status.ACTIVE),
            createEmployee("emp-8", "Henry Taylor", "henry.taylor@company.com", "081234567897", "258 Spruce St, Jakarta", LocalDate.of(1986, 12, 3), "pos-8", "dept-3", LocalDate.of(2024, 1, 22), new BigDecimal("10000000"), Status.ACTIVE),
            createEmployee("emp-9", "Ivy Chen", "ivy.chen@company.com", "081234567898", "369 Fir Ave, Jakarta", LocalDate.of(1993, 8, 14), "pos-5", "dept-2", LocalDate.of(2024, 2, 5), new BigDecimal("13000000"), Status.ACTIVE),
            createEmployee("emp-10", "Jack Anderson", "jack.anderson@company.com", "081234567899", "741 Poplar St, Jakarta", LocalDate.of(1994, 2, 28), "pos-11", "dept-4", LocalDate.of(2024, 2, 10), new BigDecimal("11000000"), Status.ACTIVE)
        );
        employeeRepository.saveAll(employees);
        System.out.println("Seeded " + employees.size() + " employees");
    }

    private void seedAttendance() {
        List<Attendance> attendanceList = Arrays.asList(
            // Recent attendance for employees
            createAttendance("att-1", "emp-1", LocalDate.of(2024, 6, 1), LocalDateTime.of(2024, 6, 1, 8, 0), LocalDateTime.of(2024, 6, 1, 17, 0), AttendanceStatus.PRESENT),
            createAttendance("att-2", "emp-2", LocalDate.of(2024, 6, 1), LocalDateTime.of(2024, 6, 1, 8, 15), LocalDateTime.of(2024, 6, 1, 17, 30), AttendanceStatus.PRESENT),
            createAttendance("att-3", "emp-3", LocalDate.of(2024, 6, 1), LocalDateTime.of(2024, 6, 1, 8, 30), LocalDateTime.of(2024, 6, 1, 17, 0), AttendanceStatus.LATE),
            createAttendance("att-4", "emp-4", LocalDate.of(2024, 6, 1), null, null, AttendanceStatus.ABSENT),
            createAttendance("att-5", "emp-5", LocalDate.of(2024, 6, 1), LocalDateTime.of(2024, 6, 1, 8, 0), LocalDateTime.of(2024, 6, 1, 17, 0), AttendanceStatus.PRESENT),
            
            // More attendance records
            createAttendance("att-6", "emp-1", LocalDate.of(2024, 6, 2), LocalDateTime.of(2024, 6, 2, 8, 5), LocalDateTime.of(2024, 6, 2, 17, 0), AttendanceStatus.PRESENT),
            createAttendance("att-7", "emp-2", LocalDate.of(2024, 6, 2), LocalDateTime.of(2024, 6, 2, 8, 0), LocalDateTime.of(2024, 6, 2, 17, 15), AttendanceStatus.PRESENT),
            createAttendance("att-8", "emp-3", LocalDate.of(2024, 6, 2), LocalDateTime.of(2024, 6, 2, 8, 45), LocalDateTime.of(2024, 6, 2, 17, 0), AttendanceStatus.LATE),
            createAttendance("att-9", "emp-6", LocalDate.of(2024, 6, 1), LocalDateTime.of(2024, 6, 1, 8, 10), LocalDateTime.of(2024, 6, 1, 17, 0), AttendanceStatus.PRESENT),
            createAttendance("att-10", "emp-7", LocalDate.of(2024, 6, 1), LocalDateTime.of(2024, 6, 1, 8, 0), LocalDateTime.of(2024, 6, 1, 17, 0), AttendanceStatus.PRESENT)
        );
        attendanceRepository.saveAll(attendanceList);
        System.out.println("Seeded " + attendanceList.size() + " attendance records");
    }

    private void seedLeaveRequests() {
        List<LeaveRequest> leaveRequests = Arrays.asList(
            createLeaveRequest("leave-1", "emp-1", LeaveType.ANNUAL, LocalDate.of(2024, 7, 10), LocalDate.of(2024, 7, 12), "Family vacation", RequestStatus.APPROVED),
            createLeaveRequest("leave-2", "emp-2", LeaveType.SICK, LocalDate.of(2024, 6, 15), LocalDate.of(2024, 6, 16), "Medical appointment", RequestStatus.APPROVED),
            createLeaveRequest("leave-3", "emp-3", LeaveType.ANNUAL, LocalDate.of(2024, 8, 1), LocalDate.of(2024, 8, 5), "Summer holiday", RequestStatus.PENDING),
            createLeaveRequest("leave-4", "emp-4", LeaveType.EMERGENCY, LocalDate.of(2024, 6, 20), LocalDate.of(2024, 6, 20), "Family emergency", RequestStatus.APPROVED),
            createLeaveRequest("leave-5", "emp-5", LeaveType.ANNUAL, LocalDate.of(2024, 9, 15), LocalDate.of(2024, 9, 20), "Personal time off", RequestStatus.REJECTED),
            createLeaveRequest("leave-6", "emp-6", LeaveType.SICK, LocalDate.of(2024, 6, 25), LocalDate.of(2024, 6, 27), "Flu symptoms", RequestStatus.PENDING),
            createLeaveRequest("leave-7", "emp-7", LeaveType.MATERNITY, LocalDate.of(2024, 8, 10), LocalDate.of(2024, 11, 10), "Maternity leave", RequestStatus.APPROVED),
            createLeaveRequest("leave-8", "emp-8", LeaveType.ANNUAL, LocalDate.of(2024, 7, 20), LocalDate.of(2024, 7, 25), "Wedding anniversary", RequestStatus.APPROVED)
        );
        leaveRequestRepository.saveAll(leaveRequests);
        System.out.println("Seeded " + leaveRequests.size() + " leave requests");
    }

    private void seedPayroll() {
        List<Payroll> payrolls = Arrays.asList(
            // May 2024 payroll
            createPayroll("pay-1", "emp-1", LocalDate.of(2024, 5, 1), LocalDate.of(2024, 5, 31), new BigDecimal("15000000"), new BigDecimal("500000"), new BigDecimal("1500000"), new BigDecimal("14000000"), PayrollStatus.PAID),
            createPayroll("pay-2", "emp-2", LocalDate.of(2024, 5, 1), LocalDate.of(2024, 5, 31), new BigDecimal("18000000"), new BigDecimal("600000"), new BigDecimal("1800000"), new BigDecimal("16800000"), PayrollStatus.PAID),
            createPayroll("pay-3", "emp-3", LocalDate.of(2024, 5, 1), LocalDate.of(2024, 5, 31), new BigDecimal("16000000"), new BigDecimal("550000"), new BigDecimal("1600000"), new BigDecimal("14950000"), PayrollStatus.PAID),
            
            // June 2024 payroll
            createPayroll("pay-4", "emp-1", LocalDate.of(2024, 6, 1), LocalDate.of(2024, 6, 30), new BigDecimal("15000000"), new BigDecimal("500000"), new BigDecimal("1500000"), new BigDecimal("14000000"), PayrollStatus.PROCESSED),
            createPayroll("pay-5", "emp-2", LocalDate.of(2024, 6, 1), LocalDate.of(2024, 6, 30), new BigDecimal("18000000"), new BigDecimal("600000"), new BigDecimal("1800000"), new BigDecimal("16800000"), PayrollStatus.PROCESSED),
            createPayroll("pay-6", "emp-3", LocalDate.of(2024, 6, 1), LocalDate.of(2024, 6, 30), new BigDecimal("16000000"), new BigDecimal("550000"), new BigDecimal("1600000"), new BigDecimal("14950000"), PayrollStatus.DRAFT),
            createPayroll("pay-7", "emp-4", LocalDate.of(2024, 6, 1), LocalDate.of(2024, 6, 30), new BigDecimal("14000000"), new BigDecimal("450000"), new BigDecimal("1400000"), new BigDecimal("13050000"), PayrollStatus.DRAFT),
            createPayroll("pay-8", "emp-5", LocalDate.of(2024, 6, 1), LocalDate.of(2024, 6, 30), new BigDecimal("13500000"), new BigDecimal("400000"), new BigDecimal("1350000"), new BigDecimal("12550000"), PayrollStatus.PROCESSED)
        );
        payrollRepository.saveAll(payrolls);
        System.out.println("Seeded " + payrolls.size() + " payroll records");
    }

    // Helper methods
    private Department createDepartment(String id, String name, String description, LocalDateTime createdAt) {
        Department dept = new Department();
        dept.setId(id);
        dept.setName(name);
        dept.setDescription(description);
        dept.setCreatedAt(createdAt);
        dept.setUpdatedAt(createdAt);
        return dept;
    }

    private Position createPosition(String id, String title, String description, String departmentId, LocalDateTime createdAt) {
        Position pos = new Position();
        pos.setId(id);
        pos.setTitle(title);
        pos.setDescription(description);
        pos.setDepartmentId(departmentId);
        pos.setCreatedAt(createdAt);
        pos.setUpdatedAt(createdAt);
        return pos;
    }

    private Employee createEmployee(String id, String fullName, String email, String phoneNumber, String address, 
                                  LocalDate dateOfBirth, String positionId, String departmentId, LocalDate hireDate, 
                                  BigDecimal salary, Status status) {
        Employee emp = new Employee();
        emp.setId(id);
        String[] names = fullName.split(" ", 2);
        emp.setFirstName(names[0]);
        emp.setLastName(names.length > 1 ? names[1] : "");
        emp.setEmail(email);
        emp.setPhone(phoneNumber);
        emp.setAddress(address);
        emp.setDateOfBirth(dateOfBirth);
        emp.setPositionId(positionId);
        emp.setDepartmentId(departmentId);
        emp.setHireDate(hireDate);
        emp.setSalary(salary);
        emp.setStatus(status);
        emp.setCreatedAt(LocalDateTime.now());
        emp.setUpdatedAt(LocalDateTime.now());
        return emp;
    }

    private Attendance createAttendance(String id, String employeeId, LocalDate date, LocalDateTime clockIn, 
                                      LocalDateTime clockOut, AttendanceStatus status) {
        Attendance att = new Attendance();
        att.setId(id);
        att.setEmployeeId(employeeId);
        att.setDate(date);
        att.setClockIn(clockIn);
        att.setClockOut(clockOut);
        att.setStatus(status);
        att.setCreatedAt(LocalDateTime.now());
        att.setUpdatedAt(LocalDateTime.now());
        return att;
    }

    private LeaveRequest createLeaveRequest(String id, String employeeId, LeaveType leaveType, LocalDate startDate, 
                                          LocalDate endDate, String reason, RequestStatus status) {
        LeaveRequest leave = new LeaveRequest();
        leave.setId(id);
        leave.setEmployeeId(employeeId);
        leave.setType(leaveType);
        leave.setStartDate(startDate);
        leave.setEndDate(endDate);
        leave.setReason(reason);
        leave.setStatus(status);
        leave.setRequestDate(LocalDate.now());
        leave.setCreatedAt(LocalDateTime.now());
        leave.setUpdatedAt(LocalDateTime.now());
        return leave;
    }

    private Payroll createPayroll(String id, String employeeId, LocalDate payPeriodStart, LocalDate payPeriodEnd,
                                BigDecimal baseSalary, BigDecimal bonuses, BigDecimal deductions, 
                                BigDecimal netPay, PayrollStatus status) {
        Payroll payroll = new Payroll();
        payroll.setId(id);
        payroll.setEmployeeId(employeeId);
        payroll.setPayPeriodStart(payPeriodStart);
        payroll.setPayPeriodEnd(payPeriodEnd);
        payroll.setBaseSalary(baseSalary);
        payroll.setBonuses(bonuses);
        payroll.setDeductions(deductions);
        payroll.setGrossPay(baseSalary.add(bonuses));
        payroll.setNetPay(netPay);
        payroll.setStatus(status);
        payroll.setCreatedAt(LocalDateTime.now());
        payroll.setUpdatedAt(LocalDateTime.now());
        return payroll;
    }
}
