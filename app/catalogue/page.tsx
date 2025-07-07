"use client";

import { Product } from "../interfaces/catalogue";
import ProductCard from "../components/ProductCard";
import useToast from "../contexts/ToastProvider";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Rings } from "react-loader-spinner";
import useCart from "../contexts/CartProvider";

export default function Catalogue() {
  const { products, isProductLoading } = useCart();

  if (isProductLoading) {
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
        <h1 className="text-3xl font-bold mb-6">Product Catalogue</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
