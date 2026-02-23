'use client'
import { ActivityIcon, Braces, Radio } from 'lucide-react'
import { ConnectionContext, DeveloperContext, DeviceContext } from '../context'
import { useContext, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Tooltip } from 'react-tooltip'
import toast from 'react-hot-toast'
import { t } from 'i18next'
import useIsMobile from '../utilities/isMobile'
import { useQuery } from '@tanstack/react-query'
import {
  CurrentNetworkSchema,
  DeviceSchema,
  type CurrentNetworkType,
  type DeviceType,
} from '../types/api'

export default function StatusBar() {
  const navigate = useNavigate()
  const { connection, setConnection } = useContext(ConnectionContext)
  const { isDeveloperMode, setDeveloperMode } = useContext(DeveloperContext)
  const [count, setCount] = useState(0)
  const isConnecting = connection.isConnecting
  const { isMobile } = useIsMobile()
  const { device, setDevice } = useContext(DeviceContext)

  useQuery({
    queryKey: ['device'],
    queryFn: async (): Promise<DeviceType> => {
      const response = await fetch('/api/device')
      if (!response.ok) {
        throw new Error('Failed to fetch device info')
      }
      const deviceData = await response.json()
      const parsedDevice = DeviceSchema.parse(deviceData)
      setDevice(parsedDevice)
      return parsedDevice
    },
    refetchInterval: 30000,
  })

  useQuery({
    queryKey: ['currentNetwork'],
    queryFn: async (): Promise<CurrentNetworkType> => {
      const response = await fetch('/api/network')
      if (!response.ok) {
        setConnection((prev) => ({
          ...prev,
          connected: false,
          mode: 'ap',
          ssid: null,
          rssi: -999,
          ip: null,
          isConnecting: false,
        }))
        throw new Error('Failed to fetch current network info')
      }
      const networkData = await response.json()
      const parsedNetwork = CurrentNetworkSchema.parse(networkData)
      setConnection({
        connected: parsedNetwork.connected,
        mode: parsedNetwork.mode,
        ssid: parsedNetwork.ssid,
        rssi: parsedNetwork.rssi,
        ip: parsedNetwork.ip,
        isConnecting: false,
      })
      return parsedNetwork
    },
    refetchInterval: 10000,
  })

  const handleDevModeDisplay = () => {
    const nextCount = count + 1

    if (nextCount < 5) {
      setCount(nextCount)
      return
    }

    setCount(0)
    const nextMode = !isDeveloperMode
    setDeveloperMode(nextMode)

    toast.success(
      nextMode ? t('developer_mode_enabled') : t('developer_mode_disabled'),
    )

    if (!nextMode) {
      navigate({ to: '/' })
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full px-2.25 py-3 lg:px-6 lg:py-4 z-50">
      <div className="w-full flex flex-wrap items-center gap-2 lg:gap-3">
        <button
          type="button"
          aria-label="Open network settings"
          data-tooltip-id="status-tooltip"
          data-tooltip-content={
            connection.connected && connection.ip
              ? `${t('connected')} ${connection.ip}`
              : t('network_status_tooltip')
          }
          className="group flex text-neutral-600 dark:text-neutral-200 text-sm bg-neutral-200 dark:bg-stone-800 outline-1 outline-neutral-200 dark:outline-neutral-700 rounded-2xl px-2.75 lg:px-4 pr-4 py-1.5 lg:py-2 max-w-max shadow-md shadow-black/10 dark:shadow-black/20 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          onClick={() => navigate({ to: '/connect' })}
        >
          <div
            className={`flex items-center gap-2 ${isConnecting ? 'animate-pulse' : ''}`}
          >
            <Radio
              className={`w-4 h-4 ${connection.connected ? 'text-green-500 dark:text-green-400/80' : 'text-neutral-400'} transition-colors duration-300`}
            />
            <span className="ml-1 font-medium transition-all duration-300">
              {connection.connected ? connection.ssid : t('not_connected')}
            </span>
          </div>
        </button>
        <div
          id="uptime"
          data-tooltip-id="status-tooltip"
          data-tooltip-content={t('uptime')}
          className="flex text-neutral-600 dark:text-white text-sm items-center bg-neutral-200 dark:bg-stone-800 outline-1 outline-neutral-200 dark:outline-neutral-700 rounded-2xl px-2.75 lg:px-4 pr-4 py-1.5 lg:py-2 max-w-max shadow-md shadow-black/10 dark:shadow-black/20 transition-all duration-200"
        >
          <ActivityIcon className="w-4 h-4 text-sky-500 dark:text-sky-400/80" />
          <span className="ml-2 text-sm font-medium tabular-nums">
            {device.uptime ?? t('not_available')}
          </span>
        </div>
        <Tooltip
          id="status-tooltip"
          place="bottom"
          delayShow={500}
          className="rounded-lg! text-xs! shadow-xl!"
        />
        {isDeveloperMode && (
          <button
            type="button"
            aria-label="Open developer menu"
            data-tooltip-id="status-tooltip"
            data-tooltip-content="Open developer menu"
            className="group flex text-neutral-600 dark:text-neutral-200 text-sm bg-neutral-200 dark:bg-stone-800 outline-1 outline-neutral-200 dark:outline-neutral-700 rounded-2xl px-2.75 lg:px-4 pr-4 py-1.5 lg:py-2 shadow-md shadow-black/10 dark:shadow-black/20 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            onClick={() => navigate({ to: '/dev' })}
          >
            <div className="flex items-center gap-2">
              <Braces className="w-4 h-4" />
              <span className="ml-1 font-medium">
                {!isMobile ? t('developer_mode') : 'Dev'}
              </span>
            </div>
          </button>
        )}

        <div className="ml-auto hidden sm:flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 px-1 py-0.5">
          <button
            onClick={handleDevModeDisplay}
            className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200 px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title={`Click ${5 - count} time${count != 4 ? 's' : ''} to ${!isDeveloperMode ? 'enable' : 'disable'} developer mode`}
          >
            <span>v{device.firmware ?? t('unknown_firmware')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
