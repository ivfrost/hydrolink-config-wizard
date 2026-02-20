import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

type TextProps = {
  messageId?: string
  messageText?: string
  className?: string
  variant?: 'default' | 'tip'
}

export default function Text(props: TextProps) {
  const { messageId, messageText, className = '', variant } = props
  const { t } = useTranslation()

  return (
    <p
      className={twMerge(
        'text-neutral-600 dark:text-neutral-400 text-sm lg:text-base lg:leading-6',
        variant === 'tip' &&
          'text-neutral-500 dark:text-neutral-500 text-xs lg:text-sm',
        className,
      )}
    >
      {messageId ? t(messageId) : messageText}
    </p>
  )
}
