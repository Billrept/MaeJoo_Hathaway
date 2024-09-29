import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    if (storedUserId && token) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('email');   // Remove specific item (user's email)
    localStorage.removeItem('token');   // Remove specific item (authentication token)
    localStorage.removeItem('user_id'); // Remove specific item (user ID)
    localStorage.clear(); // Clear all items if needed
  };

  const login = (id, token) => {
    localStorage.setItem('user_id', id);
    localStorage.setItem('access_token', token);
    setUserId(id);
    setIsLoggedIn(true);  // Set logged in state to true after login
  };  

  const logout = () => {
    clearLocalStorage();
    setUserId(null);
    setIsLoggedIn(false);  // Set logged in state to false after logout
  };

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, login, logout, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};