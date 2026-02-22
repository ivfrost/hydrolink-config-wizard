import type { LucideIcon } from 'lucide-react'
import { createElement, type ReactElement, isValidElement } from 'react'
import { twMerge } from 'tailwind-merge'

const ICON_SIZE_MAP = {
  small: 'w-4.25 h-4.25',
  medium: 'w-5.75 h-5.75',
  large: 'w-8.25 h-8.25',
}

const BUTTON_SIZE_FALLBACK = {
  compact: 'w-3 h-3',
  primary: 'w-5 h-5',
  cta: 'w-6 h-6',
  secondary: 'w-4.5 h-4.5',
}

export const renderIcon = (
  Icon: LucideIcon | ReactElement,
  position: 'left' | 'right',
  iconSize: 'small' | 'medium' | 'large',
  iconClassName: string,
  iconOnly: boolean,
  size?: 'cta' | 'primary' | 'secondary' | 'compact',
): ReactElement | null => {
  if (!Icon) return null

  const spacing =
    !iconOnly && position === 'left'
      ? 'mr-1.75'
      : !iconOnly && position === 'right'
        ? 'ml-1.75'
        : ''

  const sizeClass =
    ICON_SIZE_MAP[iconSize] ||
    (size ? BUTTON_SIZE_FALLBACK[size] : ICON_SIZE_MAP.medium)

  const classes = twMerge('z-10', spacing, sizeClass, iconClassName)

  if (isValidElement(Icon)) {
    return Icon
  }

  return createElement(Icon as LucideIcon, { className: classes })
}
