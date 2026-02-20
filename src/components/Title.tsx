import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

type TitleProps = {
  messageId: string
  level?: 'h1' | 'h2' | 'h3'
  className?: string
}

export default function Title(props: TitleProps) {
  const { messageId, level = 'h1', className = '' } = props
  const { t } = useTranslation()
  return level === 'h1' ? (
    <h1
      className={twMerge(
        'lg:leading-6 text-xl lg:text-2xl font-semibold text-neutral-800 dark:text-neutral-100',
        className,
      )}
    >
      {t(messageId)}
    </h1>
  ) : level === 'h2' ? (
    <h2
      className={twMerge(
        'lg:leading-6 text-lg lg:text-xl font-semibold text-neutral-800 dark:text-neutral-100',
        className,
      )}
    >
      {t(messageId)}
    </h2>
  ) : (
    <h3
      className={twMerge(
        'lg:leading-6 text-base lg:text-lg font-semibold text-neutral-800 dark:text-neutral-100',
        className,
      )}
    >
      {t(messageId)}
    </h3>
  )
}
