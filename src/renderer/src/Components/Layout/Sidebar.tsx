import {
  LayoutDashboard,
  CarFront,
  Wrench,
  CalendarClock,
  ChartNoAxesColumn,
  Settings
} from 'lucide-react'

type NavigationItem = {
  label: string
  icon: React.ComponentType<{ size?: number }>
}

const navigationItem: NavigationItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Vehicles', icon: CarFront },
  { label: 'Maintenance', icon: Wrench },
  { label: 'Reminder', icon: CalendarClock },
  { label: 'Reports', icon: ChartNoAxesColumn }
]

function SideBar(): React.JSX.Element {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#253244] bg-[#151e2b]">
      <div className="flex h-20 items-center gap-3 border-b border-[#253244] px-6">
        <CarFront size={28} className="text-[#14b8a6]" />
        <h1 className="text-xl font-bold text-[#f1f5f9]">GarageIQ</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold text-[#94a3b8]">MAIN</p>

        {navigationItem.map((item, index) => {
          const Icon = item.icon
          const isActive = index == 0

          return (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                isActive
                  ? `bg-[#203a40] font-medium text-[#14b8a6]`
                  : `text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f1f5f9]`
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-[#253244] p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f1f5f9]"
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}

export default SideBar
