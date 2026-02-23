import { WifiHigh, WifiLow, WifiZero } from 'lucide-react'
import Button from './Button'

type NetworkButtonProps = {
  network: {
    ssid: string
    rssi?: number | null
    frequency?: string | null
    secure: 'secure' | 'insecure'
  }
  connection?: {
    ssid: string | null
  } | null
  onSelect: (ssid: string) => void
  t: (messageId: string) => string
}

export const NetworkButton = ({
  network,
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
  // ...existing code...

  return (
    <Button
      icon={Icon}
      iconSize="larger"
      variant="outline"
      modifier="taller"
      fullWidth={true}
      extraIconClasses="-mt-2"
      onClick={() => onSelect(network.ssid)}
    >
      <div className="flex flex-col gap-px w-full justify-between">
        <div className="text-start">{network.ssid}</div>

        <div className="flex gap-1.75 items-center">
          {network.secure === 'secure' && (
            <span className="text-xs text-black dark:text-white absolute left-9.5 bottom-1.75 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="11"
                height="11"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"></path>
              </svg>
            </span>
          )}
          {network.frequency && (
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
              {network.frequency} GHz
            </span>
          )}
          <WifiHigh className="text-neutral-500 dark:text-neutral-600 absolute w-8.75 h-10.75 left-3.5 bottom-2" />
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
