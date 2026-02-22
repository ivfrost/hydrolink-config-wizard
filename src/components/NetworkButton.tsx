import { LockIcon, WifiHigh, WifiLow, WifiZero } from 'lucide-react'
import Button from './Button'

type NetworkButtonProps = {
  network: {
    ssid: string
    rssi?: number | null
    frequency?: string | null
    secure: 'secure' | 'insecure'
  }
  selectedSsid?: string
  connection?: {
    ssid: string | null
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
      icon={Icon}
      iconSize="large"
      variant="outline"
      modifier="taller"
      fullWidth={true}
      onClick={() => onSelect(network.ssid)}
    >
      <div className="flex flex-col gap-px w-full justify-between">
        <div className="text-start">{network.ssid}</div>

        <div className="flex gap-1.75 items-center">
          {network.secure === 'secure' && (
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
              <LockIcon size={10} />
            </span>
          )}
          {network.frequency && (
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
              {network.frequency} GHz
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
