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
  const base = 'text-neutral-800 dark:text-neutral-100'
  const levelMap: Record<string, string> = {
    h1: 'lg:leading-6 text-xl lg:text-2xl font-semibold',
    h2: 'lg:leading-6 text-lg lg:text-xl font-semibold',
    h3: 'lg:leading-6 text-base lg:text-lg font-semibold',
  }

  const classes = twMerge(levelMap[level] ?? levelMap.h1, base, className)

  return level === 'h1' ? (
    <h1 className={classes}>{t(messageId)}</h1>
  ) : level === 'h2' ? (
    <h2 className={classes}>{t(messageId)}</h2>
  ) : (
    <h3 className={classes}>{t(messageId)}</h3>
  )
}
