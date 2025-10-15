-- Educational Management System Database Schema
-- This script creates all necessary tables, indexes, and triggers for the educational dashboard

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for better data integrity
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'trial');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE trial_class_status AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'online');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE certificate_status AS ENUM ('issued', 'pending', 'revoked');

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    status student_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    subjects TEXT[] NOT NULL DEFAULT '{}',
    hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    experience_years INTEGER NOT NULL DEFAULT 0,
    qualifications TEXT,
    status teacher_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    class_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- in minutes
    status class_status DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trial Classes table
CREATE TABLE IF NOT EXISTS trial_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_phone VARCHAR(50) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    grade VARCHAR(50) NOT NULL,
    status trial_class_status DEFAULT 'pending',
    notes TEXT,
    assigned_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    scheduled_date DATE,
    scheduled_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL,
    completion_date DATE NOT NULL,
    grade VARCHAR(10) NOT NULL,
    certificate_url TEXT,
    status certificate_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at);

CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_subjects ON teachers USING GIN(subjects);

CREATE INDEX IF NOT EXISTS idx_classes_student_id ON classes(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_date ON classes(class_date);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
CREATE INDEX IF NOT EXISTS idx_classes_date_time ON classes(class_date, start_time);

CREATE INDEX IF NOT EXISTS idx_trial_classes_status ON trial_classes(status);
CREATE INDEX IF NOT EXISTS idx_trial_classes_date ON trial_classes(preferred_date);
CREATE INDEX IF NOT EXISTS idx_trial_classes_teacher ON trial_classes(assigned_teacher_id);

CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);

-- Create triggers to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trial_classes_updated_at BEFORE UPDATE ON trial_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional - remove in production)
-- Sample Students
INSERT INTO students (id, name, email, phone, grade, subject, parent_name, parent_phone, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ahmed Hassan', 'ahmed.hassan@email.com', '+966501234567', 'Grade 10', 'Mathematics', 'Hassan Ali', '+966501234568', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Fatima Al-Zahra', 'fatima.alzahra@email.com', '+966501234569', 'Grade 11', 'Physics', 'Ali Al-Zahra', '+966501234570', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'Omar Khalil', 'omar.khalil@email.com', '+966501234571', 'Grade 9', 'English', 'Khalil Omar', '+966501234572', 'trial'),
('550e8400-e29b-41d4-a716-446655440004', 'Layla Mohammed', 'layla.mohammed@email.com', '+966501234573', 'Grade 12', 'Chemistry', 'Mohammed Ali', '+966501234574', 'active'),
('550e8400-e29b-41d4-a716-446655440005', 'Yusuf Ibrahim', 'yusuf.ibrahim@email.com', '+966501234575', 'Grade 8', 'Science', 'Ibrahim Yusuf', '+966501234576', 'inactive')
ON CONFLICT (id) DO NOTHING;

-- Sample Teachers
INSERT INTO teachers (id, name, email, phone, subjects, hourly_rate, experience_years, qualifications, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Dr. Sarah Ahmed', 'sarah.ahmed@school.com', '+966501111111', ARRAY['Mathematics', 'Physics'], 150.00, 8, 'PhD in Mathematics, MSc in Physics', 'active'),
('660e8400-e29b-41d4-a716-446655440002', 'Prof. Mohammed Ali', 'mohammed.ali@school.com', '+966501111112', ARRAY['Chemistry', 'Biology'], 140.00, 12, 'PhD in Chemistry, BSc in Biology', 'active'),
('660e8400-e29b-41d4-a716-446655440003', 'Ms. Aisha Hassan', 'aisha.hassan@school.com', '+966501111113', ARRAY['English', 'Literature'], 120.00, 6, 'MA in English Literature, BA in English', 'active'),
('660e8400-e29b-41d4-a716-446655440004', 'Dr. Khalid Omar', 'khalid.omar@school.com', '+966501111114', ARRAY['History', 'Geography'], 130.00, 10, 'PhD in History, MA in Geography', 'active'),
('660e8400-e29b-41d4-a716-446655440005', 'Ms. Noor Abdullah', 'noor.abdullah@school.com', '+966501111115', ARRAY['Computer Science'], 160.00, 5, 'MSc in Computer Science, BSc in Software Engineering', 'inactive')
ON CONFLICT (id) DO NOTHING;

-- Sample Classes
INSERT INTO classes (id, student_id, teacher_id, subject, class_date, start_time, end_time, duration, status, notes) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Mathematics', '2024-01-20', '10:00', '11:00', 60, 'scheduled', 'Algebra review session'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Physics', '2024-01-21', '14:00', '15:30', 90, 'scheduled', 'Mechanics chapter'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'English', '2024-01-19', '16:00', '17:00', 60, 'completed', 'Grammar and vocabulary'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Chemistry', '2024-01-22', '09:00', '10:30', 90, 'scheduled', 'Organic chemistry basics'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Mathematics', '2024-01-18', '15:00', '16:00', 60, 'completed', 'Geometry problems')
ON CONFLICT (id) DO NOTHING;

