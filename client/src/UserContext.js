// src/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkLoginStatus } from './services/auService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const status = await checkLoginStatus();
        if (status) {
          // Assuming checkLoginStatus returns user data if logged in
          setUser(status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);