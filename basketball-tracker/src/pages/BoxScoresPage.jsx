import { useState, useEffect } from 'react'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorMessage from '../shared/ErrorMessage'
import { fetchGames, fetchStatsByGame, fetchPlayers } from '../utils/airtable'
import styles from './BoxScoresPage.module.css'

const STAT_FIELDS = ['fgm2', 'fga2', 'fgm3', 'fga3', 'ftm', 'fta', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls']
const STAT_HEADERS = ['FGM', 'FGA', '3PM', '3PA', 'FTM', 'FTA', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FOULS']

function calcPoints(s) {
  return (s.fgm2 || 0) * 2 + (s.fgm3 || 0) * 3 + (s.ftm || 0)
}

function BoxScoresPage() {
  const [games, setGames] = useState([])
  const [players, setPlayers] = useState([])
  const [selectedGameId, setSelectedGameId] = useState('')
  const [stats, setStats] = useState([])
  const [isLoadingGames, setIsLoadingGames] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoadingGames(true)
        const [gamesData, playersData] = await Promise.all([fetchGames(), fetchPlayers()])
        if (!cancelled) {
          setGames(gamesData)
          setPlayers(playersData)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoadingGames(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  async function handleGameChange(e) {
    const gameId = e.target.value
    setSelectedGameId(gameId)
    setStats([])

    if (!gameId) return

    try {
      setIsLoadingStats(true)
      setError(null)
      const data = await fetchStatsByGame(gameId)
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const selectedGame = games.find((g) => g.id === selectedGameId)

  // Merge stats with player info
  const rows = stats.map((s) => {
    const player = players.find((p) => p.id === s.playerId) || {}
    return { ...s, playerName: player.name || s.name || 'Unknown', number: player.number ?? '—', pts: calcPoints(s) }
  }).sort((a, b) => b.pts - a.pts)

  // Totals row
  const totals = STAT_FIELDS.reduce((acc, f) => {
    acc[f] = rows.reduce((sum, r) => sum + (Number(r[f]) || 0), 0)
    return acc
  }, {})
  totals.pts = rows.reduce((sum, r) => sum + r.pts, 0)

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Box Scores</h2>

      <div className={styles.gameSelect}>
        <label htmlFor="gameSelect">Select Game</label>
        <select id="gameSelect" value={selectedGameId} onChange={handleGameChange}>
          <option value="">-- Choose a game --</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              vs {g.opponent} — {g.date}
            </option>
          ))}
        </select>
      </div>

      {isLoadingGames && <LoadingSpinner message="Loading games..." />}
      {isLoadingStats && <LoadingSpinner message="Loading stats..." />}
      {error && <ErrorMessage message={error} />}

      {selectedGame && !isLoadingStats && stats.length > 0 && (
        <>
          <div className={styles.gameHeader}>
            <span className={styles.gameTitle}>vs {selectedGame.opponent}</span>
            <span className={styles.gameMeta}>{selectedGame.date} · {selectedGame.location}</span>
            {selectedGame.result && (
              <span className={`${styles.result} ${selectedGame.result === 'W' ? styles.win : styles.loss}`}>
                {selectedGame.result}
              </span>
            )}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>PTS</th>
                  {STAT_HEADERS.map((h) => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.playerId}>
                    <td className={styles.playerName}>
                      <span className={styles.number}>#{row.number}</span> {row.playerName}
                    </td>
                    <td className={styles.pts}>{row.pts}</td>
                    {STAT_FIELDS.map((f) => (
                      <td key={f}>{row[f] ?? 0}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.totalsRow}>
                  <td>TOTALS</td>
                  <td className={styles.pts}>{totals.pts}</td>
                  {STAT_FIELDS.map((f) => (
                    <td key={f}>{totals[f]}</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {selectedGame && !isLoadingStats && stats.length === 0 && !error && (
        <p className={styles.hint}>No stats recorded for this game yet.</p>
      )}

      {!selectedGameId && !isLoadingGames && (
        <p className={styles.hint}>Select a game to view its box score.</p>
      )}
    </div>
  )
}

export default BoxScoresPage
