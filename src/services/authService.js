import api from './api';

export const login = async (email, password) => {
  // Demo behavior: call backend if available, otherwise simulate
  try {
    const { data } = await api.post('/auth/login', { email, password });
    if (data?.token) localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    // fallback demo response
    const demo = { token: 'demo-token', user: { name: 'Demo Manager', email, role: 'manager' } };
    localStorage.setItem('token', demo.token);
    return demo;
  }
};

export const register = async (payload) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (err) {
    return { success: true, message: 'Registered (demo)' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return { name: 'Demo Manager', email: 'demo@freshflow.dk', role: 'manager' };
  }
};

export default { login, register, logout, getProfile };
