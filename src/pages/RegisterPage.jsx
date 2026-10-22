import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles-register.css'

function validationErrors(data) {
  if (!Array.isArray(data?.detail)) return {}
  return Object.fromEntries(data.detail.map(error => [error.loc?.at(-1), error.msg]))
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }))

  const submit = async event => {
    event.preventDefault()
    setErrors({}); setFormError('')
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your full name.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (!form.password) next.password = 'Please enter a password.'
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password.'
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.'
    if (Object.keys(next).length) { setErrors(next); return }

    setLoading(true)
    try {
      const payload = { name: form.name.trim(), email: form.email.trim(), password: form.password }
      const result = await register(payload)
      if (!result.response.ok) {
        if (result.response.status === 422) setErrors(validationErrors(result.data))
        else if (result.response.status === 409) setErrors({ email: result.data?.detail || 'An account with this email already exists.' })
        else setFormError(result.data?.detail || 'Registration failed. Please try again.')
        return
      }
      const loginResult = await login(form.email.trim(), form.password)
      if (loginResult.response.ok) {
        navigate(loginResult.role === 'storekeeper' ? '/inventory' : '/products', { replace: true })
      } else {
        setFormError('Account created, but automatic sign-in failed. Please sign in with your new account.')
        navigate('/signin', { replace: true })
      }
    } catch {
      setFormError('Unable to connect to the server. Please make sure the backend is running.')
    } finally { setLoading(false) }
  }

  return <div className="auth-page">
    <header className="header"><div className="header-container"><Link to="/" className="logo">Mini<span>Store</span></Link><nav className="nav"><Link to="/" className="nav-link">Home</Link><Link to="/signin" className="nav-link">Sign In</Link></nav></div></header>
    <main className="page-content"><div className="signup-card"><div className="form-header"><p className="subtitle">Create your MiniStore account</p><h1>Sign Up</h1></div>
      <form onSubmit={submit}>
        <Field label="Full Name" error={errors.name}><input id="fullname" autoComplete="name" value={form.name} onChange={e => update('name', e.target.value)} /></Field>
        <Field label="Email" error={errors.email}><input id="email" type="email" autoComplete="email" value={form.email} onChange={e => update('email', e.target.value)} /></Field>
        <PasswordField id="password" label="Password" value={form.password} show={showPassword} setShow={setShowPassword} onChange={v => update('password', v)} error={errors.password} />
        <PasswordField id="confirm-password" label="Confirm Password" value={form.confirmPassword} show={showConfirm} setShow={setShowConfirm} onChange={v => update('confirmPassword', v)} error={errors.confirmPassword} />
        {formError && <div className="form-error-message">{formError}</div>}
        <button className="signup-button" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</button>
        <p className="signin-text">Already have an account? <Link to="/signin" className="signin-link">Sign In</Link></p>
      </form>
    </div></main>
  </div>
}
function Field({ label, error, children }) { return <div className="form-group"><label>{label}</label>{children}{error && <small className="error-message">{error}</small>}</div> }
function PasswordField({ id, label, value, show, setShow, onChange, error }) { return <div className="form-group"><label htmlFor={id}>{label}</label><div className="password-wrapper"><input id={id} autoComplete={id === 'password' ? 'new-password' : 'new-password'} type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} /><button type="button" className="password-toggle" onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'}><span className="eye-icon">◉</span></button></div>{error && <small className="error-message">{error}</small>}</div> }
