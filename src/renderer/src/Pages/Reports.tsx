import {
  Wallet,
  CalendarDays,
  Wrench,
  ChartColumn,
  ChartNoAxesColumn,
  ChartPie,
  Download
} from 'lucide-react'

const reportStats = [
  {
    label: 'Lifetime Expenses',
    value: '$0.00',
    icon: Wallet
  },
  {
    label: 'This Year',
    value: '$0.00',
    icon: CalendarDays
  },
  {
    label: 'Completed Services',
    value: '0',
    icon: Wrench
  },
  {
    label: 'Average Service Cost',
    value: '$0.00',
    icon: ChartColumn
  }
]

function Reports(): React.JSX.Element {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-[#94a3b8] sm:text-base">
            Analyze vehicle expenses and maintenance activity
          </p>
        </div>

        {/* Export will be implemented in the future */}
        <button
          type="button"
          disabled
          title="Report export is not available yet"
          className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-[#253244] px-4 py-2.5 text-sm font-medium text-[#94a3b8]"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <section
        aria-label="Report Statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {reportStats.map((stat) => {
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

      {/* Future reporting visualizations */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#253244] bg-[#151e2b] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Maintenance Spending</h2>

          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <ChartNoAxesColumn size={40} className="text-[#6478b]" />
            <p className="mt-3 text-sm text-[#94a3b8]">No spending data available yet</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#253244] bg-[#151e2b] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Expenses By Category</h2>

          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <ChartPie size={40} className="text-[#64748b]" />

            <p className="mt-3 text-sm text-[#94a3b8]">No category data available yet</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Reports
