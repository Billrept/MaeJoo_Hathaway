import { set } from 'lodash';
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedUserId && token) {
      setUserId(storedUserId);
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('email');   // Remove specific item (user's email)
    localStorage.removeItem('token');   // Remove specific item (authentication token)
    localStorage.removeItem('user_id'); // Remove specific item (user ID)
    localStorage.clear(); // Clear all items if needed
  };

  const login = (id, token, username) => {
    localStorage.setItem('user_id', id);
    localStorage.setItem('access_token', token);
    localStorage.setItem('username', username);
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