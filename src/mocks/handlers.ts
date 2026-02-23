import { http, HttpResponse } from 'msw'

export const handlers = [
  // http.get('/api/networks', async () => {
  //   await new Promise((resolve) => setTimeout(resolve, 2000))
  //   return HttpResponse.json([
  //     { ssid: 'MyNetwork', rssi: -40, frequency: '2.4', secure: 'secure' },
  //     { ssid: 'NeighborWiFi', rssi: -70, frequency: '5', secure: 'insecure' },
  //     { ssid: 'CoffeeShop', rssi: -60, frequency: '2.4', secure: 'secure' },
  //     { ssid: 'LibraryWiFi', rssi: -80, frequency: '5', secure: 'secure' },
  //     { ssid: 'OpenNetwork', rssi: -50, frequency: '2.4', secure: 'insecure' },
  //     { ssid: 'OfficeWiFi', rssi: -65, frequency: '5', secure: 'secure' },
  //   ])
  // }),
  http.get('/api/networks', async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // mock a 202 response 1/3 of the times
    // mock a 204 response 1/3 of the times
    // mock a 200 response 1/3 of the times
    const rand = Math.random()
    if (rand < 0.33) {
      return HttpResponse.json([], { status: 202 })
    } else if (rand < 0.66) {
      return HttpResponse.json([], { status: 204 })
    } else {
      return HttpResponse.json([
        { ssid: 'MyNetwork', rssi: -40, frequency: '2.4', secure: 'secure' },
        { ssid: 'NeighborWiFi', rssi: -70, frequency: '5', secure: 'insecure' },
        { ssid: 'CoffeeShop', rssi: -60, frequency: '2.4', secure: 'secure' },
        { ssid: 'LibraryWiFi', rssi: -80, frequency: '5', secure: 'secure' },
        {
          ssid: 'OpenNetwork',
          rssi: -50,
          frequency: '2.4',
          secure: 'insecure',
        },
        { ssid: 'OfficeWiFi', rssi: -65, frequency: '5', secure: 'secure' },
      ])
    }
  }),

  http.post('/api/network', async ({ request }) => {
    const json = await request.clone().json()
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log('Received connect request with data:', json)
    return HttpResponse.json({
      parseFailed: false,
      saveFailed: false,
      applyFailed: false,
      reason: 'success',
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
  http.get('/api/otp', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return HttpResponse.json({ otp: '1ff23456' })
  }),
  // Device logs handler moved to mockTerminal.ts for review
]
