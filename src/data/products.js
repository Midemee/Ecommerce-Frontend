const image = (name) => `/assets/images/${name}`

export const products = [
  { id: '1', name: 'Product One', category: 'Category', price: 6500, image: image('image-tiramisu-desktop.jpg') },
  { id: '2', name: 'Product Two', category: 'Category', price: 5000, image: image('image-waffle-desktop.jpg') },
  { id: '3', name: 'Product Three', category: 'Category', price: 8200, image: image('image-baklava-desktop.jpg') },
  { id: '4', name: 'Product Four', category: 'Category', price: 4800, image: image('image-brownie-desktop.jpg') },
  { id: '5', name: 'Product Five', category: 'Category', price: 10000, image: image('image-cake-desktop.jpg') },
  { id: '6', name: 'Product Six', category: 'Category', price: 7000, image: image('image-creme-brulee-desktop.jpg') },
  { id: '7', name: 'Product Seven', category: 'Category', price: 8500, image: image('image-macaron-desktop.jpg') },
  { id: '8', name: 'Product Eight', category: 'Category', price: 5500, image: image('image-panna-cotta-desktop.jpg') },
  { id: '9', name: 'Product Nine', category: 'Category', price: 6000, image: image('image-meringue-desktop.jpg') }
]

export const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price)
