import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

type AppLayoutProps = {
  children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)')

    const handleChange = (event: MediaQueryListEvent): void => {
      setCollapsed(event.matches)
    }

    media.addEventListener('change', handleChange)

    return () => {
      media.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleSidebar = (): void => {
    setCollapsed((previous) => !previous)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0b1220] text-[#f1f5f9]">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} onClose={() => setCollapsed(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1800px]">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
