import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App start hone par check karo — kya user pehle se logged in hai?
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
//     if (token && savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);
  useEffect(() => {
  try {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser && savedUser !== 'undefined') {
      setUser(JSON.parse(savedUser));
    }
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } finally {
    setLoading(false);
  }
 }, []);

  // Login function
  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  // Register function
//   const register = async (name, email, password, role, phone) => {
//     const response = await registerUser({ name, email, password, role, phone });
//     const { token, user } = response.data;
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);
//     return user;
//   };
  const register = async (name, email, password, role, phone) => {
  const response = await registerUser({ name, email, password, role, phone });
//   const { token, user } = response.data;

//   if (token && user) {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);
//     return user;
//   } else {
//     throw new Error('Registration failed.');
//   }
     return response.data.user;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook — pages mein easily use karne ke liye
export const useAuth = () => useContext(AuthContext);