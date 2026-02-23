import { t } from 'i18next'
import z from 'zod'
import { LoaderCircle, type LucideIcon } from 'lucide-react'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { renderIcon } from '../utilities/renderIcon'

const ButtonPropsSchema = z.object({
  message: z.string().optional(),
  icon: z.custom<LucideIcon>().optional(),
  iconSize: z.enum(['small', 'medium', 'large', 'larger']).optional(),
  iconPosition: z.enum(['left', 'right']).optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
  variant: z.enum(['primary', 'secondary', 'tertiary', 'outline']),
  // make this take either array or single value of the modifier keys in the MODIFIER_MAP
  modifier: z
    .enum([
      'danger',
      'action',
      'round',
      'slideLeft',
      'tall',
      'taller',
      'tallest',
      'adaptiveBg',
    ])
    .optional()
    .or(
      z.array(
        z.enum([
          'danger',
          'action',
          'round',
          'slideLeft',
          'tall',
          'taller',
          'tallest',
          'adaptiveBg',
        ]),
      ),
    ),
  onClick: z.function().optional(),
  type: z.enum(['button', 'submit']).optional(),
  fullWidth: z.boolean().optional(),
  extraClasses: z.string().optional(),
  extraIconClasses: z.string().optional(),
  children: z.custom<React.ReactNode>().optional(),
})

type ButtonProps = z.infer<typeof ButtonPropsSchema>

export default function Button(props: ButtonProps) {
  const {
    message,
    icon,
    iconSize = 'medium',
    iconPosition = 'left',
    loading = false,
    disabled = false,
    variant = 'primary',
    modifier,
    onClick,
    type = 'button',
    fullWidth = false,
    extraClasses = '',
    extraIconClasses = '',
    children,
  } = props

  const hasLabel = !!message || !!children
  const content = message ? t(message) : children
  const iconOnly = !!icon && !hasLabel

  const BASE_CLASSES =
    'relative overflow-visible px-3.5 h-11 min-w-11 cursor-pointer group text-neutral-800 dark:text-neutral-100 \
    bg-neutral-200 dark:bg-neutral-800 rounded-lg font-medium transition-all duration-200 \
    hover:bg-neutral-300 hover:dark:bg-neutral-700 active:scale-[0.98] \
    disabled:pointer-events-none disabled:opacity-60 flex items-center justify-start \
    shadow-md shadow-black/12 dark:shadow-black/18 focus:ring-2 focus:ring-blue-500 \
    focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 \
    dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none \
    active:scale-[0.98] font-medium gap-1.5'

  const VARIANT_MAP = {
    primary:
      'hover:bg-neutral-300 hover:dark:bg-neutral-700 shadow-md \
      shadow-black/12 dark:shadow-black/18',
    secondary:
      'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-200 \
      hover:dark:bg-neutral-600 shadow-sm shadow-black/10 dark:shadow-black/20',
    tertiary:
      'bg-transparent dark:bg-transparent border border-none shadow:none dark:shadow:none \
      dark:border-neutral-900 font-normal hover:bg-neutral-300 dark:hover:bg-neutral-800',
    outline:
      'bg-transparent dark:bg-transparent border border-neutral-200 \
      dark:border-neutral-900 font-normal hover:bg-neutral-300 dark:hover:bg-neutral-800',
  }

  const MODIFIER_MAP = {
    danger:
      'hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white ring-red-300 focus:ring-red-300',
    action:
      'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600 ring-blue-300 focus:ring-blue-300',
    round: 'rounded-full',
    slideLeft: 'hover:-translate-x-1 transition-transform duration-200',
    iconOnly: 'w-9 px-0 h-9 min-w-9 rounded-xl justify-center',
    tall: 'h-12 gap-1.75',
    taller: 'h-13 gap-2',
    tallest: 'h-16 gap-2.25 ',
    adaptiveBg:
      'bg-neutral-500/30 dark:bg-neutral-500/20 hover:bg-neutral-500/50 hover:dark:bg-neutral-500/40',
  }

  const classes = useMemo(() => {
    return twMerge(
      BASE_CLASSES,
      VARIANT_MAP[variant],
      modifier
        ? Array.isArray(modifier)
          ? modifier.map((m) => MODIFIER_MAP[m]).join(' ')
          : MODIFIER_MAP[modifier]
        : '',
      iconOnly ? MODIFIER_MAP['iconOnly'] : '',
      fullWidth ? 'w-full' : '',
      disabled ? 'cursor-not-allowed' : '',
      loading ? 'pointer-events-none' : '',
    )
  }, [variant, fullWidth, loading, iconOnly, modifier, disabled])

  return (
    <button
      type={type}
      className={classes + ' ' + extraClasses}
      onClick={onClick}
      disabled={disabled}
    >
      <>
        {icon &&
          iconPosition === 'left' &&
          !loading &&
          renderIcon({ icon, iconSize, iconOnly, extraIconClasses })}

        {loading && (
          <LoaderCircle
            className={`animate-spin text-neutral-500 dark:text-neutral-400 ${
              iconSize === 'small'
                ? 'w-4 h-4'
                : iconSize === 'large'
                  ? 'w-7 h-7'
                  : iconSize === 'larger'
                    ? 'w-10 h-10'
                    : 'w-4.5 h-4.5'
            } ${iconOnly ? 'w-4.5 h-4.5' : ''} ${extraIconClasses}`}
          />
        )}

        {!iconOnly && (
          <span
            className={
              children ? 'flex justify-between items-center w-full' : ''
            }
          >
            {content}
          </span>
        )}

        {icon &&
          iconPosition === 'right' &&
          !loading &&
          renderIcon({ icon, iconSize, iconOnly, extraIconClasses })}
      </>
    </button>
  )
}
