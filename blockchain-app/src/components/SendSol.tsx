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

// Example recipients; replace with actual Devnet public keys
const demoRecipients = [
  '3qiNtjtE2VDnDcVuGgbFU7P3KTh5FKhXFTg1qZAc4wvW',
  '9xQeWvG816bUx9EEzMwWwwEDtKxjKXxo9TXo3K5iU7mm',
  '4Nd1mSZ5N4gxZzYXeXpPZUZDPEvsuH3w4iwUXdak4o7g'
]

export default function SendSol() {
  const { keypair } = useWallet()
  const [recipient, setRecipient] = useState(demoRecipients[0])
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
      <label>
        Recipient:{' '}
        <select value={recipient} onChange={e => setRecipient(e.target.value)}>
          {demoRecipients.map(pk => (
            <option key={pk} value={pk}>{pk}</option>
          ))}
        </select>
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
        disabled={sending || amount <= 0}
        style={{ marginLeft: '1rem' }}
      >
        {sending ? 'Sending…' : 'Send'}
      </button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  )
}