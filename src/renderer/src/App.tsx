import Sidebar from './Components/Layout/Sidebar'
import Topbar from './Components/Layout/Topbar'
import Dashboard from './Pages/Dashboard'

function App(): React.JSX.Element {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1220] text-[#f1f5f9]">
      {/* Left sidebar */}
      <Sidebar />

      {/* Main application area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navigation */}
        <Topbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
