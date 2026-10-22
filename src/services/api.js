const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001').replace(/\/$/, '')

export function getAccessToken() {
  return localStorage.getItem('access_token') || ''
}

async function request(path, options = {}) {
  const token = getAccessToken()
  const headers = {
    ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  let data = null
  try { data = await response.json() } catch { /* 204 No Content */ }
  return { response, data }
}

export const registerUser = (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
export const loginUser = (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
export const getCurrentUser = () => request('/auth/me')
export const promoteUser = (email) => request('/auth/promote', { method: 'POST', body: JSON.stringify({ email }) })

export const createProduct = (payload) => request('/inventory/create_product', { method: 'POST', body: JSON.stringify(payload) })
export const updateProduct = (payload) => request('/inventory/update_product', { method: 'POST', body: JSON.stringify(payload) })
export const getProduct = (id) => request(`/inventory/get_product?id=${encodeURIComponent(id)}`)
export const deleteProduct = (id) => request(`/inventory/delete_product?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
export const getAllProducts = () => request('/inventory/get_all_products')

export const addProductToCart = (payload) => request('/cart-service/add_product_to_cart', { method: 'POST', body: JSON.stringify(payload) })
export const getCart = () => request('/cart-service/find_cart')
export const removeCartItem = (cartId) => request(`/cart-service/clear_items_from_cart?cart_id=${encodeURIComponent(cartId)}`, { method: 'DELETE' })
export const clearCart = () => request('/cart-service/clear_cart', { method: 'DELETE' })
export const createOrder = () => request('/sales/orders', { method: 'POST' })
export const getOrders = () => request('/sales/orders')
