import express from 'express';
import cors from 'cors';

/**
 * SCENT GARDEN - Optional Express Backend Starter
 * ----------------------------------------------------
 * NOTE: This backend starter is NOT deployed to Vercel and is NOT
 * used by the live client application at runtime. The live app runs 100%
 * client-side using Web Crypto API and IndexedDB via `dataService.js`.
 * 
 * This server demonstrates the API contract that `dataService.js` would map to
 * if you ever migrate to a distributed cloud database and dedicated server.
 */

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory mock database for illustration
let products = [];
let users = [];
let orders = [];
let wishlist = [];
let reviews = [];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Scent Garden Future-Ready API' });
});

// Products Routes
app.get('/api/products', (req, res) => {
  const { family, gender, search, sort } = req.query;
  let results = [...products];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (family && family !== 'All') {
    results = results.filter(p => p.family.toLowerCase() === family.toLowerCase());
  }

  if (gender && gender !== 'All') {
    results = results.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
  }

  if (sort === 'price-asc') results.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);
  if (sort === 'newest') results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  res.json(results);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  // Requires Admin role in production
  const newProduct = {
    id: `prod_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Product removed' });
});

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    role: 'customer',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  res.status(201).json({
    token: `sg_jwt_${Date.now()}`,
    user: newUser
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  res.json({
    token: `sg_jwt_${Date.now()}`,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// Orders Routes
app.get('/api/orders', (req, res) => {
  // If admin query param, return all; else filter by userId
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  if (userRole === 'admin') {
    return res.json(orders);
  }
  const userOrders = orders.filter(o => o.userId === userId);
  res.json(userOrders);
});

app.post('/api/orders', (req, res) => {
  const { userId, items, total, address } = req.body;
  const newOrder = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    userId,
    items,
    total,
    address,
    status: 'Processing',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  res.json(order);
});

// Reviews Routes
app.get('/api/products/:productId/reviews', (req, res) => {
  const productReviews = reviews.filter(r => r.productId === req.params.productId);
  res.json(productReviews);
});

app.post('/api/products/:productId/reviews', (req, res) => {
  const newReview = {
    id: `rev_${Date.now()}`,
    productId: req.params.productId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Wishlist Routes
app.get('/api/wishlist', (req, res) => {
  const userId = req.headers['x-user-id'];
  const items = wishlist.filter(w => w.userId === userId);
  res.json(items);
});

app.post('/api/wishlist/toggle', (req, res) => {
  const { userId, productId } = req.body;
  const index = wishlist.findIndex(w => w.userId === userId && w.productId === productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    return res.json({ saved: false });
  } else {
    wishlist.push({ userId, productId });
    return res.json({ saved: true });
  }
});

app.listen(PORT, () => {
  console.log(`[Scent Garden Starter API] Running for future reference on http://localhost:${PORT}`);
});
