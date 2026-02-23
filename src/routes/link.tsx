import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Title from '../components/Title'
import Text from '../components/Text'
import Button from '../components/Button'
import { LinkIcon, QrCodeIcon } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import QRCode from 'react-qr-code'
import { ConnectionContext, LoadingContext } from '../context'
import Modal from '../components/Modal'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/link')({
  component: LinkComponent,
})

function LinkComponent() {
  const { connection } = useContext(ConnectionContext)
  const navigate = useNavigate()
  const [otp, setOtp] = useState<string | null>(null)
  const [loadingButton, setLoadingButton] = useState<'qr' | 'text' | null>(null)
  const { setLoading } = useContext(LoadingContext)
  const [isOpenQrModal, setOpenQrModal] = useState(false)
  const [isOpenTextModal, setOpenTextModal] = useState(false)
  const OTP_URL_BASE = 'https://hl.netoasis.dedyn.io/devices/link?otp='

  useEffect(() => {
    if (!connection.connected) {
      navigate({ to: '/connect', replace: true })
    }
  }, [connection.connected, navigate])

  const { refetch, isFetching } = useQuery({
    queryKey: ['fetch-otp'],
    queryFn: async (): Promise<{ otp: string }> => {
      const response = await fetch('/api/otp')
      if (!response.ok) {
        throw new Error('Failed to get OTP')
      }
      const data = await response.json()
      if (!data.otp) {
        throw new Error('OTP not found in response')
      }
      return data
    },
    enabled: isOpenQrModal,
    refetchInterval: isOpenQrModal ? 10000 : false,
    refetchOnWindowFocus: false,
  })

  const handleShowOTP = async (selectedMethod: 'qr' | 'text') => {
    setLoadingButton(selectedMethod)
    setLoading(true)
    if (!otp && !isFetching) {
      try {
        const { data } = await refetch()
        if (data?.otp) {
          setOtp(data.otp)
          if (selectedMethod === 'qr') {
            setOpenTextModal(false)
            setOpenQrModal(true)
          } else {
            setOpenQrModal(false)
            setOpenTextModal(true)
          }
        } else {
          throw new Error('OTP not found in response')
        }
      } catch (error) {
        console.error('Error fetching OTP:', error)
        toast.error('Failed to get OTP. Please try again.')
      } finally {
        setLoading(false)
        setLoadingButton(null)
      }
    } else if (otp) {
      if (selectedMethod === 'qr') {
        setOpenQrModal(true)
      } else {
        setOpenTextModal(true)
      }
      setLoading(false)
      setLoadingButton(null)
    }
  }

  return (
    <div className="space-y-4">
      <Title messageId="link_title" level="h1" />
      <Text messageId="link_message" />
      <div className="flex gap-1">
        <Text messageId="link_account_hint" variant="tip" />
        <a
          href="https://app.hydro.link/signup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text messageId="link_account_hint_2" variant="link" />
        </a>
      </div>

      <div className="space-y-3.75 flex flex-col">
        <Button
          iconSize="large"
          message="link_method_qr"
          variant="outline"
          modifier="tallest"
          fullWidth={true}
          disabled={!!loadingButton}
          loading={loadingButton === 'qr'}
          icon={QrCodeIcon}
          onClick={() => handleShowOTP('qr')}
        />
        <Button
          iconSize="large"
          message="link_method_text"
          variant="outline"
          modifier="tallest"
          fullWidth={true}
          disabled={!!loadingButton}
          loading={loadingButton === 'text'}
          icon={LinkIcon}
          onClick={() => handleShowOTP('text')}
        />
      </div>
      {isOpenQrModal && otp && (
        <Modal onClose={() => setOpenQrModal(false)}>
          <div className="w-full lg:flex flex-col lg:flex-row gap-4 lg:justify-between justify-center items-center">
            <QRCode value={OTP_URL_BASE + otp} size={256} className="w-full" />
            <hr className="my-6 h-px border-t-0 bg-neutral-200 dark:bg-neutral-800" />
            <div className="text-lg text-neutral-700 space-y-6 w-full justify-start items-center flex flex-col max-w-sm">
              <Title
                messageId="link_qr_title"
                className="text-center"
                level="h2"
              />
              <ol className="text-base space-y-2 leading-6 lg:leading-8 lg:text-md list-decimal list-outside pl-5">
                <li>
                  <Text messageId="link_qr_step_1" />
                </li>
                <li>
                  <Text messageId="link_qr_step_2" />
                </li>
                <li>
                  <Text messageId="link_qr_step_3" />
                </li>
              </ol>
              <Text messageId="link_qr_tip" variant="tip" />
            </div>
          </div>
        </Modal>
      )}
      {isOpenTextModal && otp && (
        <Modal onClose={() => setOpenTextModal(false)}>
          <div className="w-full flex flex-col gap-6 justify-between items-center">
            <Title
              messageId="link_text_title"
              className="text-center"
              level="h2"
            />
            <Text messageId="link_text_message" />
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-6 py-4">
              <Text
                messageText={otp}
                className="font-mono text-lg lg:text-xl"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
