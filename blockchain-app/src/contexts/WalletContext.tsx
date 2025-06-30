import React, { createContext, useContext, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { decryptSecret, encryptSecret } from '../utils/encryption';
import { saveWallet, getWallet, listWallets } from '../storage';

interface WalletContextValue {
  keypair: Keypair | null;
  publicKey: PublicKey | null;
  createWallet: (password: string) => Promise<void>;
  login: (id: string, password: string) => Promise<void>;
  logout: () => void;
  listWallets: () => Promise<string[]>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [keypair, setKeypair] = useState<Keypair | null>(null);

  const createWallet = async (password: string) => {
    const newWallet = Keypair.generate();
    const encrypted = await encryptSecret(newWallet.secretKey, password);
    setKeypair(newWallet);
    // Persist this wallet to Azure Blob Storage
    await saveWallet(
      newWallet.publicKey.toBase58(),
      {
        publicKey: newWallet.publicKey.toBase58(),
        secretKey: Array.from(newWallet.secretKey),
      }
    );
  };

  const login = async (id: string, password: string) => {
    const walletData = await getWallet(id);
    const secretKeyArray = walletData.secretKey as number[];
    const secretKey = Uint8Array.from(secretKeyArray);
    const decrypted = await decryptSecret(secretKey, password);
    const wallet = Keypair.fromSecretKey(decrypted);
    setKeypair(wallet);
  };

  const logout = () => {
    setKeypair(null);
    // leave encrypted blob in localStorage for future logins
  };

  // Expose listing of wallets
  const listAllWallets = () => listWallets();

  const value: WalletContextValue = {
    keypair,
    publicKey: keypair?.publicKey ?? null,
    createWallet,
    login,
    logout,
    listWallets: listAllWallets,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be inside WalletProvider');
  return ctx;
}