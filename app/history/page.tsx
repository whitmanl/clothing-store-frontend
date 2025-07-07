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

export default function Catalogue() {
  const { showToast } = useToast();
  const { get } = useHttp();
  const { user } = useAuth();
  const { products } = useCart();

  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchHistory() {
      const res = await get(`/sales/${user.id}`);
      if (res?.status) {
        showToast(res?.data?.message || "Please try again later", "error");
      } else {
        setHistory(res);
      }
      setIsLoading(false);
    }
    if (user?.id) {
      fetchHistory();
    }
  }, [user]);

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
        {history.length === 0 ? (
          <p className="text-gray-500">No purchase history available.</p>
        ) : (
          <>
            <div className="space-y-6">
              {history.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 shadow-md"
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
