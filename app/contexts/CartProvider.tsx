"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import { Cart } from "../interfaces/catalogue";
import useToast from "../contexts/ToastProvider";

type httpContextType = {
  addToCart: (cart: Cart) => void;
  cart: Cart[];
};

const cartContextDefaultValues: httpContextType = {
  addToCart: () => {},
  cart: [],
};

const CartContext = createContext(cartContextDefaultValues);

const useCart = () => {
  return useContext(CartContext);
};

export default useCart;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<Cart[]>([]);

  const addToCart = async (cart: Cart) => {
    setCart((p) => [
      ...p.filter((v) => v.product._id !== cart.product._id),
      cart,
    ]);
    showToast('Successfully added to shopping cart!')
  };

  return (
    <CartContext.Provider
      value={{
        addToCart,
        cart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
