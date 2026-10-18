import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  User,
  LogOut,
  ShieldAlert,
  Package,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-sage-900 font-semibold border-b-2 border-gold-500 pb-0.5' : 'text-sage-700 hover:text-sage-950'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-sage-200/60">
      {/* Top Botanical Ribbon */}
      <div className="bg-sage-900 text-cream-100 text-[11px] tracking-widest uppercase py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles size={12} className="text-gold-400" />
        <span>Complimentary botanical discovery vials on all orders over $100</span>
        <Sparkles size={12} className="text-gold-400" />
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-sage-800 hover:text-sage-950 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-sage-800 text-gold-300 flex items-center justify-center shadow-soft group-hover:bg-sage-900 transition">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-sage-950 block leading-tight">
              Scent Garden
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-sage-600 block">
              Artisanal Botanical Parfums
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkStyle}>
            Fragrance Catalog
          </NavLink>
          <NavLink to="/shop?family=Floral" className={navLinkStyle}>
            Florals
          </NavLink>
          <NavLink to="/shop?family=Woody" className={navLinkStyle}>
            Woods & Earth
          </NavLink>
          <NavLink to="/shop?family=Citrus" className={navLinkStyle}>
            Citrus
          </NavLink>
        </div>

        {/* Right Actions: Wishlist, Cart, Profile/Auth */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 text-sage-700 hover:text-sage-950 rounded-full hover:bg-sage-100/70 transition"
            aria-label="Wishlist"
          >
            <Heart size={21} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blush-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2 text-sage-700 hover:text-sage-950 rounded-full hover:bg-sage-100/70 transition"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={21} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sage-800 text-cream-50 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* Auth / User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-sage-300 bg-white/60 hover:bg-white text-sage-900 transition shadow-sm text-xs font-semibold"
              >
                <div className="w-6 h-6 rounded-full bg-sage-200 text-sage-800 flex items-center justify-center font-bold text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
                <ChevronDown size={14} className="text-sage-500" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-sage-200/80 py-2 z-40 animate-in fade-in-50">
                    <div className="px-4 py-2 border-b border-sage-100">
                      <p className="text-xs text-sage-500">Signed in as</p>
                      <p className="text-sm font-semibold text-sage-950 truncate">{user.name}</p>
                      <p className="text-xs text-sage-600 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-700 px-2 py-0.5 rounded-md">
                          Botanical Admin
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-sage-800 hover:bg-cream-100 transition"
                    >
                      <User size={15} className="text-sage-500" />
                      Profile & Security
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-sage-800 hover:bg-cream-100 transition"
                    >
                      <Package size={15} className="text-sage-500" />
                      My Fragrance Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gold-700 bg-gold-50/70 hover:bg-gold-100/70 transition"
                      >
                        <ShieldAlert size={15} className="text-gold-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-sage-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-blush-600 hover:bg-blush-50 transition text-left"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 bg-sage-800 hover:bg-sage-900 text-cream-50 text-xs font-semibold px-4 py-2.5 rounded-full transition shadow-soft"
            >
              <User size={14} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sage-200/80 bg-cream-50 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-sage-800 hover:bg-sage-100"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-sage-800 hover:bg-sage-100"
          >
            All Perfumes
          </Link>
          <Link
            to="/shop?family=Floral"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-sage-800 hover:bg-sage-100"
          >
            Floral Scents
          </Link>
          <Link
            to="/shop?family=Woody"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-sage-800 hover:bg-sage-100"
          >
            Woody Scents
          </Link>
          <Link
            to="/shop?family=Citrus"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-sage-800 hover:bg-sage-100"
          >
            Citrus Scents
          </Link>
          <Link
            to="/shop?family=Oriental"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-sage-800 hover:bg-sage-100"
          >
            Oriental Scents
          </Link>
          <Link
            to="/shop?family=Fresh"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-sage-800 hover:bg-sage-100"
          >
            Fresh Scents
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-gold-700 bg-gold-50"
            >
              🌿 Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
