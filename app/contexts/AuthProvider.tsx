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

type authContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  getUser: () => void;
  login: (email: string, password: string) => any;
  logout: () => void;
  updateUser: (user: any) => void;
};

const authContextDefaultValues: authContextType = {
  isAuthenticated: false,
  isLoading: true,
  user: {},
  getUser: () => {},
  login: () => {},
  logout: () => {},
  updateUser: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { get, post } = useHttp();

  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const getUser = useCallback(async () => {
    setIsLoading(true);
    const token = Cookies.get("token");
    if (token) {
      const user = await get("/user");
      if (user && user.status != 401 && user.status != 403) {
        setUser(user);
      } else {
        setUser({});
        Cookies.remove("token");
      }
    }
    setIsLoading(false);
  }, [get]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const login = async (username: string, password: string) => {
    const user = await post("/users/login", { username, password });
    if (user && user.user) {
      setUser(user.user);
      Cookies.set("token", user.token);
      router.push('/catalogue')
    }
    return user;
  };

  const logout = () => {
    setUser({});
    Cookies.remove("token");
    router.push("/login");
  };

  const updateUser = async (user: any) => {
    setUser(user.user);
    Cookies.set("token", user.token);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !_.isEmpty(user),
        user,
        getUser,
        login,
        logout,
        isLoading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
