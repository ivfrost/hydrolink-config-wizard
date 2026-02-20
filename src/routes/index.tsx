import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import { ConnectionContext, LoadingContext } from '../context'
import { useContext } from 'react'
import Title from '../components/Title'
import Text from '../components/Text'

const IndexComponent = () => {
  const { loading } = useContext(LoadingContext)
  const { connection } = useContext(ConnectionContext)
  return (
    <div className="space-y-2.75 lg:space-y-4">
      <Title messageId="welcome_title" level="h1" />
      <Text messageId="welcome_message" />

      <Link to={!connection.connected ? '/connect' : '/link'}>
        <Button
          messageId="begin"
          loading={loading}
          rightIcon={ArrowRight}
          fullWidth={true}
        />
      </Link>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: IndexComponent,
})
