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

const Button = (props: ButtonProps) => {
  const {
    messageId = '',
    messageText,
    leftIcon,
    rightIcon,
    loading = false,
    disabled = false,
    size = 'medium',
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
  } = props

  const classes = useMemo(() => {
    const baseClasses = twMerge(
      'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 hover:dark:bg-neutral-700 active:scale-[0.98] cursor-pointer text-neutral-800 group dark:text-neutral-100 flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none',
      size === 'cta'
        ? 'text-lg h-18 px-4.5 gap-2.5'
        : size === 'primary'
          ? 'text-normal h-14 px-4 gap-2.25'
          : size === 'compact'
            ? 'text-base h-11 px-3.25 gap-2'
            : 'text-base h-11 px-3.25 gap-2',
      loading ? 'cursor-wait pointer-events-none opacity-60' : '',
    )

    const variantClass =
      variant === 'primary'
        ? 'hover:dark:bg-neutral-700 shadow-md shadow-black/12 dark:shadow-black/18'
        : variant === 'secondary'
          ? 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 hover:dark:bg-neutral-600 shadow-sm shadow-black/10 dark:shadow-black/20'
          : variant === 'tertiary'
            ? 'bg-transparent dark:bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 shadow-none'
            : variant === 'outline'
              ? twMerge(
                  'bg-transparent dark:bg-transparent border border-neutral-200 dark:border-neutral-900 font-normal focus:ring-0 focus:dark:outline-none focus:dark:bg-neutral-800 focus:dark:ring-blue-500 justify-start hover:bg-neutral-300 dark:hover:bg-neutral-800',
                  active
                    ? 'border-blue-300 dark:border-blue-500 hover:text-black/70 dark:hover:text-white/70 bg-neutral-200 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-900'
                    : '',
                )
              : ''

    const iconOnlyClass = iconOnly
      ? 'w-9.25 h-9.25 gap-0 p-0 rounded-xl'
      : twMerge(
          leftIcon ? 'pr-4' : '',
          rightIcon ? 'pl-4' : '',
          fullWidth ? 'w-full' : 'w-auto',
        )

    return twMerge(baseClasses, variantClass, iconOnlyClass, className)
  }, [
    loading,
    iconOnly,
    variant,
    fullWidth,
    className,
    leftIcon,
    size,
    rightIcon,
    active,
  ])

  const { t } = useTranslation()

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
              size,
              iconOnly,
            )}
          <span
            className={
              children ? 'flex justify-between items-center w-full' : ''
            }
          >
            {(!iconOnly && !messageText && t(messageId)) || messageText}
            {children}
          </span>
          {rightIcon &&
            renderIcon(
              rightIcon,
              'right',
              iconSize,
              iconClassName,
              size,
              iconOnly,
            )}
        </>
      )}
    </button>
  )
}

export default Button
