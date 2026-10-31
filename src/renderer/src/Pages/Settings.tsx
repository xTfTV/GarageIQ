import { UserRound, SlidersHorizontal, DatabaseBackup, Info } from 'lucide-react'

function Setting(): React.JSX.Element {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-[#94a3b8] sm:text-base">
          Manage your GarageIQ prefrences and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Profile Settings */}
        <section className="rounded-xl border border-[#253244] bg-[#151e2b] p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <UserRound size={22} className="text-[#14b8a6]" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="settings-name" className="mb-2 block text-sm text-[#94a3b8]">
                Display name
              </label>
              <input
                id="settings-name"
                type="text"
                disabled
                placeholder="Not Configured"
                className="w-full cursor-not-allowed rounded-lg border border-[#253244] bg-[#0b1220] px-4 py-3 text-sm text-[#94a3b8]"
              />
            </div>

            <div>
              <label htmlFor="settings-email" className="mb-2 block text-sm text-[#94a3b8]">
                Email Address
              </label>
              <input
                id="settings-email"
                type="text"
                disabled
                placeholder="Not Configured"
                className="w-full cursor-not-allowed rounded-lg border border-[#253244] bg-[#0b1220] px-4 py-3 text-sm text-[#94a3b8]"
              />
            </div>
          </div>
        </section>

        {/* Application Preferences */}
        <section className="rounded-xl border border-[#253244] bg-[#151e2b] p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <SlidersHorizontal size={22} className="text-[#14b8a6]" />
            <h2 className="text-lg font-semibold">Application Preferences</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="settings-appearance" className="mb-2 block text-sm text-[#94a3b8]">
                Appearance
              </label>

              <select
                id="settings-select"
                disabled
                defaultValue="dark"
                className="w-full cursor-not-allowed rounded-lg border border-[#253244] bg-[#0b1220] px-4 py-3 text-sm text-[#f1f5f9]"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>

            <div>
              <label htmlFor="settings-distance" className="mb-2 block text-sm text-[#94a3b8]">
                Distance Unit
              </label>
              <select
                id="settings-distance"
                disabled
                defaultValue="miles"
                className="w-full cursor-not-allowed rounded-lg border border-[#253244] bg-[#0b1220] px-4 py-3 text-sm text-[#f1f5f9]"
              >
                <option value="miles">Miles (mi)</option>
                <option value="kilometers">Kilometers (km)</option>
              </select>
            </div>

            <div>
              <label htmlFor="settings-currency" className="mb-2 block text-sm text-[#94a3b8]">
                Currency
              </label>

              <select
                id="settings-currency"
                disabled
                defaultValue="miles"
                className="w-full cursor-not-allowed rounded-lg border border-[#253244] bg-[#0b1220] px-4 py-3 text-sm text-[#f1f5f9]"
              >
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* Data Management */}
      <section className="rounded-xl border border-[#253244] bg-[#151e2b] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <DatabaseBackup size={22} className="text-[#14b8a6]" />
          <h2 className="text-lg font-semibold">Data & Backup</h2>
        </div>

        <p className="mt-3 text-sm text-[#94a3b8]">
          Backup and restore your local GarageIQ database. This feature will be available in a
          future update
        </p>

        <button
          type="button"
          disabled
          className="mt-5 cursor-not-allowed rounded-lg border border-[#253244] bg-[#0b1220] px-4 py-2.5 text-sm text-[#94a3b8]"
        >
          Backup Database
        </button>
      </section>

      {/* Application information */}
      <section className="rounded-xl border border-[#253244] bg-[#151e2b] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Info size={22} className="text-[#14b8a6]" />
          <h2 className="text-lg font-semibold">About GarageIQ</h2>
        </div>

        <p className="mt-3 text-sm text-[#94a3b8]">
          GarageIQ is a cross-platform desktop application for managing vehicles, maintenance
          history, reminders, and vehicle ownership expenses.
        </p>

        <p className="mt-3 text-xs text-[#64748b]">
          Built with Electron, React, TypeScript & SQLite
        </p>

        <p className="mt-3 text-xs text-[#94a3b8]">Version: 0.0.1 BETA</p>
      </section>
    </div>
  )
}

export default Setting
