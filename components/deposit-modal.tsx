"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Coins, TrendingUp } from "lucide-react"
import { useContract } from "@/hooks/useContract"
import { approveMFI, depositMFI, formatMFI, needsApproval } from "@/lib/contract"
import { toast } from "sonner"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void | Promise<void>
  mfiBalance: bigint
}

export default function DepositModal({ isOpen, onClose, onSuccess, mfiBalance }: DepositModalProps) {
  const { client, account } = useContract()
  const [isLoading, setIsLoading] = useState(false)

  const handleDeposit = async () => {
    if (!client || !account) {
      toast.error("Wallet not connected")
      return
    }

    // Fixed deposit amount of 10 MFI
    const depositAmount = "10"

    // Check balance
    const balance = Number(mfiBalance) / Number(10n ** 18n)
    if (parseFloat(depositAmount) > balance) {
      toast.error("Insufficient MFI balance", {
        description: `You need at least 10 MFI. Current balance: ${balance.toFixed(2)} MFI`,
      })
      return
    }

    setIsLoading(true)
    try {
      // Check if approval is needed
      const needsApprovalCheck = await needsApproval(client, account.address, depositAmount)
      
      if (needsApprovalCheck) {
        toast.info("Approving MFI...", {
          description: "Please confirm the approval transaction",
        })
        await approveMFI(client, account, depositAmount)
        toast.success("Approval successful!")
      }

      // Deposit
      toast.info("Depositing MFI...", {
        description: "Please confirm the deposit transaction",
      })
      await depositMFI(client, account, depositAmount)

      toast.success("Deposit successful!", {
        description: `10 MFI deposited. Your bouquet will update shortly! 🌹`,
      })

      onClose()
      
      if (onSuccess) {
        setTimeout(async () => {
          await onSuccess()
        }, 3000)
      }
    } catch (err: unknown) {
      console.error("Error depositing:", err)
      toast.error("Deposit failed", {
        description: (err as Error).message || "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const roses = 1 // Fixed at 1 rose for 10 MFI deposit
  const mfiBalanceFormatted = formatMFI(mfiBalance, 2)

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
              type="text"
              value="10"
              placeholder="10"
              disabled={isLoading}
              readOnly
              className="cursor-not-allowed bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Fixed amount: 10 MFI = 1 rose 🌹
            </p>
          </div>

          {/* Preview card */}
          <Card className="p-4 border-2 border-rose-500/30 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20">
            <div className="text-center">
              <div className="text-4xl mb-3">
                🌹
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                +1 Rose
              </h3>
              <p className="text-sm text-muted-foreground">
                You will receive 1 rose for your bouquet
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
              variant="ghost"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={isLoading}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Deposit 10 MFI
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
