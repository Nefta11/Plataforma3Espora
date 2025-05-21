import React, { createContext, useContext, useState, ReactNode } from "react";
import { AuthContextType, User, LoginCredentials } from "../types/auth";
import { Client } from "../types/client";
import { delay } from "../lib/utils";

// Mock users for different roles
const MOCK_USERS: Record<string, User> = {
  "admin": {
    id: "1",
    username: "admin",
    name: "Admin User",
    email: "admin@example.com",
    role: "super-admin",
    avatarUrl: "https://i.pravatar.cc/150?img=1"
  },
  "sales": {
    id: "2",
    username: "sales",
    name: "Sales Team",
    email: "sales@alpha.com",
    role: "alpha-sales",
    avatarUrl: "https://i.pravatar.cc/150?img=2"
  },
  "ssc": {
    id: "3",
    username: "ssc",
    name: "SSC Team",
    email: "ssc@alpha.com",
    role: "alpha-ssc",
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  },
  "strategy": {
    id: "4",
    username: "strategy",
    name: "Strategy Team",
    email: "strategy@espora.com",
    role: "espora-strategy",
    avatarUrl: "https://i.pravatar.cc/150?img=4"
  },
  "studies": {
    id: "5",
    username: "studies",
    name: "Studies Team",
    email: "studies@testank.com",
    role: "testank-studies",
    avatarUrl: "https://i.pravatar.cc/150?img=5"
  },
  "accompaniment": {
    id: "6",
    username: "accompaniment",
    name: "Accompaniment Team",
    email: "accompaniment@espora.com",
    role: "espora-accompaniment",
    avatarUrl: "https://i.pravatar.cc/150?img=6"
  },
  "management": {
    id: "7",
    username: "management",
    name: "Management Team",
    email: "management@espora.com",
    role: "espora-management",
    avatarUrl: "https://i.pravatar.cc/150?img=7"
  },
  "production": {
    id: "8",
    username: "production",
    name: "Production Team",
    email: "production@espora.com",
    role: "espora-production",
    avatarUrl: "https://i.pravatar.cc/150?img=8"
  },
  "diffusion": {
    id: "9",
    username: "diffusion",
    name: "Diffusion Team",
    email: "diffusion@espora.com",
    role: "espora-diffusion",
    avatarUrl: "https://i.pravatar.cc/150?img=9"
  }
};

// All mock users share the same password for demo purposes
const MOCK_PASSWORD = "password123";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    let success = false;
    
    try {
      // Simulate API call with delay
      await delay(1500);

      // Check if user exists and password matches
      const mockUser = MOCK_USERS[username.toLowerCase()];
      if (mockUser && password === MOCK_PASSWORD) {
        setUser(mockUser);
        success = true;
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
    
    return success;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    selectedClient,
    setSelectedClient,
    login,
    logout,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};