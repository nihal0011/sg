# Scent Garden 🌿 | Artisanal Botanical Perfumery

> An artisanal luxury perfume e-commerce web application inspired by nature's untamed blooms, ancient sacred woods, and nocturnal resins.

---

## ⚡ Crucial Architecture & Deployment Rule

- **100% Client-Side In-Browser Execution**: The live application runs entirely in the browser using **IndexedDB** (via the [`idb`](https://www.npmjs.com/package/idb) library) and **localStorage**.
- **Zero Third-Party Services**: Does **not** require or connect to Supabase, Firebase, MongoDB, or any external backend/API at runtime.
- **Client Security**: User passwords are cryptographically hashed client-side with the native **Web Crypto API** using **PBKDF2 with SHA-256 and a unique random 16-byte salt per user**. Plain-text passwords are never stored.
- **Vercel-Ready**: Only the `frontend/` directory is deployed to Vercel. The `backend/` folder is an optional future-use Express reference specification and starter that is **not** hosted or called by the live client.

---

## 📂 Project Structure

```text
scent-garden/
├── frontend/                     # React application (Vercel deployment root)
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx        # Botanical branding, search, auth, cart & wishlist badges
│   │   │   ├── Footer.jsx        # Story, scent links, and client-storage disclosures
│   │   │   ├── ProductCard.jsx   # Interactive perfume card with size & wishlist actions
│   │   │   ├── CartDrawer.jsx    # Slide-over shopping bag with free shipping meter
│   │   │   ├── ProtectedRoute.jsx# Auth and Admin role route guards
│   │   │   └── Toast.jsx         # Non-intrusive floating feedback notifications
│   │   ├── context/              # Global React state management
│   │   │   ├── AuthContext.jsx   # User session, login, signup, PBKDF2 updates
│   │   │   ├── CartContext.jsx   # Bag items, quantity, size-pricing multiplier
│   │   │   └── WishlistContext.jsx # User saved fragrances synced to IndexedDB
│   │   ├── data/
│   │   │   └── products.js       # 14 initial luxury perfumes and sample reviews
│   │   ├── pages/                # Application routes
│   │   │   ├── Home.jsx          # Hero, scent families, featured catalog, olfactory pyramid
│   │   │   ├── Shop.jsx          # Live search, scent family/gender/price filters & sort
│   │   │   ├── ProductDetail.jsx # High-res gallery, 30/50/100ml size selector, reviews
│   │   │   ├── Cart.jsx          # Cart review table, promo code simulator, subtotal
│   │   │   ├── Checkout.jsx      # Shipping address form, mock payment, order confirmation
│   │   │   ├── Auth.jsx          # Login & Signup with device-storage privacy notice
│   │   │   ├── Orders.jsx        # User-specific order history & tracking badges
│   │   │   ├── Wishlist.jsx      # Private saved botanical fragrances
│   │   │   ├── Admin.jsx         # Curator dashboard (inventory CRUD & order status)
│   │   │   └── Profile.jsx       # Edit name & PBKDF2 password change
│   │   ├── services/
│   │   │   └── dataService.js    # Single data layer abstraction for all IndexedDB calls
│   │   ├── App.jsx               # Route definitions & application layout
│   │   ├── index.css             # Tailwind directives & botanical styles
│   │   └── main.jsx              # React 18 DOM mount point
│   ├── tailwind.config.js        # Sage, cream, blush, and gold color palettes
│   ├── vercel.json               # SPA rewrite rule so routes persist on refresh
│   └── package.json
├── backend/                      # Optional future-use Express API starter & contract notes
│   ├── server.js                 # Demonstrative REST endpoints matching dataService.js
│   ├── package.json
│   └── README.md                 # API contract specification
└── README.md
```

---

## 🔑 Default Administrator Credentials

On first load, if the database is uninitialized, seed perfumes and a pre-configured administrator account are automatically created in IndexedDB:

- **Email**: `admin@scentgarden.com`
- **Password**: `Admin@123`
- **Role**: `admin`

*(Tip: On the `/auth` page, click **"Fill Default Admin Credentials"** to test immediately.)*

---

## 🎨 Botanical Design System

- **Palette**:
  - Soft Sage Green (`#405A45`, `#6B8E72`, `#E6EDE7`)
  - Warm Cream & Linen (`#FDFAF5`, `#FAF6EE`, `#EDE0C6`)
  - Subtle Blush Pink (`#F8DADA`, `#E98D8D`)
  - Champagne Gold Accents (`#DFB835`, `#C99D1C`, `#A47D14`)
- **Typography**:
  - Headings: *Playfair Display* (classic luxury serif)
  - Body & UI: *Plus Jakarta Sans* (clean modern sans-serif)

---

## 🚀 Local Development

### 1. Test the Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Verify Production Build

```bash
npm run build
npm run preview
```

---

## 🚢 Vercel Deployment Instructions

Follow these simple steps to deploy the live application on Vercel:

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket).
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **"Add New"** > **"Project"**.
3. Import your Git repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Environment Variables**: Leave blank (no API keys or environment variables required!)
5. Click **Deploy**.

### Client-Side SPA Routing on Vercel
The provided `frontend/vercel.json` automatically configures the rewrite rule below so refreshing routes like `/shop`, `/product/sg-prod-01`, `/orders`, or `/admin` works without 404 errors:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📦 Single Data Layer Abstraction (`dataService.js`)

All components communicate strictly with `src/services/dataService.js`. Components never access IndexedDB or localStorage directly.

| Function | Storage Target | Description |
|---|---|---|
| `getProducts(filters)` | IndexedDB (`products`) | Search by keyword, filter by family/gender/price, sort |
| `getProductById(id)` | IndexedDB (`products`) | Fetch single perfume details & stock |
| `createProduct(data)` | IndexedDB (`products`) | Curator admin inventory creation |
| `updateProduct(id, data)` | IndexedDB (`products`) | Curator admin inventory edit |
| `deleteProduct(id)` | IndexedDB (`products`) | Curator admin inventory removal |
| `createUser(name, email, pass)` | IndexedDB (`users`) | PBKDF2 salt generation and hashing |
| `loginUser(email, pass)` | IndexedDB (`users`) | PBKDF2 hash verification |
| `createOrder(orderData)` | IndexedDB (`orders`) | Stock decrement & order record |
| `getUserOrders(userId)` | IndexedDB (`orders`) | Filtered past orders for active user |
| `getAllOrders()` | IndexedDB (`orders`) | Curator admin view of all customer orders |
| `updateOrderStatus(id, status)` | IndexedDB (`orders`) | Update fulfillment: Processing, Shipped, Delivered |
| `getWishlist(userId)` | IndexedDB (`wishlist`) | Saved perfume references |
| `toggleWishlist(userId, pid)` | IndexedDB (`wishlist`) | Add/remove perfume from user wardrobe |
| `addReview(reviewData)` | IndexedDB (`reviews`) | Verified reviews & ratings for perfumes |
| `getCart() / saveCart(items)` | `localStorage` | Active shopping bag persistence |
| `getCurrentSession()` | `localStorage` | Active authentication session token |
