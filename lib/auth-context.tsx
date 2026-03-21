import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

// Single-user password — stored as a hash in AsyncStorage
// Default password is "ngo2024" — user can change it in settings
const AUTH_KEY = "kreator_auth_session";
const PASSWORD_KEY = "kreator_auth_password";
const DEFAULT_PASSWORD = "ngo2024";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  changePassword: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's an active session
    AsyncStorage.getItem(AUTH_KEY).then((session) => {
      if (session === "active") {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    // Get stored password or use default
    const storedPassword = await AsyncStorage.getItem(PASSWORD_KEY);
    const correctPassword = storedPassword ?? DEFAULT_PASSWORD;

    if (password === correctPassword) {
      await AsyncStorage.setItem(AUTH_KEY, "active");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
    const storedPassword = await AsyncStorage.getItem(PASSWORD_KEY);
    const correctPassword = storedPassword ?? DEFAULT_PASSWORD;

    if (oldPassword !== correctPassword) return false;
    if (newPassword.length < 4) return false;

    await AsyncStorage.setItem(PASSWORD_KEY, newPassword);
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
