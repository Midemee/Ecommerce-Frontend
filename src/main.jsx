import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import SigninPage from './pages/SigninPage'
import ProductsPage from './pages/ProductsPage'
import InventoryPage from './pages/InventoryPage'
import ProtectedRoute from './components/ProtectedRoute'
import StoreKeeperProtectedRoute from './components/StoreKeeperProtectedRoute'
import './index.css'

function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/LandingPage/landing.html" element={<LandingPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/Auth/register.html" element={<RegisterPage />} />
    <Route path="/signin" element={<SigninPage />} />
    <Route path="/Auth/signin.html" element={<SigninPage />} />
    <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
    <Route path="/Cart/cart.html" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
    <Route path="/inventory" element={<StoreKeeperProtectedRoute><InventoryPage /></StoreKeeperProtectedRoute>} />
    <Route path="/inventory-form-page/index.html" element={<StoreKeeperProtectedRoute><InventoryPage /></StoreKeeperProtectedRoute>} />
    <Route path="*" element={<LandingPage />} />
  </Routes>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></React.StrictMode>
)
