import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight, Sparkles, User } from 'lucide-react';

export default function Wishlist() {
  const { wishlistProducts, loading } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="bg-white/80 rounded-3xl p-10 text-center border border-sage-200 shadow-soft space-y-4">
          <div className="w-16 h-16 bg-cream-100 text-blush-400 rounded-full flex items-center justify-center mx-auto">
            <Heart size={32} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-sage-950">Save Your Favorite Scents</h2>
          <p className="text-xs text-sage-600 max-w-sm mx-auto leading-relaxed">
            Sign in to curate your private wishlist and keep track of fragrances you love across all your visits.
          </p>
          <div className="pt-2">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-sage-800 text-cream-50 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sage-900 transition shadow-soft"
            >
              <User size={14} />
              <span>Sign In to View Wishlist</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block mb-1">
          Personal Wardrobe
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
          Saved Botanical Fragrances ({wishlistProducts.length})
        </h1>
        <p className="text-xs text-sage-600 mt-1">
          Your curated sanctuary of perfumes to acquire or gift.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-96 bg-sage-100/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-12 text-center border border-sage-200 shadow-soft max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-cream-100 text-sage-400 rounded-full flex items-center justify-center mx-auto">
            <Heart size={32} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-sage-950">Your Wishlist is Empty</h2>
          <p className="text-xs text-sage-600 max-w-sm mx-auto leading-relaxed">
            Click the heart icon on any perfume in the catalog to save it to your personal fragrance sanctuary.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-sage-800 text-cream-50 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sage-900 transition shadow-soft"
            >
              <span>Explore Fragrances</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
