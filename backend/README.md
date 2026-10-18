# Scent Garden - Future Backend Specification & Contract

> **IMPORTANT ARCHITECTURAL NOTE:**
> The live deployment of Scent Garden runs **100% within the user's browser**.
> It does NOT connect to this backend server, nor any external database or cloud API.
> All business logic, PBKDF2 cryptography, user authentication, orders, cart, and reviews operate via `frontend/src/services/dataService.js` using IndexedDB (`idb`) and `localStorage`.

This folder is provided as a starter and specification for future cloud backends.

---

## Service Layer Abstraction (`dataService.js`)

All client components strictly interact with `dataService.js`. When migrating to a remote REST backend, only `dataService.js` needs to be updated to replace local IndexedDB calls with `fetch('/api/...')`.

### Method to Endpoint Mapping

| `dataService.js` Method | HTTP Verb & Route | Description |
|---|---|---|
| `getProducts(filters)` | `GET /api/products` | Retrieves catalog with optional search, family, gender, sort filters |
| `getProductById(id)` | `GET /api/products/:id` | Returns full detail for a single perfume |
| `createProduct(productData)` | `POST /api/products` | Adds a new perfume to inventory (Admin only) |
| `updateProduct(id, productData)`| `PUT /api/products/:id` | Updates an existing perfume (Admin only) |
| `deleteProduct(id)` | `DELETE /api/products/:id` | Removes a perfume (Admin only) |
| `registerUser(name, email, pass)`| `POST /api/auth/signup` | Registers new user; returns session token & profile |
| `loginUser(email, pass)` | `POST /api/auth/login` | Authenticates credentials; returns session token & profile |
| `updateUserProfile(id, updates)` | `PUT /api/users/:id` | Updates user details (name, etc.) |
| `changePassword(id, oldPass, newPass)`| `POST /api/users/:id/password` | Verifies old password and updates PBKDF2 hash |
| `createOrder(orderData)` | `POST /api/orders` | Creates an order; sets status to 'Processing' |
| `getUserOrders(userId)` | `GET /api/orders` | Retrieves order history for a logged in user |
| `getAllOrders()` | `GET /api/orders?all=true`| Retrieves all customer orders (Admin only) |
| `updateOrderStatus(orderId, status)`| `PATCH /api/orders/:id/status`| Updates delivery status (Admin only) |
| `getReviews(productId)` | `GET /api/products/:id/reviews` | Retrieves customer reviews for a perfume |
| `addReview(reviewData)` | `POST /api/products/:id/reviews`| Adds a verified product review |
| `getWishlist(userId)` | `GET /api/wishlist` | Gets saved fragrance IDs for a user |
| `toggleWishlist(userId, productId)`| `POST /api/wishlist/toggle` | Toggles product in/out of user's wishlist |

---

## Local Development (Optional)

If you wish to experiment with the Express starter locally:

```bash
cd backend
npm install
npm run dev
```

Remember: **Do not deploy this backend folder to Vercel.** Vercel should only build and serve the `frontend/` directory.
