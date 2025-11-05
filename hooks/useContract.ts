'use client'

import { useMemo } from 'react'
import { useActiveAccount, usePanna } from 'panna-sdk'
import { SAVINGS_VAULT_ADDRESS } from '@/types/contracts'

/**
 * Hook untuk get Panna client dan active account
 * Returns client, account, dan wallet connection status
 */
export function useContract() {
  const activeAccount = useActiveAccount()
  const { client } = usePanna()

  const contractInfo = useMemo(() => {
    return {
      client: client || null,
      account: activeAccount || null,
      isConnected: !!activeAccount && !!client,
      address: activeAccount?.address || null,
      vaultAddress: SAVINGS_VAULT_ADDRESS,
    }
  }, [activeAccount, client])

  return contractInfo
}
