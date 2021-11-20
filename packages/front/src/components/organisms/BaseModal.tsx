import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment } from "react"

export type BaseModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  initialFocus: React.MutableRefObject<HTMLElement | null> | undefined
}

const BaseModal: React.VFC<BaseModalProps> = ({
  open,
  onClose,
  children,
  initialFocus,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
        initialFocus={initialFocus}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="absolute flex flex-col max-w-full p-6 space-y-4 min-h-[150px] text-center transition-all transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-2xl top-1/2 left-1/2">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default BaseModal
