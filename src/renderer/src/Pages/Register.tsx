import { useState, type SubmitEvent } from 'react'
import { CarFront, UserPlus } from 'lucide-react'
import type { RegisterUserRequest } from '../../../shared/garageIQApi'

interface RegisterProps {
  onRegistered: () => void
}

const initialForm: RegisterUserRequest = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  dob: '',
  password: ''
}

const fields: {
  label: string
  name: keyof RegisterUserRequest
  type: string
  autocomplete: string
}[] = [
  {
    label: 'First Name',
    name: 'firstName',
    type: 'text',
    autocomplete: 'given-name'
  },
  {
    label: 'Last Name',
    name: 'lastName',
    type: 'text',
    autocomplete: 'family-name'
  },
  {
    label: 'Username',
    name: 'username',
    type: 'text',
    autocomplete: 'username'
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autocomplete: 'email'
  },
  {
    label: 'Date of Birth',
    name: 'dob',
    type: 'date',
    autocomplete: 'bday'
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autocomplete: 'new-password'
  }
]

function Register({ onRegistered }: RegisterProps): React.JSX.Element {
  const [form, setForm] = useState<RegisterUserRequest>(initialForm)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const now = new Date()
  const maxDob = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-')

  function updateField(field: keyof RegisterUserRequest, value: string): void {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }))
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError('')

    if (form.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 12) {
      setError('Password must contain at least 12 characters')
      return
    }

    setLoading(true)

    try {
      await window.garageIQ.users.register(form)
      onRegistered()
    } catch {
      setError('Registration failed. Please review your information.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1220] px-6 py-10 text-[#f1f5f9]">
      <div className="w-full max-w-3xl rounded-3xl border border-[#253244] bg-[#151e2b] p-8 shadow-2xl sm:p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-2xl bg-[#203a40] p-4 text-[#14b8a6]">
            <CarFront size={32} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to GarageIQ</h1>

            <p className="mt-1 text-base text-[#94a3b8]">Create your account to get started</p>
          </div>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className="block space-y-2">
                <span className="text-sm font-medium text-[#cbd5e1]">{field.label}</span>

                <input
                  type={field.type}
                  required
                  autoComplete={field.autocomplete}
                  max={field.name === 'dob' ? maxDob : undefined}
                  minLength={field.name === 'password' ? 12 : undefined}
                  value={form[field.name]}
                  onChange={(event) => updateField(field.name, event.target.value)}
                  className="w-full rounded-xl border border-[#253244] bg-[#0b1220] px-4 py-3 text-sm text-white outline-none transition focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]/20"
                />
              </label>
            ))}
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#cbd5e1]">Confirm Password</span>

            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-[#253244] bg-[#0b1220] px-4 py-3 text-sm text-white outline-none transition focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]/20"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-lg border border-red-900 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#14b8a6] px-5 py-3 font-semibold text-[#0b1220] transition-colors hover:bg-[#2dd4bf] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus size={19} />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Register
