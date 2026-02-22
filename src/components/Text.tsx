import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

type TextProps = {
  messageId?: string
  messageText?: string
  className?: string
  variant?: 'default' | 'tip' | 'link'
}

export default function Text(props: TextProps) {
  const { messageId, messageText, className = '', variant } = props
  const { t } = useTranslation()
  const variantMap: Record<string, string> = {
    default:
      'text-neutral-600 dark:text-neutral-300/85 text-sm lg:text-base lg:leading-5.75 font-normal',
    tip: 'text-neutral-500 dark:text-neutral-500/90 text-xs lg:text-sm',
    link: 'text-blue-600 dark:text-blue-500 text-sm lg:text-sm font-medium underline',
  }

  return (
    <p className={twMerge(variantMap[variant ?? 'default'], className)}>
      {messageId ? t(messageId) : messageText}
    </p>
  )
}
