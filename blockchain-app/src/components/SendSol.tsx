// src/components/SendSol.tsx
import { useState } from 'react'
import { connection } from '../solana'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey
} from '@solana/web3.js'
import { useWallet } from '../contexts/WalletContext'


export default function SendSol() {
  const { keypair } = useWallet()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount]       = useState(0.1)
  const [status, setStatus]       = useState<string | null>(null)
  const [sending, setSending]     = useState(false)

  if (!keypair) return null

  const onSend = async () => {
    setStatus(null)
    setSending(true)
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      )
      const sig = await sendAndConfirmTransaction(connection, tx, [keypair])
      setStatus(`Sent ${amount} SOL. Signature: ${sig}`)
    } catch (err: any) {
      setStatus(`Error: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h4>Send SOL</h4>
      <label style={{ display: 'block', marginBottom: '0.75rem' }}>
        Recipient Public Key:
        <input
          type="text"
          placeholder="Paste recipient address"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </label>
      <label style={{ marginLeft: '1rem' }}>
        Amount:{' '}
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(+e.target.value)}
          style={{ width: '4rem' }}
        /> SOL
      </label>
      <button
        onClick={onSend}
        disabled={sending || amount <= 0 || !recipient}
        style={{ marginLeft: '1rem' }}
      >
        {sending ? 'Sending…' : 'Send'}
      </button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  )
}