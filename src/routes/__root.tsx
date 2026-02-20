import { createRootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ConnectionContext,
  DeveloperContext,
  DeviceContext,
  LoadingContext,
  type DeviceContextType,
  type ConnectionContextType,
} from '../context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { resolveValue, Toaster } from 'react-hot-toast'
import { Transition, TransitionChild } from '@headlessui/react'
import { CheckCircle, XCircle, Info, Loader2 } from 'lucide-react'
import AppShell from '../components/AppShell'

function Root() {
  const [loading, setLoading] = useState(false)
  const [connection, setConnection] = useState<ConnectionContextType>({
    connected: false,
    ssid: null,
    ip: null,
    isConnecting: false,
  })
  const [device, setDevice] = useState<DeviceContextType>({
    id: undefined,
    firmware: undefined,
    uptime: undefined,
  })
  const [isDeveloperMode, setDeveloperMode] = useState(false)
  const [queryClient] = useState(() => new QueryClient())

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DeveloperContext.Provider
          value={{ isDeveloperMode, setDeveloperMode }}
        >
          <DeviceContext.Provider value={{ device, setDevice }}>
            <ConnectionContext.Provider value={{ connection, setConnection }}>
              <LoadingContext.Provider value={{ loading, setLoading }}>
                <AppShell>
                  <Outlet />
                </AppShell>
              </LoadingContext.Provider>
            </ConnectionContext.Provider>
          </DeviceContext.Provider>
        </DeveloperContext.Provider>
      </QueryClientProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      >
        {(t) => (
          <Transition appear show={t.visible}>
            <TransitionChild
              as="div"
              className="transform p-4 flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700"
              enter="transition-all duration-300"
              enterFrom="opacity-0 translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="transition-all duration-200"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-full"
            >
              {t.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              )}
              {t.type === 'error' && (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
              {t.type === 'loading' && (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
              )}
              {t.type === 'blank' && (
                <Info className="w-5 h-5 text-neutral-500 shrink-0" />
              )}
              {t.icon && <span className="shrink-0">{t.icon}</span>}
              <p className="text-sm text-neutral-800 dark:text-neutral-100">
                {resolveValue(t.message, t)}
              </p>
            </TransitionChild>
          </Transition>
        )}
      </Toaster>
    </>
  )
}

export const Route = createRootRoute({
  component: Root,
})
