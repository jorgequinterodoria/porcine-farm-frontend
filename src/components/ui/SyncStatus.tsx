import React from 'react'
import { useSync } from '../../hooks/useSync'
import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react'

export const SyncStatus: React.FC = () => {
  const { isSyncing, isOnline, error } = useSync()

  if (!isOnline) {
    return (
        <div className="flex items-center gap-2 text-amber-600 text-xs font-medium px-2 py-1 bg-amber-50 rounded-full border border-amber-100">
            <CloudOff className="w-3 h-3" />
            <span>Offline</span>
        </div>
    )
  }

  if (isSyncing) {
    return (
        <div className="flex items-center gap-2 text-blue-600 text-xs font-medium px-2 py-1 bg-blue-50 rounded-full border border-blue-100">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Sincronizando...</span>
        </div>
    )
  }

  if (error) {
    return (
        <div className="flex items-center gap-2 text-red-600 text-xs font-medium px-2 py-1 bg-red-50 rounded-full border border-red-100" title={error.message}>
            <AlertCircle className="w-3 h-3" />
            <span>Error</span>
        </div>
    )
  }

  return (
      <div className="flex items-center gap-2 text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full border border-green-100">
          <Cloud className="w-3 h-3" />
          <span>En línea</span>
      </div>
  )
}
