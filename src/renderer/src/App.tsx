import Sidebar from './Components/Layout/Sidebar'

function App(): React.JSX.Element {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1220] text-[#f1f5f9]">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold">GarageIQ</h1>

        <p className="mt-3 text-[#94a3b8]">Vehicle Maintenance Management</p>
      </main>
    </div>
  )
}

export default App
