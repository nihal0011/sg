import { openDB } from 'idb';
import { initialProducts, sampleReviews } from '../data/products';

const DB_NAME = 'scent_garden_db';
const DB_VERSION = 1;

/**
 * =========================================================================
 * WEB CRYPTO API UTILITIES (PBKDF2)
 * High-grade client-side cryptographic hashing. No plain-text passwords.
 * =========================================================================
 */

// Convert ArrayBuffer to hex string
function bufferToHex(buffer) {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray, (byte) => ('0' + byte.toString(16)).slice(-2)).join('');
}

// Convert hex string back to Uint8Array
function hexToBuffer(hexString) {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// Generate random salt
function generateSalt() {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return bufferToHex(salt.buffer);
}

// Hash password with PBKDF2 and salt
async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const saltBuffer = hexToBuffer(saltHex);
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  return bufferToHex(derivedBits);
}

/**
 * =========================================================================
 * INDEXED DB INITIALIZATION & SEEDING
 * =========================================================================
 */

let dbPromise = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const prodStore = db.createObjectStore('products', { keyPath: 'id' });
          prodStore.createIndex('family', 'family', { unique: false });
          prodStore.createIndex('price', 'price', { unique: false });
        }

        // Orders store
        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
          orderStore.createIndex('userId', 'userId', { unique: false });
          orderStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Wishlist store (composite key: userId_productId)
        if (!db.objectStoreNames.contains('wishlist')) {
          const wishStore = db.createObjectStore('wishlist', { keyPath: 'id' });
          wishStore.createIndex('userId', 'userId', { unique: false });
          wishStore.createIndex('productId', 'productId', { unique: false });
        }

        // Reviews store
        if (!db.objectStoreNames.contains('reviews')) {
          const revStore = db.createObjectStore('reviews', { keyPath: 'id' });
          revStore.createIndex('productId', 'productId', { unique: false });
        }

        // Newsletter store
        if (!db.objectStoreNames.contains('newsletter')) {
          db.createObjectStore('newsletter', { keyPath: 'email' });
        }
      }
    });
  }

  const db = await dbPromise;
  await seedInitialData(db);
  return db;
}

/**
 * Seed initial sample perfumes, sample reviews, and default admin account
 */
