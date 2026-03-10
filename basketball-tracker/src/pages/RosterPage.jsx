import { useState, useEffect } from 'react'
import Roster from '../features/Roster/Roster'
import LoadingSpinner from '../shared/LoadingSpinner'
import ErrorMessage from '../shared/ErrorMessage'
import { fetchPlayers, createPlayer, deletePlayer } from '../utils/airtable'
import styles from './RosterPage.module.css'

function RosterPage() {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ name: '', number: '', position: '' })
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadPlayers() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchPlayers()
        if (!cancelled) setPlayers(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadPlayers()
    return () => { cancelled = true }
  }, [])

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!formData.name.trim()) {
      setFormError('Player name is required.')
      return
    }
    if (!formData.number || isNaN(Number(formData.number))) {
      setFormError('Jersey number must be a valid number.')
      return
    }
    if (!formData.position) {
      setFormError('Please select a position.')
      return
    }

    try {
      setIsSaving(true)
      const newPlayer = await createPlayer({
        name: formData.name.trim(),
        number: Number(formData.number),
        position: formData.position,
      })
      setPlayers((prev) => [...prev, newPlayer])
      setFormData({ name: '', number: '', position: '' })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeletePlayer(id) {
    try {
      await deletePlayer(id)
      setPlayers((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Team Roster</h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h3 className={styles.formTitle}>Add Player</h3>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Player name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="number">Jersey #</label>
            <input
              id="number"
              name="number"
              type="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="00"
              min="0"
              max="99"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="position">Position</label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="PG">PG</option>
              <option value="SG">SG</option>
              <option value="SF">SF</option>
              <option value="PF">PF</option>
              <option value="C">C</option>
            </select>
          </div>
        </div>

        {formError && <p className={styles.formError}>{formError}</p>}

        <button type="submit" className={styles.submitButton} disabled={isSaving}>
          {isSaving ? 'Adding...' : 'Add Player'}
        </button>
      </form>

      {isLoading && <LoadingSpinner message="Loading roster..." />}
      {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}
      {!isLoading && !error && (
        <Roster players={players} onDeletePlayer={handleDeletePlayer} />
      )}
    </div>
  )
}

export default RosterPage
