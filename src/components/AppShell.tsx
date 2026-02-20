import NavigationControl from './NavigationControls'
import StatusBar from './StatusBar'
import LocaleSelector from './LocaleSelector'
import { useLocation } from '@tanstack/react-router'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen flex flex-col items-center justify-center">
      <StatusBar />
      <div
        className={
          location.pathname === '/dev'
            ? 'w-full max-w-2xl space-y-1 lg:space-y-2'
            : 'w-full max-w-md lg:max-w-lg lg:min-w-lg px-3.25 py-3.25 pt-16 lg:px-6 lg:py-4 pb-32 space-y-1 lg:space-y-2'
        }
      >
        <NavigationControl />
        <div
          className={
            location.pathname === '/dev'
              ? 'space-y-2.75 lg:space-y-6 w-full overflow-hidden items-stretch relative rounded-lg outline-1 outline-neutral-200 dark:outline-neutral-700 shadow-2xl/10 bg-white dark:bg-stone-950'
              : 'space-y-2.75 lg:space-y-6 w-full lg:min-w-md p-6 overflow-hidden items-stretch relative rounded-lg outline-1 outline-neutral-200 dark:outline-neutral-700 shadow-2xl/10 bg-white dark:bg-stone-950'
          }
        >
          {children}
        </div>
      </div>
      <footer className="absolute bottom-0 w-full py-4 px-6 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-neutral-500">
          &copy; {new Date().getFullYear()} Hydrolink
        </span>
        <LocaleSelector />
      </footer>
    </div>
  )
}
