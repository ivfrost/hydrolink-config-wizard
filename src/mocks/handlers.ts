import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/network/available', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return HttpResponse.json([
      { ssid: 'MyNetwork', rssi: -40 },
      { ssid: 'NeighborWiFi', rssi: -70 },
      { ssid: 'CoffeeShop', rssi: -80 },
      { ssid: 'LibraryWiFi', rssi: -60 },
      { ssid: 'OpenNetwork', rssi: -90 },
      { ssid: 'OfficeWiFi', rssi: -50 },
      { ssid: 'GuestNetwork', rssi: -75 },
    ])
  }),
  http.get('/api/network', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return HttpResponse.json({
      mode: 'ap_sta',
      connected: true,
      ssid: 'MyNetwork',
      rssi: -40,
      ip: '192.168.1.121',
    })
  }),
  http.post('/api/network', async ({ request }) => {
    const json = await request.clone().json()
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Received connect request with data:', json)
    return HttpResponse.json({
      status: 200,
      changed: true,
      ip: '192.168.1.165',
      errors: null,
    })
  }),
  http.delete('/api/network', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return HttpResponse.json({ status: 200, changed: true, errors: null })
  }),
  http.get('/api/device', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return HttpResponse.json({
      id: 'Hydro-0324B',
      firmware: '0.0.1',
      uptime: '3d 4h 12m',
    })
  }),
  http.get('/api/device/link', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return HttpResponse.json({ otp: '1ff23456' })
  }),
  // Device logs handler moved to mockTerminal.ts for review
]
