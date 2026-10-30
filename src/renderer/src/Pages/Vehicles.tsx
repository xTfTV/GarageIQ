import { CarFront } from 'lucide-react'

function Vehicles(): React.JSX.Element {
  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-[#f1f5f9]">My Vehicles</h1>
        <p className="mt-2 text-[#94a3b8]">Manage and view the vehicles in your garage</p>
      </div>

      {/* Empty Garage State */}
      <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-[#253244] bg-[#151e2b] p-8 text-center">
        <CarFront size={42} className="text-[#14b8a6]" />
        <h2 className="mt-4 text-xl font-semibold text-[#f1f5f9]">No vehicles registered</h2>
        <p className="mt-2 max-w-md text-sm text-[#94a3b8]">
          Your registered vehicles will appear here once they are added to GarageIQ
        </p>
      </section>
    </div>
  )
}

export default Vehicles
