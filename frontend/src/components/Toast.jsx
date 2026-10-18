import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 animate-bounce-short">
      <div className="flex items-center gap-3 bg-sage-900 text-cream-50 px-5 py-3.5 rounded-full shadow-soft-lg border border-gold-400/30">
        <div className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
          <CheckCircle2 size={18} />
        </div>
        <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
      </div>
    </div>
  );
}
