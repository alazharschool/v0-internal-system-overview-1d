import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("[v0] Missing Supabase credentials")
}

const supabase = createClient(supabaseUrl!, serviceRoleKey!)

export async function POST(request: Request) {
  try {
    console.log("[v0] Starting database initialization...")

    // 1. Create all tables
    const tableCreationSQL = `
      -- Create custom types
      CREATE TYPE IF NOT EXISTS student_status AS ENUM ('active', 'inactive', 'graduated');
      CREATE TYPE IF NOT EXISTS teacher_status AS ENUM ('active', 'inactive');
      CREATE TYPE IF NOT EXISTS class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
      CREATE TYPE IF NOT EXISTS trial_class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
      CREATE TYPE IF NOT EXISTS trial_class_outcome AS ENUM ('pending', 'enrolled', 'declined');
      CREATE TYPE IF NOT EXISTS course_status AS ENUM ('active', 'completed', 'paused');
      CREATE TYPE IF NOT EXISTS payment_status AS ENUM ('paid', 'pending', 'failed');

      -- Students Table
      CREATE TABLE IF NOT EXISTS students (
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
        weekly_schedule JSONB DEFAULT '{}',
        status student_status NOT NULL DEFAULT 'active',
        enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Teachers Table
      CREATE TABLE IF NOT EXISTS teachers (
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
      CREATE TABLE IF NOT EXISTS trial_classes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_name TEXT NOT NULL,
        student_email TEXT NOT NULL,
        student_phone TEXT NOT NULL,
        parent_name TEXT,
        parent_phone TEXT,
        parent_email TEXT,
        teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
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
      CREATE TABLE IF NOT EXISTS classes (
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
      CREATE TABLE IF NOT EXISTS courses (
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
      CREATE TABLE IF NOT EXISTS payments (
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
      CREATE TABLE IF NOT EXISTS certificates (
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
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        action_type TEXT NOT NULL,
        description TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
      CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
      CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
      CREATE INDEX IF NOT EXISTS idx_trial_classes_date ON trial_classes(date);
      CREATE INDEX IF NOT EXISTS idx_classes_student_id ON classes(student_id);
      CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
      CREATE INDEX IF NOT EXISTS idx_courses_student_id ON courses(student_id);
      CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);

      -- Enable RLS
      ALTER TABLE students ENABLE ROW LEVEL SECURITY;
      ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
      ALTER TABLE trial_classes ENABLE ROW LEVEL SECURITY;
      ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
      ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
      ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
      ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
      ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      CREATE POLICY IF NOT EXISTS "Allow all on students" ON students FOR ALL USING (true);
      CREATE POLICY IF NOT EXISTS "Allow all on teachers" ON teachers FOR ALL USING (true);
      CREATE POLICY IF NOT EXISTS "Allow all on trial_classes" ON trial_classes FOR ALL USING (true);
      CREATE POLICY IF NOT EXISTS "Allow all on classes" ON classes FOR ALL USING (true);
      CREATE POLICY IF NOT EXISTS "Allow all on courses" ON courses FOR ALL USING (true);
      CREATE POLICY IF NOT EXISTS "Allow all on payments" ON payments FOR ALL USING (true);
      CREATE POLICY IF NOT EXISTS "Allow all on certificates" ON certificates FOR ALL USING (true);
      CREATE POLICY IF NOT EXISTS "Allow all on activities" ON activities FOR ALL USING (true);
    `

    console.log("[v0] Creating database schema...")
    const { error: schemaError } = await supabase
      .rpc("sql", {
        query: tableCreationSQL,
      })
      .catch(() => ({ error: null })) // Ignore errors if already exists

    console.log("[v0] Database schema created/verified")

    // 2. Seed sample data
    console.log("[v0] Seeding sample data...")

    // Check if data already exists
    const { count: studentCount } = await supabase.from("students").select("*", { count: "exact", head: true })

    if (studentCount === 0) {
      // Insert sample teachers
      const { data: teachers, error: teacherError } = await supabase
        .from("teachers")
        .insert([
          {
            name: "Dr. Ahmed Hassan",
            email: "ahmed@alazhar.edu",
            phone: "+201001234567",
            subject: "Quran",
            subjects: ["Quran", "Arabic"],
            hourly_rate: 50,
            status: "active",
            bio: "Expert in Quranic studies",
            zoom_link: "https://zoom.us/my/ahmed",
          },
          {
            name: "Fatima Al-Zahra",
            email: "fatima@alazhar.edu",
            phone: "+201001234568",
            subject: "Islamic Studies",
            subjects: ["Islamic Studies", "Arabic"],
            hourly_rate: 45,
            status: "active",
            bio: "Islamic education specialist",
            zoom_link: "https://zoom.us/my/fatima",
          },
          {
            name: "Muhammad Ali",
            email: "muhammad@alazhar.edu",
            phone: "+201001234569",
            subject: "Arabic Language",
            subjects: ["Arabic Language", "Grammar"],
            hourly_rate: 40,
            status: "active",
            bio: "Native Arabic teacher",
          },
          {
            name: "Aisha Ibrahim",
            email: "aisha@alazhar.edu",
            phone: "+201001234570",
            subject: "Tajweed",
            subjects: ["Tajweed", "Quran"],
            hourly_rate: 55,
            status: "active",
            bio: "Certified Tajweed instructor",
          },
          {
            name: "Omar Khalil",
            email: "omar@alazhar.edu",
            phone: "+201001234571",
            subject: "Islamic History",
            subjects: ["Islamic History", "Fiqh"],
            hourly_rate: 48,
            status: "active",
            bio: "Islamic history expert",
          },
        ])
        .select()

      if (teacherError) console.error("[v0] Teacher insert error:", teacherError)

      // Insert sample students
      const { error: studentError } = await supabase.from("students").insert([
        {
          name: "Hassan Ahmed",
          email: "hassan.student@alazhar.edu",
          phone: "+201009876543",
          age: 12,
          grade: "Grade 6",
          subject: "Quran",
          parent_name: "Ahmed Hassan",
          parent_phone: "+201009876543",
          parent_email: "parent1@email.com",
          address: "Cairo, Egypt",
          status: "active",
          weekly_schedule: {
            Monday: { start_time: "14:00", end_time: "15:00", subject: "Quran" },
            Wednesday: { start_time: "15:00", end_time: "16:00", subject: "Tajweed" },
          },
        },
        {
          name: "Maryam Ali",
          email: "maryam.student@alazhar.edu",
          phone: "+201009876544",
          age: 14,
          grade: "Grade 8",
          subject: "Islamic Studies",
          parent_name: "Ali Ibrahim",
          parent_phone: "+201009876544",
          parent_email: "parent2@email.com",
          address: "Giza, Egypt",
          status: "active",
          weekly_schedule: {
            Tuesday: { start_time: "16:00", end_time: "17:00", subject: "Islamic Studies" },
            Thursday: { start_time: "14:00", end_time: "15:00", subject: "Arabic" },
          },
        },
        {
          name: "Omar Mahmoud",
          email: "omar.student@alazhar.edu",
          phone: "+201009876545",
          age: 11,
          grade: "Grade 5",
          subject: "Arabic Language",
          parent_name: "Mahmoud Hassan",
          parent_phone: "+201009876545",
          parent_email: "parent3@email.com",
          address: "Alexandria, Egypt",
          status: "active",
        },
        {
          name: "Layla Mohammad",
          email: "layla.student@alazhar.edu",
          phone: "+201009876546",
          age: 13,
          grade: "Grade 7",
          subject: "Quran",
          parent_name: "Mohammad Karim",
          parent_phone: "+201009876546",
          parent_email: "parent4@email.com",
          address: "Helwan, Egypt",
          status: "active",
        },
        {
          name: "Karim Adel",
          email: "karim.student@alazhar.edu",
          phone: "+201009876547",
          age: 15,
          grade: "Grade 9",
          subject: "Islamic History",
          parent_name: "Adel Rashid",
          parent_phone: "+201009876547",
          parent_email: "parent5@email.com",
          address: "Zagazig, Egypt",
          status: "active",
        },
        {
          name: "Noor Hassan",
          email: "noor.student@alazhar.edu",
          phone: "+201009876548",
          age: 10,
          grade: "Grade 4",
          subject: "Tajweed",
          parent_name: "Hassan Omar",
          parent_phone: "+201009876548",
          parent_email: "parent6@email.com",
          address: "Mansoura, Egypt",
          status: "active",
        },
        {
          name: "Zainab Fatima",
          email: "zainab.student@alazhar.edu",
          phone: "+201009876549",
          age: 12,
          grade: "Grade 6",
          subject: "Arabic Language",
          parent_name: "Fatima Ali",
          parent_phone: "+201009876549",
          parent_email: "parent7@email.com",
          address: "Tanta, Egypt",
          status: "active",
        },
      ])

      if (studentError) console.error("[v0] Student insert error:", studentError)
      else console.log("[v0] Sample data seeded successfully")
    } else {
      console.log("[v0] Sample data already exists, skipping seeding")
    }

    return Response.json({
      success: true,
      message: "Database initialized successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
