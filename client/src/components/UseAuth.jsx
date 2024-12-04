import { useState, useEffect } from 'react';
import axios from 'axios';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get('/checksession', { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Authentication check failed', error);
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  return { isAuthenticated };
}

export default useAuth;
