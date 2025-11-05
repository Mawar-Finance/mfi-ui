"use client"

import { Flower2 } from "lucide-react"
import { LoginButton, useActiveAccount, liskSepolia } from "panna-sdk"

export default function SavingsHeader() {
  const activeAccount = useActiveAccount()
  const isConnected = !!activeAccount

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mawar Finance</h1>
            <p className="text-xs text-muted-foreground">On-chain Savings DApp</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
              Lisk Sepolia
            </span>
          </div>
          <LoginButton chain={liskSepolia} />
        </div>
      </div>
    </header>
  )
}
