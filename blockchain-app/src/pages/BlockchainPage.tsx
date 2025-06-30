// src/pages/BlockchainPage.tsx
import { useWallet } from '../contexts/WalletContext';
import WalletGate from '../components/WalletGate';
import AirdropBalance from '../components/AirdropBalance';
import SendSol from '../components/SendSol';

// src/storage.ts
export async function getWallet(id: string) {
  const res = await fetch(`/api/get-wallet/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Failed to fetch wallet');
  return res.json();
}

export default function BlockchainPage() {
  const { keypair } = useWallet();

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
  );
}
export async function listWallets() {
  const res = await fetch('/api/list-wallets');
  if (!res.ok) throw new Error('Failed to list wallets');
  return res.json();
}