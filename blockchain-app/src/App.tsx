// src/App.tsx

import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import BlockchainPage from './pages/BlockchainPage'

function HomePage() {
  return (
    <div className="home-text" style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <h2>Welcome to Robinson's Blockchain App</h2>
      <p>Click "Blockchain" to play around with the Robinson Blockchain:</p>
      <p>   -Create a wallet</p>
      <p>   -Airdrop yourself some free Solana Testnet Coins</p>
      <p>   -Send Sol to your friends and receive some back</p>
      <p>   -Log out and come back anytime later to open your wallet where you left off...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/blockchain-app">
      <header className="app-header">
        <nav>
          <Link to="/">Home</Link> | <Link to="/blockchain">Blockchain</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App