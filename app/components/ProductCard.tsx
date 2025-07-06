"use client";

import { useState } from "react";
import { Product } from "../interfaces/catalogue";
import { priceFormat } from "../helpers/formatter";

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const imageSrc = imageFailed ? "not-found.jpg" : product.imageUrl;

  return (
    <div
      className="rounded-lg p-4 bg-white shadow-md hover:shadow-lg relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageSrc}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded-lg"
        onError={() => setImageFailed(true)}
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{priceFormat(product.price)}</p>
      {isHovered && (
        <div className="absolute inset-0 bg-gray-700/20 flex items-center justify-center rounded-lg">
          <button className="btn btn-primary">View</button>
        </div>
      )}
    </div>
  );
}
