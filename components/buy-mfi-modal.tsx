"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, TrendingUp, AlertCircle } from "lucide-react"
import { useContract } from "@/hooks/useContract"
import { buyMFI } from "@/lib/contract"
import { toast } from "sonner"

interface BuyMFIModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void | Promise<void>
}

export default function BuyMFIModal({ isOpen, onClose, onSuccess }: BuyMFIModalProps) {
  const { client, account } = useContract()
  const [ethAmount, setEthAmount] = useState("0.01")
  const [isLoading, setIsLoading] = useState(false)

  const handleBuy = async () => {
    if (!client || !account) {
      toast.error("Wallet not connected")
      return
    }

    const amount = parseFloat(ethAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    try {
      toast.info("Buying MFI...", {
        description: "Please confirm the transaction",
      })

      await buyMFI(client, account, ethAmount)

      const mfiReceived = amount * 3000
      toast.success("Purchase successful!", {
        description: `You received ${mfiReceived.toLocaleString()} MFI tokens 🎉`,
      })

      onClose()
      setEthAmount("0.01")
      
      if (onSuccess) {
        setTimeout(async () => {
          await onSuccess()
        }, 3000)
      }
    } catch (err: any) {
      console.error("Error buying MFI:", err)
      toast.error("Purchase failed", {
        description: err.message || "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const mfiAmount = (parseFloat(ethAmount || "0") * 3000).toLocaleString()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-green-500" />
            Buy MFI Tokens
          </DialogTitle>
          <DialogDescription>Exchange ETH for MFI tokens</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Exchange rate display */}
          <Card className="p-4 bg-blue-500/10 border-blue-500/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <span className="font-bold text-foreground">1 ETH = 3,000 MFI</span>
            </div>
          </Card>

          {/* ETH input */}
          <div className="space-y-2">
            <Label htmlFor="ethAmount">ETH Amount</Label>
            <Input
              id="ethAmount"
              type="number"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              placeholder="0.01"
              min="0.001"
              step="0.001"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Minimum: 0,0000001 ETH
            </p>
          </div>

          {/* Preview card */}
          <Card className="p-4 border-2 border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">You Pay</span>
                <span className="font-semibold text-foreground">{ethAmount} ETH</span>
              </div>
              <div className="flex items-center justify-center text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">You Receive</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  {mfiAmount} MFI
                </span>
              </div>
            </div>
          </Card>

          {/* Info card */}
          <Card className="p-3 bg-orange-500/10 border-orange-500/30">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Note:</strong> Make sure your wallet has enough ETH to cover the purchase amount plus gas fees.</p>
                <p className="pt-1">
                  💡 <strong>Tip:</strong> 100 MFI = 10 roses (1 full bouquet)
                </p>
              </div>
            </div>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              disabled={isLoading || parseFloat(ethAmount || "0") <= 0}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  Buy MFI
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
