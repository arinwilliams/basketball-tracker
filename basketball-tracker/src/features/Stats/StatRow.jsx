import styles from './Stats.module.css'

const STAT_FIELDS = ['fgm2', 'fga2', 'fgm3', 'fga3', 'ftm', 'fta', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls']

function StatRow({ player, stats, onChange }) {
  return (
    <tr className={styles.row}>
      <td className={styles.playerName}>
        <span className={styles.number}>#{player.number}</span> {player.name}
      </td>
      {STAT_FIELDS.map((field) => (
        <td key={field}>
          <input
            className={styles.statInput}
            type="number"
            min="0"
            value={stats[field] ?? ''}
            onChange={(e) => onChange(player.id, field, e.target.value)}
          />
        </td>
      ))}
    </tr>
  )
}

export default StatRow
