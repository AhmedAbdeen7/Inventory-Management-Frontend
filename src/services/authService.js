import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/users/login', { email, password });
  if (data?.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/users/register', userData);
  if (data?.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async () => {
  // We can just get user from localStorage since login/register returns it
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  if (token && userStr) return JSON.parse(userStr);
  return null;
};

export default { login, register, logout, getProfile };
