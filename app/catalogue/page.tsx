"use client";

import { Product } from "../interfaces/catalogue";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Rings } from "react-loader-spinner";
import useCart from "../contexts/CartProvider";
import _ from "lodash";
import { ProtectRoute } from "../contexts/AuthProvider";

function CataloguePage() {
  const { products, isProductLoading } = useCart();

  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const applyFilter = () => {
    let tempOrders: Product[] = [...products];
    let filtered: Product[] = [];
    if (search) {
      for (let i = 0; i < tempOrders.length; i++) {
        if (
          tempOrders[i].name.toLowerCase().includes(search.toLowerCase()) ||
          tempOrders[i].price === parseFloat(search)
        ) {
          filtered.push(tempOrders[i]);
        }
      }
      tempOrders = filtered;
    } else {
      filtered = tempOrders;
    }
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const debouncedSearch = _.debounce(() => {
      applyFilter();
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, products]);

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
        <input
          type="text"
          name="productName"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search Product Name or Price"
          className="input input-info w-full mb-6"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProtectRoute(CataloguePage);
