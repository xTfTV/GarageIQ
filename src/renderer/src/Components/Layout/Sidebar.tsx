import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CarFront,
  Wrench,
  CalendarClock,
  ChartNoAxesColumn,
  Settings,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
  onClose: () => void
}

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard
  },
  {
    label: 'Vehicles',
    path: '/vehicles',
    icon: CarFront
  },
  {
    label: 'Maintenance',
    path: '/maintenance',
    icon: Wrench
  },
  {
    label: 'Reminder',
    path: '/reminder',
    icon: CalendarClock
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: ChartNoAxesColumn
  }
]

function Sidebar({ collapsed, onToggle, onClose }: SidebarProps): React.JSX.Element {
  const [isSmallWindow, setIsSmallWindow] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')

    const handleChange = (event: MediaQueryListEvent): void => {
      setIsSmallWindow(event.matches)
    }

    media.addEventListener('change', handleChange)

    return () => {
      media.removeEventListener('change', handleChange)
    }
  }, [])

  const showOverlay = isSmallWindow && !collapsed

  const handleNavigation = (): void => {
    if (isSmallWindow && !collapsed) {
      onClose()
    }
  }

  return (
    <>
      {/* Small-window overlay */}
      {showOverlay && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60"
        />
      )}

      <aside
        className={`flex h-full shrink-0 flex-col border-r border-[#253244] bg-[#151e2b] transition-[width] duration-200 ${
          collapsed ? 'w-18' : 'w-64'
        } ${showOverlay ? 'fixed inset-y-0 left-0 z-40 shadow-2xl' : 'relative'}`}
      >
        {/* GarageIQ branding */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#253244] px-4">
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-2">
              <CarFront size={25} className="shrink-0 text-[#14b8a6]" />

              <span className="truncate text-xl font-bold">GarageIQ</span>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="rounded-lg p-2 text-[#94a3b8] transition-colors hover:bg-[#1e293b] hover:text-white"
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        {/* Application navigation */}
        <nav aria-label="Main navigation" className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {!collapsed && <p className="mb-3 px-3 text-xs font-semibold text-[#94a3b8]">MAIN</p>}

          {navigationItems.map((item, index) => {
            const Icon = item.icon

            // Temporary active styling.
            // Dynamic highlighting belongs to Issue #9.
            const isActive = index === 0

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                className={`flex w-full items-center rounded-lg py-3 transition-colors ${
                  collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                } ${
                  isActive
                    ? 'bg-[#203a40] font-medium text-[#14b8a6]'
                    : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
                }`}
              >
                <Icon size={19} className="shrink-0" />

                {!collapsed && <span className="truncate text-sm">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Settings navigation */}
        <div className="shrink-0 border-t border-[#253244] p-3">
          <NavLink
            to="/settings"
            onClick={handleNavigation}
            title={collapsed ? 'Settings' : undefined}
            aria-label="Settings"
            className={`flex w-full items-center rounded-lg py-3 text-[#94a3b8] transition-colors hover:bg-[#1e293b] hover:text-white ${
              collapsed ? 'justify-center px-2' : 'gap-3 px-3'
            }`}
          >
            <Settings size={19} className="shrink-0" />

            {!collapsed && <span className="truncate text-sm">Settings</span>}
          </NavLink>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
