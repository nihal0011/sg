import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function Cart() {
  const { user } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    total
  } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'BOTANICAL10') {
      setDiscountPercent(0.10);
      setPromoMessage({ success: true, text: 'Promo code BOTANICAL10 applied: 10% off!' });
    } else {
      setPromoMessage({ success: false, text: 'Invalid promo code. Try "BOTANICAL10"' });
    }
  };

  const discountAmount = Math.round(subtotal * discountPercent);
  const finalTotal = Math.max(0, total - discountAmount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4">
        <div className="bg-white/80 rounded-3xl p-12 text-center border border-sage-200/80 shadow-soft space-y-5">
          <div className="w-20 h-20 bg-cream-100 text-sage-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={36} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-sage-950">Your Fragrance Bag is Empty</h2>
          <p className="text-xs text-sage-600 max-w-md mx-auto leading-relaxed">
            Your collection awaits. Explore our artisanal perfumes infused with cold-pressed blooms, rare woods, and pure botanical spirits.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-sage-800 text-cream-50 px-8 py-3.5 rounded-full text-xs uppercase font-semibold hover:bg-sage-900 transition shadow-soft"
            >
              <span>Explore Fragrances</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-sage-600 block mb-1">
          Review Selection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sage-950">
          Your Fragrance Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items Table / List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/80 rounded-3xl border border-sage-200/80 shadow-soft overflow-hidden">
            <div className="divide-y divide-sage-100">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-center">
                  {/* Thumbnail */}
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-28 object-cover rounded-2xl bg-cream-100 shadow-sm"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sage-500">
                      {item.brand} • {item.family}
                    </span>
                    <Link to={`/product/${item.id}`} className="block">
                      <h3 className="font-serif text-lg font-bold text-sage-950 hover:text-sage-700 transition">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="inline-block text-xs bg-cream-200 text-sage-800 px-2.5 py-0.5 rounded-full font-semibold">
                      Flacon Size: {item.size}
                    </div>
                    <p className="text-xs text-sage-600 font-medium pt-1">
                      ${item.unitPrice} each
                    </p>
                  </div>

                  {/* Quantity & Total */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <span className="font-serif text-lg font-bold text-sage-950">
                      ${item.unitPrice * item.quantity}
                    </span>

                    <div className="flex items-center border border-sage-200 rounded-xl bg-cream-50">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1.5 hover:bg-sage-100 text-sage-700 transition rounded-l-xl"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-bold text-sage-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1.5 hover:bg-sage-100 text-sage-700 transition rounded-r-xl"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-sage-400 hover:text-blush-500 p-1 transition"
                      title="Remove from bag"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-6 bg-cream-50/60 border-t border-sage-100 flex items-center justify-between">
              <Link
                to="/shop"
                className="text-xs font-semibold text-sage-800 hover:text-sage-950 underline underline-offset-4"
              >
                ← Continue Exploring Fragrances
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-blush-600 hover:text-blush-800 font-semibold transition"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white/80 rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-sage-950">Order Summary</h2>

            {/* Line items */}
            <div className="space-y-3 text-xs text-sage-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-sage-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-sage-900">
                  {shipping === 0 ? <span className="text-emerald-700">Complimentary</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Botanical Promo (10%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-sage-900">$0.00</span>
              </div>

              <div className="pt-3 border-t border-sage-200 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-sage-950">Total</span>
                <span className="font-serif text-2xl font-bold text-sage-950">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-sage-100">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-sage-600">
                Conservatory Privilege Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Code (Try: BOTANICAL10)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-gold-400 uppercase"
                />
                <button
                  type="submit"
                  className="bg-cream-200 hover:bg-cream-300 text-sage-900 text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] font-medium ${promoMessage.success ? 'text-emerald-700' : 'text-blush-500'}`}>
                  {promoMessage.text}
                </p>
              )}
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => {
                if (!user) {
                  navigate('/auth', { state: { from: { pathname: '/checkout' }, message: 'Please sign in or create an account to proceed to checkout.' } });
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full bg-sage-800 hover:bg-sage-900 text-cream-50 font-semibold py-4 px-6 rounded-2xl transition shadow-soft flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-sage-500 text-center">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>Complimentary express delivery & 100% satisfaction guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
