import { Bell, Search, ChevronDown } from 'lucide-react'

function TopBar(): React.JSX.Element {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#253244] bg-[#151e2b] px-8">
      {/* Current Page */}
      <div>
        <h2 className="text-lg font-semibold text-[#f1f15f9]">Dashboard</h2>

        <p className="text-xs text-[#94a3b8]">Garage Overview</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="flex w-72 items-center gap-3 rounded-lg border border-[#253244] bg-[#0b1220] px-4 py-2.5">
          <Search size={18} className="text-[#94a3b8]" />

          <input
            type="text"
            placeholder="Search GarageIQ..."
            aria-label="Search GarageIQ"
            className="w-full bg-transparent text-sm text-[#f1f5f9] outline-none placeholder:text-[#64748b]"
          />
        </div>

        {/* Notifications -- visual placeholder */}
        <div className="rounded-lg p-2 text-[#94a3b8]" title="Notifications coming soon">
          <Bell size={20} />
        </div>

        {/* User Profile -- Visual placeholder for now */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#203a40] text-sm font-semibold text-[#14b8a6]">
            GI
          </div>
          <ChevronDown size={16} className="text-[94a3b8]" />
        </div>
      </div>
    </header>
  )
}

export default TopBar
