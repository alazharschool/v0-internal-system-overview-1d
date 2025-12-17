"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Copy, Database, ExternalLink, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DatabaseSetupPage() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qumeveerinufukgpbcyk.supabase.co"
  const sqlEditorUrl = `${supabaseUrl.replace("https://", "https://supabase.com/dashboard/project/")}/editor`

  const copyScript = () => {
    // The complete SQL script
    const scriptContent = `-- Complete Al-Azhar School Database Setup
-- Copy and paste this entire script into Supabase SQL Editor

-- Drop existing objects if they exist
DROP POLICY IF EXISTS "Allow all operations on activities" ON activities;
DROP POLICY IF EXISTS "Allow all operations on certificates" ON certificates;
DROP POLICY IF EXISTS "Allow all operations on payments" ON payments;
DROP POLICY IF EXISTS "Allow all operations on courses" ON courses;
DROP POLICY IF EXISTS "Allow all operations on classes" ON classes;
DROP POLICY IF EXISTS "Allow all operations on trial_classes" ON trial_classes;
DROP POLICY IF EXISTS "Allow all operations on teachers" ON teachers;
DROP POLICY IF EXISTS "Allow all operations on students" ON students;

DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
DROP TRIGGER IF EXISTS update_trial_classes_updated_at ON trial_classes;
DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
DROP TRIGGER IF EXISTS update_students_updated_at ON students;

DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS trial_classes CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;

DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS trial_class_outcome CASCADE;
DROP TYPE IF EXISTS trial_class_status CASCADE;
DROP TYPE IF EXISTS class_status CASCADE;
DROP TYPE IF EXISTS teacher_status CASCADE;
DROP TYPE IF EXISTS student_status CASCADE;

-- Create custom types
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE trial_class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE trial_class_outcome AS ENUM ('pending', 'enrolled', 'declined');
CREATE TYPE course_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed');

-- Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  age INTEGER,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  address TEXT,
  status student_status NOT NULL DEFAULT 'active',
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Teachers Table
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status teacher_status NOT NULL DEFAULT 'active',
  bio TEXT,
  zoom_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trial Classes Table
CREATE TABLE trial_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  status trial_class_status NOT NULL DEFAULT 'scheduled',
  outcome trial_class_outcome NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Classes Table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  status class_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_classes INTEGER NOT NULL DEFAULT 0,
  completed_classes INTEGER NOT NULL DEFAULT 0,
  remaining_classes INTEGER NOT NULL DEFAULT 0,
  progress_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
  monthly_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status course_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activities Table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_status ON teachers(status);
CREATE INDEX idx_trial_classes_date ON trial_classes(date);
CREATE INDEX idx_trial_classes_status ON trial_classes(status);
CREATE INDEX idx_classes_student_id ON classes(student_id);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_classes_class_date ON classes(class_date);
CREATE INDEX idx_courses_student_id ON courses(student_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);

-- Create triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trial_classes_updated_at BEFORE UPDATE ON trial_classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on trial_classes" ON trial_classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on classes" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on courses" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on certificates" ON certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on activities" ON activities FOR ALL USING (true) WITH CHECK (true);

-- Insert seed data (5 teachers and 30 students)
INSERT INTO teachers (name, email, phone, subject, subjects, hourly_rate, bio) VALUES
('Sheikh Ahmed Al-Mansour', 'ahmed.mansour@alazhar.school', '+20-123-456-7891', 'Quran Recitation', ARRAY['Quran Recitation', 'Tajweed'], 25.00, 'Expert in Quran recitation'),
('Ustadh Fatima Hassan', 'fatima.hassan@alazhar.school', '+20-123-456-7892', 'Arabic Language', ARRAY['Arabic Language', 'Grammar'], 20.00, 'Specialized in Arabic language'),
('Sheikh Mohammed Ibrahim', 'mohammed.ibrahim@alazhar.school', '+20-123-456-7893', 'Tajweed', ARRAY['Tajweed', 'Quranic Sciences'], 30.00, 'Master of Tajweed rules'),
('Ustadha Aisha Abdallah', 'aisha.abdallah@alazhar.school', '+20-123-456-7894', 'Islamic Studies', ARRAY['Islamic Studies', 'Fiqh'], 22.00, 'Scholar in Islamic jurisprudence'),
('Sheikh Omar Khalil', 'omar.khalil@alazhar.school', '+20-123-456-7895', 'Quran Memorization', ARRAY['Quran Memorization'], 28.00, 'Hafiz with 20 years experience');

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup complete! Tables created with seed data.';
END $$;`

    navigator.clipboard.writeText(scriptContent)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "SQL script copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Database Setup Required</h1>
          <p className="text-slate-600">Initialize your Al-Azhar School database tables</p>
        </div>
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          The database tables haven't been created yet. Follow the steps below to set up your database.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>Follow these steps to initialize your database (takes about 2 minutes)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Copy the SQL Script</h3>
              <p className="text-slate-600">Click the button below to copy the complete database setup script</p>
              <Button onClick={copyScript} className="gap-2">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy SQL Script
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Open Supabase SQL Editor</h3>
              <p className="text-slate-600">Open the SQL Editor in your Supabase Dashboard</p>
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <a href={sqlEditorUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open Supabase SQL Editor
                </a>
              </Button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Paste and Run</h3>
              <div className="space-y-2 text-slate-600">
                <p>1. Paste the copied script into the SQL Editor</p>
                <p>2. Click the "Run" button (or press Cmd+Enter / Ctrl+Enter)</p>
                <p>3. Wait for the script to complete (you'll see success messages)</p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Return to Dashboard</h3>
              <p className="text-slate-600">Once complete, return to the dashboard to see your system in action!</p>
              <Button asChild>
                <Link href="/">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">What This Script Does</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                Creates 8 database tables (students, teachers, classes, trial_classes, courses, payments, certificates,
                activities)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Sets up indexes for fast queries</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Enables Row Level Security (RLS) with permissive policies</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Adds sample data (5 teachers) to get you started</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>Note:</strong> After running the script, create an admin user in Supabase Authentication (Settings →
          Authentication → Users) with email{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">admin@alazhar.school</code> and password{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">mbanora1983</code>
        </AlertDescription>
      </Alert>
    </div>
  )
}
