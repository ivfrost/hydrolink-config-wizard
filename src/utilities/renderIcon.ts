import type { LucideIcon } from 'lucide-react'
import { createElement, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

export const renderIcon = (
  Icon: LucideIcon | ReactElement,
  position: 'left' | 'right',
  iconSize: 'small' | 'medium' | 'large',
  iconClassName: string,
  size: 'small' | 'medium' | 'large',
  iconOnly: boolean,
): ReactElement | null => {
  if (!Icon) return null

  const iconClasses = twMerge(
    !iconOnly && position === 'left' && !iconOnly ? 'mr-1' : '',
    !iconOnly && position === 'right' && !iconOnly ? 'ml-1' : '',
    !iconSize && size === 'small' ? 'w-4 h-4' : '',
    !iconSize && size === 'medium' ? 'w-5 h-5' : '',
    !iconSize && size === 'large' ? 'w-6 h-6' : '',
    iconSize === 'small' ? 'w-4 h-4' : '',
    iconSize === 'medium' ? 'w-5 h-5' : '',
    iconSize === 'large' ? 'w-6 h-6' : '',
    iconClassName,
  )

  // Check if it's already a React element
  if (typeof Icon === 'object' && 'type' in Icon) {
    return Icon
  }

  // Otherwise it's a LucideIcon component that needs to be rendered
  const IconComponent = Icon as LucideIcon
  return createElement(IconComponent, { className: iconClasses })
}
