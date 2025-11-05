// ============================================
// MAWAR FINANCE - Contract Types & ABIs
// ============================================

// NFT Bouquet interface (represents user's savings as rose bouquet)
export interface Bouquet {
  tokenId: bigint
  owner: string
  roseCount: number // 1-10 roses (each rose = 10 MFI deposited)
  totalValue: bigint // Total MFI value in wei (18 decimals)
  exists: boolean
}

// Contract addresses dari environment variables
export const MFI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MFI_TOKEN_ADDRESS || ''
export const SAVINGS_NFT_ADDRESS = process.env.NEXT_PUBLIC_SAVINGS_NFT_ADDRESS || ''
export const EXCHANGE_ADDRESS = process.env.NEXT_PUBLIC_EXCHANGE_ADDRESS || ''
export const SAVINGS_VAULT_ADDRESS = process.env.NEXT_PUBLIC_SAVINGS_VAULT_ADDRESS || ''

// Contract constants
export const MFI_PER_ROSE = 10n // 10 MFI per rose
export const MAX_ROSES_PER_BOUQUET = 10n // Max 10 roses per bouquet
export const FEE_BASIS_POINTS = 250n // 2.5% platform fee
export const EXCHANGE_RATE = 3000n // 3000 MFI per 1 ETH (1 MFI = $1 USD)

// ============================================
// MFI TOKEN (ERC20) ABI
// ============================================
export const MFI_TOKEN_ABI = [
  // ERC20 Standard functions
  {
    inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }, { internalType: 'address', name: 'spender', type: 'address' }],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// ============================================
// EXCHANGE CONTRACT ABI
// ============================================
export const EXCHANGE_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }],
    name: 'buyMFI',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RATE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mfiToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'ethAmount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'mfiAmount', type: 'uint256' },
    ],
    name: 'MFIPurchased',
    type: 'event',
  },
] as const

// ============================================
// SAVINGS VAULT CONTRACT ABI
// ============================================
export const SAVINGS_VAULT_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'redeem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'previewRedeem',
    outputs: [
      { internalType: 'uint256', name: 'principal', type: 'uint256' },
      { internalType: 'uint256', name: 'fee', type: 'uint256' },
      { internalType: 'uint256', name: 'payout', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserDeposits',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mfiToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'savingsNFT',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'treasury',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeBasisPoints',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Deposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'principal', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'payout', type: 'uint256' },
    ],
    name: 'Redeemed',
    type: 'event',
  },
] as const

// ============================================
// SAVINGS NFT CONTRACT ABI
// ============================================
export const SAVINGS_NFT_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getValue',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getRoseCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const

// ============================================
// HELPER FUNCTIONS
// ============================================

// Calculate rose count from MFI amount
export function calculateRoseCount(mfiAmount: bigint): number {
  return Number(mfiAmount / (MFI_PER_ROSE * 10n ** 18n))
}

// Calculate MFI value from rose count
export function calculateMFIValue(roseCount: number): bigint {
  return BigInt(roseCount) * MFI_PER_ROSE * 10n ** 18n
}

// Calculate fee and payout for redemption
export function calculateRedemptionFee(principal: bigint): { fee: bigint; payout: bigint } {
  const fee = (principal * FEE_BASIS_POINTS) / 10000n
  const payout = principal - fee
  return { fee, payout }
}

// Format MFI amount to human-readable string
export function formatMFI(amount: bigint, decimals: number = 2): string {
  const value = Number(amount) / Number(10n ** 18n)
  return value.toFixed(decimals)
}

// Format ETH amount to human-readable string
export function formatETH(amount: bigint, decimals: number = 4): string {
  const value = Number(amount) / Number(10n ** 18n)
  return value.toFixed(decimals)
}