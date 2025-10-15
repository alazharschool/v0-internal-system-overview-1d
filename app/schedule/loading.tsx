export default function ScheduleLoading() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="h-10 bg-slate-200 rounded w-64"></div>
            <div className="h-6 bg-slate-200 rounded w-96"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>

          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}
