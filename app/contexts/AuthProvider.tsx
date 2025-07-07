"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  FC,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import useHttp from "./HttpProvider";
import { Profile } from "../interfaces/profile";
import { Rings } from "react-loader-spinner";

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

export const ProtectRoute = <P extends object>(Component: FC<P>): FC<P> => {
  const Authenticated: FC<P> = (props): JSX.Element | null => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Rings color="#00B9B5" height={80} width={80} />
        </div>
      );
    }

    return <Component {...props} />;
  };

  return Authenticated;
};