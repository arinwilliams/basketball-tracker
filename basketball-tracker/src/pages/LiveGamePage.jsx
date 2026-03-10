import styles from './LiveGamePage.module.css'

function LiveGamePage() {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Live Game</h2>
      <div className={styles.comingSoon}>
        <span className={styles.icon}>🏀</span>
        <p className={styles.message}>Live game tracking coming soon.</p>
        <p className={styles.sub}>Use the Stats page to log stats after a game.</p>
      </div>
    </div>
  )
}

export default LiveGamePage
