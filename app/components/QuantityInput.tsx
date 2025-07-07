"use client";

import { useState } from "react";
import { Product } from "../interfaces/catalogue";
import { priceFormat } from "../helpers/formatter";
import useCart from "../contexts/CartProvider";
import { useRouter } from "next/navigation";

export default function QuantityInput({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: any;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
        onClick={() => {
          if (quantity > 1) {
            onChange(quantity - 1);
          }
        }}
      >
        -
      </button>
      <div className="text-lg w-full text-center">{quantity}</div>
      <button
        className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}
