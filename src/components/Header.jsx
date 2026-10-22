import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header({ showProducts = true }) {
  const { isLoggedIn, customer, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (!customer) { navigate('/'); return }
    const result = await logout()
    if (result.ok) {
      alert('Sign out suucesssful')
      navigate('/')
    } else {
      alert(result.message || result.data?.detail || 'Unable to sign out. Please try again.')
    }
  }

  return <header className="header">
    <div className="header-container">
      <Link to="/" className="logo">Mini<span>Store</span></Link>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        {showProducts && <Link to={isLoggedIn ? '/products' : '/signin'} className="nav-link">Products</Link>}
        {!isLoggedIn && <Link to="/signin" className="nav-link">Sign In</Link>}
        <Link to="/register" className="signup-btn">Sign Up</Link>
        {isLoggedIn && <button type="button" className="signout-btn" onClick={handleLogout}>Sign Out</button>}
      </nav>
    </div>
  </header>
}
