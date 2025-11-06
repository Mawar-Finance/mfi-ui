'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContract } from './useContract'
import { getUserBouquets, getBouquetDetails, getMFIBalance, getNFTBalance } from '@/lib/contract'
import { Bouquet } from '@/types/contracts'

/**
 * Hook to fetch and manage user's NFT bouquets
 */
export function useBouquets() {
  const { client, address, isConnected } = useContract()
  const [bouquets, setBouquets] = useState<Bouquet[]>([])
  const [mfiBalance, setMfiBalance] = useState<bigint>(0n)
  const [nftCount, setNftCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all bouquets and balances
  const fetchBouquets = useCallback(async () => {
    if (!client || !address || !isConnected) {
      setBouquets([])
      setMfiBalance(0n)
      setNftCount(0)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch MFI balance first (this should always work)
      const balance = await getMFIBalance(client, address)
      setMfiBalance(balance)

      // Fetch NFT count
      const count = await getNFTBalance(client, address)
      setNftCount(count)

      // Only fetch bouquet details if user has NFTs
      if (count > 0) {
        // Fetch user's token IDs
        const tokenIds = await getUserBouquets(client, address)

        if (tokenIds.length > 0) {
          // Fetch details for each bouquet, but catch individual errors
          const bouquetPromises = tokenIds.map(async (tokenId) => {
            try {
              return await getBouquetDetails(client, tokenId)
            } catch (err) {
              console.error(`Error fetching bouquet ${tokenId}:`, err)
              return null
            }
          })
          
          const bouquetDetails = await Promise.all(bouquetPromises)
          // Filter out any failed fetches
          const validBouquets = bouquetDetails.filter((b): b is Bouquet => b !== null)
          setBouquets(validBouquets)
        } else {
          setBouquets([])
        }
      } else {
        setBouquets([])
      }
    } catch (err: any) {
      console.error('Error fetching bouquets:', err)
      setError(err.message || 'Failed to fetch bouquets')
      // Don't reset balances on error - keep what we have
      if (bouquets.length === 0) {
        setBouquets([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [client, address, isConnected])

  // Auto-fetch on mount and when connection changes
  useEffect(() => {
    fetchBouquets()
  }, [fetchBouquets])

  // Refresh function for manual updates (e.g., after transactions)
  const refresh = useCallback(() => {
    return fetchBouquets()
  }, [fetchBouquets])

  return {
    bouquets,
    mfiBalance,
    nftCount,
    isLoading,
    error,
    refresh,
  }
}
