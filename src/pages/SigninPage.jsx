import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles-signin.css'

export default function SigninPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async event => {
    event.preventDefault(); setErrors({}); setFormError('')
    const next = {}
    if (!email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Please enter a valid email address.'
    if (!password) next.password = 'Please enter your password.'
    if (Object.keys(next).length) { setErrors(next); return }
    setLoading(true)
    try {
      const result = await login(email.trim(), password)
      if (result.response.ok) {
        const defaultPath = result.role === 'storekeeper' ? '/inventory' : '/products'
        const requestedPath = location.state?.from
        navigate(requestedPath || defaultPath, { replace: true })
        return
      }
      if (result.response.status === 422 && Array.isArray(result.data?.detail)) {
        setErrors(Object.fromEntries(result.data.detail.map(item => [item.loc?.at(-1), item.msg])))
      } else setFormError(result.data?.detail || 'Invalid email or password.')
    } catch { setFormError('Unable to connect to the server. Please make sure the backend is running.') }
    finally { setLoading(false) }
  }

  return <div className="auth-page"><header className="header"><div className="header-container"><Link to="/" className="logo">Mini<span>Store</span></Link><nav className="nav"><Link to="/" className="nav-link">Home</Link><Link to="/register" className="signup-btn">Sign Up</Link></nav></div></header>
    <main className="page-content"><div className="signin-card"><div className="form-header"><p className="subtitle">Welcome back to MiniStore</p><h1>Sign In</h1></div>
      <form onSubmit={submit}>
        <Field label="Email" error={errors.email}><input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <div className="form-group"><label htmlFor="password">Password</label><div className="password-wrapper"><input id="password" autoComplete="current-password" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} /><button type="button" className="password-toggle" onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'}><span className="eye-icon">◉</span></button></div>{errors.password && <small className="error-message">{errors.password}</small>}</div>
        {formError && <div className="form-error-message">{formError}</div>}
        <button className="signin-button" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
        <p className="signup-text">Don't have an account? <Link to="/register">Sign Up</Link></p>
      </form></div></main></div>
}
function Field({ label, error, children }) { return <div className="form-group"><label>{label}</label>{children}{error && <small className="error-message">{error}</small>}</div> }
