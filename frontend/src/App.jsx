import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

function NotFound() {
  return (
    <div className="max-w-xl mx-auto my-20 px-4 text-center space-y-4">
      <div className="text-6xl font-serif text-sage-400">404</div>
      <h1 className="font-serif text-3xl font-bold text-sage-950">Aroma Pathway Lost</h1>
      <p className="text-xs text-sage-600 leading-relaxed max-w-sm mx-auto">
        The botanical formulation you sought seems to have vanished into thin air like top notes in a summer breeze.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-block bg-sage-800 text-cream-50 px-6 py-2.5 rounded-full text-xs uppercase font-semibold hover:bg-sage-900 transition shadow-soft"
        >
          Return to Sanctuary
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-cream-50 text-sage-950 selection:bg-sage-200">
              <Navbar />
              <CartDrawer />
              <Toast />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
