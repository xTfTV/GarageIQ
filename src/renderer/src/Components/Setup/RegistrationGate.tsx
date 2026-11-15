import { useEffect, useState, type ReactNode } from 'react'
import Register from '../../Pages/Register'

interface RegisterGateProps {
  children: ReactNode
}

function RegistrationGate({ children }: RegisterGateProps): React.JSX.Element {
  const [hasAccount, setHasAccount] = useState<boolean | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    window.garageIQ.users
      .hasLocalAccount()
      .then((exists) => {
        if (active) setHasAccount(exists)
      })
      .catch(() => {
        if (active) setError(true)
      })

    return () => {
      active = false
    }
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1220] text-red-400">
        Unable to load account information
      </div>
    )
  }

  if (hasAccount === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1220] text-[#94a3b8]">
        Loading GarageIQ...
      </div>
    )
  }

  if (import.meta.env.DEV || !hasAccount) {
    return <Register onRegistered={() => setHasAccount(true)} />
  }

  return <>{children}</>
}

export default RegistrationGate
