
import { synchronize } from '@nozbe/watermelondb/sync'
import database from '../db'
import api from '../api/axiosInstance'

export async function sync() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const response = await api.get('/sync/pull', {
        params: { lastSyncAt: lastPulledAt ? new Date(lastPulledAt).toISOString() : null }
      })

      if (!response.data.success) {
        throw new Error('Sync failed')
      }

      const { changes, timestamp } = response.data.data
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await api.post('/sync/push', {
        changes,
        lastPulledAt: lastPulledAt ? new Date(lastPulledAt).toISOString() : null
      })

      if (!response.data.success) {
        throw new Error('Push failed')
      }
    },
    // migrationsEnabledAtVersion: 1,
  })
}
