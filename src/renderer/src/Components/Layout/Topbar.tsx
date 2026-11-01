import { useState } from 'react'
import { Bell, Search, ChevronDown, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const pageInformation: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Garage Overview'
  },
  '/vehicles': {
    title: 'Vehicles',
    subtitle: 'Manage Your Garage'
  },
  '/maintenance': {
    title: 'Maintenance',
    subtitle: 'Service History & Maintenance'
  },
  '/reminder': {
    title: 'Reminder',
    subtitle: 'Upcoming Maintenance'
  },
  '/reports': {
    title: 'Reports',
    subtitle: 'Vehicle Analytics'
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Application Preferences'
  }
}

function Topbar(): React.JSX.Element {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const location = useLocation()

  const currentPage = pageInformation[location.pathname] ?? {
    title: 'GarageIQ',
    subtitle: 'Vehicle Management'
  }

  return (
    <header className="relative flex h-20 shrink-0 items-center justify-between gap-3 border-b border-[#253244] bg-[#151e2b] px-4 sm:px-6 lg:px-8">
      {/* Current page */}
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-[#f1f5f9] sm:text-lg">
          {currentPage.title}
        </h2>
        <p className="hidden text-xs text-[#94a3b8] sm:block">{currentPage.subtitle}</p>
      </div>

      {/* Right controls */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Desktop search */}
        <div className="hidden items-center gap-3 rounded-lg border border-[#253244] bg-[#0b1220] px-4 py-2.5 md:flex md:w-44 lg:w-56 xl:w-72">
          <Search size={18} className="shrink-0 text-[#94a3b8]" />

          <input
            type="search"
            placeholder="Search GarageIQ..."
            aria-label="Search GarageIQ"
            className="min-w-0 w-full bg-transparent text-sm text-[#f1f5f9] outline-none placeholder:text-[#64748b]"
          />
        </div>

        {/* Small-window search toggle */}
        <button
          type="button"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          aria-label="Toggle search"
          aria-expanded={showMobileSearch}
          className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#1e293b] md:hidden"
        >
          {showMobileSearch ? <X size={20} /> : <Search size={20} />}
        </button>

        {/* Notification placeholder */}
        <span
          title="Notifications coming soon"
          aria-label="Notifications coming soon"
          className="rounded-lg p-2 text-[#94a3b8]"
        >
          <Bell size={20} />
        </span>

        {/* Profile placeholder */}
        <div title="User profile coming soon" className="flex items-center gap-1 sm:gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#203a40] text-sm font-semibold text-[#14b8a6]">
            GI
          </div>
          <ChevronDown size={16} className="hidden text-[#94a3b8] sm:block" />
        </div>
      </div>

      {/* Compact search */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-full z-20 border-b border-[#253244] bg-[#151e2b] p-3 shadow-lg md:hidden">
          <div className="flex items-center gap-2 rounded-lg border border-[#253244] bg-[#0b1220] px-3 py-2">
            <Search size={18} className="text-[#94a3b8]" />
            <input
              type="search"
              placeholder="Search GarageIQ..."
              aria-label="Search GarageIQ"
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#64748b]"
            />
          </div>
        </div>
      )}
    </header>
  )
}

export default Topbar
