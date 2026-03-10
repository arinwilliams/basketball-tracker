import { useState, useEffect } from 'react'
import GameCard from '../features/Games/GameCard'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorMessage from '../shared/ErrorMessage'
import { fetchGames, createGame } from '../utils/airtable'
import styles from './GamesPage.module.css'

function GamesPage() {
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGame, setSelectedGame] = useState(null)
  const [formData, setFormData] = useState({
    opponent: '',
    date: '',
    location: '',
    result: '',
  })
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadGames() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchGames()
        if (!cancelled) setGames(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadGames()
    return () => { cancelled = true }
  }, [])

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!formData.opponent.trim()) {
      setFormError('Opponent name is required.')
      return
    }
    if (!formData.date) {
      setFormError('Game date is required.')
      return
    }

    try {
      setIsSaving(true)
      const newGame = await createGame({
        opponent: formData.opponent.trim(),
        date: formData.date,
        location: formData.location.trim(),
        result: formData.result || null,
      })
      setGames((prev) => [newGame, ...prev])
      setFormData({ opponent: '', date: '', location: '', result: '' })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Games</h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h3 className={styles.formTitle}>Add Game</h3>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label htmlFor="opponent">Opponent</label>
            <input
              id="opponent"
              name="opponent"
              type="text"
              value={formData.opponent}
              onChange={handleChange}
              placeholder="Team name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Home / Away / Gym name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="result">Result</label>
            <select
              id="result"
              name="result"
              value={formData.result}
              onChange={handleChange}
            >
              <option value="">TBD</option>
              <option value="W">W</option>
              <option value="L">L</option>
            </select>
          </div>
        </div>

        {formError && <p className={styles.formError}>{formError}</p>}

        <button type="submit" className={styles.submitButton} disabled={isSaving}>
          {isSaving ? 'Adding...' : 'Add Game'}
        </button>
      </form>

      {isLoading && <LoadingSpinner message="Loading games..." />}
      {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
      {!isLoading && !error && (
        <div className={styles.gamesList}>
          {games.length === 0 ? (
            <p className={styles.empty}>No games yet. Add one above!</p>
          ) : (
            games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={setSelectedGame}
                isSelected={selectedGame?.id === game.id}
              />
            ))
          )}
        </div>
      )}

      {selectedGame && (
        <p className={styles.hint}>
          📋 Selected: <strong>vs {selectedGame.opponent}</strong> — you'll log stats for this game in the Stats page.
        </p>
      )}
    </div>
  )
}

export default GamesPage
