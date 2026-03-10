import { Routes, Route } from 'react-router'
import Header from './features/Header/Header'
import LiveGamePage from './pages/LiveGamePage'
import BoxScoresPage from './pages/BoxScoresPage'
import RosterPage from './pages/RosterPage'
import GamesPage from './pages/GamesPage'
import StatsPage from './pages/StatsPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LiveGamePage />} />
          <Route path="/boxscores" element={<BoxScoresPage />} />
          <Route path="/roster" element={<RosterPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
