-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  parent_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  assigned_teacher UUID REFERENCES teachers(id),
  study_days TEXT[],
  study_time TEXT,
  lesson_duration INTEGER,
  monthly_payments DECIMAL,
  custom_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  country TEXT,
  specialization TEXT,
  hourly_rate DECIMAL,
  assigned_students UUID[],
  monthly_salary DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT,
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  duration INTEGER,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trial_classes table
CREATE TABLE IF NOT EXISTS trial_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_email TEXT,
  student_phone TEXT,
  teacher_id UUID REFERENCES teachers(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration INTEGER,
  subject TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  method TEXT,
  month TEXT,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'overdue')),
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'overdue')),
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  completion_date DATE,
  certificate_template JSONB,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  student_ids UUID[],
  level TEXT,
  duration INTEGER,
  price DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'no_lesson')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table (alias for classes if needed)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  lesson_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration INTEGER,
  attendance TEXT DEFAULT 'present' CHECK (attendance IN ('present', 'absent', 'no_lesson')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_classes_student_id ON classes(student_id);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_class_date ON classes(class_date);
CREATE INDEX idx_trial_classes_date ON trial_classes(date);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_invoices_student_id ON invoices(student_id);
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_lessons_student_id ON lessons(student_id);
CREATE INDEX idx_lessons_lesson_date ON lessons(lesson_date);
