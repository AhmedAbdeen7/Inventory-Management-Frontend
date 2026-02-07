import api from './api';

export const getSettings = async () => {
  const { data } = await api.get('/users/settings');
  return data;
};

export const updateSettings = async (settings) => {
  const { data } = await api.put('/users/settings', settings);
  return data;
};

export default {
  getSettings,
  updateSettings,
};
