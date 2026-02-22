import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ConnectionContext, LoadingContext } from '../context'
import { useContext } from 'react'
import Title from '../components/Title'
import Text from '../components/Text'
import Button from '../components/Button'

const IndexComponent = () => {
  const { loading } = useContext(LoadingContext)
  const { connection } = useContext(ConnectionContext)
  return (
    <div className="space-y-4">
      <Title messageId="welcome_title" level="h1" />
      <Text messageId="welcome_message" />

      <div className="w-full flex justify-end">
        <Link to={!connection.connected ? '/connect' : '/link'}>
          <Button
            message="next_step"
            icon={ArrowRight}
            iconPosition="right"
            loading={loading}
            variant={'primary'}
          />
        </Link>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: IndexComponent,
})
