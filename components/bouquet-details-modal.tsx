"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Sparkles, Coins, TrendingDown, AlertTriangle } from "lucide-react"
import { Bouquet } from "@/types/contracts"
import { formatMFI, previewRedeem, redeemNFT } from "@/lib/contract"
import { useBouquets } from "@/hooks/useBouquets"
import { useContract } from "@/hooks/useContract"
import { toast } from "sonner"

interface BouquetDetailsModalProps {
  bouquet: Bouquet | null
  isOpen: boolean
  onClose: () => void
}

function renderRoses(count: number) {
  const roses = []
  for (let i = 0; i < count; i++) {
    roses.push(
      <span 
        key={i} 
        className="text-4xl animate-float inline-block"
        style={{ animationDelay: `${i * 0.1}s` }}
      >
        🌹
      </span>
    )
  }
  return roses
}

export default function BouquetDetailsModal({ bouquet, isOpen, onClose }: BouquetDetailsModalProps) {
  const { client, account } = useContract()
  const { refresh } = useBouquets()
  const [isLoading, setIsLoading] = useState(false)
  const [redeemPreview, setRedeemPreview] = useState<{
    principal: bigint
    fee: bigint
    payout: bigint
  } | null>(null)

  if (!bouquet) return null

  const progress = (bouquet.roseCount / 10) * 100
  const mfiValue = formatMFI(bouquet.totalValue)

  // Load preview when modal opens
  const loadPreview = async () => {
    if (!client || !bouquet) return
    try {
      const preview = await previewRedeem(client, bouquet.tokenId)
      setRedeemPreview(preview)
    } catch (err) {
      console.error("Error loading preview:", err)
    }
  }

  // Load preview on mount
  if (isOpen && !redeemPreview) {
    loadPreview()
  }

  const handleRedeem = async () => {
    if (!client || !account) {
      toast.error("Wallet not connected")
      return
    }

    setIsLoading(true)
    try {
      toast.info("Redeeming bouquet...", {
        description: "Please confirm the transaction",
      })

      await redeemNFT(client, account, bouquet.tokenId)

      toast.success("Bouquet redeemed!", {
        description: `You received ${redeemPreview ? formatMFI(redeemPreview.payout) : '—'} MFI 🎉`,
      })

      await refresh()
      onClose()
    } catch (err: unknown) {
      console.error("Error redeeming:", err)
      toast.error("Redemption failed", {
        description: (err as Error).message || "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">🌹</span>
            {bouquet.name || `Bouquet #${bouquet.tokenId.toString()}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bouquet visualization - show NFT image or fallback to roses */}
          <div 
            className={`h-48 rounded-lg flex items-center justify-center relative overflow-hidden bg-linear-to-b from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 ${bouquet.image ? 'cursor-pointer group/image' : ''}`}
            onClick={() => bouquet.image && window.open(bouquet.image, '_blank')}
            title={bouquet.image ? 'Click to view full image' : ''}
          >
            {bouquet.image ? (
              <>
                <div className="relative w-full h-full">
                  <Image 
                    src={bouquet.image} 
                    alt={bouquet.name || `Bouquet #${bouquet.tokenId.toString()}`}
                    fill
                    className="object-cover rounded-lg transition-transform duration-300 group-hover/image:scale-105"
                    unoptimized
                  />
                </div>
                {/* Overlay hint on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    View full image
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center items-center max-w-[250px]">
                {renderRoses(bouquet.roseCount)}
              </div>
            )}
            
            {bouquet.roseCount >= 5 && (
              <>
                <div className="absolute top-4 left-4 animate-bounce-in pointer-events-none">
                  <Sparkles className="w-7 h-7 text-yellow-500" />
                </div>
                <div className="absolute top-6 right-6 text-3xl animate-pulse pointer-events-none">✨</div>
              </>
            )}
            
            {bouquet.roseCount === 10 && (
              <>
                <div className="absolute bottom-6 left-6 text-2xl opacity-50 animate-bounce pointer-events-none">🌺</div>
                <div className="absolute bottom-6 right-6 text-2xl opacity-50 animate-bounce delay-100 pointer-events-none">🦋</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-pulse opacity-20 pointer-events-none">
                  👑
                </div>
              </>
            )}
          </div>

          {/* Bouquet stats */}
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Bouquet Progress
                </span>
                <span className="text-muted-foreground">{Math.floor(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {bouquet.roseCount} of 10 roses
                {bouquet.roseCount === 10 && " - Full bouquet! 👑"}
              </p>
            </div>

            {/* Value */}
            <Card className="p-4 bg-green-500/10 border-green-500/30">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4 text-green-500" />
                  Total Value
                </span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  {mfiValue} MFI
                </span>
              </div>
            </Card>

            {/* Redemption preview */}
            {redeemPreview && (
              <Card className="p-4 bg-rose-500/10 border-rose-500/30">
                <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Redemption Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Principal</span>
                    <span className="font-medium">{formatMFI(redeemPreview.principal)} MFI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                    <span className="font-medium text-red-500">-{formatMFI(redeemPreview.fee)} MFI</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold">You Receive</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatMFI(redeemPreview.payout)} MFI
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Warning */}
            <Card className="p-3 bg-orange-500/10 border-orange-500/30">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Warning:</strong> Redeeming will burn this NFT permanently and return your MFI minus the 2.5% platform fee.
                </p>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Close
            </Button>
            <Button
              onClick={handleRedeem}
              disabled={isLoading}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Redeeming...
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4" />
                  Redeem Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
