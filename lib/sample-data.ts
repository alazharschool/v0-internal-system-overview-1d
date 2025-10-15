import { prisma } from "./prisma"
import { Role, AttendanceStatus, ScheduleStatus, PaymentStatus, PaymentMethod } from "@prisma/client"

export async function generateSampleData() {
  try {
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: "Ahmed Mohamed Admin",
        email: "admin@alazhar-online.com",
        role: Role.ADMIN,
      },
    })

    // Create teachers
    const teachers = await Promise.all([
      prisma.user.create({
        data: {
          name: "Sheikh Mohamed Abdullah",
          email: "teacher1@alazhar-online.com",
          role: Role.TEACHER,
          teacher: {
            create: {
              bio: "Quran teacher with 15 years experience in Tajweed and memorization",
              ratePerHour: 25.0,
              active: true,
            },
          },
        },
        include: { teacher: true },
      }),
      prisma.user.create({
        data: {
          name: "Professor Fatima Ahmed",
          email: "teacher2@alazhar-online.com",
          role: Role.TEACHER,
          teacher: {
            create: {
              bio: "Quran teacher specialized in teaching children",
              ratePerHour: 20.0,
              active: true,
            },
          },
        },
        include: { teacher: true },
      }),
      prisma.user.create({
        data: {
          name: "Sheikh Abdulrahman Hassan",
          email: "teacher3@alazhar-online.com",
          role: Role.TEACHER,
          teacher: {
            create: {
              bio: "Hafiz of Quran and certified Tajweed teacher",
              ratePerHour: 30.0,
              active: true,
            },
          },
        },
        include: { teacher: true },
      }),
      prisma.user.create({
        data: {
          name: "Professor Aisha Salem",
          email: "teacher4@alazhar-online.com",
          role: Role.TEACHER,
          teacher: {
            create: {
              bio: "Quran and Tafseer teacher for women and girls",
              ratePerHour: 22.0,
              active: true,
            },
          },
        },
        include: { teacher: true },
      }),
      prisma.user.create({
        data: {
          name: "Sheikh Youssef Ibrahim",
          email: "teacher5@alazhar-online.com",
          role: Role.TEACHER,
          teacher: {
            create: {
              bio: "Quran teacher and Islamic sciences instructor",
              ratePerHour: 28.0,
              active: true,
            },
          },
        },
        include: { teacher: true },
      }),
    ])

    // Create parents
    const parents = await Promise.all([
      prisma.user.create({
        data: {
          name: "Mohamed Ahmed Elsayed",
          email: "parent1@example.com",
          role: Role.PARENT,
        },
      }),
      prisma.user.create({
        data: {
          name: "Fatima Mahmoud Ali",
          email: "parent2@example.com",
          role: Role.PARENT,
        },
      }),
      prisma.user.create({
        data: {
          name: "Abdullah Hassan Mohamed",
          email: "parent3@example.com",
          role: Role.PARENT,
        },
      }),
      prisma.user.create({
        data: {
          name: "Khadija Abdulrahman",
          email: "parent4@example.com",
          role: Role.PARENT,
        },
      }),
      prisma.user.create({
        data: {
          name: "Omar Youssef Ahmed",
          email: "parent5@example.com",
          role: Role.PARENT,
        },
      }),
    ])

    // Create students
    const students = await Promise.all([
      prisma.student.create({
        data: {
          name: "Ahmed Mohamed Elsayed",
          parentUserId: parents[0].id,
          teacherId: teachers[0].teacher!.id,
          timezone: "Asia/Riyadh",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Aisha Mahmoud Ali",
          parentUserId: parents[1].id,
          teacherId: teachers[1].teacher!.id,
          timezone: "Asia/Dubai",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Youssef Abdullah Hassan",
          parentUserId: parents[2].id,
          teacherId: teachers[2].teacher!.id,
          timezone: "Asia/Kuwait",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Maryam Khadija Abdulrahman",
          parentUserId: parents[3].id,
          teacherId: teachers[3].teacher!.id,
          timezone: "Africa/Cairo",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Abdulrahman Omar Youssef",
          parentUserId: parents[4].id,
          teacherId: teachers[4].teacher!.id,
          timezone: "Asia/Riyadh",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Zainab Ahmed Mohamed",
          parentUserId: parents[0].id,
          teacherId: teachers[1].teacher!.id,
          timezone: "Asia/Riyadh",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Hassan Fatima Mahmoud",
          parentUserId: parents[1].id,
          teacherId: teachers[2].teacher!.id,
          timezone: "Asia/Dubai",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Sara Abdullah Hassan",
          parentUserId: parents[2].id,
          teacherId: teachers[3].teacher!.id,
          timezone: "Asia/Kuwait",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Mohamed Khadija Abdulrahman",
          parentUserId: parents[3].id,
          teacherId: teachers[4].teacher!.id,
          timezone: "Africa/Cairo",
          active: true,
        },
      }),
      prisma.student.create({
        data: {
          name: "Fatima Omar Youssef",
          parentUserId: parents[4].id,
          teacherId: teachers[0].teacher!.id,
          timezone: "Asia/Riyadh",
          active: true,
        },
      }),
    ])

    // Create class templates
    const classTemplates = await Promise.all([
      // Sheikh Mohamed Abdullah - Sunday, Tuesday, Thursday
      prisma.classTemplate.create({
        data: {
          teacherId: teachers[0].teacher!.id,
          dayOfWeek: 0, // Sunday
          time: "09:00",
          durationMin: 60,
          active: true,
        },
      }),
      prisma.classTemplate.create({
        data: {
          teacherId: teachers[0].teacher!.id,
          dayOfWeek: 2, // Tuesday
          time: "10:00",
          durationMin: 60,
          active: true,
        },
      }),
      prisma.classTemplate.create({
        data: {
          teacherId: teachers[0].teacher!.id,
          dayOfWeek: 4, // Thursday
          time: "11:00",
          durationMin: 60,
          active: true,
        },
      }),
      // Professor Fatima Ahmed - Monday, Wednesday, Friday
      prisma.classTemplate.create({
        data: {
          teacherId: teachers[1].teacher!.id,
          dayOfWeek: 1, // Monday
          time: "14:00",
          durationMin: 45,
          active: true,
        },
      }),
      prisma.classTemplate.create({
        data: {
          teacherId: teachers[1].teacher!.id,
          dayOfWeek: 3, // Wednesday
          time: "15:00",
          durationMin: 45,
          active: true,
        },
      }),
      prisma.classTemplate.create({
        data: {
          teacherId: teachers[1].teacher!.id,
          dayOfWeek: 5, // Friday
          time: "16:00",
          durationMin: 45,
          active: true,
        },
      }),
    ])

    // Create schedule entries (20 entries)
    const scheduleEntries = []
    const today = new Date()

    for (let i = 0; i < 20; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + (i % 7) - 3) // Distribute over a week

      const studentIndex = i % students.length
      const teacherIndex = i % teachers.length

      scheduleEntries.push(
        await prisma.scheduleEntry.create({
          data: {
            studentId: students[studentIndex].id,
            teacherId: teachers[teacherIndex].teacher!.id,
            date: date,
            durationMin: 60,
            status: i < 10 ? ScheduleStatus.COMPLETED : ScheduleStatus.SCHEDULED,
          },
        }),
      )
    }

    // Create attendance records for completed classes
    for (let i = 0; i < 10; i++) {
      await prisma.attendance.create({
        data: {
          scheduleEntryId: scheduleEntries[i].id,
          status: i % 4 === 0 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
          note: i % 4 === 0 ? "Absent with excuse" : "Excellent attendance",
        },
      })
    }

    // Create payments
    const payments = []
    for (let i = 0; i < 15; i++) {
      const studentIndex = i % students.length
      const parentIndex = i % parents.length

      payments.push(
        await prisma.payment.create({
          data: {
            studentId: students[studentIndex].id,
            userId: parents[parentIndex].id,
            amount: 100 + i * 25,
            currency: "USD",
            method: i % 3 === 0 ? PaymentMethod.PAYPAL : PaymentMethod.BANK_TRANSFER,
            status: i % 5 === 0 ? PaymentStatus.PENDING : PaymentStatus.PAID,
            reference: `PAY-${Date.now()}-${i}`,
          },
        }),
      )
    }

    // Create certificates
    for (let i = 0; i < 5; i++) {
      await prisma.certificate.create({
        data: {
          studentId: students[i].id,
          title: `Certificate of Completion - Quran Part ${i + 1}`,
          issuedAt: new Date(),
          pdfUrl: `/certificates/cert-${students[i].id}-${i + 1}.pdf`,
        },
      })
    }

    console.log("✅ Sample data created successfully!")
    console.log(`📊 Created:`)
    console.log(`   - ${teachers.length} teachers`)
    console.log(`   - ${students.length} students`)
    console.log(`   - ${scheduleEntries.length} scheduled classes`)
    console.log(`   - ${payments.length} payments`)
    console.log(`   - 5 certificates`)
  } catch (error) {
    console.error("❌ Error creating sample data:", error)
    throw error
  }
}
