
import { useState } from 'react'
import { sync } from '../services/sync'

export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const syncNow = async () => {
    if (isSyncing) return
    setIsSyncing(true)
    setError(null)
    try {
      await sync()
    } catch (e: any) {
      setError(e)
    } finally {
      setIsSyncing(false)
    }
  }

  // Optional: Auto-sync on mount
  /*
  useEffect(() => {
    syncNow()
  }, [])
  */

  return { isSyncing, error, syncNow }
}
