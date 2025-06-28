// src/pages/BlockchainPage.tsx
import React from 'react'
import { useWallet } from '../contexts/WalletContext'
import WalletGate from '../components/WalletGate'
import AirdropBalance from '../components/AirdropBalance'
import SendSol from '../components/SendSol'

export default function BlockchainPage() {
  const { keypair } = useWallet()

  return (
    <div className="blockchain-page" style={{ padding: '1rem', maxWidth: 400, margin: '0 auto' }}>
      <h2>RobinSon Test Blockchain</h2>
      <WalletGate />

      {keypair && (
        <>
          <AirdropBalance />
          <SendSol />
        </>
      )}
    </div>
  )
}