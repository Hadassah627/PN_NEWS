import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const hasRole = (role) => {
  const user = getUserFromToken();
  return user && user.role === role;
};
