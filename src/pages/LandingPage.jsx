import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles-landing.css'

export default function LandingPage() {
  const { isLoggedIn } = useAuth()
  return <div>
    <Header />
    <main>
      <section className="hero"><div className="hero-overlay"/><div className="hero-content">
        <p className="hero-small-text">Welcome to MiniStore</p>
        <h1>Delicious Desserts<br/>Delivered With Ease</h1>
        <p className="hero-description">Discover delicious desserts made to satisfy your cravings. Browse our selection, choose your favourites, add them to your cart, and enjoy a simple and convenient ordering experience.</p>
        <Link to={isLoggedIn ? '/products' : '/signin'} className="hero-button">{isLoggedIn ? 'Shop Now' : 'Sign In'}</Link>
      </div></section>
      <section className="intro"><div className="intro-content"><p className="section-label">WHY MINISTORE?</p><h2>Your Favourite Desserts, Just A Few Clicks Away</h2><p>MiniStore makes ordering desserts simple. Explore our products, add the desserts you love to your cart, and get ready for a convenient shopping experience.</p></div></section>
    </main>
    <Footer />
  </div>
}
