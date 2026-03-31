import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('sportvault_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('sportvault_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('sportvault_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sportvault_coupon', JSON.stringify(coupon));
  }, [coupon]);

  const addToCart = (product, quantidade = 1, tamanho = 'M') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.tamanho === tamanho);
      if (existing) {
        return prev.map((item) => (item.id === product.id && item.tamanho === tamanho
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item));
      }
      return [...prev, { ...product, quantidade, tamanho }];
    });
  };

  const removeFromCart = (id, tamanho) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho)));
  };

  const updateQuantity = (id, tamanho, quantidade) => {
    if (quantidade < 1) return;
    setCart((prev) => prev.map((item) => (item.id === id && item.tamanho === tamanho ? { ...item, quantidade } : item)));
  };

  const applyCoupon = (nextCoupon) => setCoupon(nextCoupon);
  const clearCoupon = () => setCoupon(null);

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const totals = useMemo(() => {
    const items = cart.reduce((sum, item) => sum + item.quantidade, 0);
    const amount = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    const desconto = coupon?.desconto || 0;
    const finalAmount = Math.max(0, amount - desconto);
    return { items, amount, desconto, finalAmount };
  }, [cart, coupon]);

  useEffect(() => {
    if (!cart.length) setCoupon(null);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totals, coupon, applyCoupon, clearCoupon }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
