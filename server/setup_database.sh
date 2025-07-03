#!/bin/bash

# MySQL Database Setup and Data Seeding Script for HR Management System

echo "🚀 Setting up MySQL database and seeding data for HR Management System..."

# Database configuration
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="hr_management_dev"
DB_USER="hr_user"
DB_PASSWORD="hr_dev_password_2024"

# Create SQL file for data seeding
cat > /tmp/hr_data_seed.sql << 'EOF'
-- Use the HR Management database
USE hr_management_dev;

-- Create tables
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    manager_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS positions (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    department_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    date_of_birth DATE,
    department_id VARCHAR(36) NOT NULL,
    position_id VARCHAR(36) NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(15,2) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'TERMINATED') DEFAULT 'ACTIVE',
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (position_id) REFERENCES positions(id)
);

CREATE TABLE IF NOT EXISTS attendances (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    clock_in DATETIME,
    clock_out DATETIME,
    total_hours DECIMAL(4,2),
    status ENUM('PRESENT', 'ABSENT', 'LATE', 'EARLY_DEPARTURE') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    UNIQUE KEY unique_employee_date (employee_id, date)
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    type ENUM('ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'EMERGENCY') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT,
    reason TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    request_date DATE DEFAULT (CURDATE()),
    approved_by VARCHAR(36),
    approved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS payrolls (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    base_salary DECIMAL(15,2) NOT NULL,
    overtime DECIMAL(15,2) DEFAULT 0,
    bonuses DECIMAL(15,2) DEFAULT 0,
    deductions DECIMAL(15,2) DEFAULT 0,
    gross_pay DECIMAL(15,2) NOT NULL,
    net_pay DECIMAL(15,2) NOT NULL,
    status ENUM('DRAFT', 'PROCESSED', 'PAID') DEFAULT 'DRAFT',
    processed_date DATE,
    paid_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Insert dummy data
-- Departments
INSERT INTO departments (id, name, description, created_at) VALUES
('dept-1', 'Human Resources', 'Manages employee relations, recruitment, and HR policies', '2024-01-15 00:00:00'),
('dept-2', 'Information Technology', 'Handles software development, system maintenance, and tech support', '2024-01-15 00:00:00'),
('dept-3', 'Finance', 'Manages company finances, accounting, and budgeting', '2024-01-15 00:00:00'),
('dept-4', 'Marketing', 'Handles marketing campaigns, brand management, and customer outreach', '2024-01-20 00:00:00'),
('dept-5', 'Operations', 'Manages daily operations, logistics, and process improvement', '2024-02-01 00:00:00');

-- Positions
INSERT INTO positions (id, title, description, department_id, created_at) VALUES
('pos-1', 'HR Manager', 'Oversees all HR operations and employee relations', 'dept-1', '2024-01-15 00:00:00'),
('pos-2', 'HR Assistant', 'Supports HR operations and administrative tasks', 'dept-1', '2024-01-15 00:00:00'),
('pos-3', 'IT Manager', 'Leads the IT team and manages technology infrastructure', 'dept-2', '2024-01-15 00:00:00'),
('pos-4', 'Software Developer', 'Develops and maintains software applications', 'dept-2', '2024-01-15 00:00:00'),
('pos-5', 'DevOps Engineer', 'Manages deployment pipelines and infrastructure', 'dept-2', '2024-01-20 00:00:00'),
('pos-6', 'UI/UX Designer', 'Designs user interfaces and user experiences', 'dept-2', '2024-01-25 00:00:00'),
('pos-7', 'Finance Manager', 'Oversees financial operations and strategy', 'dept-3', '2024-01-15 00:00:00'),
('pos-8', 'Accountant', 'Handles daily accounting tasks and financial reporting', 'dept-3', '2024-01-15 00:00:00'),
('pos-9', 'Financial Analyst', 'Analyzes financial data and creates reports', 'dept-3', '2024-01-22 00:00:00'),
('pos-10', 'Marketing Manager', 'Leads marketing strategy and campaigns', 'dept-4', '2024-01-20 00:00:00'),
('pos-11', 'Digital Marketing Specialist', 'Manages online marketing and social media', 'dept-4', '2024-01-25 00:00:00'),
('pos-12', 'Content Creator', 'Creates marketing content and materials', 'dept-4', '2024-02-01 00:00:00'),
('pos-13', 'Operations Manager', 'Oversees daily operations and processes', 'dept-5', '2024-02-01 00:00:00'),
('pos-14', 'Business Analyst', 'Analyzes business processes and requirements', 'dept-5', '2024-02-05 00:00:00'),
('pos-15', 'Project Coordinator', 'Coordinates projects and team activities', 'dept-5', '2024-02-10 00:00:00');

-- Employees
INSERT INTO employees (id, first_name, last_name, email, phone, address, date_of_birth, position_id, department_id, hire_date, salary, status) VALUES
('emp-1', 'Alice', 'Johnson', 'alice.johnson@company.com', '081234567890', '123 Main St, Jakarta', '1985-03-15', 'pos-1', 'dept-1', '2024-01-15', 15000000.00, 'ACTIVE'),
('emp-2', 'Bob', 'Smith', 'bob.smith@company.com', '081234567891', '456 Oak Ave, Jakarta', '1987-07-22', 'pos-3', 'dept-2', '2024-01-15', 18000000.00, 'ACTIVE'),
('emp-3', 'Carol', 'Davis', 'carol.davis@company.com', '081234567892', '789 Pine St, Jakarta', '1990-11-08', 'pos-7', 'dept-3', '2024-01-15', 16000000.00, 'ACTIVE'),
('emp-4', 'David', 'Wilson', 'david.wilson@company.com', '081234567893', '321 Elm St, Jakarta', '1988-04-30', 'pos-10', 'dept-4', '2024-01-20', 14000000.00, 'ACTIVE'),
('emp-5', 'Eva', 'Brown', 'eva.brown@company.com', '081234567894', '654 Maple Ave, Jakarta', '1992-09-12', 'pos-13', 'dept-5', '2024-02-01', 13500000.00, 'ACTIVE'),
('emp-6', 'Frank', 'Miller', 'frank.miller@company.com', '081234567895', '987 Cedar St, Jakarta', '1989-01-25', 'pos-4', 'dept-2', '2024-01-20', 12000000.00, 'ACTIVE'),
('emp-7', 'Grace', 'Lee', 'grace.lee@company.com', '081234567896', '147 Birch Ave, Jakarta', '1991-06-18', 'pos-2', 'dept-1', '2024-01-25', 9000000.00, 'ACTIVE'),
('emp-8', 'Henry', 'Taylor', 'henry.taylor@company.com', '081234567897', '258 Spruce St, Jakarta', '1986-12-03', 'pos-8', 'dept-3', '2024-01-22', 10000000.00, 'ACTIVE'),
('emp-9', 'Ivy', 'Chen', 'ivy.chen@company.com', '081234567898', '369 Fir Ave, Jakarta', '1993-08-14', 'pos-5', 'dept-2', '2024-02-05', 13000000.00, 'ACTIVE'),
('emp-10', 'Jack', 'Anderson', 'jack.anderson@company.com', '081234567899', '741 Poplar St, Jakarta', '1994-02-28', 'pos-11', 'dept-4', '2024-02-10', 11000000.00, 'ACTIVE');

-- Attendance records
INSERT INTO attendances (id, employee_id, date, clock_in, clock_out, status) VALUES
('att-1', 'emp-1', '2024-06-01', '2024-06-01 08:00:00', '2024-06-01 17:00:00', 'PRESENT'),
('att-2', 'emp-2', '2024-06-01', '2024-06-01 08:15:00', '2024-06-01 17:30:00', 'PRESENT'),
('att-3', 'emp-3', '2024-06-01', '2024-06-01 08:30:00', '2024-06-01 17:00:00', 'LATE'),
('att-4', 'emp-4', '2024-06-01', NULL, NULL, 'ABSENT'),
('att-5', 'emp-5', '2024-06-01', '2024-06-01 08:00:00', '2024-06-01 17:00:00', 'PRESENT'),
('att-6', 'emp-1', '2024-06-02', '2024-06-02 08:05:00', '2024-06-02 17:00:00', 'PRESENT'),
('att-7', 'emp-2', '2024-06-02', '2024-06-02 08:00:00', '2024-06-02 17:15:00', 'PRESENT'),
('att-8', 'emp-3', '2024-06-02', '2024-06-02 08:45:00', '2024-06-02 17:00:00', 'LATE'),
('att-9', 'emp-6', '2024-06-01', '2024-06-01 08:10:00', '2024-06-01 17:00:00', 'PRESENT'),
('att-10', 'emp-7', '2024-06-01', '2024-06-01 08:00:00', '2024-06-01 17:00:00', 'PRESENT');

-- Leave requests
INSERT INTO leave_requests (id, employee_id, type, start_date, end_date, reason, status, request_date) VALUES
('leave-1', 'emp-1', 'ANNUAL', '2024-07-10', '2024-07-12', 'Family vacation', 'APPROVED', '2024-06-01'),
('leave-2', 'emp-2', 'SICK', '2024-06-15', '2024-06-16', 'Medical appointment', 'APPROVED', '2024-06-14'),
('leave-3', 'emp-3', 'ANNUAL', '2024-08-01', '2024-08-05', 'Summer holiday', 'PENDING', '2024-07-01'),
('leave-4', 'emp-4', 'EMERGENCY', '2024-06-20', '2024-06-20', 'Family emergency', 'APPROVED', '2024-06-19'),
('leave-5', 'emp-5', 'ANNUAL', '2024-09-15', '2024-09-20', 'Personal time off', 'REJECTED', '2024-08-15'),
('leave-6', 'emp-6', 'SICK', '2024-06-25', '2024-06-27', 'Flu symptoms', 'PENDING', '2024-06-24'),
('leave-7', 'emp-7', 'MATERNITY', '2024-08-10', '2024-11-10', 'Maternity leave', 'APPROVED', '2024-07-10'),
('leave-8', 'emp-8', 'ANNUAL', '2024-07-20', '2024-07-25', 'Wedding anniversary', 'APPROVED', '2024-06-20');

-- Payroll records
INSERT INTO payrolls (id, employee_id, pay_period_start, pay_period_end, base_salary, bonuses, deductions, gross_pay, net_pay, status) VALUES
('pay-1', 'emp-1', '2024-05-01', '2024-05-31', 15000000.00, 500000.00, 1500000.00, 15500000.00, 14000000.00, 'PAID'),
('pay-2', 'emp-2', '2024-05-01', '2024-05-31', 18000000.00, 600000.00, 1800000.00, 18600000.00, 16800000.00, 'PAID'),
('pay-3', 'emp-3', '2024-05-01', '2024-05-31', 16000000.00, 550000.00, 1600000.00, 16550000.00, 14950000.00, 'PAID'),
('pay-4', 'emp-1', '2024-06-01', '2024-06-30', 15000000.00, 500000.00, 1500000.00, 15500000.00, 14000000.00, 'PROCESSED'),
('pay-5', 'emp-2', '2024-06-01', '2024-06-30', 18000000.00, 600000.00, 1800000.00, 18600000.00, 16800000.00, 'PROCESSED'),
('pay-6', 'emp-3', '2024-06-01', '2024-06-30', 16000000.00, 550000.00, 1600000.00, 16550000.00, 14950000.00, 'DRAFT'),
('pay-7', 'emp-4', '2024-06-01', '2024-06-30', 14000000.00, 450000.00, 1400000.00, 14450000.00, 13050000.00, 'DRAFT'),
('pay-8', 'emp-5', '2024-06-01', '2024-06-30', 13500000.00, 400000.00, 1350000.00, 13900000.00, 12550000.00, 'PROCESSED');

-- Update department manager IDs
UPDATE departments SET manager_id = 'emp-1' WHERE id = 'dept-1';
UPDATE departments SET manager_id = 'emp-2' WHERE id = 'dept-2';
UPDATE departments SET manager_id = 'emp-3' WHERE id = 'dept-3';
UPDATE departments SET manager_id = 'emp-4' WHERE id = 'dept-4';
UPDATE departments SET manager_id = 'emp-5' WHERE id = 'dept-5';

EOF

echo "📝 Created SQL file with sample data..."

# Execute the SQL file
echo "🗄️ Creating database tables and inserting sample data..."
mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST -P $DB_PORT < /tmp/hr_data_seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    
    # Show created tables
    echo "📊 Created tables:"
    mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST -P $DB_PORT -D $DB_NAME -e "SHOW TABLES;"
    
    # Show record counts
    echo "📈 Record counts:"
    mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST -P $DB_PORT -D $DB_NAME -e "
    SELECT 'Departments' as Table_Name, COUNT(*) as Count FROM departments
    UNION ALL
    SELECT 'Positions', COUNT(*) FROM positions
    UNION ALL
    SELECT 'Employees', COUNT(*) FROM employees
    UNION ALL
    SELECT 'Attendances', COUNT(*) FROM attendances
    UNION ALL
    SELECT 'Leave Requests', COUNT(*) FROM leave_requests
    UNION ALL
    SELECT 'Payrolls', COUNT(*) FROM payrolls;"
    
    echo ""
    echo "🎉 HR Management Database is ready!"
    echo "📝 Database: $DB_NAME"
    echo "👤 User: $DB_USER"
    echo "🏢 Host: $DB_HOST:$DB_PORT"
    echo ""
    echo "🔗 You can now connect your Spring Boot application to this database."
else
    echo "❌ Database setup failed!"
    exit 1
fi

# Clean up temporary file
rm -f /tmp/hr_data_seed.sql
