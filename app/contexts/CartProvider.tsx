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
import { useRouter } from "next/navigation";
import useHttp from "./HttpProvider";
import useAuth from "./AuthProvider";

type httpContextType = {
  addToCart: (cart: Cart) => void;
  updateFromCart: (cart: Cart) => void;
  removeFromCart: (product: Product) => void;
  checkout: () => void;
  cart: Cart[];
  totalPrice: number;
};

const cartContextDefaultValues: httpContextType = {
  addToCart: () => {},
  updateFromCart: () => {},
  removeFromCart: () => {},
  checkout: () => {},
  cart: [],
  totalPrice: 0,
};

const CartContext = createContext(cartContextDefaultValues);

const useCart = () => {
  return useContext(CartContext);
};

export default useCart;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { post } = useHttp();
  const { user } = useAuth();

  const [cart, setCart] = useState<Cart[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

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

  const checkout = async () => {
    const res = await post("/sales", {
      userId: user.id,
      products: cart.map((v) => ({
        productId: v.product._id,
        name: v.product.name,
        price: v.product.price,
        quantity: v.quantity,
      })),
      totalPrice,
    });
    if (res?.status) {
      showToast(res?.data?.message || "Please try again later", "error");
    } else {
      await showToast("Successfully checkout!");
      setCart([]);
      router.push("catalogue");
    }
  };

  useEffect(() => {
    let amount = 0;
    for (let i = 0; i < cart.length; i++) {
      amount += cart[i].product.price * cart[i].quantity;
    }
    setTotalPrice(amount);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        updateFromCart,
        removeFromCart,
        checkout,
        cart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
