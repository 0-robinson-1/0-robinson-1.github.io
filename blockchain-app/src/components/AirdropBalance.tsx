// src/components/AirdropBalance.tsx
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { connection } from '../solana';

interface AirdropBalanceProps {
  balance: number | null;
  error: string | null;
  onRefresh: () => void;
}

export default function AirdropBalance({ balance, error, onRefresh }: AirdropBalanceProps) {
  const { keypair } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleAirdrop = async () => {
    if (!keypair) return;
    setLoading(true);
    try {
      const signature = await connection.requestAirdrop(keypair.publicKey, 1e9); // 1 SOL
      await connection.confirmTransaction(signature);
      onRefresh(); // Refresh balance after airdrop
    } catch (err: any) {
      // Handle error (you can add error state if needed)
    } finally {
      setLoading(false);
    }
  };

  if (!keypair) return null;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {balance !== null && (
        <p>Your balance: {balance.toFixed(4)} SOL</p>
      )}
      <button onClick={handleAirdrop} disabled={loading}>
        {loading ? 'Requesting...' : 'Request 1 SOL Airdrop'}
      </button>
    </div>
  );
}