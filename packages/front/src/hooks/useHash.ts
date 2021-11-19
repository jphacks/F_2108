import { useRouter } from "next/router"
import { useCallback } from "react"

const useHash = (): [string | null, (newHash: string | null) => void] => {
  const router = useRouter()
  const hash = router.asPath.split("#")?.[1]
  const setHash = useCallback(
    (hash: string | null) => {
      // NOTE: hashを外すときはshallowにしないとページトップに遷移してしまう
      if (hash != null) {
        router.replace(
          { hash: hash ?? undefined, query: router.query },
          undefined,
        )
      } else {
        router.replace({ hash: undefined, query: router.query }, undefined, {
          shallow: true,
        })
      }
    },
    [router],
  )

  return [hash ?? null, setHash]
}

export default useHash
