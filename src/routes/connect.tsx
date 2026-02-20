import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Text from '../components/Text'
import Title from '../components/Title'
import Button from '../components/Button'
import {
  CloudOff,
  Radio,
  RefreshCcw,
  WifiHigh,
  WifiLow,
  WifiZero,
} from 'lucide-react'
import { useContext, useState, type SubmitEventHandler } from 'react'
import { ConnectionContext } from '../context'
import { useQuery, useMutation } from '@tanstack/react-query'
import { t } from 'i18next'
import Input from '../components/Input'
import {
  AvailableNetworkSchema,
  NetworkConnectResponseSchema,
  NetworkDisconnectResponseSchema,
  type AvailableNetworkType,
  type NetworkConnectRequestType,
  type NetworkConnectResponseType,
  type NetworkDisconnectResponseType,
} from '../types/api'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/connect')({
  component: ConnectComponent,
})

function ConnectComponent() {
  const navigate = useNavigate()
  const { connection, setConnection } = useContext(ConnectionContext)
  const [selectedSsid, setSelectedSsid] = useState<string | undefined>(
    undefined,
  )
  const [password, setPassword] = useState('')

  const { isPending, error, data, refetch, isFetching } = useQuery({
    queryKey: ['networks'],
    queryFn: async (): Promise<AvailableNetworkType> => {
      const response = await fetch('/api/network/available')
      if (!response.ok) {
        throw new Error('Failed to fetch networks')
      }
      const networks = await response.json()
      return AvailableNetworkSchema.parse(networks)
    },
  })

  const connectMutation = useMutation({
    mutationFn: async ({
      ssid,
      password,
    }: NetworkConnectRequestType): Promise<NetworkConnectResponseType> => {
      setConnection((prev) => ({
        ...prev,
        isConnecting: true,
      }))
      const response = await fetch('/api/network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssid, password }),
      })
      if (!response.ok) throw new Error('Failed to connect')
      const result = await response.json()
      return NetworkConnectResponseSchema.parse(result)
    },
    onSuccess: (result, variables) => {
      setConnection(() => ({
        connected: true,
        isConnecting: false,
        ip: result.ip,
        ssid: variables.ssid,
      }))
      toast.success(t('connected_to_network', { ssid: variables.ssid }))
      setSelectedSsid(undefined)
      setPassword('')
      setTimeout(() => {
        navigate({ to: '/link' })
      }, 2000)
    },
    onError: () => {
      setConnection((prev) => ({
        ...prev,
        isConnecting: false,
      }))
      toast.error(t('connect_failed'))
    },
  })

  const handleConnect: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!selectedSsid || !password) return
    connectMutation.mutate({ ssid: selectedSsid, password })
  }

  const handleDisconnect = async (): Promise<NetworkDisconnectResponseType> => {
    const response = await fetch('/api/network', {
      method: 'DELETE',
    })
    if (!response.ok) {
      toast.error(t('disconnect_failed'))
      throw new Error('Failed to disconnect')
    }
    setConnection((prev) => ({
      ...prev,
      connected: false,
      ssid: null,
      ip: null,
      isConnecting: false,
    }))
    setSelectedSsid(undefined)
    setPassword('')
    toast.success(t('disconnect_success'))
    const result = await response.json()
    return NetworkDisconnectResponseSchema.parse(result)
  }

  const isSelectedConnectedNetwork =
    !!selectedSsid && connection.connected && selectedSsid === connection.ssid

  return (
    <div className="space-y-2.75 lg:space-y-4">
      <Title messageId="connect_title" level="h1" />
      {connection.connected && <Text messageId="edit_connection" />}
      {!connection.connected && <Text messageId="establish_connection" />}
      <Text messageId="establish_connection_tip" variant="tip" />
      <form
        className="lg:space-y-6 space-y-4 mt-6"
        onSubmit={(e) => handleConnect(e)}
      >
        <div className="relative space-y-2.75 lg:space-y-4 outline-1 outline-neutral-200 dark:outline-neutral-900 rounded-lg p-2 shadow-lg shadow-black/10 dark:shadow-black/10 backdrop-blur-sm">
          {isPending ? (
            <div className="space-y-2 px-1 max-h-64 lg:max-h-82  animate-pulse mb-2">
              <Text
                messageId="scanning_networks"
                className="px-1 font-medium py-1.75"
              />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-neutral-200 dark:bg-neutral-900 rounded-lg"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          ) : error ? (
            <div className="px-1 py-1.75 text-center mb-2">
              <Text messageId="failed_scan" className="text-red-500" />
            </div>
          ) : data && data.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <Text
                  messageId="select_network"
                  className="px-1 font-medium py-1.75"
                />
                <Button
                  iconOnly={true}
                  rightIcon={RefreshCcw}
                  iconSize="small"
                  variant="tertiary"
                  fullWidth={false}
                  messageId="rescan"
                  loading={isFetching}
                  onClick={() => refetch()}
                  className={isFetching ? 'animate-spin' : ''}
                />
              </div>
              <div className="space-y-2 overflow-y-auto max-h-64 lg:max-h-82 pr-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
                {data
                  .filter((network) => network.ssid === connection?.ssid)
                  .map((network, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Button
                        className="flex-1"
                        leftIcon={
                          (network.rssi ?? -100) > -50
                            ? WifiHigh
                            : (network.rssi ?? -100) > -70
                              ? WifiLow
                              : WifiZero
                        }
                        iconSize="large"
                        iconClassName="-mt-1.5"
                        variant="outline"
                        fullWidth={true}
                        size="primary"
                        messageText={network.ssid}
                        loading={false}
                        onClick={() => setSelectedSsid(network.ssid)}
                        active={network.ssid === selectedSsid}
                      >
                        <span className="text-xs text-neutral-400">
                          {network.ssid === connection?.ssid
                            ? t('connected')
                            : ''}
                        </span>
                      </Button>
                    </div>
                  ))}
                {data
                  .filter((network) => network.ssid !== connection?.ssid)
                  .map((network, idx) => (
                    <div key={idx}>
                      <Button
                        leftIcon={
                          (network.rssi ?? -100) > -50
                            ? WifiHigh
                            : (network.rssi ?? -100) > -70
                              ? WifiLow
                              : WifiZero
                        }
                        iconSize="large"
                        iconClassName="-mt-1.5"
                        variant="outline"
                        fullWidth={true}
                        messageText={network.ssid}
                        loading={false}
                        size="primary"
                        onClick={() => setSelectedSsid(network.ssid)}
                        active={network.ssid === selectedSsid}
                      ></Button>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <Text messageId="no_networks" />
          )}
        </div>

        {selectedSsid && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {!isSelectedConnectedNetwork && (
              <Input
                inputId="password"
                label={t('enter_password')}
                value={password}
                onChange={setPassword}
                placeholder={t('password_placeholder')}
                type="password"
                autoComplete="current-password"
              />
            )}

            {isSelectedConnectedNetwork ? (
              <Button
                messageId="disconnect"
                leftIcon={CloudOff}
                onClick={handleDisconnect}
                variant="secondary"
                className="hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors duration-200"
              />
            ) : password.length > 0 ? (
              <Button
                messageId="connect"
                loading={connectMutation.isPending}
                leftIcon={Radio}
                type="submit"
                variant="primary"
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg"
              />
            ) : null}
          </div>
        )}
      </form>
    </div>
  )
}
