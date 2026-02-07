import api from './api';

export const getStockLevels = async (placeId) => { const { data } = await api.get(`/inventory/stock?placeId=${placeId}`); return data; };
export const getLowStockItems = async (placeId) => { const { data } = await api.get(`/inventory/low-stock?placeId=${placeId}`); return data; };
export const getReorderRecommendations = async (placeId) => { const { data } = await api.get(`/inventory/reorder?placeId=${placeId}`); return data; };
export const getWasteAnalysis = async (placeId, days = 30) => { const { data } = await api.get(`/inventory/waste?placeId=${placeId}&days=${days}`); return data; };
export const getAlerts = async (placeId) => { const { data } = await api.get(`/inventory/alerts?placeId=${placeId}`); return data; };
export const resolveAlert = async (alertId) => { const { data } = await api.patch(`/inventory/alerts/${alertId}`, { status: 'resolved' }); return data; };

export const getInventory = async (placeId) => { const { data } = await api.get(`/inventory/items?placeId=${placeId}`); return data; };
export const stockIn = async (itemId, qty, note) => { const { data } = await api.post(`/inventory/items/${itemId}/stock-in`, { qty, note }); return data; };
export const orderOut = async (itemId, qty, note) => { const { data } = await api.post(`/inventory/items/${itemId}/order-out`, { qty, note }); return data; };
export const getTransactions = async (placeId, limit = 20) => { const { data } = await api.get(`/inventory/transactions?placeId=${placeId}&limit=${limit}`); return data; };
