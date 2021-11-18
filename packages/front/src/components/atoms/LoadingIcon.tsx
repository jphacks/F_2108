import React from "react"
import { Loader } from "react-feather"

type LoadingIconProps = React.ComponentProps<typeof Loader>

const LoadingIcon: React.VFC<LoadingIconProps> = ({ className, ...props }) => {
  return <Loader className={"animate-spin-slow " + className} {...props} />
}

export default LoadingIcon
