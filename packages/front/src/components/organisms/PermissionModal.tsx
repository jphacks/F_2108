import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment, useRef } from "react"

export type PermissionModalProps = {
  open: boolean
  onClose: () => void
}

const PermissionModal: React.VFC<PermissionModalProps> = ({
  open,
  onClose,
}) => {
  const loginButtonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
        initialFocus={loginButtonRef}
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
              <Dialog.Title as="h3" className="text-lg text-gray-900">
                この機能を利用するにはログインが必要です
              </Dialog.Title>

              <ul className="text-sm leading-relaxed text-left">
                <li>・音声やコメントの追加</li>
                <li>・新しいPDFのアップロード</li>
              </ul>

              <div className="flex justify-end w-full space-x-2">
                <button
                  className="inline-flex justify-center px-4 py-2 text-sm text-blue-900 transition border border-transparent rounded-md hover:bg-gray-200"
                  onClick={onClose}
                  ref={loginButtonRef}
                >
                  キャンセル
                </button>
                <button
                  className="inline-flex justify-center px-4 py-2 text-sm text-blue-900 transition bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                  onClick={onClose}
                  ref={loginButtonRef}
                >
                  ログイン
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PermissionModal
