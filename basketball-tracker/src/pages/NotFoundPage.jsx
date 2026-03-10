import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  )
}

export default NotFoundPage
