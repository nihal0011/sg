import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const wishlisted = isWishlisted(product.id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/auth', { state: { message: 'Please log in to save items to your wishlist.' } });
      return;
    }
    await toggleWishlist(product);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, '50ml', 1);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-sage-200/60 hover:border-gold-400/60 hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] rounded-xl overflow-hidden bg-cream-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-sage-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cream-50/90 text-sage-800 shadow-sm border border-sage-200/50 backdrop-blur-sm">
            {product.family}
          </span>
          {product.isFeatured && (
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold-400 text-sage-950 shadow-sm">
              Artisan Choice
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-sm ${
            wishlisted
              ? 'bg-blush-400 text-white shadow-soft'
              : 'bg-white/90 text-sage-600 hover:text-blush-500 hover:bg-white'
          }`}
        >
          <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
        </button>

        {/* Quick View hint */}
        <div className="absolute bottom-2.5 left-0 right-0 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-sage-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg">
            <Eye size={13} /> View Notes
          </span>
        </div>
      </Link>

      {/* Info Container */}
      <div className="pt-3 pb-1 px-1 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-sage-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px]">{product.brand}</span>
            <span className="text-[11px] text-sage-600 font-medium">{product.gender}</span>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-base font-semibold text-sage-900 hover:text-sage-700 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Notes summary */}
          <p className="text-xs text-sage-600 line-clamp-1 mt-1 italic">
            {product.notesTop?.split(',')[0]} • {product.notesMiddle?.split(',')[0]} • {product.notesBase?.split(',')[0]}
          </p>
        </div>

        {/* Price & Quick Add */}
        <div className="mt-4 pt-2 border-t border-sage-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-sage-500 font-normal">from </span>
            <span className="text-base font-bold text-sage-900">${Math.round(product.price * 0.75)}</span>
            <span className="text-[11px] text-sage-500 ml-1">/ 30ml</span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 bg-sage-800 hover:bg-sage-900 active:scale-95 text-cream-50 text-xs font-semibold px-3 py-2 rounded-xl transition shadow-sm"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag size={14} />
            <span>Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
}
