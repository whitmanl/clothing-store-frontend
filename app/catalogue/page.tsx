"use client";

import { Product } from "../interfaces/catalogue";
import ProductCard from "../components/ProductCard";
import useToast from "../contexts/ToastProvider";
import { useState, useEffect } from "react";

export default function Catalogue() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/products.json");
      if (!res.ok) showToast("Failed to fetch products", "error");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Product Catalogue</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
