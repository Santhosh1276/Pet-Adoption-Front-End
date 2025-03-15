/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: localStorage.getItem("user_id") || null,
    userRole: localStorage.getItem("user_role") || null,
    accessToken: localStorage.getItem("accessToken") || null,
  });

  // Update state when localStorage changes (e.g., after login)
  useEffect(() => {
    const updateAuth = () => {
      setUser({
        userId: localStorage.getItem("user_id"),
        userRole: localStorage.getItem("user_role"),
        accessToken: localStorage.getItem("accessToken"),
      });
    };

    window.addEventListener("storage", updateAuth); // Detect changes

    return () => window.removeEventListener("storage", updateAuth);
  }, []);

  const login = (userId, userRole, token) => {
    localStorage.setItem("user_id", userId);
    localStorage.setItem("user_role", userRole);
    localStorage.setItem("accessToken", token);

    setUser({ userId, userRole, accessToken: token });
  };

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("accessToken");

    setUser({ userId: null, userRole: null, accessToken: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
