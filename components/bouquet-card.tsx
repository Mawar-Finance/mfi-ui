"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Coins } from "lucide-react"
import { Bouquet } from "@/types/contracts"
import { formatMFI } from "@/lib/contract"

const ROSE_COUNT_COLORS = {
  low: "from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950",
  medium: "from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950",
  high: "from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950",
}

const ROSE_COUNT_HOVER = {
  low: "group-hover:from-pink-100 group-hover:to-rose-100 dark:group-hover:from-pink-900 dark:group-hover:to-rose-900",
  medium: "group-hover:from-rose-100 group-hover:to-red-100 dark:group-hover:from-rose-900 dark:group-hover:to-red-900",
  high: "group-hover:from-red-100 group-hover:to-pink-100 dark:group-hover:from-red-900 dark:group-hover:to-pink-900",
}

const ROSE_COUNT_BORDERS = {
  low: "border-pink-300 dark:border-pink-700",
  medium: "border-rose-300 dark:border-rose-700",
  high: "border-red-300 dark:border-red-700",
}

function getRoseColorCategory(count: number): 'low' | 'medium' | 'high' {
  if (count <= 3) return 'low'
  if (count <= 7) return 'medium'
  return 'high'
}

function renderRoses(count: number) {
  const roses = []
  for (let i = 0; i < count; i++) {
    roses.push(
      <span 
        key={i} 
        className="text-3xl animate-float inline-block"
        style={{ animationDelay: `${i * 0.1}s` }}
      >
        🌹
      </span>
    )
  }
  return roses
}

export default function BouquetCard({ bouquet }: { bouquet: Bouquet }) {
  const colorCategory = getRoseColorCategory(bouquet.roseCount)
  const progress = (bouquet.roseCount / 10) * 100
  const mfiValue = formatMFI(bouquet.totalValue)

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ease-out animate-grow border-2 cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${ROSE_COUNT_BORDERS[colorCategory]} hover:border-opacity-100`}
    >
      {/* Bouquet visualization */}
      <div className={`h-48 flex items-center justify-center relative overflow-hidden transition-all duration-300 ease-out bg-linear-to-b ${ROSE_COUNT_COLORS[colorCategory]} ${ROSE_COUNT_HOVER[colorCategory]}`}>
        <div className="flex flex-wrap gap-2 justify-center items-center max-w-[200px]">
          {renderRoses(bouquet.roseCount)}
        </div>
        
        {/* Decorations */}
        {bouquet.roseCount >= 5 && (
          <>
            <div className="absolute top-3 left-3 animate-bounce-in">
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="absolute top-6 right-6 text-2xl animate-pulse">✨</div>
          </>
        )}
        
        {bouquet.roseCount === 10 && (
          <>
            <div className="absolute bottom-6 left-6 text-xl opacity-50 animate-bounce">🌺</div>
            <div className="absolute bottom-6 right-6 text-xl opacity-50 animate-bounce delay-100">🦋</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-pulse opacity-20">
              👑
            </div>
          </>
        )}
      </div>

      {/* Bouquet info */}
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Bouquet #{bouquet.tokenId.toString()}</h3>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30`}>
                {bouquet.roseCount} {bouquet.roseCount === 1 ? 'Rose' : 'Roses'}
              </span>
              {bouquet.roseCount === 10 && (
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30">
                  👑 Full Bouquet!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bouquet Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Bouquet Progress
            </span>
            <span className="text-muted-foreground font-medium">{Math.floor(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {bouquet.roseCount < 10 && (
            <p className="text-xs text-muted-foreground">
              Deposit {10 - bouquet.roseCount} more rose(s) to complete this bouquet
            </p>
          )}
        </div>

        {/* MFI Value */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Coins className="w-4 h-4 text-green-500" />
              Total Value
            </span>
            <span className="text-muted-foreground font-semibold">{mfiValue} MFI</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>≈ {(bouquet.roseCount * 10)} MFI deposited</p>
          </div>
        </div>

        {/* Redemption info */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          <p className="flex items-center justify-between">
            <span>If redeemed now:</span>
            <span className="font-semibold text-foreground">
              {formatMFI(bouquet.totalValue * 975n / 1000n)} MFI
            </span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            (2.5% platform fee applies)
          </p>
        </div>
      </div>
    </Card>
  )
}
