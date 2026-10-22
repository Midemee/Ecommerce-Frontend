import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct, updateProduct, getProduct, deleteProduct, getAllProducts, promoteUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import '../styles-inventory.css'

export default function InventoryPage() {
  const navigate = useNavigate()
  const { storeKeeper, logout, role } = useAuth()
  const email = storeKeeper?.email || ''
  const [result, setResult] = useState(null)
  const [products, setProducts] = useState([])
  const [add, setAdd] = useState({ name: '', description: '', price: '', quantity: '' })
  const [update, setUpdate] = useState({ id: '', name: '', description: '', price: '', quantity: '' })
  const [lookupId, setLookupId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [promotionEmail, setPromotionEmail] = useState('')
  const [promotionLoading, setPromotionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const call = async (fn, success, failure = 'Operation failed') => {
    try {
      const response = await fn()
      if (response.response.ok) {
        setMessage(success)
        return response.data
      }
      setMessage(response.data?.detail || failure)
    } catch {
      setMessage('Could not connect to the server.')
    }
    return null
  }

  const loadAll = async () => {
    const data = await call(() => getAllProducts(), '')
    if (Array.isArray(data)) setProducts(data)
  }

  useEffect(() => {
    loadAll()
  }, [])

  const submitAdd = async event => {
    event.preventDefault()
    if (!add.name.trim() || !add.description.trim() || !add.price || !add.quantity) {
      setMessage('Please fill in all the product details.')
      return
    }

    setLoading(true)
    const data = await call(
      () => createProduct({
        name: add.name.trim(),
        description: add.description.trim(),
        price: Number(add.price),
        quantity: Number(add.quantity),
      }),
      'Product added successfully.'
    )
    setLoading(false)

    if (data) {
      setAdd({ name: '', description: '', price: '', quantity: '' })
      await loadAll()
    }
  }

  const submitUpdate = async event => {
    event.preventDefault()
    if (!update.id || !update.name.trim() || !update.description.trim() || !update.price || !update.quantity) {
      setMessage('Please fill in all the update details.')
      return
    }

    setLoading(true)
    const data = await call(
      () => updateProduct({
        id: update.id.trim(),
        name: update.name.trim(),
        description: update.description.trim(),
        price: Number(update.price),
        quantity: Number(update.quantity),
      }),
      'Product updated successfully.'
    )
    setLoading(false)

    if (data) {
      setUpdate({ id: '', name: '', description: '', price: '', quantity: '' })
      await loadAll()
    }
  }

  const submitGet = async event => {
    event.preventDefault()
    if (!lookupId) return setMessage('Enter a product ID.')
    const data = await call(() => getProduct(lookupId.trim()), '')
    if (data) setResult(data)
  }

  const submitDelete = async event => {
    event.preventDefault()
    if (!deleteId) return setMessage('Enter a product ID.')
    if (!window.confirm('Are you sure you want to delete this product?')) return

    setLoading(true)
    const data = await call(() => deleteProduct(deleteId.trim()), 'Product deleted successfully.')
    setLoading(false)
    if (data) {
      setDeleteId('')
      await loadAll()
    }
  }


  const submitPromotion = async event => {
    event.preventDefault()
    const emailToPromote = promotionEmail.trim()
    if (!emailToPromote || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToPromote)) {
      setMessage('Enter a valid customer email address.')
      return
    }

    const confirmed = window.confirm(
      `Promote ${emailToPromote} to storekeeper? This change cannot be undone from the app.`
    )
    if (!confirmed) return

    setPromotionLoading(true)
    const promotedUser = await call(
      () => promoteUser(emailToPromote),
      `User ${emailToPromote} was promoted to storekeeper.`
    )
    setPromotionLoading(false)
    if (promotedUser) setPromotionEmail('')
  }

  const handleLogout = async () => {
    const response = await logout()
    if (response.ok) {
      alert('Storekeeper signed out successfully.')
      navigate('/signin', { state: { role: 'storekeeper' }, replace: true })
    } else {
      alert(response.message || response.data?.detail || 'Unable to sign out. Please try again.')
    }
  }

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div>
          <div className="inventory-logo">Mini<span>Store</span></div>
          <p>Inventory Management</p>
        </div>
        <div className="inventory-user">
          <span>{storeKeeper?.name || email}</span>
          <button type="button" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <main className="container">
        <div className="inventory-welcome">
          <div>
            <p className="inventory-eyebrow">Storekeeper Portal</p>
            <h1>Inventory Management</h1>
            <p>Manage products, prices and stock quantities for MiniStore.</p>
          </div>
          <div className="signed-in-storekeeper"><strong>Signed in as</strong><span>{email}</span></div>
        </div>

        {message && <p className="inventory-message" role="status">{message}</p>}

        {role === 'storekeeper' && (
          <section className="card" id="team" aria-labelledby="team-heading">
            <h2 id="team-heading">Team — Add Storekeeper</h2>
            <p>Enter the email address of an existing customer. Their account will receive storekeeper permissions.</p>
            <form onSubmit={submitPromotion}>
              <input
                type="email"
                autoComplete="email"
                aria-label="Customer email address to promote"
                placeholder="Customer email address"
                value={promotionEmail}
                onChange={e => setPromotionEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={promotionLoading}>
                {promotionLoading ? 'Promoting...' : 'Promote to Storekeeper'}
              </button>
            </form>
          </section>
        )}

        <FormCard title="Add Product" onSubmit={submitAdd} submitText={loading ? 'Working...' : 'Add Product'} disabled={loading}>
          <input placeholder="Product Name" value={add.name} onChange={e => setAdd({ ...add, name: e.target.value })} />
          <textarea placeholder="Product Description" value={add.description} onChange={e => setAdd({ ...add, description: e.target.value })} />
          <input type="number" min="0" placeholder="Price" value={add.price} onChange={e => setAdd({ ...add, price: e.target.value })} />
          <input type="number" min="0" placeholder="Quantity" value={add.quantity} onChange={e => setAdd({ ...add, quantity: e.target.value })} />
        </FormCard>

        <FormCard title="Update Product" onSubmit={submitUpdate} submitText={loading ? 'Working...' : 'Update Product'} disabled={loading}>
          <input type="text" placeholder="Product UUID" value={update.id} onChange={e => setUpdate({ ...update, id: e.target.value })} />
          <input placeholder="Product Name" value={update.name} onChange={e => setUpdate({ ...update, name: e.target.value })} />
          <textarea placeholder="Product Description" value={update.description} onChange={e => setUpdate({ ...update, description: e.target.value })} />
          <input type="number" min="0" placeholder="Price" value={update.price} onChange={e => setUpdate({ ...update, price: e.target.value })} />
          <input type="number" min="0" placeholder="Quantity" value={update.quantity} onChange={e => setUpdate({ ...update, quantity: e.target.value })} />
        </FormCard>

        <div className="card">
          <h2>Check Product</h2>
          <form onSubmit={submitGet}>
            <input type="text" placeholder="Product UUID" value={lookupId} onChange={e => setLookupId(e.target.value)} />
            <button>Get Product</button>
          </form>
          {result && <div id="productResult"><h3>Product Information</h3><p><strong>ID:</strong> {result.id}</p><p><strong>Name:</strong> {result.name}</p><p><strong>Description:</strong> {result.description}</p><p><strong>Price:</strong> ₦{result.price}</p><p><strong>Quantity:</strong> {result.quantity}</p></div>}
        </div>

        <div className="card">
          <h2>Remove Product</h2>
          <form onSubmit={submitDelete}>
            <input type="text" placeholder="Product UUID" value={deleteId} onChange={e => setDeleteId(e.target.value)} />
            <button className="delete-button" disabled={loading}>Delete Product</button>
          </form>
        </div>

        <div className="card">
          <div className="products-heading"><h2>Current Stock</h2><button type="button" onClick={loadAll}>Refresh Stock</button></div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Product ID</th><th>Name</th><th>Description</th><th>Price</th><th>Quantity Left</th></tr></thead>
              <tbody>{products.length ? products.map(product => <tr key={product.id}><td>{product.id}</td><td>{product.name}</td><td>{product.description}</td><td>₦{product.price}</td><td>{product.quantity}</td></tr>) : <tr><td colSpan="5">No products in inventory.</td></tr>}</tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

function FormCard({ title, onSubmit, children, submitText, disabled }) {
  return <div className="card"><h2>{title}</h2><form onSubmit={onSubmit}>{children}<button disabled={disabled}>{submitText}</button></form></div>
}
