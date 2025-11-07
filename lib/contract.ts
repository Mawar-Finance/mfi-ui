// ============================================
// MAWAR FINANCE - Contract Interaction Layer
// ============================================
// Menggunakan Panna SDK & Thirdweb untuk berinteraksi dengan smart contracts

import { liskSepolia } from 'panna-sdk'
import { prepareContractCall, sendTransaction, readContract, waitForReceipt } from 'thirdweb/transaction'
import { getContract } from 'thirdweb/contract'
import { parseUnits, formatUnits } from 'ethers'
import {
  MFI_TOKEN_ADDRESS,
  SAVINGS_NFT_ADDRESS,
  EXCHANGE_ADDRESS,
  SAVINGS_VAULT_ADDRESS,
  MFI_TOKEN_ABI,
  EXCHANGE_ABI,
  SAVINGS_VAULT_ABI,
  SAVINGS_NFT_ABI,
  Bouquet,
  formatMFI,
  formatETH,
  calculateRoseCount,
} from '@/types/contracts'

// ============================================
// CONTRACT WRITE FUNCTIONS (Mengubah state)
// ============================================

/**
 * Buy MFI tokens with ETH via Exchange contract
 * @param client - Panna SDK client
 * @param account - Active wallet account
 * @param ethAmount - Amount of ETH to spend (as string, e.g., "0.01")
 * @returns Transaction result
 */
export async function buyMFI(client: any, account: any, ethAmount: string) {
  const ethValue = parseUnits(ethAmount, 18)
  
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: EXCHANGE_ADDRESS,
    }),
    method: 'function buyMFI(address recipient) payable',
    params: [account.address],
    value: ethValue,
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

/**
 * Approve SavingsVault to spend MFI tokens
 * @param client - Panna SDK client
 * @param account - Active wallet account
 * @param amount - Amount of MFI to approve (in MFI units, e.g., "30")
 */
export async function approveMFI(client: any, account: any, amount: string) {
  const amountWei = parseUnits(amount, 18)
  
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: MFI_TOKEN_ADDRESS,
    }),
    method: 'function approve(address spender, uint256 amount) returns (bool)',
    params: [SAVINGS_VAULT_ADDRESS, amountWei],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

/**
 * Deposit MFI tokens to mint/upgrade NFT bouquet
 * @param client - Panna SDK client
 * @param account - Active wallet account
 * @param amount - Amount of MFI to deposit (in MFI units, e.g., "30")
 */
export async function depositMFI(client: any, account: any, amount: string) {
  const amountWei = parseUnits(amount, 18)
  
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: SAVINGS_VAULT_ADDRESS,
    }),
    method: 'function deposit(uint256 amount)',
    params: [amountWei],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

/**
 * Redeem (burn) NFT bouquet to get MFI back
 * @param client - Panna SDK client
 * @param account - Active wallet account
 * @param tokenId - NFT token ID to redeem
 */
export async function redeemNFT(client: any, account: any, tokenId: bigint) {
  const tx = prepareContractCall({
    contract: getContract({
      client,
      chain: liskSepolia,
      address: SAVINGS_VAULT_ADDRESS,
    }),
    method: 'function redeem(uint256 tokenId)',
    params: [tokenId],
  })

  const result = await sendTransaction({
    account,
    transaction: tx,
  })

  await waitForReceipt(result)
  return result
}

// ============================================
// CONTRACT READ FUNCTIONS (Read-only)
// ============================================

/**
 * Get MFI token balance for an address
 */
export async function getMFIBalance(client: any, address: string): Promise<bigint> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: MFI_TOKEN_ADDRESS,
  })

  const balance = await readContract({
    contract,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [address],
  })

  return balance
}

/**
 * Get MFI allowance for SavingsVault
 */
export async function getMFIAllowance(client: any, ownerAddress: string): Promise<bigint> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: MFI_TOKEN_ADDRESS,
  })

  const allowance = await readContract({
    contract,
    method: 'function allowance(address owner, address spender) view returns (uint256)',
    params: [ownerAddress, SAVINGS_VAULT_ADDRESS],
  })

  return allowance
}

/**
 * Preview redemption details (principal, fee, payout)
 */
