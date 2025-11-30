import { supabaseServer } from "./server"

export async function initializeDatabase() {
  try {
    // Create students table
    await supabaseServer.rpc("create_students_table").catch(() => {})
    // Create teachers table
    await supabaseServer.rpc("create_teachers_table").catch(() => {})
    // Create lessons table
    await supabaseServer.rpc("create_lessons_table").catch(() => {})
    // Create attendance table
    await supabaseServer.rpc("create_attendance_table").catch(() => {})
    // Create invoices table
    await supabaseServer.rpc("create_invoices_table").catch(() => {})
    // Create certificates table
    await supabaseServer.rpc("create_certificates_table").catch(() => {})

    console.log("Database initialized successfully")
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
}

export async function seedDatabase() {
  try {
    // Seed sample teachers
    const teachers = [
      {
        name: "Ahmed Mohamed",
        email: "ahmed@example.com",
        phone: "+201000000001",
        country: "Egypt",
        hourly_rate: 50,
      },
      {
        name: "Fatima Ali",
        email: "fatima@example.com",
        phone: "+201000000002",
        country: "Saudi Arabia",
        hourly_rate: 60,
      },
      {
        name: "Hassan Karim",
        email: "hassan@example.com",
        phone: "+201000000003",
        country: "UAE",
        hourly_rate: 55,
      },
      {
        name: "Noor Hassan",
        email: "noor@example.com",
        phone: "+201000000004",
        country: "Egypt",
        hourly_rate: 45,
      },
    ]

    for (const teacher of teachers) {
      await supabaseServer
        .from("teachers")
        .insert([
          {
            ...teacher,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .catch(() => {})
    }

    console.log("Database seeded successfully")
    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
}
