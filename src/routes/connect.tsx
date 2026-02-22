import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Text from '../components/Text'
import Title from '../components/Title'
import Button from '../components/Button'
import {
  CloudOff,
  LockIcon,
  Radio,
  RefreshCcw,
  WifiHigh,
  WifiLow,
  WifiZero,
} from 'lucide-react'
import { useContext, useState, type SubmitEventHandler } from 'react'
import { ConnectionContext } from '../context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { NetworkButton } from '../components/NetworkButton'

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
  const queryClient = useQueryClient()

  const { isPending, error, data, refetch, isFetching } = useQuery({
    queryKey: ['networks'],
    queryFn: async (): Promise<AvailableNetworkType> => {
      const response = await fetch('/api/networks')
      if (!response.ok) {
        throw new Error('Failed to fetch networks')
      }
      const networks = await response.json()
      console.log(AvailableNetworkSchema.parse(networks))
      return AvailableNetworkSchema.parse(networks)
    },
    refetchInterval: 10000,
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['currentNetwork'] })
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
      <form className="space-y-4 lg:space-y-6 mt-6" onSubmit={handleConnect}>
        <div className="relative space-y-2.75 lg:space-y-4 outline outline-1 outline-neutral-200 dark:outline-neutral-900 rounded-lg p-2 pt-1 lg:p-2 shadow-lg shadow-black/10 dark:shadow-black/10 backdrop-blur-sm">
          {/* Loading state */}
          {isPending && (
            <div className="space-y-1.75 lg:space-y-2 px-1 max-h-64 lg:max-h-82 animate-pulse">
              <Text
                messageId="scanning_networks"
                className="px-1.25 font-medium py-1.5"
              />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-neutral-200 dark:bg-neutral-900 rounded-lg"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {!isPending && error && (
            <div className="flex justify-between items-center mb-1 lg:mb-2">
              <Text
                messageId="failed_scan"
                className="px-1.25 font-medium py-1.5"
              />
            </div>
          )}

          {/* Networks list */}
          {!isPending && !error && data?.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-1 lg:mb-2">
                <Text
                  messageId="select_network"
                  className="px-1.25 font-medium py-1.5"
                />

                <Button
                  iconOnly
                  rightIcon={RefreshCcw}
                  iconSize="small"
                  variant="tertiary"
                  size="compact"
                  fullWidth={false}
                  messageId="rescan"
                  loading={isFetching}
                  onClick={refetch}
                  className={isFetching ? 'animate-spin bg-transparent' : ''}
                />
              </div>

              <div className="space-y-2 overflow-y-auto max-h-64 lg:max-h-82 pr-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
                {/* Connected network first */}
                {data
                  .filter((n) => n.ssid === connection?.ssid)
                  .map((network, idx) => (
                    <NetworkButton
                      key={idx}
                      network={network}
                      selectedSsid={selectedSsid}
                      connection={connection}
                      onSelect={setSelectedSsid}
                      t={t}
                    />
                  ))}

                {/* Other networks */}
                {data
                  .filter((n) => n.ssid !== connection?.ssid)
                  .map((network, idx) => (
                    <NetworkButton
                      key={idx}
                      network={network}
                      selectedSsid={selectedSsid}
                      connection={connection}
                      onSelect={setSelectedSsid}
                      t={t}
                    />
                  ))}
              </div>
            </>
          )}

          {/* No networks */}
          {!isPending && !error && (!data || data.length === 0) && (
            <Text messageId="no_networks" />
          )}
        </div>

        {/* Password + Connect/Disconnect */}
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
            ) : (
              password.length > 0 && (
                <Button
                  messageId="connect"
                  loading={connectMutation.isPending}
                  leftIcon={Radio}
                  type="submit"
                  variant="primary"
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg"
                />
              )
            )}
          </div>
        )}
      </form>
    </div>
  )
}
