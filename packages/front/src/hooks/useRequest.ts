import { useEffect, useMemo, useState } from "react"
import { useAuth } from "./useAuth"

export const useRequest = <Response>(
  fetch: (...args: unknown[]) => Promise<Response>,
  initData: Response | (() => Response),
  onError?: (error: unknown) => void,
  enabled = true,
) => {
  const [data, setData] = useState<Response>(initData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const user = useAuth()

  useEffect(() => {
    ;(async () => {
      if (user == null || !enabled) {
        return
      }
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
  }, [user, enabled])

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
