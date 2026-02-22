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
        message="previous_step"
        icon={ArrowLeft}
        onClick={handleGoBackButton}
        variant="tertiary"
        fullWidth={false}
        disabled={!canNavigateBack}
        modifier="slideLeft"
      />
    </div>
  )
}
