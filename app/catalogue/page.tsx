"use client";

import { Product } from "../interfaces/catalogue";
import ProductCard from "../components/ProductCard";
import useToast from "../contexts/ToastProvider";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Rings } from "react-loader-spinner";

export default function Catalogue() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/products.json");
      if (!res.ok) showToast("Failed to fetch products", "error");
      const data = await res.json();
      setProducts(data);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-screen flex items-center justify-center">
          <Rings />
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Product Catalogue</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