-- Sample Trial Classes
INSERT INTO trial_classes (id, student_name, student_email, student_phone, parent_name, parent_phone, subject, preferred_date, preferred_time, grade, status, notes, assigned_teacher_id, scheduled_date, scheduled_time) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Maryam Ali', 'maryam.ali@email.com', '+966501234580', 'Ali Hassan', '+966501234581', 'Mathematics', '2024-01-25', '16:00', 'Grade 9', 'pending', 'Student needs help with algebra', NULL, NULL, NULL),
('880e8400-e29b-41d4-a716-446655440002', 'Hassan Mohammed', 'hassan.mohammed@email.com', '+966501234582', 'Mohammed Hassan', '+966501234583', 'Physics', '2024-01-26', '14:00', 'Grade 11', 'scheduled', 'Interested in mechanics', '660e8400-e29b-41d4-a716-446655440001', '2024-01-26', '14:00'),
('880e8400-e29b-41d4-a716-446655440003', 'Zainab Omar', 'zainab.omar@email.com', '+966501234584', 'Omar Ali', '+966501234585', 'English', '2024-01-24', '10:00', 'Grade 10', 'completed', 'Trial class completed successfully', '660e8400-e29b-41d4-a716-446655440003', '2024-01-24', '10:00')
ON CONFLICT (id) DO NOTHING;

-- Sample Payments
INSERT INTO payments (id, student_id, amount, payment_date, payment_method, status, description) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 600.00, '2024-01-15', 'bank_transfer', 'completed', 'Monthly tuition fee - January 2024'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 800.00, '2024-01-16', 'card', 'completed', 'Monthly tuition fee - January 2024'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 900.00, '2024-01-18', 'cash', 'completed', 'Monthly tuition fee - January 2024'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 400.00, '2024-01-20', 'online', 'pending', 'Trial class fee')
ON CONFLICT (id) DO NOTHING;

-- Sample Certificates
INSERT INTO certificates (id, student_id, course_name, completion_date, grade, certificate_url, status) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Advanced Mathematics', '2024-01-10', 'A+', '/certificates/cert-001.pdf', 'issued'),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Physics Fundamentals', '2024-01-12', 'A', '/certificates/cert-002.pdf', 'issued'),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Chemistry Basics', '2024-01-14', 'B+', NULL, 'pending')
ON CONFLICT (id) DO NOTHING;

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM students) as total_students,
    (SELECT COUNT(*) FROM students WHERE status = 'active') as active_students,
    (SELECT COUNT(*) FROM teachers) as total_teachers,
    (SELECT COUNT(*) FROM teachers WHERE status = 'active') as active_teachers,
    (SELECT COUNT(*) FROM classes) as total_classes,
    (SELECT COUNT(*) FROM classes WHERE status = 'scheduled') as scheduled_classes,
    (SELECT COUNT(*) FROM trial_classes) as total_trial_classes,
    (SELECT COUNT(*) FROM trial_classes WHERE status = 'pending') as pending_trial_classes,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed') as total_revenue,
    (SELECT COUNT(*) FROM payments WHERE status = 'pending') as pending_payments;

-- Create a function to get upcoming classes
CREATE OR REPLACE FUNCTION get_upcoming_classes(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id UUID,
    student_id UUID,
    teacher_id UUID,
    subject VARCHAR,
    class_date DATE,
    start_time TIME,
    end_time TIME,
    duration INTEGER,
    status class_status,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    student_name VARCHAR,
    teacher_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.student_id,
        c.teacher_id,
        c.subject,
        c.class_date,
        c.start_time,
        c.end_time,
        c.duration,
        c.status,
        c.notes,
        c.created_at,
        c.updated_at,
        s.name as student_name,
        t.name as teacher_name
    FROM classes c
    JOIN students s ON c.student_id = s.id
    JOIN teachers t ON c.teacher_id = t.id
    WHERE c.class_date >= CURRENT_DATE
    AND c.status = 'scheduled'
    ORDER BY c.class_date ASC, c.start_time ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Educational Management System database schema created successfully!';
    RAISE NOTICE 'Tables created: students, teachers, classes, trial_classes, payments, certificates';
    RAISE NOTICE 'Sample data inserted for testing purposes';
    RAISE NOTICE 'Indexes and triggers created for optimal performance';
END $$;
