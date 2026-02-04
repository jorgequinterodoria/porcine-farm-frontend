import { create } from 'zustand'

interface SyncState {
  isSyncing: boolean
  isOnline: boolean
  lastSyncAt: Date | null
  error: Error | null
  setSyncing: (isSyncing: boolean) => void
  setOnline: (isOnline: boolean) => void
  setLastSyncAt: (date: Date) => void
  setError: (error: Error | null) => void
}

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  isOnline: navigator.onLine,
  lastSyncAt: null,
  error: null,
  setSyncing: (isSyncing) => set({ isSyncing }),
  setOnline: (isOnline) => set({ isOnline }),
  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
  setError: (error) => set({ error }),
}))
