import { useTranslation } from 'react-i18next'
import { languages } from '../locales/i18n.ts'

type LocaleSelectorProps = {
  className?: string
}

export default function LocaleSelector(props: LocaleSelectorProps) {
  const { i18n } = useTranslation()
  const { className } = props
  console.log(i18n.languages)

  return (
    <div
      className={`text-gray-500 font-semibold dark:text-neutral-500 text-sm ${className || ''}`}
    >
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="cursor-pointer px-3 py-2.25 hover:bg-neutral-200 rounded-md dark:hover:bg-neutral-900 transition-colors duration-200"
      >
        {/* SHOW SUPPORTED LANGUAGES */}
        {languages.map((lng: string) => (
          <option key={lng} value={lng}>
            {lng.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}
