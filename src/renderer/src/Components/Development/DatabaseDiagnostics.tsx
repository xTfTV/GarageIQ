import { useState } from 'react'

function DatabaseDiagnostics(): React.JSX.Element {
  const [userId, setUserId] = useState('1')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function runTests(): Promise<void> {
    setLoading(true)
    setResult('')

    try {
      const id = Number(userId)

      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error('Enter a valid UserId')
      }

      const health = await window.garageIQ.database.checkHealth()
      const serviceTypes = await window.garageIQ.serviceTypes.getAllActive()
      const vehicles = await window.garageIQ.vehicles.getByUserId(id)

      const summary = {
        databaseConnected: health.connected,
        schemaVersion: health.schemaVersion,
        foreignKeysEnabled: health.foreignKeyEnabled,
        activeServiceTypes: serviceTypes.length,
        vehiclesForUser: vehicles.length,
        vehicleNames: vehicles.map(
          (vehicle) => `${vehicle.VehicleYear} ${vehicle.Make} ${vehicle.Model}`
        )
      }
      console.log('[GarageIQ Diagnostics]', summary)
      setResult(JSON.stringify(summary, null, 2))
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Test failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-[#253244] bg-[#151e2b] p-5">
      <h3 className="mb-2 font-semibold text-white">Database Diagnostics (Development Only)</h3>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="diganostic-user-id" className="text-sm text-[#94a3b8]">
          Test UserId
        </label>
        <input
          id="diagnostic-user-id"
          type="number"
          min="1"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          className="w-24 rounded-lg border border-[#253244] bg-[#0b1220] p-2 text-white"
        />

        <button
          type="button"
          disabled={loading}
          onClick={() => void runTests()}
          className="rounded-lg bg-[#14b8a6] px-4 py-2 font-medium text-[#0b1220] disabled:opacity-50"
        >
          {loading ? 'Testing ...' : 'Run Database Tests'}
        </button>
      </div>

      {result && (
        <pre className="mt-4 overflow-auto rounded-lg bg-[#0b1220] p-4 text-sm text-[#94a3b8]">
          {result}
        </pre>
      )}
    </section>
  )
}

export default DatabaseDiagnostics
