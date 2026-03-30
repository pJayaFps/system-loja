import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('sportvault_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sportvault_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantidade = 1, tamanho = 'M') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.tamanho === tamanho);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.tamanho === tamanho
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      return [...prev, { ...product, quantidade, tamanho }];
    });
  };

  const removeFromCart = (id, tamanho) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho)));
  };

  const updateQuantity = (id, tamanho, quantidade) => {
    if (quantidade < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.tamanho === tamanho ? { ...item, quantidade } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    const items = cart.reduce((sum, item) => sum + item.quantidade, 0);
    const amount = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    return { items, amount };
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totals }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
