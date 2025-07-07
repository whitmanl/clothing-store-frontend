"use client";

import { Product } from "../../interfaces/catalogue";
import useToast from "../../contexts/ToastProvider";
import { useState, useEffect, use } from "react";
import Layout from "../../components/Layout";
import { Rings } from "react-loader-spinner";
import useCart from "../../contexts/CartProvider";
import { priceFormat } from "@/app/helpers/formatter";
import { useRouter } from "next/navigation";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const [productDetail, setProductDetail] = useState<Product>();
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/products.json");
      if (!res.ok) showToast("Failed to fetch products", "error");
      const data = await res.json();
      const product = data.find((p: Product) => p._id === id);
      setProductDetail(product);
      setIsLoading(false);
    }
    fetchProducts();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-screen flex items-center justify-center">
          <Rings />
        </div>
      </Layout>
    );
  }

  if (!productDetail) {
    return (
      <Layout>
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
          Product not found. Please return to catalog
          <button className="btn btn-info" onClick={() => router.push("/catalogue")}>Back</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={productDetail.imageUrl}
            alt={productDetail.name}
            className="w-full md:w-1/2 h-96 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/not-found.jpg";
            }}
          />
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{productDetail.name}</h1>
            <p className="text-gray-600 mb-4">{productDetail.description}</p>
            <p className="text-2xl font-semibold mb-4">
              {priceFormat(productDetail.price)}
            </p>
            <p className="text-gray-500 mb-8">
              Category: {productDetail.category}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <button
                className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity((p) => p - 1);
                  }
                }}
              >
                -
              </button>
              <div className="text-lg w-full text-center">{quantity}</div>
              <button
                className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
                onClick={() => setQuantity((p) => p + 1)}
              >
                +
              </button>
            </div>
            <button
              className="btn btn-secondary w-full"
              onClick={() => {
                addToCart({ product: productDetail, quantity });
                setQuantity(1);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
