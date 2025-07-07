"use client";

import useToast from "../contexts/ToastProvider";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Rings } from "react-loader-spinner";
import useHttp from "../contexts/HttpProvider";
import useAuth from "../contexts/AuthProvider";
import { History } from "../interfaces/history";
import moment from "moment";
import { priceFormat } from "../helpers/formatter";
import useCart from "../contexts/CartProvider";

interface HistoryFilter {
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  productName?: string;
}

export default function Catalogue() {
  const { showToast } = useToast();
  const { get } = useHttp();
  const { user } = useAuth();
  const { products } = useCart();

  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<HistoryFilter>({});
  const [filteredHistory, setFilteredHistory] = useState<History[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      const res = await get(`/sales/${user.id}`);
      if (res?.status) {
        showToast(res?.data?.message || "Please try again later", "error");
      } else {
        setHistory(res);
        setFilteredHistory(res);
      }
      setIsLoading(false);
    }
    if (user?.id) {
      fetchHistory();
    }
  }, [user]);

  const applyFilter = () => {
    let tempOrders: History[] = [...history];
    let filtered: History[] = [];

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      const start = filters.startDate
        ? new Date(`${filters.startDate}T00:00:00`)
        : new Date(0);
      const end = filters.endDate
        ? new Date(`${filters.endDate}T23:59:59`)
        : new Date();
      for (let i = 0; i < tempOrders.length; i++) {
        const orderDate = new Date(tempOrders[i].saleDate);
        if (orderDate >= start && orderDate <= end) {
          filtered.push(tempOrders[i]);
        }
      }
      tempOrders = filtered;
      filtered = [];
    }

    // Filter by price range
    if (
      (filters.minPrice && filters.minPrice > 0) ||
      (filters.maxPrice && filters.maxPrice > 0)
    ) {
      for (let i = 0; i < tempOrders.length; i++) {
        const total = tempOrders[i].totalPrice;
        const isMin = filters.minPrice
          ? filters.minPrice === 0 || total >= filters.minPrice
          : true;
        const isMax = filters.maxPrice
          ? filters.maxPrice === 0 || total <= filters.maxPrice
          : true;
        if (isMin && isMax) {
          filtered.push(tempOrders[i]);
        }
      }
      tempOrders = filtered;
      filtered = [];
    }

    // Filter by product name
    if (filters.productName) {
      for (let i = 0; i < tempOrders.length; i++) {
        let hasProduct = false;
        for (let j = 0; j < tempOrders[i].products.length; j++) {
          if (
            tempOrders[i].products[j].name
              .toLowerCase()
              .includes(filters.productName.toLowerCase())
          ) {
            hasProduct = true;
            break;
          }
        }
        if (hasProduct) {
          filtered.push(tempOrders[i]);
        }
      }
      tempOrders = filtered;
    } else {
      filtered = tempOrders;
    }
    console.log(["after product", filtered, tempOrders]);
    setFilteredHistory(filtered);
  };

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
        <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
        <div className="mb-6 space-y-4 text-right">
          <div className="flex gap-4">
            <input
              type="date"
              name="startDate"
              value={filters.startDate || ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  startDate: e.target.value,
                }))
              }
              className="input input-info w-full"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate || ""}
              onChange={(e) =>
                setFilters((p) => ({ ...p, endDate: e.target.value }))
              }
              className="input input-info w-full"
            />
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice || ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  minPrice: parseInt(e.target.value, 10),
                }))
              }
              placeholder="Min Price"
              className="input input-info w-full"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  maxPrice: parseInt(e.target.value, 10),
                }))
              }
              placeholder="Max Price"
              className="input input-info w-full"
            />
          </div>
          <input
            type="text"
            name="productName"
            value={filters.productName || ""}
            onChange={(e) =>
              setFilters((p) => ({ ...p, productName: e.target.value }))
            }
            placeholder="Filter by product name"
            className="input input-info w-full"
          />
          <button
            onClick={applyFilter}
            className="btn btn-info text-white py-2 px-4 rounded"
          >
            Apply Filters
          </button>
        </div>
        {filteredHistory.length === 0 ? (
          <p className="text-gray-500">No purchase history available.</p>
        ) : (
          <>
            <div className="space-y-6">
              {filteredHistory.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="rounded-lg p-4 shadow-md hover:shadow-lg bg-white"
                  >
                    <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                    <p className="text-gray-500 mb-4">
                      {moment(order.saleDate).local().format("MMMM Do YYYY")}
                    </p>
                    <div className="space-y-2">
                      {order.products.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                products.find(
                                  (product) => product._id === item.productId
                                )?.imageUrl
                              }
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = "/not-found.jpg";
                              }}
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-gray-600">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-gray-600">
                                {priceFormat(item.price)}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600">
                            {priceFormat(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <p className="text-lg font-bold">
                        Total Price: {priceFormat(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
