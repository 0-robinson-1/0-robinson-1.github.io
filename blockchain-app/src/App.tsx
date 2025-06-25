// src/App.tsx
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import BlockchainPage from './pages/BlockchainPage'

function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <nav>
          <a href="/">Home</a> |{' '}
          <Link to="/blockchain">Blockchain Demo</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<BlockchainPage />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App