import styles from './Games.module.css'

function GameCard({ game, onSelect, isSelected }) {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(game)}
    >
      <div className={styles.cardTop}>
        <span className={styles.opponent}>vs {game.opponent}</span>
        <span className={styles.date}>{game.date}</span>
      </div>
      <div className={styles.cardBottom}>
        <span className={styles.location}>{game.location}</span>
        {game.result && (
          <span
            className={`${styles.result} ${
              game.result === 'W' ? styles.win : styles.loss
            }`}
          >
            {game.result}
          </span>
        )}
      </div>
    </div>
  )
}

export default GameCard