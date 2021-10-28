import { useEffect, useMemo, useState } from "react"

export const useRequest = <Response>(
  fetch: (...args: unknown[]) => Promise<Response>,
  initData: Response | (() => Response),
  onError?: (error: unknown) => void,
) => {
  const [data, setData] = useState<Response>(initData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const res = await fetch()
        setData(res)
      } catch (e) {
        onError?.(e)
        setError(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const returnValue = useMemo(
    () => ({
      data,
      isLoading,
      error,
    }),
    [data, isLoading, error],
  )

  return returnValue
}
