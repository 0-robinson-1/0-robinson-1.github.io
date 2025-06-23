// src/contexts/WalletContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { decryptSecret, encryptSecret } from '../utils/encryption';

interface WalletContextValue {
  keypair: Keypair | null;
  publicKey: PublicKey | null;
  createWallet: (password: string) => Promise<void>;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [keypair, setKeypair] = useState<Keypair | null>(null);

  const createWallet = async (password: string) => {
    const newWallet = Keypair.generate();
    const encrypted = await encryptSecret(newWallet.secretKey, password);
    localStorage.setItem('robinson-wallet', encrypted);
    setKeypair(newWallet);
  };

  const login = async (password: string) => {
    const encrypted = localStorage.getItem('robinson-wallet');
    if (!encrypted) throw new Error('No wallet found—please create one first.');
    const secretKey = await decryptSecret(encrypted, password);
    const wallet = Keypair.fromSecretKey(secretKey);
    setKeypair(wallet);
  };

  const logout = () => {
    setKeypair(null);
    // leave encrypted blob in localStorage for future logins
  };

  const value: WalletContextValue = {
    keypair,
    publicKey: keypair?.publicKey ?? null,
    createWallet,
    login,
    logout,
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