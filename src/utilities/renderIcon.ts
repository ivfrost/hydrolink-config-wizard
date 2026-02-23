import type { LucideIcon } from 'lucide-react'
import { createElement, type ReactElement, isValidElement } from 'react'
import { twMerge } from 'tailwind-merge'
import z from 'zod'

const IconPropSchema = z.object({
  icon: z.custom<LucideIcon | ReactElement>(),
  iconSize: z.enum(['small', 'medium', 'large', 'larger']).optional(),
  iconOnly: z.boolean(),
  extraIconClasses: z.string().optional(),
})

type IconProps = z.infer<typeof IconPropSchema>

const ICON_SIZE_MAP = {
  small: 'w-4 h-4',
  medium: 'w-4.5 h-4.5',
  large: 'w-7 h-7',
  larger: 'w-10 h-10',
}

const MODIFIER_MAP = {
  iconOnly: 'w-4.5 h-4.5',
}

export const renderIcon = (props: IconProps): ReactElement => {
  const { icon, iconSize, iconOnly, extraIconClasses } = props

  const sizeClass = ICON_SIZE_MAP[iconSize || 'medium']
  const modifierClass = iconOnly ? MODIFIER_MAP['iconOnly'] : ''
  const classes = twMerge('z-20', sizeClass, modifierClass, extraIconClasses)

  if (isValidElement(icon)) {
    return icon
  }

  return createElement(icon as LucideIcon, { className: classes })
}
