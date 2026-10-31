import { Wrench, CheckCircle2, CalendarClock, Wallet } from 'lucide-react'

const maintenanceStats = [
  {
    label: 'Completed Service',
    value: '0',
    icon: CheckCircle2
  },
  {
    label: 'Scheduled Service',
    value: '0',
    icon: CalendarClock
  },
  {
    label: 'Maintenance Expenses',
    value: '$0.00',
    icon: Wallet
  }
]

function Maintenance(): React.JSX.Element {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Maintenance</h1>
          <p className="mt-2 text-sm text-[#94a3b8] sm:text-base">
            Manage Service records and vehicle maintenance
          </p>
        </div>

        {/* Disabled until Maintenance is complete */}
        <button
          type="button"
          disabled
          title="Maintenance entry will be available in future update"
          className="cursor-not-allowed rounded-lg bg-[#253244] px-4 py-2.5 text-sm font-medium text-[#94a3b8]"
        >
          Add Service
        </button>
      </div>

      {/* Summary Cards */}
      <section
        aria-label="Maintenance Statistics"
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {maintenanceStats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#253244] bg-[#151e2b] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#94a3b8]">{stat.label}</p>

                <Icon size={20} className="shrink-0 text-[#14b8a6]" />
              </div>

              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{stat.value}</h2>
            </div>
          )
        })}
      </section>

      {/* Empty Maintenance State */}
      <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-[#253244] bg-[#151e2b] px-4 py-10 text-center">
        <Wrench size={42} className="text-[#14b8a6]" />

        <h2 className="mt-4 text-lg font-semibold sm:text-xl">No Maintenance Records Yet</h2>
        <p className="mt-2 max-w-md text-sm text-[#94a3b8] sm:text-base">
          Completed services and repairs will appear here once they are recorded in GarageIQ
        </p>
      </section>
    </div>
  )
}

export default Maintenance
