import React from "react"

type PrimaryButtonProps = {
  onClick: () => void
  children: React.ReactNode
}

const PrimaryButton: React.VFC<PrimaryButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button className="px-4 py-2 text-black rounded-lg bg-primary">
      {children}
    </button>
  )
}

export default PrimaryButton
