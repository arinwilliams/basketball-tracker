import styles from './shared.module.css'

function LoadingSpinner({ message }) {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.spinner}></div>
      {message && <p className={styles.spinnerMessage}>{message}</p>}
    </div>
  )
}

export default LoadingSpinner
