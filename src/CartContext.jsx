import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load initially from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('lynix_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('lynix_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item =>
        item.id === product.id &&
        item.selectedSize === (product.selectedSize || null) &&
        item.selectedColor === (product.selectedColor || null)
      );
      if (existing) {
        return prev.map(item =>
          (item.id === product.id &&
           item.selectedSize === (product.selectedSize || null) &&
           item.selectedColor === (product.selectedColor || null))
          ? { ...item, quantity: item.quantity + qty }
          : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (uniqueId) => {
    // Unique ID can be id+size+color if needed, but for now we look for exact match
    setCartItems(prev => prev.filter(item => {
      const isSame = item.id === uniqueId; // Simple ID check
      return !isSame;
    }));
  };

  const updateQuantity = (productId, newQty, size = null, color = null) => {
    if (newQty < 1) {
      setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)));
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === productId && item.selectedSize === size && item.selectedColor === color) ? { ...item, quantity: newQty } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('lynix_cart');
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const numericPrice = Number(item.price.toString().replace(/[^0-9.-]+/g,""));
    return total + (numericPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
