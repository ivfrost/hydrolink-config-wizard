import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { CurrentNetworkType } from './types/api'

export interface LoadingContextType {
  loading: boolean
  setLoading: (loading: boolean) => void
}

export interface ConnectionContextType extends CurrentNetworkType {
  isConnecting: boolean
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
  connection: {
    connected: false,
    ssid: null,
    rssi: -999,
    mode: 'ap',
    isConnecting: false,
    ip: null,
  },
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
