import { useCallback } from 'react'
import PlayerCard from './PlayerCard'
import styles from './Roster.module.css'

function Roster({ players, onDeletePlayer }) {
  const handleDelete = useCallback(
    (id) => {
      onDeletePlayer(id)
    },
    [onDeletePlayer]
  )

  return (
    <div className={styles.roster}>
      {players.length === 0 ? (
        <p className={styles.empty}>No players yet. Add one above!</p>
      ) : (
        players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  )
}

export default Roster
