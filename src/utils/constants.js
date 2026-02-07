export const ROLES = { ADMIN: 'admin', MANAGER: 'manager', STAFF: 'staff', VIEWER: 'viewer' };
export const ROUTES = { LOGIN: '/login', REGISTER: '/register', DASHBOARD: '/', STOCK: '/stock', DEMAND_FORECAST: '/forecast', REORDER_TIMELINE: '/reorder', ALERTS: '/alerts', PROMOTIONS: '/promotions', SETTINGS: '/settings' };
export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'Dashboard' },
  { label: 'Stock', path: ROUTES.STOCK, icon: 'Inventory' },
  { label: 'Demand Forecast', path: ROUTES.DEMAND_FORECAST, icon: 'TrendingUp' },
  { label: 'Reorder Timeline', path: ROUTES.REORDER_TIMELINE, icon: 'Timeline' },
  { label: 'Alerts', path: ROUTES.ALERTS, icon: 'Notifications' },
  { label: 'Promotions', path: ROUTES.PROMOTIONS, icon: 'LocalOffer' },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings' },
];
