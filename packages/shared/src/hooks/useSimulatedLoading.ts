import { useState, useEffect } from 'react'

declare const __DEV__: boolean

/**
 * Simulates API loading delay for pages using mock data.
 */
export const useSimulatedLoading = (durationMs = 800): boolean => {
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false
  const [isLoading, setIsLoading] = useState(isDev)

  useEffect(() => {
    if (!isDev) return
    const timer = setTimeout(() => setIsLoading(false), durationMs)
    return () => clearTimeout(timer)
  }, [durationMs, isDev])

  return isLoading
}

export default useSimulatedLoading
