"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Coins, TrendingUp } from "lucide-react"
import { useBouquets } from "@/hooks/useBouquets"
import { useContract } from "@/hooks/useContract"
import { approveMFI, depositMFI, needsApproval } from "@/lib/contract"
import { toast } from "sonner"
import { parseUnits } from "ethers"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { refresh, mfiBalance } = useBouquets()
  const { client, account } = useContract()
  const [amount, setAmount] = useState("10")
  const [isLoading, setIsLoading] = useState(false)

  const handleDeposit = async () => {
    if (!client || !account) {
      toast.error("Wallet not connected")
      return
    }

    const depositAmount = parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (depositAmount < 10) {
      toast.error("Minimum deposit is 10 MFI (1 rose)")
      return
    }

    // Check balance
    const balance = Number(mfiBalance) / Number(10n ** 18n)
    if (depositAmount > balance) {
      toast.error("Insufficient MFI balance")
      return
    }

    setIsLoading(true)
    try {
      // Check if approval is needed
      const needsApprovalCheck = await needsApproval(client, account.address, amount)
      
      if (needsApprovalCheck) {
        toast.info("Approving MFI...", {
          description: "Please confirm the approval transaction",
        })
        await approveMFI(client, account, amount)
        toast.success("Approval successful!")
      }

      // Deposit
      toast.info("Depositing MFI...", {
        description: "Please confirm the deposit transaction",
      })
      await depositMFI(client, account, amount)

      toast.success("Deposit successful!", {
        description: `${amount} MFI deposited. Check your new roses! 🌹`,
      })

      // Wait a bit for blockchain to update, then refresh
      setTimeout(async () => {
        await refresh()
      }, 2000)
      
      onClose()
      setAmount("10")
    } catch (err: any) {
      console.error("Error depositing:", err)
      toast.error("Deposit failed", {
        description: err.message || "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const roses = Math.floor(parseFloat(amount || "0") / 10)
  const mfiBalanceFormatted = (Number(mfiBalance) / Number(10n ** 18n)).toFixed(2)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            Deposit MFI
          </DialogTitle>
          <DialogDescription>Deposit MFI tokens to grow your rose bouquet</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Balance display */}
          <Card className="p-3 bg-green-500/10 border-green-500/30">
            <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
            <p className="flex items-center gap-2 font-bold text-lg text-green-600 dark:text-green-400">
              <Coins className="w-5 h-5" />
              {mfiBalanceFormatted} MFI
            </p>
          </Card>

          {/* Amount input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Deposit Amount (MFI)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10"
              min="10"
              step="10"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Minimum: 10 MFI (1 rose) • Recommended: Multiples of 10
            </p>
          </div>

          {/* Preview card */}
          <Card className="p-4 border-2 border-rose-500/30 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20">
            <div className="text-center">
              <div className="text-4xl mb-3">
                {roses > 0 ? '🌹'.repeat(Math.min(roses, 10)) : '—'}
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                {roses === 0 ? 'Enter Amount' : `+${roses} Rose${roses > 1 ? 's' : ''}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {roses === 0 
                  ? 'Deposit at least 10 MFI to get 1 rose'
                  : roses > 10
                    ? `⚠️ Exceeds 10 roses - will create multiple bouquets`
                    : `Each rose represents 10 MFI deposited`
                }
              </p>
            </div>
          </Card>

          {/* Info card */}
          <Card className="p-3 bg-muted/30 border-rose-500/20">
            <p className="text-xs text-muted-foreground">
              🌹 <strong>1 Rose = 10 MFI</strong> deposited
              <br />
              💐 <strong>Max 10 roses</strong> per bouquet
              <br />
              🔄 <strong>2.5% fee</strong> when you redeem
              <br />
              ✨ <strong>NFT receipt</strong> minted automatically
            </p>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={isLoading || roses === 0}
              className="flex-1 gap-2 bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Deposit {amount} MFI
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
