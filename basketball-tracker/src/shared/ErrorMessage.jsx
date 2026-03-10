import styles from './shared.module.css'

function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.errorWrapper}>
      <p className={styles.errorText}>⚠️ {message}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
