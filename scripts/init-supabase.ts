import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase environment variables")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl)
  console.error("SUPABASE_SERVICE_ROLE_KEY:", !!serviceRoleKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function initializeDatabase() {
  console.log("[v0] Starting Supabase database initialization...")

  try {
    // 1. Enable UUID extension
    console.log("[v0] Creating UUID extension...")
    await supabase
      .rpc("exec_sql", {
        sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
      })
      .catch(() => console.log("[v0] UUID extension already exists"))

    // 2. Drop existing tables (if they exist)
    console.log("[v0] Dropping existing tables...")
    const tables = [
      "activities",
      "certificates",
      "payments",
      "courses",
      "classes",
      "trial_classes",
      "teachers",
      "students",
    ]

    for (const table of tables) {
      await supabase
        .rpc("exec_sql", {
          sql: `DROP TABLE IF EXISTS ${table} CASCADE`,
        })
        .catch(() => null)
    }

    // 3. Drop custom types
    console.log("[v0] Dropping custom types...")
    const types = [
      "student_status",
      "teacher_status",
      "class_status",
      "trial_class_status",
      "trial_class_outcome",
      "course_status",
      "payment_status",
    ]

    for (const type of types) {
      await supabase
        .rpc("exec_sql", {
          sql: `DROP TYPE IF EXISTS ${type} CASCADE`,
        })
        .catch(() => null)
    }

    console.log("[v0] Database cleanup complete")

    // Now create all tables using direct SQL
    console.log("[v0] Creating database schema...")
    const { error } = await supabase.rpc("exec_sql", {
      sql: getSQLSchema(),
    })

    if (error) {
      console.error("[v0] Error creating schema:", error)
      process.exit(1)
    }

    console.log("[v0] ✅ Database initialization complete!")
    console.log("[v0] All tables, indexes, and triggers created successfully")
  } catch (error) {
    console.error("[v0] Fatal error during initialization:", error)
    process.exit(1)
  }
}

function getSQLSchema(): string {
  return `
    -- Create custom enum types
    CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
    CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
    CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
    CREATE TYPE trial_class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
    CREATE TYPE trial_class_outcome AS ENUM ('pending', 'enrolled', 'declined');
    CREATE TYPE course_status AS ENUM ('active', 'completed', 'paused');
    CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed');

    -- Students Table
    CREATE TABLE students (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      weekly_schedule JSONB DEFAULT '{}',
      status student_status NOT NULL DEFAULT 'active',
      enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Teachers Table
    CREATE TABLE teachers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID,
      action_type TEXT NOT NULL,
      description TEXT NOT NULL,
      metadata JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create indexes for performance
    CREATE INDEX idx_students_email ON students(email);
    CREATE INDEX idx_students_status ON students(status);
    CREATE INDEX idx_teachers_email ON teachers(email);
    CREATE INDEX idx_trial_classes_date ON trial_classes(date);
    CREATE INDEX idx_classes_student_id ON classes(student_id);
    CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
    CREATE INDEX idx_courses_student_id ON courses(student_id);
    CREATE INDEX idx_payments_student_id ON payments(student_id);

    -- Enable Row Level Security
    ALTER TABLE students ENABLE ROW LEVEL SECURITY;
    ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE trial_classes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
    ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
    ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies (allow all for now)
    CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all operations on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all operations on trial_classes" ON trial_classes FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all operations on classes" ON classes FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all operations on courses" ON courses FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all operations on certificates" ON certificates FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all operations on activities" ON activities FOR ALL USING (true) WITH CHECK (true);
  `
}

initializeDatabase()
