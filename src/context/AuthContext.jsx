import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../services/api'

const AuthContext = createContext(null)
const SESSION_KEY = 'ministore_session'

function normalizeRole(value) {
  const role = String(value || '').toLowerCase()
  if (role.includes('storekeeper')) return 'storekeeper'
  if (role.includes('customer')) return 'customer'
  return role || null
}

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (session?.access_token && session?.user) {
      const role = normalizeRole(session.role || session.user.role)
      if (role) return { ...session, role }
    }
  } catch { /* ignore invalid stored data */ }
  return null
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)
  const role = normalizeRole(session?.role || session?.user?.role)
  const user = session?.user || null
  const customer = role === 'customer' ? user : null
  const storeKeeper = role === 'storekeeper' ? user : null

  const register = async (payload) => registerUser(payload)

  const login = async (email, password) => {
    const result = await loginUser({ email, password })
    if (!result.response.ok) return result

    const responseData = result.data || {}
    const account = responseData.user || responseData
    const token = responseData.access_token
    const authenticatedRole = normalizeRole(account.role || responseData.role)

    if (!token) {
      return { ...result, response: { ...result.response, ok: false }, data: { detail: 'The backend login response did not include an access token.' } }
    }
    if (!authenticatedRole) {
      return { ...result, response: { ...result.response, ok: false }, data: { detail: 'The login response did not include a recognized user role.' } }
    }

    const nextSession = { access_token: token, token_type: responseData.token_type || 'bearer', role: authenticatedRole, user: account }
    localStorage.setItem('access_token', token)
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    localStorage.removeItem('customer')
    localStorage.removeItem('storeKeeper')
    localStorage.removeItem('cart')
    setSession(nextSession)
    return { ...result, role: authenticatedRole }
  }

  const logout = async () => {
    setSession(null)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem('access_token')
    localStorage.removeItem('customer')
    localStorage.removeItem('storeKeeper')
    localStorage.removeItem('cart')
    return { ok: true }
  }

  const value = useMemo(() => ({
    session, user, role, customer, storeKeeper,
    isLoggedIn: role === 'customer',
    isStoreKeeperLoggedIn: role === 'storekeeper',
    register, login, logout,
  }), [session, role, user, customer, storeKeeper])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
