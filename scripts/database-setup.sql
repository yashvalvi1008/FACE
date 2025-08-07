-- Create database schema for facial recognition attendance system

-- Users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    is_active BOOLEAN DEFAULT true,
    face_descriptor TEXT, -- JSON string of face descriptor
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records table
CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'present', -- present, absent, late, half_day
    confidence_score FLOAT, -- Face recognition confidence
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work schedules table
CREATE TABLE work_schedules (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
    start_time TIME,
    end_time TIME,
    is_working_day BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, password, role) VALUES 
('admin@company.com', '$2a$10$rOzJqQZ9QZ9QZ9QZ9QZ9QOzJqQZ9QZ9QZ9QZ9QZ9QZ9QZ9QZ9QZ9Q', 'admin');

INSERT INTO departments (name, description) VALUES 
('Engineering', 'Software development and technical operations'),
('Human Resources', 'Employee management and recruitment'),
('Marketing', 'Brand promotion and customer acquisition'),
('Finance', 'Financial planning and accounting');

-- Create indexes for better performance
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, date);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_employees_active ON employees(is_active);
