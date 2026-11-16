import { useEffect, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import './DatePicker.css'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  maxDate?: Date
  minDate?: Date
  placeholder?: string
  id?: string
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }

  return date
}

function DatePicker({
  value,
  onChange,
  maxDate,
  minDate = new Date(1900, 0, 1),
  placeholder = 'Select a date',
  id
}: DatePickerProps): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = parseDate(value)
  const latestDate = maxDate ?? new Date()

  const [month, setMonth] = useState<Date>(
    selected ?? new Date(latestDate.getFullYear() - 20, latestDate.getMonth(), 1)
  )

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function handleToggle(): void {
    if (!open) {
      setMonth(selected ?? new Date(latestDate.getFullYear() - 20, latestDate.getMonth(), 1))
    }

    setOpen((previous) => !previous)
  }

  function handleSelect(date: Date | undefined): void {
    if (!date) return

    onChange(formatDate(date))
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        aria-label="Choose date of birth"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#253244] bg-[#0b1220] px-4 py-3 text-left text-sm text-white outline-none transition hover:border-[#14b8a6] focus-visible:border-[#14b8a6] focus-visible:ring-2 focus-visible:ring-[#14b8a6]/20"
      >
        <span className={selected ? 'text-white' : 'text-[#64748b]'}>
          {selected
            ? selected.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              })
            : placeholder}
        </span>

        <CalendarDays size={19} className="shrink-0 text-[#14b8a6]" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose date of birth"
          className="garageiq-calendar absolute top-full left-0 z-50 mt-2 rounded-2xl border border-[#253244] bg-[#151e2b] p-4 shadow-2xl"
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            captionLayout="dropdown"
            navLayout="after"
            startMonth={minDate}
            endMonth={latestDate}
            disabled={[{ before: minDate }, { after: latestDate }]}
            reverseYears
            showOutsideDays={false}
          />

          <div className="mt-3 flex items-center justify-between border-t border-[#253244] pt-3">
            <span className="text-xs text-[#94a3b8]">
              {selected
                ? `Selected: ${selected.toLocaleDateString('en-US')}`
                : `Choose your birth date`}
            </span>

            {selected && (
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setOpen(false)
                }}
                className="cursor-pointer text-xs font-medium text-[#14b8a6] hover:text-[#2dd4bf]"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
