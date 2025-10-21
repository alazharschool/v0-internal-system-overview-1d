// ✅ FIXED VERSION: Safe API route for dashboard stats
export async function GET() {
  try {
    // بيانات تجريبية إلى أن نربط قاعدة البيانات
    const stats = {
      totalStudents: 120,
      activeTeachers: 8,
      monthlyRevenue: 2200,
      unpaidInvoices: 3,
    }

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return new Response(
      JSON.stringify({ error: "Failed to fetch dashboard stats" }),
      { status: 500 }
    )
  }
}
