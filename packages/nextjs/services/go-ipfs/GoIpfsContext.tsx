"use client";

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  apiKey: string;
  quota: number;
  admin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (apiKey: string) => Promise<void>;
  logout: () => void;
  updateQuota: (apiKey: string, quota: number) => Promise<void>;
  createUser: (apiKey: string, quota: number, admin: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("apiKey");
    if (storedApiKey) {
      login(storedApiKey);
    }
  }, []);

  const login = async (apiKey: string) => {
    try {
      const response = await axios.get("http://localhost:3030/api/auth", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      setUser(response.data);
      localStorage.setItem("apiKey", apiKey);
      // Router.push("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("apiKey");
    // Router.push("/login");
  };

  const updateQuota = async (apiKey: string, quota: number) => {
    try {
      await axios.put(
        "/admin/update-quota",
        { apiKey, quota },
        {
          headers: { Authorization: `Bearer ${user?.apiKey}` },
        },
      );
    } catch (error) {
      console.error("Updating quota failed", error);
    }
  };

  const createUser = async (apiKey: string, quota: number, admin: boolean) => {
    try {
      await axios.post(
        "/admin/create",
        { apiKey, quota, admin },
        {
          headers: { Authorization: `Bearer ${user?.apiKey}` },
        },
      );
    } catch (error) {
      console.error("Creating user failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateQuota, createUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
