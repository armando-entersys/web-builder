import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DesignTokens, defaultTokens } from '../design-tokens'

interface DesignTokensStore {
  tokens: DesignTokens
  setTokens: (tokens: DesignTokens) => void
  updateTokens: (updates: Partial<DesignTokens>) => void
  resetTokens: () => void
}

export const useDesignTokensStore = create<DesignTokensStore>()(
  persist(
    (set) => ({
      tokens: defaultTokens,
      setTokens: (tokens) => set({ tokens }),
      updateTokens: (updates) =>
        set((state) => ({
          tokens: { ...state.tokens, ...updates },
        })),
      resetTokens: () => set({ tokens: defaultTokens }),
    }),
    {
      name: 'design-tokens-storage',
    }
  )
)
