// src/components/SendSol.tsx
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { connection } from '../solana';
import { Transaction, SystemProgram, PublicKey, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface SendSolProps {
  onTransactionSuccess: () => void;
}

export default function SendSol({ onTransactionSuccess }: SendSolProps) {
  const { keypair } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0.1);
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  if (!keypair) return null;

  const onSend = async () => {
    setStatus(null);
    setSending(true);
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      const sig = await sendAndConfirmTransaction(connection, tx, [keypair]);
      setStatus(`Sent ${amount} SOL. Signature: ${sig}`);
      onTransactionSuccess(); // Refresh balance after successful send
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

    return (
      <div style={{ marginTop: '2rem' }}>
        {status && (
          <p className="transaction-status"> {/* Replaced inline styles with class */}
            {status}
          </p>
        )}
      <label>
        Recipient Public Key:
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Paste recipient address"
        />
      </label>
      <br />
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          step="0.01"
        />
        SOL
      </label>
      <br />
      <button onClick={onSend} disabled={sending || !recipient}>
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}