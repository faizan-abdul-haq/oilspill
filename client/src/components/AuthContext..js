import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create a Context for Authentication
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Authentication Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status here, e.g., by making an API call
    const checkAuth = async () => {
      try {
        const response = await axios.get('/checksession'); // Replace with your API endpoint
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
