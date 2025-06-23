// src/components/AirdropBalance.tsx
import React, { useState, useEffect } from 'react'
import { connection } from '../solana'
import { useWallet } from '../contexts/WalletContext'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export default function AirdropBalance() {
  const { keypair } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // Fetch current balance whenever the keypair changes
  useEffect(() => {
    if (!keypair) return
    ;(async () => {
      try {
        const lamports = await connection.getBalance(keypair.publicKey)
        setBalance(lamports / LAMPORTS_PER_SOL)
      } catch (err: any) {
        setError(err.message)
      }
    })()
  }, [keypair])

  const handleAirdrop = async () => {
    if (!keypair) return
    setLoading(true)
    setError(null)
    try {
      const sig = await connection.requestAirdrop(
        keypair.publicKey,
        LAMPORTS_PER_SOL
      )
      await connection.confirmTransaction(sig, 'confirmed')
      // Refresh balance
      const lamports = await connection.getBalance(keypair.publicKey)
      setBalance(lamports / LAMPORTS_PER_SOL)
    } catch (err: any) {
      // handle the Devnet‐faucet 429 specifically:
      if (err?.error?.code === 429) {
        setError(
          'Airdrop limit reached on Devnet. Try the manual faucet: https://faucet.solana.com'
        )
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!keypair) return null // hide when not logged in

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <button onClick={handleAirdrop} disabled={loading}>
        {loading ? 'Airdropping…' : 'Request 1 SOL Airdrop'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {balance !== null && (
        <p>Your balance: <strong>{balance.toFixed(4)} SOL</strong></p>
      )}
    </div>
  )
}