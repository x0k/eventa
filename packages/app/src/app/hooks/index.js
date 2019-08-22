import { useEffect, useRef } from 'react'

export function useLoad (load) {
  const needLoad = useRef(true)
  useEffect(() => {
    if (needLoad.current) {
      load()
    }
    needLoad.current = false
  })
}
