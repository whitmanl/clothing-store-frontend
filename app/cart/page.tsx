"use client";

import useToast from "../contexts/ToastProvider";
import useCart from "../contexts/CartProvider";
import Layout from "../components/Layout";
import QuantityInput from "../components/QuantityInput";
import { priceFormat } from "../helpers/formatter";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Çart() {
  const { cart, updateFromCart, removeFromCart, totalPrice, checkout } =
    useCart();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/not-found.jpg";
                      }}
                    />
                    <div>
                      <h2 className="text-lg font-semibold">
                        {item.product.name}
                      </h2>
                      <p className="text-gray-600">
                        {priceFormat(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <QuantityInput
                      quantity={item.quantity}
                      onChange={(quantity: number) =>
                        updateFromCart({ product: item.product, quantity })
                      }
                    />
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.product)}
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <p className="text-xl font-bold">
                Total: {priceFormat(totalPrice)}
              </p>
              <button
                className="btn btn-primary text-white py-2 px-4 mt-4"
                onClick={checkout}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
