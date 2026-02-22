import { LoaderCircle, type LucideIcon } from 'lucide-react'
import { useMemo, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { renderIcon } from '../utilities/renderIcon'

type ButtonProps = {
  messageId?: string
  messageText?: string
  leftIcon?: LucideIcon | ReactElement
  rightIcon?: LucideIcon | ReactElement
  loading?: boolean
  disabled?: boolean
  size?: 'cta' | 'primary' | 'secondary' | 'compact'
  iconOnly?: boolean
  iconSize?: 'small' | 'medium' | 'large'
  iconClassName?: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline'
  className?: string
  onClick?: () => void
  active?: boolean
  type?: 'button' | 'submit'
  fullWidth?: boolean
  children?: React.ReactNode
}

const SIZE_MAP = {
  cta: 'text-medium px-6 py-4.25 min-h-17 min-w-17 gap-2.25',
  primary: 'text-normal px-3.75 py-1.75 min-h-11 min-w-11',
  secondary: 'text-base min-h-11 min-w-11 px-2.75 py-1.25',
  compact: 'text-base min-h-9 min-w-9 px-3 py-1.5',
}

const VARIANT_MAP = {
  primary:
    'hover:dark:bg-neutral-700 shadow-md shadow-black/12 dark:shadow-black/18',
  secondary:
    'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-200 hover:dark:bg-neutral-600 shadow-sm shadow-black/10 dark:shadow-black/20',
  tertiary:
    'bg-transparent dark:bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 shadow-none',
  outline:
    'bg-transparent dark:bg-transparent border border-neutral-200 dark:border-neutral-900 font-normal hover:bg-neutral-300 dark:hover:bg-neutral-800',
}

const Button = ({
  messageId = '',
  messageText,
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  size = 'primary',
  iconOnly = false,
  iconSize = 'medium',
  iconClassName = '',
  variant = 'primary',
  className = '',
  onClick,
  active = false,
  type = 'button',
  fullWidth = true,
  children,
}: ButtonProps) => {
  const { t } = useTranslation()

  const classes = useMemo(() => {
    const base =
      'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 hover:dark:bg-neutral-700 active:scale-[0.98] cursor-pointer text-neutral-800 dark:text-neutral-100 flex items-center justify-center font-medium rounded-lg transition-all duration-150 disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none'

    const sizeClass = SIZE_MAP[size]
    const variantClass = VARIANT_MAP[variant]

    const iconOnlyClass = iconOnly ? 'w-9.25 h-9.25 p-0 rounded-xl gap-0' : ''
    const activeClass =
      variant === 'outline' && active
        ? 'border-blue-400 dark:border-blue-500 bg-neutral-200 dark:bg-neutral-900'
        : ''

    const loadingClass = loading
      ? 'cursor-wait opacity-60 pointer-events-none'
      : ''
    const widthClass = fullWidth ? 'w-full' : 'w-max'

    return twMerge(
      base,
      sizeClass,
      variantClass,
      iconOnlyClass,
      activeClass,
      loadingClass,
      widthClass,
      className,
    )
  }, [size, variant, iconOnly, loading, fullWidth, active, className])

  const label = messageText || (messageId ? t(messageId) : null)

  return (
    <button
      disabled={disabled}
      className={classes}
      type={type}
      onClick={onClick}
    >
      {loading ? (
        <LoaderCircle className="animate-spin w-5 h-5 text-neutral-500" />
      ) : (
        <>
          {leftIcon &&
            renderIcon(
              leftIcon,
              'left',
              iconSize,
              iconClassName,
              iconOnly,
              size,
            )}

          {!iconOnly && (
            <span
              className={
                children ? 'flex justify-between items-center w-full' : ''
              }
            >
              {label}
              {children}
            </span>
          )}

          {rightIcon &&
            renderIcon(
              rightIcon,
              'right',
              iconSize,
              iconClassName,
              iconOnly,
              size,
            )}
        </>
      )}
    </button>
  )
}

export default Button
