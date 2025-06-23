// src/components/WalletGate.tsx
import React, { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'

export default function WalletGate() {
  const { keypair, createWallet, login, logout } = useWallet()
  const [mode, setMode] = useState<'create' | 'login'>('create')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handle = async () => {
    setError(null)
    try {
      if (mode === 'create') await createWallet(password)
      else await login(password)
    } catch (err: any) {
      setError(err.message)
    }
  }

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
    )
  }

  return (
    <div style={{ maxWidth: 300, margin: '1rem auto' }}>
      <h4>{mode === 'create' ? 'Create Wallet' : 'Login'}</h4>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button disabled={!password} onClick={handle}>
        {mode === 'create' ? 'Create & Login' : 'Login'}
      </button>
      <div style={{ marginTop: '0.5rem' }}>
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            setMode(mode === 'create' ? 'login' : 'create')
            setError(null)
          }}
        >
          {mode === 'create'
            ? 'Have a wallet? Log in'
            : 'Need a wallet? Create one'}
        </a>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}