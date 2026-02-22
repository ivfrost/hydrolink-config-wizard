import { LockIcon, WifiHigh, WifiLow, WifiZero } from 'lucide-react'
import Button from './Button'

type NetworkButtonProps = {
  network: {
    ssid: string
    rssi?: number
    frequency?: number
    secure: 'secure' | 'open'
  }
  selectedSsid?: string
  connection?: {
    ssid: string
  } | null
  onSelect: (ssid: string) => void
  t: (messageId: string) => string
}

export const NetworkButton = ({
  network,
  selectedSsid,
  connection,
  onSelect,
  t,
}: NetworkButtonProps) => {
  const Icon =
    (network.rssi ?? -100) > -50
      ? WifiHigh
      : (network.rssi ?? -100) > -70
        ? WifiLow
        : WifiZero

  const isConnected = network.ssid === connection?.ssid
  const isSelected = network.ssid === selectedSsid

  return (
    <Button
      className="relative w-full"
      leftIcon={Icon}
      iconSize="large"
      iconClassName="-mt-1.5"
      variant="outline"
      size="primary"
      fullWidth
      active={isSelected}
      onClick={() => onSelect(network.ssid)}
    >
      <div className="flex flex-col gap-0.25 w-full justify-between">
        <div className="text-start">{network.ssid}</div>

        <div className="flex gap-1.75 items-center">
          {network.frequency && (
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
              {network.frequency} GHz
            </span>
          )}

          {network.secure === 'secure' && (
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
              <LockIcon size={10} />
            </span>
          )}
        </div>
      </div>

      {isConnected && (
        <span className="text-xs text-neutral-400 self-end p-0.5 lg:self-auto">
          {t('connected')}
        </span>
      )}
    </Button>
  )
}
