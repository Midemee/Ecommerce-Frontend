import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function StoreKeeperProtectedRoute({ children }) {
  const { isStoreKeeperLoggedIn } = useAuth()
  const location = useLocation()
  if (!isStoreKeeperLoggedIn) return <Navigate to="/signin" state={{ from: location.pathname, role: 'storekeeper' }} replace />
  return children
}
