import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as dataService from '../services/dataService';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadWishlist() {
      if (!user) {
        setWishlistProducts([]);
        return;
      }
      try {
        setLoading(true);
        const items = await dataService.getWishlist(user.id);
        setWishlistProducts(items);
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      throw new Error('Please log in to add items to your wishlist.');
    }
    const isAdded = await dataService.toggleWishlist(user.id, product.id);
    if (isAdded) {
      setWishlistProducts(prev => [...prev, product]);
    } else {
      setWishlistProducts(prev => prev.filter(p => p.id !== product.id));
    }
    return isAdded;
  };

  const isWishlisted = (productId) => {
    return wishlistProducts.some(p => p.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistProducts,
        wishlistCount: wishlistProducts.length,
        loading,
        toggleWishlist,
        isWishlisted
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
