import { AlertCircle, CalendarClock, CheckCircle2, CalendarCheck, Plus } from 'lucide-react'

const reminderStats = [
  {
    label: 'Overdue',
    value: '0',
    icon: AlertCircle,
    color: 'text-[#ef4444]'
  },
  {
    label: 'Upcoming',
    value: '0',
    icon: CalendarClock,
    color: 'text-[#f59e0b]'
  },
  {
    label: 'Completed',
    value: '0',
    icon: CheckCircle2,
    color: 'text-[#14b8a6]'
  }
]

function Reminder(): React.JSX.Element {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reminders</h1>
          <p className="mt-2 text-sm text-[#94a3b8] sm:text-3xl">
            Stay ahead of upcoming vehicle maintenance
          </p>
        </div>

        {/* Placeholder for the future reminder event */}
        <button
          type="button"
          disabled
          title="Reminder creation will be available in a future update"
          className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-[#253244] px-4 py-2.5 text-sm font-medium text-[#94a3b8]"
        >
          <Plus size={18} />
          Add Reminder
        </button>
      </div>

      {/* Reminder Summary Cards */}
      <section aria-label="Reminder statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {reminderStats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#253244] bg-[#151e2b] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#94a3b8]">{stat.label}</p>

                <Icon size={20} className={`shrink-0 ${stat.color}`} />
              </div>

              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{stat.value}</h2>
            </div>
          )
        })}
      </section>

      {/* Empty Reminder State */}
      <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-[#253244] bg-[#151e2b] px-4 py-10 text-center">
        <CalendarCheck size={42} className="text-[#14b8a6]" />

        <h2 className="mt-4 text-lg font-semibold sm:text-xl">No maintenance reminders</h2>

        <p className="mt-2 max-w-md text-sm text-[#94a3b8] sm:text-base">
          Upcoming maintenance and service reminders will appear here once they are configred in
          GargeIQ
        </p>
      </section>
    </div>
  )
}

export default Reminder
