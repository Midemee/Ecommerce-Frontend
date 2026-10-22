import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { isLoggedIn } = useAuth()
  const handleProducts = (event) => {
    if (!isLoggedIn) { event.preventDefault(); alert('Please sign in before accessing our products.') }
  }
  return <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand"><Link to="/" className="footer-logo">Mini<span>Store</span></Link><p>Delicious desserts, made easy to order.</p></div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to={isLoggedIn ? '/products' : '/signin'} onClick={handleProducts}>Products</Link>
        {!isLoggedIn && <Link to="/signin">Sign In</Link>}
        <Link to="/register">Sign Up</Link>
      </div>
    </div>
    <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} MiniStore. All rights reserved.</p></div>
  </footer>
}
