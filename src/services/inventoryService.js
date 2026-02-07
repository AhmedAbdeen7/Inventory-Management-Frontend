import api from './api';

export const getStockLevels = async (placeId) => { const { data } = await api.get(`/inventory/stock?placeId=${placeId}`); return data; };
export const getLowStockItems = async (placeId) => { const { data } = await api.get(`/inventory/low-stock?placeId=${placeId}`); return data; };
export const getReorderRecommendations = async (placeId) => { const { data } = await api.get(`/inventory/reorder?placeId=${placeId}`); return data; };
export const getWasteAnalysis = async (placeId, days = 30) => { const { data } = await api.get(`/inventory/waste?placeId=${placeId}&days=${days}`); return data; };
export const getAlerts = async (placeId) => { const { data } = await api.get(`/inventory/alerts?placeId=${placeId}`); return data; };
export const resolveAlert = async (alertId) => { const { data } = await api.patch(`/inventory/alerts/${alertId}`, { status: 'resolved' }); return data; };

export const getInventory = async (placeId) => { const { data } = await api.get(`/inventory/items?placeId=${placeId}`); return data; };
// Note: The backend expects 'menuItemId', 'addonIds', 'quantity', 'price'
export const stockIn = async (item, qty) => {
    const payload = {
        menuItemId: item._id, // Sending the item ID as menuItemId
        quantity: qty,
        pricePerUnit: item.price,
        addonIds: [] // No addons supported in this simple dialog yet
    };
    const { data } = await api.post('/restock', payload);
    return data;
};

export const orderOut = async (item, qty) => {
    const payload = {
        menuItemId: item._id,
        quantity: qty,
        pricePerUnit: item.price, // Updated to match backend requirement
        discount: 0,
        addonIds: []
    };
    const { data } = await api.post('/sales', payload);
    return data;
};

export const getTransactions = async (placeId, limit = 20) => { const { data } = await api.get(`/inventory/transactions?placeId=${placeId}&limit=${limit}`); return data; };

export const getMenuItems = async (search) => {
    const params = search ? { search } : {};
    const { data } = await api.get('/menu-items', { params });
    return data;
};

export const getAddons = async (search) => {
    const params = search ? { search } : {};
    const { data } = await api.get('/addons', { params });
    return data;
};

export const getStock = async () => {
    const { data } = await api.get('/stock');
    return data;
};

export const getSales = async () => {
    const { data } = await api.get('/sales');
    return data;
};

export const getRestocks = async () => {
    const { data } = await api.get('/restock');
    return data;
};

export const getSettings = async () => {
    const { data } = await api.get('/users/settings');
    return data;
};
