import { ArrowLeft } from 'lucide-react'
import Button from './Button'
import {
  useRouter,
  useRouterState,
  useCanGoBack,
  useNavigate,
} from '@tanstack/react-router'
import { usePreviousLocation } from '../hooks/usePreviousLocation'
import { ConnectionContext } from '../context'
import { useContext } from 'react'

export default function NavigationControl({ className = '' }) {
  const navigate = useNavigate()
  const router = useRouter()
  const routerState = useRouterState()
  const canGoBack = useCanGoBack()
  const previousLocation = usePreviousLocation()
  const { connection } = useContext(ConnectionContext)

  const handleGoBackButton = () => {
    if (
      routerState.location.pathname === '/connect' &&
      previousLocation.includes('/link') &&
      !connection.connected
    ) {
      navigate({ to: '/' })
    } else {
      router.history.back()
    }
  }

  const isRootRoute = routerState.location.pathname === '/'

  const canNavigateBack =
    canGoBack ||
    (routerState.location.pathname === '/connect' &&
      previousLocation?.includes('/link') &&
      !connection.connected)

  return isRootRoute ? null : (
    <div className={className}>
      <Button
        messageId="previous_step"
        leftIcon={ArrowLeft}
        onClick={handleGoBackButton}
        size="compact"
        variant="tertiary"
        fullWidth={false}
        disabled={!canNavigateBack}
        className="hover:-translate-x-1 transition-transform duration-200"
      />
    </div>
  )
}
