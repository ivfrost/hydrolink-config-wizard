import { createContext, type Dispatch, type SetStateAction } from 'react'

export interface LoadingContextType {
  loading: boolean
  setLoading: (loading: boolean) => void
}

export interface ConnectionContextType {
  connected: boolean
  isConnecting: boolean
  ip?: string | null
  ssid?: string | null
}

export interface DeviceContextType {
  id?: string
  firmware?: string
  uptime?: string
}

export const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
})

export const ConnectionContext = createContext<{
  connection: ConnectionContextType
  setConnection: Dispatch<SetStateAction<ConnectionContextType>>
}>({
  connection: { connected: false, ssid: null, isConnecting: false, ip: null },
  setConnection: () => {},
})

export const DeveloperContext = createContext<{
  isDeveloperMode: boolean
  setDeveloperMode: (isDeveloperMode: boolean) => void
}>({
  isDeveloperMode: false,
  setDeveloperMode: () => {},
})

export const DeviceContext = createContext<{
  device: DeviceContextType
  setDevice: Dispatch<SetStateAction<DeviceContextType>>
}>({
  device: { id: '', firmware: '', uptime: '' },
  setDevice: () => {},
})
