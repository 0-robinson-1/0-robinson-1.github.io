// src/contexts/WalletContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { saveWallet, getWallet, listWallets, WalletBlob } from '../storage';

interface WalletContextValue {
  keypair: Keypair | null;
  publicKey: PublicKey | null;
  createWallet: (alias: string, password: string) => Promise<void>;
  login: (alias: string, password: string) => Promise<void>;
  logout: () => void;
  listWallets: () => Promise<string[]>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [keypair, setKeypair] = useState<Keypair | null>(null);

  const createWallet = async (alias: string, password: string) => {
    const wallet = Keypair.generate();
    const rawKeyArray = Array.from(wallet.secretKey);
    const blob: WalletBlob = {
      alias,
      publicKey: wallet.publicKey.toBase58(),
      pwdHash: '',
      salt: '',
      iv: '',
      secretKey: rawKeyArray,
    };
    await saveWallet(blob);
    setKeypair(wallet);
  };

  const login = async (alias: string, password: string) => {
    const blob = await getWallet(alias);
    const secretArray = JSON.parse(blob.secretKey) as number[];
    const secretUint8 = Uint8Array.from(secretArray);
    const wallet = Keypair.fromSecretKey(secretUint8);
    setKeypair(wallet);
  };

  const logout = () => {
    setKeypair(null);
  };

  const listAll = () => listWallets();

  const publicKey = keypair ? keypair.publicKey : null;

  return (
    <WalletContext.Provider value={{ keypair, publicKey, createWallet, login, logout, listWallets: listAll }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
// src/contexts/WalletContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { saveWallet, getWallet, listWallets, WalletBlob, WalletInfo } from '../storage';

interface WalletContextValue {
  keypair: Keypair | null;
  publicKey: PublicKey | null;
  createWallet: (alias: string, password: string) => Promise<void>;
  login: (alias: string, password: string) => Promise<void>;
  logout: () => void;
  getStoredWallets: () => Promise<WalletInfo[]>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [keypair, setKeypair] = useState<Keypair | null>(null);

  const createWallet = async (alias: string, password: string) => {
    // Generate new Solana keypair
    const wallet = Keypair.generate();
    // Prepare blob data; server will handle encryption
    const blob: WalletBlob = {
      alias,
      publicKey: wallet.publicKey.toBase58(),
      pwdHash: '',
      salt: '',
      iv: '',
      secretKey: Array.from(wallet.secretKey),
    };
    await saveWallet(blob);
    setKeypair(wallet);
  };

  const login = async (alias: string, password: string) => {
    // Fetch stored wallet blob by alias
    const blob = await getWallet(alias);
    // Decrypt secretKey (stub implementation: direct JSON parse)
    const secretArray = JSON.parse(blob.secretKey) as number[];
    const secretUint8 = Uint8Array.from(secretArray);
    const wallet = Keypair.fromSecretKey(secretUint8);
    setKeypair(wallet);
  };

  const logout = () => {
    setKeypair(null);
  };

  const getStoredWallets = () => listWallets();

  const publicKey = keypair ? keypair.publicKey : null;

  return (
    <WalletContext.Provider
      value={{ keypair, publicKey, createWallet, login, logout, getStoredWallets }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}