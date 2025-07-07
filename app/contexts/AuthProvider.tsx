"use client";

import Cookies from "js-cookie";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import useHttp from "./HttpProvider";
import { Profile } from "../interfaces/profile";

type authContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Profile | undefined;
  getUser: () => void;
  login: (email: string, password: string) => any;
  logout: () => void;
};

const authContextDefaultValues: authContextType = {
  isAuthenticated: false,
  isLoading: true,
  user: undefined,
  getUser: () => {},
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { get, post } = useHttp();

  const [user, setUser] = useState<Profile | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const getUser = useCallback(async () => {
    setIsLoading(true);
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    if (token && userId) {
      const userRes = await get(`/users/${userId}`);
      if (userRes && userRes.status != 401 && userRes.status != 403) {
        setUser(userRes);
      } else {
        setUser(undefined);
        Cookies.remove("token");
        Cookies.remove("userId");
      }
    }
    setIsLoading(false);
  }, [get]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const login = async (username: string, password: string) => {
    const userRes = await post("/users/login", { username, password });
    if (userRes?.user) {
      setUser(userRes?.user);
      Cookies.set("token", userRes.accessToken);
      Cookies.set("userId", userRes.user.id);
      router.push("/catalogue");
    }
    return user;
  };

  const logout = () => {
    setUser(undefined);
    Cookies.remove("token");
    Cookies.remove("userId");
    router.push("/login");
  };


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        getUser,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
