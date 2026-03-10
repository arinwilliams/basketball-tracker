import { useState, useEffect } from 'react'
import StatRow from '../features/Stats/StatRow'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorMessage from '../shared/ErrorMessage'
import { fetchGames, fetchPlayers, fetchStatsByGame, saveStats } from '../utils/airtable'
import styles from './StatsPage.module.css'

const STAT_FIELDS = ['fgm2', 'fga2', 'fgm3', 'fga3', 'ftm', 'fta', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls']
const STAT_HEADERS = ['FGM', 'FGA', '3PM', '3PA', 'FTM', 'FTA', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FOULS']

function buildEmptyStats(players) {
  const map = {}
  players.forEach((p) => {
    map[p.id] = {}
    STAT_FIELDS.forEach((f) => { map[p.id][f] = '' })
  })
  return map
}

function StatsPage() {
  const [games, setGames] = useState([])
  const [players, setPlayers] = useState([])
  const [selectedGameId, setSelectedGameId] = useState('')
  const [statsMap, setStatsMap] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadInitial() {
      try {
        setIsLoading(true)
        setError(null)
        const [gamesData, playersData] = await Promise.all([fetchGames(), fetchPlayers()])
        console.log('Players:', JSON.stringify(playersData, null, 2))
        if (!cancelled) {
          setGames(gamesData)
          setPlayers(playersData)
          setStatsMap(buildEmptyStats(playersData))
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadInitial()
    return () => { cancelled = true }
  }, [])

  async function handleGameChange(e) {
    const gameId = e.target.value
    setSelectedGameId(gameId)
    setSaveSuccess(false)

    if (!gameId) {
      setStatsMap(buildEmptyStats(players))
      return
    }

    try {
      setIsLoading(true)
      const existing = await fetchStatsByGame(gameId)
      console.log('Existing stats:', JSON.stringify(existing, null, 2))
      const map = buildEmptyStats(players)

      existing.forEach((record) => {
        const playerId = record.playerId
        if (map[playerId]) {
          STAT_FIELDS.forEach((f) => {
            map[playerId][f] = record[f] ?? ''
          })
        }
      })

      setStatsMap(map)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleStatChange(playerId, field, value) {
     console.log('handleStatChange called:', playerId, field, value)
    setStatsMap((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value,
      },
    }))
  }

  async function handleSave() {
    if (!selectedGameId) return

    const records = players.map((player) => {
      const s = statsMap[player.id] || {}
      const entry = { gameId: selectedGameId, playerId: player.id, name: player.name }
      STAT_FIELDS.forEach((f) => {
        entry[f] = s[f] !== '' ? Number(s[f]) : 0
      })
      return entry
    })

    console.log('Saving records:', JSON.stringify(records, null, 2))


    try {
      setIsSaving(true)
      setError(null)
      await saveStats(records)
      setSaveSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Stats Entry</h2>

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

      {isLoading && <LoadingSpinner message="Loading..." />}
      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && selectedGameId && players.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Player</th>
                  {STAT_HEADERS.map((h) => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <StatRow
                    key={player.id}
                    player={player}
                    stats={statsMap[player.id] || {}}
                    onChange={handleStatChange}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {saveSuccess && (
            <p className={styles.success}>✅ Stats saved successfully!</p>
          )}

          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Stats'}
          </button>
        </>
      )}

      {!isLoading && !error && !selectedGameId && (
        <p className={styles.hint}>Select a game above to enter or edit stats.</p>
      )}
    </div>
  )
}

export default StatsPage
