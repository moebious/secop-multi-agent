import { create } from "zustand"

interface SyncState {
  lastSync: Date | null
  isSync: boolean
  syncProgress: number
  syncMessage: string
  // Actions
  startSync: () => void
  updateSyncProgress: (progress: number, message?: string) => void
  completeSync: (success: boolean, message?: string) => void
  resetSync: () => void
}

export const useSyncStore = create<SyncState>((set) => ({
  lastSync: null,
  isSync: false,
  syncProgress: 0,
  syncMessage: "",
  startSync: () =>
    set({
      isSync: true,
      syncProgress: 0,
      syncMessage: "Iniciando sincronización...",
    }),
  updateSyncProgress: (progress, message) =>
    set((state) => ({
      syncProgress: progress,
      syncMessage: message || state.syncMessage,
    })),
  completeSync: (success, message) =>
    set({
      isSync: false,
      syncProgress: success ? 100 : 0,
      syncMessage: message || (success ? "Sincronización completada" : "Error en sincronización"),
      lastSync: success ? new Date() : null,
    }),
  resetSync: () =>
    set({
      isSync: false,
      syncProgress: 0,
      syncMessage: "",
    }),
}))
