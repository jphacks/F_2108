import React from "react"

type PrimaryButtonProps = {
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
}

const PrimaryButton: React.VFC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className="px-4 py-2 text-black rounded-lg bg-primary disabled:bg-gray-200 disabled:text-gray-400"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
