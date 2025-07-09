"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  role: string;
  numberOfLogins: number;
  dateCreated: string;
  dateUpdated: string;
}

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  canViewAdvocate: (advocate: Advocate) => boolean;
  filterAdvocatesByRole: (advocates: Advocate[]) => Advocate[];
  isAdmin: boolean;
  isAdvocate: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isAdvocate = user?.role === 'ADVOCATE';
  const isUser = user?.role === 'USER';

  const canViewAdvocate = (advocate: Advocate): boolean => {
    if (!user) return false;
    
    if (user.role === 'ADMIN') return true;
    
    if (user.role === 'ADVOCATE') {
      return advocate.firstName.toLowerCase() === user.username.toLowerCase();
    }
    
    if (user.role === 'USER') return true;
    
    return false;
  };

  const filterAdvocatesByRole = (advocates: Advocate[]): Advocate[] => {
    if (!user) return [];
    return user.role === 'ADMIN' ? advocates : advocates.filter(canViewAdvocate);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
        return { success: true, message: "Login successful!" };
      }
      
      return { success: false, message: result.message || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    canViewAdvocate,
    filterAdvocatesByRole,
    isAdmin,
    isAdvocate,
    isUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
