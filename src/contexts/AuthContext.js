"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp > currentTime) {
          setToken(storedToken);
          setUserType(decodedToken.userType);
          setIsAuthenticated(true);

          if (decodedToken.userType === "owner") {
            setUser({
              id: decodedToken.id,
              phoneNumber: decodedToken.phoneNumber,
              role: decodedToken.role,
            });
          } else if (decodedToken.userType === "employee") {
            setUser({
              id: decodedToken.id,
              email: decodedToken.email,
              username: decodedToken.username,
              role: decodedToken.role,
            });
          }
        } else {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("authToken");
      }
    }

    setLoading(false);
  }, []);

  const loginOwner = (authToken) => {
    try {
      const decodedToken = jwtDecode(authToken);

      setUser({
        id: decodedToken.id,
        phoneNumber: decodedToken.phoneNumber,
        role: decodedToken.role,
      });
      setUserType(decodedToken.userType);
      setIsAuthenticated(true);
      setToken(authToken);

      localStorage.setItem("authToken", authToken);
    } catch (error) {
      console.error("Error decoding token during login:", error);
      throw new Error("Invalid token received from server");
    }
  };

  const loginEmployee = (authToken) => {
    try {
      // Decode token to get user info
      const decodedToken = jwtDecode(authToken);

      // Set user data from token
      setUser({
        id: decodedToken.id,
        email: decodedToken.email,
        username: decodedToken.username,
        role: decodedToken.role,
      });
      setUserType(decodedToken.userType);
      setIsAuthenticated(true);
      setToken(authToken);

      // Store token in localStorage
      localStorage.setItem("authToken", authToken);
    } catch (error) {
      console.error("Error decoding token during login:", error);
      throw new Error("Invalid token received from server");
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const getAuthHeaders = () => {
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    loading,
    token,
    loginOwner,
    loginEmployee,
    logout,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
