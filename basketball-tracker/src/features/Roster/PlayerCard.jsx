import styles from './Roster.module.css'

function PlayerCard({ player, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <span className={styles.number}>#{player.number}</span>
        <span className={styles.name}>{player.name}</span>
        <span className={styles.position}>{player.position}</span>
      </div>
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(player.id)}
      >
        Remove
      </button>
    </div>
  )
}

export default PlayerCard
