import { useState, useRef } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { FloatingLabel, HelperText } from 'flowbite-react'

type InputProps = {
  inputId: string
  label: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number'
  disabled?: boolean
  className?: string
  requirements?: string
  autoComplete?: string
  minLength?: number
  error?: string
  success?: boolean
}

export default function Input(props: InputProps) {
  const {
    inputId,
    label,
    value,
    onChange = () => {},
    type = 'text',
    disabled = false,
    requirements,
    autoComplete,
    minLength,
    error,
    success = false,
  } = props

  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange('')
  }

  const handleToggleVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleParentFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      inputRef.current &&
      e.target === e.currentTarget &&
      !(
        e.relatedTarget && (e.relatedTarget as HTMLElement).tagName === 'BUTTON'
      )
    ) {
      inputRef.current.focus()
    }
  }

  const isPassword = type === 'password'
  const inputType = showPassword ? 'text' : type

  const getBorderColor = () => {
    if (error) return 'border-red-500 dark:border-red-400'
    if (success) return 'border-green-500 dark:border-green-400'
    return 'border-neutral-300 dark:border-neutral-700'
  }

  const getRingColor = () => {
    if (error) return 'focus-within:ring-red-500 dark:focus-within:ring-red-400'
    if (success)
      return 'focus-within:ring-green-500 dark:focus-within:ring-green-400'
    return 'focus-within:ring-blue-600 dark:focus-within:ring-blue-600'
  }

  return (
    <div>
      <div
        className={`gap-2.5 relative items-center rounded-lg border ${getBorderColor()} ${getRingColor()} group transition-all duration-200 focus-within:ring-2 focus-within:border-transparent focus-within:outline-none`}
        tabIndex={0}
        onFocus={handleParentFocus}
      >
        <FloatingLabel
          variant="outlined"
          value={value}
          name={inputId}
          type={inputType}
          minLength={minLength}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          sizing="md"
          className="inline-flex outline-0 border-0 bg-stone-50 dark:bg-stone-950 text-gray-700 dark:text-neutral-200 transition-all duration-200 focus:outline-none"
          label={label}
          ref={inputRef}
        />
        <span className="inline-flex me-2 gap-0.5 absolute right-0 top-1/2 -translate-y-1/2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="p-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all duration-150 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
              aria-label="Clear"
            >
              <X size={20} />
            </button>
          )}
          {isPassword && value && (
            <button
              type="button"
              onClick={handleToggleVisibility}
              disabled={disabled}
              className="p-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all duration-150 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </span>
        {error && (
          <HelperText color="failure" className="text-xs mt-1.5 ml-1">
            {error}
          </HelperText>
        )}
        {!error && requirements && (
          <HelperText className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 ml-1">
            {requirements}
          </HelperText>
        )}
      </div>
    </div>
  )
}
