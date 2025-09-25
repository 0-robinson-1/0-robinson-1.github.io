// src/pages/BlockchainPage.tsx
import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import WalletGate from '../components/WalletGate';
import AirdropBalance from '../components/AirdropBalance';
import SendSol from '../components/SendSol';
import { connection } from '../solana'; // Import connection for balance fetching

export default function BlockchainPage() {
  const { keypair } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Function to fetch and update balance
  const refreshBalance = async () => {
    if (!keypair) return;
    try {
      const lamports = await connection.getBalance(keypair.publicKey);
      setBalance(lamports / 1e9); // Convert to SOL
      setBalanceError(null);
    } catch (err: any) {
      setBalanceError(err.message);
    }
  };

  // Fetch balance when keypair changes
  useEffect(() => {
    refreshBalance();
  }, [keypair]);

  return (
    <div className="blockchain-page" style={{ padding: '1rem', maxWidth: 400, margin: '0 auto' }}>
      <h2>RobinSon Test Blockchain</h2>
      <WalletGate />

      {keypair && (
        <>
          <AirdropBalance balance={balance} error={balanceError} onRefresh={refreshBalance} />
          <SendSol onTransactionSuccess={refreshBalance} />
        </>
      )}
    </div>
  );
}