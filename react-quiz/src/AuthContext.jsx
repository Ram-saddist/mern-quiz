// AuthContext.jsx
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [student, setStudent] = useState(() => {
    const stored = localStorage.getItem("student");
    return stored ? JSON.parse(stored) : null;
  });
  useEffect(() => {
    const stored = localStorage.getItem("student");
    setStudent(stored ? JSON.parse(stored) : null);
  }, []);
  const login = (user) => {
    localStorage.setItem("student", JSON.stringify(user));
    setStudent(user);
  };
  const logout = () => {
    localStorage.removeItem("student");
    setStudent(null);
  };
  return (
    <AuthContext.Provider value={{ student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}