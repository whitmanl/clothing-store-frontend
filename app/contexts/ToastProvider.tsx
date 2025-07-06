"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

const toastContextDefaultValues = {
  showToast: (content: string, color?: "success" | "error") => {},
};

const ToastContext = createContext(toastContextDefaultValues);

const useToast = () => {
  return useContext(ToastContext);
};

export default useToast;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const colors = {
    success: "alert-success",
    error: "alert-error",
  };

  const [message, setMessage] = useState("");
  const [color, setColor] = useState("alert-success");

  const showToast = async (message: string, color?: "success" | "error") => {
    setMessage(message);
    setColor(colors[color || "success"]);
    setTimeout(() => {
      setMessage("");
      setColor("alert-success");
    }, 3000);
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}
      {message ? (
        <div className="toast toast-end">
          <div className={`alert ${color}`}>
            <span className="text-white">{message}</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </ToastContext.Provider>
  );
};
