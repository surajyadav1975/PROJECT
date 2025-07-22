import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const apiurl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    if (userId && userName) {
      setIsLoggedIn(true);
      setUser({ id: userId, name: userName });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiurl}/login`, { email, password }, {
        withCredentials: true,
      });
      const userData = { id: response.data.userid, name: response.data.username };
      
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.name);
      
      setUser(userData);
      setIsLoggedIn(true);
      toast.success(`Welcome back, ${userData.name}! 🎉`);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed.";
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
        await axios.get(`${apiurl}/logout`, { withCredentials: true });
    } catch (error) {
        console.error("Logout API call failed, continuing local logout:", error);
    } finally {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        setUser(null);
        setIsLoggedIn(false);
        toast.success("You have been logged out.");
    }
  };

  const value = { isLoggedIn, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};