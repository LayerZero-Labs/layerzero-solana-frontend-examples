import { useState, useCallback } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletReady } from './index'

interface LoadingState {
  [key: string]: boolean
}

export function useSolanaBase() {
  const wallet = useWallet()
  const walletReady = useWalletReady()
  
  // Error state
  const [error, setError] = useState<string | null>(null)
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingState>({})
  
  // Loading state helpers
  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])
  
  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }))
  }, [])
  
  const withLoading = useCallback(async <T>(
    key: string, 
    fn: () => Promise<T>,
    options?: { logName?: string }
  ): Promise<T | undefined> => {
    const { logName = key } = options || {}
    
    setLoading(key, true)
    setError(null)
    
    try {
      console.log(`Starting ${logName}...`)
      const result = await fn()
      console.log(`${logName} completed successfully`)
      return result
    } catch (error) {
      console.error(`${logName} failed:`, error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      return undefined
    } finally {
      setLoading(key, false)
    }
  }, [setLoading])
  
  // Common error handling
  const handleError = useCallback((error: unknown, fallbackMessage: string) => {
    console.error(fallbackMessage, error)
    const errorMessage = error instanceof Error ? error.message : fallbackMessage
    setError(errorMessage)
  }, [])
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])
  
  return {
    // Wallet state
    wallet,
    walletReady,
    
    // Error state
    error,
    setError,
    clearError,
    
    // Loading state
    isLoading,
    setLoading,
    withLoading,
    
    // Actions
    handleError,
  }
} 