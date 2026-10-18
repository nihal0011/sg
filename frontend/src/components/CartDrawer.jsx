import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { user } = useAuth();
  const {
    cartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total
  } = useCart();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-sage-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-50 text-sage-950 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-sage-200/60 flex items-center justify-between bg-white/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sage-700" />
              <h2 className="font-serif text-xl font-medium tracking-tight">Your Fragrance Bag</h2>
              <span className="text-xs bg-sage-100 text-sage-800 font-semibold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-sage-500 hover:text-sage-900 rounded-full hover:bg-sage-100 transition"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-sage-100/70 px-6 py-3 border-b border-sage-200/50">
            {remainingForFree > 0 ? (
              <p className="text-xs text-sage-800 font-medium">
                Add <span className="font-bold text-sage-900">${remainingForFree.toFixed(2)}</span> more to unlock <span className="text-gold-600 font-bold">Complimentary Shipping</span>
              </p>
            ) : (
              <p className="text-xs text-sage-800 font-bold flex items-center gap-1.5">
                🌿 You've unlocked <span className="text-gold-600">Complimentary Shipping!</span>
              </p>
            )}
            <div className="w-full bg-sage-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gold-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 text-sage-400 rounded-full flex items-center justify-center">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-serif text-lg text-sage-800 font-medium">Your bag is empty</h3>
                <p className="text-sm text-sage-600 mt-1 mb-6">Discover our bespoke artisanal botanical creations.</p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="inline-flex items-center gap-2 bg-sage-800 text-cream-50 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-sage-900 transition shadow-soft"
                >
                  Explore Fragrances <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 p-3 bg-white/80 rounded-2xl border border-sage-100 hover:border-sage-200 transition shadow-sm"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-sage-50"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-sage-500 font-semibold">
                            {item.brand}
                          </span>
                          <h4 className="font-serif text-sm font-medium text-sage-900 line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-sage-400 hover:text-blush-500 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-cream-200 text-sage-800 px-2 py-0.5 rounded-md font-medium">
                          {item.size}
                        </span>
                        <span className="text-xs font-semibold text-sage-900">
                          ${item.unitPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-sage-200 rounded-lg bg-cream-50">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 hover:bg-sage-100 text-sage-700 transition rounded-l-lg"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-sage-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 hover:bg-sage-100 text-sage-700 transition rounded-r-lg"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-sage-900">
                        ${item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-sage-200/80 bg-white/90 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-sage-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-sage-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sage-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-sage-900">
                    {shipping === 0 ? <span className="text-emerald-700">Free</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-sage-950 pt-2 border-t border-sage-100">
                  <span>Estimated Total</span>
                  <span className="text-sage-900">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-3 px-4 border border-sage-300 text-sage-800 rounded-xl text-sm font-semibold hover:bg-sage-100 transition text-center"
                >
                  View Bag
                </button>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    if (!user) {
                      navigate('/auth', { state: { from: { pathname: '/checkout' }, message: 'Please sign in or create an account to proceed to checkout.' } });
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full py-3 px-4 bg-sage-800 hover:bg-sage-900 text-cream-50 rounded-xl text-sm font-semibold transition text-center shadow-soft flex items-center justify-center gap-1.5"
                >
                  Checkout <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
