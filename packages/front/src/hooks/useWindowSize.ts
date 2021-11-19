import { useEffect, useState } from "react"
import debounce from "lodash.debounce"

export const useWindowSize = () => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: globalThis?.innerWidth,
    height: globalThis?.innerHeight,
  })
  useEffect(() => {
    const handler = debounce(() => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    })
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return size
}

export const useWindowWidthGreaterThan = (border: number) => {
  const [isGreater, setIsGreater] = useState(border < window.innerWidth)
  useEffect(() => {
    const handler = debounce(() => {
      setIsGreater(border < window.innerWidth)
    })
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [border])
  return isGreater
}
