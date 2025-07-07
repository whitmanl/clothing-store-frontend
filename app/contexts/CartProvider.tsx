"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Cart, Product } from "../interfaces/catalogue";
import useToast from "../contexts/ToastProvider";

type httpContextType = {
  addToCart: (cart: Cart) => void;
  updateFromCart: (cart: Cart) => void;
  removeFromCart: (product: Product) => void;
  cart: Cart[];
  totalAmount: number;
};

const cartContextDefaultValues: httpContextType = {
  addToCart: () => {},
  updateFromCart: () => {},
  removeFromCart: () => {},
  cart: [],
  totalAmount: 0,
};

const CartContext = createContext(cartContextDefaultValues);

const useCart = () => {
  return useContext(CartContext);
};

export default useCart;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<Cart[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const addToCart = async (cart: Cart) => {
    setCart((p) => [
      ...p.filter((v) => v.product._id !== cart.product._id),
      cart,
    ]);
    showToast("Successfully added to shopping cart!");
  };

  const updateFromCart = async (cart: Cart) => {
    setCart((p) =>
      p.map((item) => (item.product._id === cart.product._id ? cart : item))
    );
  };

  const removeFromCart = async (product: Product) => {
    setCart((p) => [...p.filter((v) => v.product._id !== product._id)]);
    showToast("Successfully added to shopping cart!");
  };

  useEffect(() => {
    let amount = 0;
    for (let i = 0; i < cart.length; i++) {
      amount += cart[i].product.price * cart[i].quantity;
    }
    setTotalAmount(amount);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        updateFromCart,
        removeFromCart,
        cart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
