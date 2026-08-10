import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecom_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const { success, info, warning } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('ecom_cart_items', JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items]);

  // Add Item to Cart (Showcases List .find() and .map())
  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      warning('This item is currently out of stock.');
      return;
    }

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);

      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          warning(`Cannot add more. Maximum available stock is ${product.stock}.`);
          return prevItems;
        }
        success(`Updated ${product.name} quantity to ${newQty}.`);
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        success(`Added ${product.name} to your cart.`);
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image_url: product.image_url,
            category: product.category,
            stock: product.stock,
            quantity: Math.min(quantity, product.stock)
          }
        ];
      }
    });
  };

  // Update quantity (Showcases List .map())
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          if (newQuantity > item.stock) {
            warning(`Only ${item.stock} units available in stock.`);
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove Item (Showcases List .filter())
  const removeFromCart = (productId) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === productId);
      if (target) {
        info(`Removed ${target.name} from cart.`);
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  // Clear Cart
  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  // Apply Coupon
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'REACT2026' || clean === 'DEMO10' || clean === 'SAVE10') {
      setCouponCode(clean);
      setDiscountPercent(10);
      success('Promo code applied! 10% discount added.');
      return true;
    } else {
      warning('Invalid discount code. Try using REACT2026');
      return false;
    }
  };

  // List Operations & Aggregations (Active Showcase of .reduce())
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.08;
  const shipping = subtotal === 0 || discountedSubtotal >= 100 ? 0 : 9.99;
  const grandTotal = discountedSubtotal > 0 ? discountedSubtotal + tax + shipping : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        couponCode,
        discountPercent,
        discountAmount,
        totalItems,
        subtotal,
        tax,
        shipping,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
