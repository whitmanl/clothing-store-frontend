"use client";

import { useState } from "react";
import { Product } from "../interfaces/catalogue";
import { priceFormat } from "../helpers/formatter";
import useCart from "../contexts/CartProvider";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-lg p-4 bg-white shadow-md hover:shadow-lg relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded-lg"
        onError={(e) => {
          e.currentTarget.src = "/not-found.jpg";
        }}
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{priceFormat(product.price)}</p>
      {isHovered && (
        <div className="absolute inset-0 bg-gray-700/20 flex flex-col items-center justify-center rounded-lg gap-4">
          <button
            className="btn btn-primary"
            onClick={() => router.push(`/product/${product._id}`)}
          >
            View
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => addToCart({ product, quantity: 1 })}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
