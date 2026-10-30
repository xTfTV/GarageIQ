import { CarFront, CalendarClock, Wrench, Wallet } from 'lucide-react'

const stats = [
  { label: 'Total Vehicles', value: '0', icon: CarFront },
  { label: 'Upcoming Services', value: '0', icon: CalendarClock },
  { label: 'Maintenance Records', value: '0', icon: Wrench },
  { label: 'Total Expenses', value: '$0.00', icon: Wallet }
]

function Dashboard(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Garage overview</h1>
        <p className="mt-2 text-[#94a3b8]">Track your vehicles and maintenance activity</p>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div key={stat.label} className="rounded-xl border border-[#253244] bg-[#151e2b] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#94a3b8]">{stat.label}</p>
                <Icon size={20} className="text-[#14b8a6]" />
              </div>

              <h2 className="mt-4 text-3xl font-bold">{stat.value}</h2>
            </div>
          )
        })}
      </section>

      <section className="rounded-xl border border-[#253244] bg-[#151e2b] p-12 text-center">
        <CarFront size={40} className="mx-auto text-[#14b8a6]" />

        <h2 className="mt-4 text-xl font-semibold">No vehicles added yet</h2>

        <p className="mt-2 text-[#94a3b8]">
          Your vehicles and maintenance activity will appear here
        </p>
      </section>
    </div>
  )
}

export default Dashboard
