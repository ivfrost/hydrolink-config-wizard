import z from 'zod'

export const AvailableNetworkSchema = z.array(
  z.object({
    ssid: z.string(),
    rssi: z.number().nullable(),
    frequency: z.string().nullable(),
    secure: z.enum(['secure', 'insecure']),
  }),
)
export type AvailableNetworkType = z.infer<typeof AvailableNetworkSchema>

export const CurrentNetworkSchema = z.object({
  connected: z.boolean(),
  mode: z.enum(['ap', 'sta', 'ap_sta']).nullable(),
  ssid: z.string().nullable(),
  rssi: z.number().nullable(),
  ip: z.string().nullable(),
})
export type CurrentNetworkType = z.infer<typeof CurrentNetworkSchema>

export const NetworkConnectRequestSchema = z.object({
  ssid: z.string().max(32),
  password: z.string().max(63),
})
export type NetworkConnectRequestType = z.infer<
  typeof NetworkConnectRequestSchema
>
export const NetworkConnectResponseSchema = z.object({
  parseFailed: z.boolean(),
  saveFailed: z.boolean(),
  applyFailed: z.boolean(),
  reason: z.string().nullable(),
})
export type NetworkConnectResponseType = z.infer<
  typeof NetworkConnectResponseSchema
>

export const NetworkDisconnectResponseSchema = z.object({
  status: z.number(),
  changed: z.boolean(),
  errors: z.array(z.string()).nullable(),
})
export type NetworkDisconnectResponseType = z.infer<
  typeof NetworkDisconnectResponseSchema
>

export const DeviceSchema = z.object({
  id: z.string(),
  firmware: z.string(),
  uptime: z.string(),
})
export type DeviceType = z.infer<typeof DeviceSchema>
