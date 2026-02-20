import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import './index.css'
import './locales/i18n.ts'

const router = createRouter({
  routeTree,
  context: {},
  history: createHashHistory(),
})

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'warn',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
    console.log('🚀 MSW started successfully')
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