export async function previewRedeem(
  client: any,
  tokenId: bigint
): Promise<{ principal: bigint; fee: bigint; payout: bigint }> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: SAVINGS_VAULT_ADDRESS,
  })

  const result = await readContract({
    contract,
    method: 'function previewRedeem(uint256 tokenId) view returns (uint256 principal, uint256 fee, uint256 payout)',
    params: [tokenId],
  })

  return {
    principal: result[0],
    fee: result[1],
    payout: result[2],
  }
}

/**
 * Get all NFT token IDs owned by user
 */
export async function getUserBouquets(client: any, userAddress: string): Promise<bigint[]> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: SAVINGS_VAULT_ADDRESS,
  })

  const tokenIds = await readContract({
    contract,
    method: 'function getUserDeposits(address user) view returns (uint256[])',
    params: [userAddress],
  })

  return tokenIds.map((id: any) => BigInt(id))
}

/**
 * Get detailed bouquet data for a token ID including NFT metadata
 */
export async function getBouquetDetails(client: any, tokenId: bigint): Promise<Bouquet> {
  const nftContract = getContract({
    client,
    chain: liskSepolia,
    address: SAVINGS_NFT_ADDRESS,
  })

  try {
    // Get owner
    const owner = await readContract({
      contract: nftContract,
      method: 'function ownerOf(uint256 tokenId) view returns (address)',
      params: [tokenId],
    })

    // Get rose count using roseCountOf
    const roseCount = await readContract({
      contract: nftContract,
      method: 'function roseCountOf(uint256 tokenId) view returns (uint8)',
      params: [tokenId],
    })

    // Calculate value from rose count (each rose = 10 MFI = 10e18 wei)
    const value = BigInt(Number(roseCount)) * 10n * 10n ** 18n

    // Get metadata URI
    let metadataURI: string | undefined
    let image: string | undefined
    let name: string | undefined

    try {
      metadataURI = await readContract({
        contract: nftContract,
        method: 'function tokenURI(uint256 tokenId) view returns (string)',
        params: [tokenId],
      }) as string

      // Fetch metadata from IPFS
      if (metadataURI) {
        try {
          const response = await fetch(metadataURI)
          if (response.ok) {
            const metadata = await response.json()
            image = metadata.image
            name = metadata.name
          }
        } catch (fetchErr) {
          console.warn(`Failed to fetch metadata from ${metadataURI}:`, fetchErr)
        }
      }
    } catch (uriErr) {
      console.warn(`Failed to get tokenURI for ${tokenId}:`, uriErr)
    }

    return {
      tokenId,
      owner: owner as string,
      roseCount: Number(roseCount),
      totalValue: value,
      exists: true,
      image,
      name,
      metadataURI,
    }
  } catch (err) {
    console.error(`Failed to fetch bouquet ${tokenId}:`, err)
    throw err
  }
}

/**
 * Get NFT balance for user
 */
export async function getNFTBalance(client: any, address: string): Promise<number> {
  const contract = getContract({
    client,
    chain: liskSepolia,
    address: SAVINGS_NFT_ADDRESS,
  })

  const balance = await readContract({
    contract,
    method: 'function balanceOf(address owner) view returns (uint256)',
    params: [address],
  })

  return Number(balance)
}

// ============================================
// CLIENT-SIDE HELPER FUNCTIONS
// ============================================

/**
 * Check if user needs to approve more MFI
 */
export async function needsApproval(
  client: any,
  userAddress: string,
  requiredAmount: string
): Promise<boolean> {
  const allowance = await getMFIAllowance(client, userAddress)
  const required = parseUnits(requiredAmount, 18)
  return allowance < required
}

/**
 * Format bouquet display text
 */
export function formatBouquetDisplay(bouquet: Bouquet): string {
  const roses = bouquet.roseCount === 1 ? '1 rose' : `${bouquet.roseCount} roses`
  const value = formatMFI(bouquet.totalValue)
  return `${roses} (${value} MFI)`
}

/**
 * Calculate how many more MFI needed to reach next rose
 */
export function getMFIToNextRose(currentValue: bigint): bigint {
  const mfiPerRose = 10n * 10n ** 18n
  const currentRoses = currentValue / mfiPerRose
  const nextRoseValue = (currentRoses + 1n) * mfiPerRose
  return nextRoseValue - currentValue
}

// Export contract addresses for convenience
export {
  MFI_TOKEN_ADDRESS,
  SAVINGS_NFT_ADDRESS,
  EXCHANGE_ADDRESS,
  SAVINGS_VAULT_ADDRESS,
  formatMFI,
  formatETH,
}