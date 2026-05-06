import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getStorage, setStorage, removeStorage } from "../utils/storage";

export interface User {
  name: string;
  email: string;
  phone?: string;
  college?: string;
  year?: string;
  skills: string[];
  preferredRole?: string;
  resumeFilename?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  signup: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStorage("user", null));

  useEffect(() => {
    if (user) {
      setStorage("user", user);
    } else {
      removeStorage("user");
    }
  }, [user]);

  const login = (userData: User) => setUser(userData);
  const signup = (userData: User) => setUser(userData);
  const logout = () => setUser(null);
  const updateUser = (userData: User) => setUser(userData);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
