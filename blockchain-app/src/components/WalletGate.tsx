// src/components/WalletGate.tsx
import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

export default function WalletGate() {
  const { keypair, createWallet, login, logout } = useWallet();
  const [mode, setMode] = useState<'create' | 'login'>('create');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // If already logged in, show logout button
  if (keypair) {
    return (
      <div>
        <p>
          🔑 Logged in as{' '}
          <code style={{ wordBreak: 'break-all' }}>
            {keypair.publicKey.toBase58()}
          </code>
        </p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  const handleAction = async () => {
    setError(null);
    try {
      if (mode === 'create') {
        await createWallet(alias, password);
      } else {
        await login(alias, password);
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '1rem auto' }}>
      <h4>{mode === 'create' ? 'Create Wallet' : 'Login'}</h4>

      <label style={{ display: 'block', margin: '0.5rem 0' }}>
        Alias:
        <input
          type="text"
          value={alias}
          onChange={e => setAlias(e.target.value)}
          style={{ width: '100%', marginTop: '0.25rem' }}
        />
      </label>

      <label style={{ display: 'block', margin: '0.5rem 0' }}>
        Password:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginTop: '0.25rem' }}
        />
      </label>

      <button
        type="button"
        onClick={handleAction}
        disabled={!alias || !password}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {mode === 'create' ? 'Create & Login' : 'Login'}
      </button>

      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            setMode(mode === 'create' ? 'login' : 'create');
            setError(null);
            setAlias('');
            setPassword('');
          }}
        >
          {mode === 'create' ? 'Have a wallet? Log in' : 'Need a wallet? Create one'}
        </a>
      </div>

      {error && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}