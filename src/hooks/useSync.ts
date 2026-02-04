import { useEffect } from 'react'
import { sync } from '../services/sync'
import { useSyncStore } from '../store/useSyncStore'


const performSync = async () => {
    
    if (useSyncStore.getState().isSyncing || !navigator.onLine) return

    const { setSyncing, setError, setLastSyncAt } = useSyncStore.getState()

    setSyncing(true)
    setError(null)
    try {
      await sync()
      setLastSyncAt(new Date())
    } catch (e: any) {
      console.error('Sync failed:', e)
      setError(e)
    } finally {
      setSyncing(false)
    }
}

export function useSyncInit() {
  const { setOnline } = useSyncStore()

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true)
      console.log('App is online, attempting sync...')
      performSync()
    }
    
    const handleOffline = () => {
      setOnline(false)
      console.log('App is offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    
    setOnline(navigator.onLine)
    if (navigator.onLine) {
        performSync()
    }

    
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        performSync()
      }
    }, 5 * 60 * 1000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(intervalId)
    }
  }, [setOnline])
}

export function useSync() {
  const { isSyncing, isOnline, lastSyncAt, error } = useSyncStore()
  return { isSyncing, isOnline, lastSyncAt, error, syncNow: performSync }
}
