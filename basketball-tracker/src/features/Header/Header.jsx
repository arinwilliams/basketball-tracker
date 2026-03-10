import { NavLink } from 'react-router'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>🏀 Basketball Tracker</h1>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? styles.active : styles.link}
        >
          Live Game
        </NavLink>
        <NavLink
          to="/boxscores"
          className={({ isActive }) => isActive ? styles.active : styles.link}
        >
          Box Scores
        </NavLink>
        <NavLink
          to="/roster"
          className={({ isActive }) => isActive ? styles.active : styles.link}
        >
          Roster
        </NavLink>
        <NavLink
          to="/games"
          className={({ isActive }) => isActive ? styles.active : styles.link}
        >
          Games
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) => isActive ? styles.active : styles.link}
>
          Stats
        </NavLink>

      </nav>
    </header>
  )
}

export default Header
