// src/pages/BlockchainPage.tsx
import React from 'react'
import { useWallet } from '../contexts/WalletContext'
import WalletGate from '../components/WalletGate'
import AirdropBalance from '../components/AirdropBalance'

export default function BlockchainPage() {
  const { keypair } = useWallet()

  return (
    <div style={{ padding: '1rem', maxWidth: 400, margin: '0 auto' }}>
      <h2>RobinSon Test Blockchain</h2>
      <WalletGate />

      {keypair && (
        <>
          <AirdropBalance />
          {/* next: <SendSol /> here */}
        </>
      )}
    </div>
  )
}