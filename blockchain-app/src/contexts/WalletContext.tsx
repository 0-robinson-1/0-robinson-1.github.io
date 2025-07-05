import React, { createContext, useContext, useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { decryptSecret, encryptSecret } from '../utils/encryption';
import { saveWallet, getWallet, listWallets, type WalletBlob } from '../storage';

interface WalletContextValue {
  keypair: Keypair | null;
  publicKey: PublicKey | null;
  createWallet: (alias: string, password: string) => Promise<void>;
  login: (alias: string, password: string) => Promise<void>;
  logout: () => void;
  getStoredWallets: () => Promise<string[]>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [keypair, setKeypair] = useState<Keypair | null>(null);

  const createWallet = async (alias: string, password: string) => {
    const newWallet = Keypair.generate();
    const encryptedSecret = await encryptSecret(newWallet.secretKey, password);
    setKeypair(newWallet);
    const blob: WalletBlob = {
      alias,
      publicKey: newWallet.publicKey.toBase58(),
      secretKey: encryptedSecret,
    };
    await saveWallet(blob);
  };

  const login = async (alias: string, password: string) => {
    const walletData = await getWallet(alias);
    const encryptedSecret = walletData.secretKey as string;
    const decrypted = await decryptSecret(encryptedSecret, password);
    const wallet = Keypair.fromSecretKey(decrypted);
    setKeypair(wallet);
  };

  const logout = () => {
    setKeypair(null);
    // Keep the encrypted blob for future logins if needed
  };

  const listAllWallets = () => listWallets();

  const value: WalletContextValue = {
    keypair,
    publicKey: keypair?.publicKey ?? null,
    createWallet,
    login,
    logout,
    getStoredWallets: listAllWallets,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}