async function seedInitialData(db) {
  // 1. Seed Products if empty
  const prodCount = await db.count('products');
  if (prodCount === 0) {
    const tx = db.transaction('products', 'readwrite');
    for (const prod of initialProducts) {
      await tx.store.put(prod);
    }
    await tx.done;
  } else {
    // Automatically sync updated perfume image URLs into existing local IndexedDB
    const tx = db.transaction('products', 'readwrite');
    for (const prod of initialProducts) {
      const existing = await tx.store.get(prod.id);
      if (existing && existing.imageUrl !== prod.imageUrl) {
        existing.imageUrl = prod.imageUrl;
        await tx.store.put(existing);
      }
    }
    await tx.done;
  }

  // 2. Seed Reviews if empty
  const revCount = await db.count('reviews');
  if (revCount === 0) {
    const tx = db.transaction('reviews', 'readwrite');
    for (const rev of sampleReviews) {
      await tx.store.put(rev);
    }
    await tx.done;
  }

  // 3. Seed Default Admin if missing
  const adminEmail = 'admin@scentgarden.com';
  const existingAdmin = await db.getFromIndex('users', 'email', adminEmail);
  if (!existingAdmin) {
    const salt = generateSalt();
    const passwordHash = await hashPassword('Admin@123', salt);
    await db.put('users', {
      id: 'user_admin_001',
      name: 'Garden Curator (Admin)',
      email: adminEmail,
      passwordHash,
      salt,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
  }
}

/**
 * =========================================================================
 * AUTH & USER DATA LAYER
 * =========================================================================
 */

const SESSION_KEY = 'scent_garden_session';
const CART_KEY = 'scent_garden_cart';

export async function createUser(name, email, password) {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();

  // Check duplicate
  const existing = await db.getFromIndex('users', 'email', normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    salt,
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  await db.put('users', newUser);

  // Auto-login session
  const sessionToken = `sg_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const session = {
    userId: newUser.id,
    token: sessionToken,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
}

export async function loginUser(email, password) {
  const db = await getDb();
  const normalizedEmail = email.trim().toLowerCase();

  const user = await db.getFromIndex('users', 'email', normalizedEmail);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const derivedHash = await hashPassword(password, user.salt);
  if (derivedHash !== user.passwordHash) {
    throw new Error('Invalid email or password.');
  }

  const sessionToken = `sg_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const session = {
    userId: user.id,
    token: sessionToken,
    name: user.name,
    email: user.email,
    role: user.role
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
}

export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export async function getUserById(userId) {
  const db = await getDb();
  const user = await db.get('users', userId);
  if (!user) return null;
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

export async function updateUserProfile(userId, { name }) {
  const db = await getDb();
  const user = await db.get('users', userId);
  if (!user) throw new Error('User not found.');

  user.name = name.trim();
  await db.put('users', user);

  // Update localStorage session if it matches
  const session = getCurrentSession();
  if (session && session.userId === userId) {
    session.name = user.name;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const db = await getDb();
  const user = await db.get('users', userId);
  if (!user) throw new Error('User not found.');

  const derivedHash = await hashPassword(currentPassword, user.salt);
  if (derivedHash !== user.passwordHash) {
    throw new Error('The current password entered is incorrect.');
  }

  const newSalt = generateSalt();
  const newHash = await hashPassword(newPassword, newSalt);
  user.salt = newSalt;
  user.passwordHash = newHash;

  await db.put('users', user);
  return true;
}

/**
 * =========================================================================
 * PRODUCTS DATA LAYER
 * =========================================================================
 */

export async function getProducts({ search = '', family = 'All', gender = 'All', sort = 'featured', minPrice = 0, maxPrice = 1000 } = {}) {
  const db = await getDb();
  let list = await db.getAll('products');

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.notesTop && p.notesTop.toLowerCase().includes(q)) ||
      (p.notesMiddle && p.notesMiddle.toLowerCase().includes(q)) ||
      (p.notesBase && p.notesBase.toLowerCase().includes(q))
    );
  }

  // Family filter
  if (family && family !== 'All') {
    list = list.filter(p => p.family.toLowerCase() === family.toLowerCase());
  }

  // Gender filter
  if (gender && gender !== 'All') {
    list = list.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
  }

  // Price range
  list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);

  // Sorting
  if (sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    list.sort((a, b) => (b.id > a.id ? 1 : -1));
  } else if (sort === 'featured') {
    list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return list;
}

export async function getProductById(id) {
  const db = await getDb();
  return await db.get('products', id);
}

export async function getFeaturedProducts(limit = 4) {
  const db = await getDb();
  const all = await db.getAll('products');
  return all.filter(p => p.isFeatured).slice(0, limit);
}

// Admin Product Management
export async function createProduct(productData) {
  const db = await getDb();
  const id = `sg-prod-${Date.now()}`;
  const newProduct = {
    id,
    ...productData,
    price: Number(productData.price),
    stock: Number(productData.stock || 10),
    isFeatured: Boolean(productData.isFeatured)
  };
  await db.put('products', newProduct);
  return newProduct;
}

export async function updateProduct(id, productData) {
  const db = await getDb();
  const existing = await db.get('products', id);
  if (!existing) throw new Error('Product not found.');

  const updated = {
    ...existing,
    ...productData,
    price: Number(productData.price ?? existing.price),
    stock: Number(productData.stock ?? existing.stock),
    isFeatured: Boolean(productData.isFeatured ?? existing.isFeatured)
  };
  await db.put('products', updated);
  return updated;
}

export async function deleteProduct(id) {
  const db = await getDb();
  await db.delete('products', id);
  return true;
}

/**
 * =========================================================================
 * CART (Stored in localStorage)
 * =========================================================================
 */

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/**
 * =========================================================================
 * ORDERS DATA LAYER
 * =========================================================================
 */

export async function createOrder({ userId, items, total, address }) {
  const db = await getDb();
  const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const order = {
    id: orderId,
    userId: userId || 'guest',
    items,
    total: Number(total.toFixed(2)),
    address,
    status: 'Processing',
    createdAt: new Date().toISOString()
  };

  await db.put('orders', order);

  // Decrement product stock
  const tx = db.transaction('products', 'readwrite');
  for (const item of items) {
    const prod = await tx.store.get(item.id);
    if (prod && prod.stock >= item.quantity) {
      prod.stock -= item.quantity;
      await tx.store.put(prod);
    }
  }
  await tx.done;

  // Clear cart after checkout
  clearCart();

  return order;
}

export async function getUserOrders(userId) {
  const db = await getDb();
  const allOrders = await db.getAllFromIndex('orders', 'userId', userId);
  return allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getAllOrders() {
  const db = await getDb();
  const all = await db.getAll('orders');
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateOrderStatus(orderId, status) {
  const db = await getDb();
  const order = await db.get('orders', orderId);
  if (!order) throw new Error('Order not found.');
  order.status = status;
  await db.put('orders', order);
  return order;
}

/**
 * =========================================================================
 * WISHLIST DATA LAYER
 * =========================================================================
 */

export async function getWishlist(userId) {
  if (!userId) return [];
  const db = await getDb();
  const entries = await db.getAllFromIndex('wishlist', 'userId', userId);
  const productIds = entries.map(e => e.productId);

  // Fetch product details
  const products = [];
  for (const pid of productIds) {
    const p = await db.get('products', pid);
    if (p) products.push(p);
  }
  return products;
}

export async function isInWishlist(userId, productId) {
  if (!userId) return false;
  const db = await getDb();
  const key = `${userId}_${productId}`;
  const item = await db.get('wishlist', key);
  return !!item;
}

export async function toggleWishlist(userId, productId) {
  if (!userId) throw new Error('Please log in to save to your wishlist.');
  const db = await getDb();
  const key = `${userId}_${productId}`;
  const existing = await db.get('wishlist', key);

  if (existing) {
    await db.delete('wishlist', key);
    return false; // Removed
  } else {
    await db.put('wishlist', {
      id: key,
      userId,
      productId,
      addedAt: new Date().toISOString()
    });
    return true; // Added
  }
}

/**
 * =========================================================================
 * REVIEWS DATA LAYER
 * =========================================================================
 */

export async function getReviews(productId) {
  const db = await getDb();
  const list = await db.getAllFromIndex('reviews', 'productId', productId);
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addReview({ productId, userId, userName, rating, comment }) {
  const db = await getDb();
  const review = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    productId,
    userId,
    userName,
    rating: Number(rating),
    comment: comment.trim(),
    createdAt: new Date().toISOString()
  };
  await db.put('reviews', review);
  return review;
}

/**
 * =========================================================================
 * NEWSLETTER (Stored locally)
 * =========================================================================
 */

export async function subscribeNewsletter(email) {
  const db = await getDb();
  const normalized = email.trim().toLowerCase();
  await db.put('newsletter', {
    email: normalized,
    subscribedAt: new Date().toISOString()
  });
  return true;
}
