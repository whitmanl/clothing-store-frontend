"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useCart from "../contexts/CartProvider";
import useAuth from "../contexts/AuthProvider";
import { ShoppingCartIcon, Bars4Icon } from "@heroicons/react/24/outline";

export default function Layout(props: { children?: ReactNode }) {
  const { children } = props;

  const routes = [
    { href: "/catalogue", title: "Catalogue" },
    { href: "/history", title: "Purchase History" },
    { href: "/profile", title: "Profile" },
  ];

  const { cart } = useCart();
  const { logout } = useAuth();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isDrawerOpen]);

  return (
    <div>
      {/* Left Navbar */}
      <nav
        className={`fixed top-0 left-0 h-screen w-52 bg-white p-4 transition-all duration-300 z-50 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold mb-6">Clothing Store</h2>
        <ul className="space-y-2">
          {routes.map((v, i) => (
            <li key={i}>
              <Link
                href={v.href}
                className={`block py-2 px-4 rounded hover:bg-gray-700 hover:text-white ${
                  pathname === v.href ? "bg-gray-700 text-white" : ""
                }`}
                onClick={() => setIsDrawerOpen(false)}
              >
                {v.title}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                logout();
                setIsDrawerOpen(false); // Close drawer on logout
              }}
              className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700 hover:text-white"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Top App Bar */}
      <header
        className={`fixed top-0 ${
          isDrawerOpen ? "left-52" : "left-0"
        } right-0 bg-white p-4 shadow-md z-40 flex justify-between md:justify-end items-center md:left-52`}
      >
        <button
          onClick={toggleDrawer}
          className="block md:hidden text-gray-500 hover:text-gray-700"
        >
          <Bars4Icon className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-4">
          <Link
            href="/cart"
            className="hover:text-gray-500 flex items-center gap-2"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            <span>{cart.length}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`p-4 transition-all duration-300 ${
          isDrawerOpen ? "ml-52" : "ml-0"
        } md:ml-52 mt-10`}
      >
        {children}
      </main>
    </div>
  );
}
