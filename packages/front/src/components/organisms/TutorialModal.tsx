import React, { useEffect, useRef, useState } from "react"
import BaseModal from "./BaseModal"
import Image from "next/image"
import { isFirstAccess, neverShowTutorial } from "@lib/tutorialManager"
import { useAuthUser } from "@hooks/useAuth"

const TutorialModal: React.VFC = () => {
  const user = useAuthUser()
  const [openTutorialModal, setOpenTutorialModal] = useState(false)
  const [neverShow, setNeverShow] = useState(true)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (isFirstAccess() && user != null && !user.isAnonymous) {
      setOpenTutorialModal(true)
    }
  }, [])

  const handleClose = () => {
    setOpenTutorialModal(false)
    if (neverShow) {
      neverShowTutorial()
    }
  }

  return (
    <BaseModal
      open={openTutorialModal}
      onClose={() => setOpenTutorialModal(false)}
      initialFocus={buttonRef}
    >
      <div className="flex flex-col items-center space-y-4 overflow-hidden rounded-lg">
        <div>音声を追加したい場所をダブルクリックしてみよう</div>
        <div className="relative h-[200px] w-[400px]">
          <Image src="/tutorial-1.png" layout="fill" objectFit="contain" />
        </div>
        <div>
          <label className="flex items-center space-x-1 text-sm text-gray-900">
            <input
              type="checkbox"
              checked={neverShow}
              onChange={(e) => setNeverShow(e.target.checked)}
            />
            <span>次回以降は表示しない</span>
          </label>
        </div>
        <div className="mt-4">
          <button
            className="inline-flex justify-center px-4 py-2 text-sm text-blue-900 transition bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
            onClick={handleClose}
            ref={buttonRef}
          >
            とじる
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export default TutorialModal
