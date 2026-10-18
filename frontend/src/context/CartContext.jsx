import React, { createContext, useContext, useState, useEffect } from 'react';
import * as dataService from '../services/dataService';

const CartContext = createContext(null);

export const SIZE_PRICE_MULTIPLIERS = {
  '30ml': 0.75,
  '50ml': 1.0,
  '100ml': 1.6
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => dataService.getCart());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    dataService.saveCart(cartItems);
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product, size = '50ml', quantity = 1) => {
    const multiplier = SIZE_PRICE_MULTIPLIERS[size] || 1.0;
    const unitPrice = Math.round(product.price * multiplier);
    const cartItemId = `${product.id}_${size}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock.`);
          return prev;
        }
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty
        };
        showToast(`Updated "${product.name}" (${size}) in your cart.`);
        return next;
      } else {
        showToast(`Added "${product.name}" (${size}) to your cart.`);
        return [
          ...prev,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            brand: product.brand,
            family: product.family,
            imageUrl: product.imageUrl,
            basePrice: product.price,
            unitPrice,
            size,
            quantity,
            stock: product.stock
          }
        ];
      }
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          if (newQuantity > item.stock) {
            showToast(`Max available stock is ${item.stock}`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart.');
  };

  const clearCart = () => {
    setCartItems([]);
    dataService.clearCart();
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        shipping,
        total,
        itemCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
