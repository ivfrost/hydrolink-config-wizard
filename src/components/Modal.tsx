import { Transition, TransitionChild } from '@headlessui/react'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import Button from './Button'

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <Transition
      appear
      show={true}
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <TransitionChild
          as="div"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          onClick={onClose}
          aria-hidden="true"
        />
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <TransitionChild
          as="div"
          role="dialog"
          aria-modal="true"
          className="inline-block w-full max-w-md lg:max-w-2xl p-8 my-8 pt-12 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-stone-900 shadow-2xl rounded-2xl outline-1 outline-neutral-200 dark:outline-neutral-800 relative"
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95 translate-y-4"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-4"
        >
          <Button
            iconOnly={true}
            variant="tertiary"
            size="compact"
            className="absolute top-4 right-4 transition-transform duration-200"
            onClick={onClose}
            iconSize="medium"
            fullWidth={false}
            leftIcon={X}
          />
          {children}
        </TransitionChild>
      </div>
    </Transition>
  )
}
