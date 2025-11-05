"use client"

import { useState } from "react"
import SavingsHeader from "@/components/savings-header"
import SavingsGrid from "@/components/savings-grid"
import StatsSidebar from "@/components/savings-sidebar"
import BouquetDetailsModal from "@/components/bouquet-details-modal"
import DepositModal from "@/components/deposit-modal"
import { useBouquets } from "@/hooks/useBouquets"

export default function Home() {
  const [selectedBouquetId, setSelectedBouquetId] = useState<bigint | null>(null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const { bouquets } = useBouquets()

  const selectedBouquet = bouquets.find((b) => b.tokenId === selectedBouquetId) || null

  return (
    <div className="min-h-screen bg-background">
      <SavingsHeader />
      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        <main className="flex-1">
          <SavingsGrid onSelectBouquet={setSelectedBouquetId} onDeposit={() => setShowDepositModal(true)} />
        </main>
        <aside className="w-80">
          <StatsSidebar selectedBouquetId={selectedBouquetId} />
        </aside>
      </div>

      {/* Modals */}
      <BouquetDetailsModal
        bouquet={selectedBouquet}
        isOpen={!!selectedBouquetId}
        onClose={() => setSelectedBouquetId(null)}
      />
      <DepositModal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} />
    </div>
  )
}

