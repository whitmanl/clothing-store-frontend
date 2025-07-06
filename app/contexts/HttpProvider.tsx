"use client";

import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash";
import React, { createContext, ReactNode, useContext } from "react";

type httpContextType = {
  get: (path: string, data?: any) => any;
  post: (path: string, data?: any) => any;
  update: (path: string, data?: any) => any;
  remove: (path: string, data?: any) => any;
};

const httpContextDefaultValues: httpContextType = {
  get: (path: string, data?: any) => {},
  post: (path: string, data?: any) => {},
  update: (path: string, data?: any) => {},
  remove: (path: string, data?: any) => {},
};

const HttpContext = createContext<httpContextType>(httpContextDefaultValues);

const useHttp = () => {
  return useContext(HttpContext);
};

export default useHttp;

export const HttpProvider = ({
  children,
  lang,
}: {
  children: ReactNode;
  lang?: string;
}) => {
  const _fetchWithToken = (req: any, token?: string) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    return axios({ ...req, headers, baseURL });
  };

  const get = async (path: String, data?: any) => {
    const token = Cookies.get("token");
    const req = {
      method: "GET",
      url: path,
      params: data,
    };

    try {
      const r0 = await _fetchWithToken(req, token);
      return r0.data;
    } catch (err: any) {
      return err.response;
    }
  };

  const post = async (path: String, data?: any) => {
    const token = Cookies.get("token");
    const req = {
      method: "POST",
      url: path,
      data,
    };

    try {
      const r0 = await _fetchWithToken(req, token);
      return r0.data;
    } catch (err: any) {
      return err.response;
    }
  };

  const update = async (path: String, data?: any) => {
    const token = Cookies.get("token");

    const req = {
      method: "PUT",
      url: path,
      data,
    };

    try {
      const r0 = await _fetchWithToken(req, token);
      return r0.data;
    } catch (err: any) {
      return err.response;
    }
  };

  const remove = async (path: String, data?: any) => {
    const token = Cookies.get("token");
    const req = {
      method: "DELETE",
      url: path,
      params: data,
    };

    try {
      const r0 = await _fetchWithToken(req, token);
      return r0.data;
    } catch (err: any) {
      return err.response;
    }
  };

  return (
    <HttpContext.Provider
      value={{
        get,
        post,
        update,
        remove,
      }}
    >
      {children}
    </HttpContext.Provider>
  );
};
