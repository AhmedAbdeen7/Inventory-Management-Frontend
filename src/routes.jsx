import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ROUTES, ROLES } from './utils/constants';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const StockManagement = lazy(() => import('./pages/StockManagement'));
const DemandForecast = lazy(() => import('./pages/DemandForecast'));
const ReorderTimeline = lazy(() => import('./pages/ReorderTimeline'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Promotions = lazy(() => import('./pages/Promotions'));
const Settings = lazy(() => import('./pages/Settings'));

export default function AppRoutes() {
  const fallback = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      Loading...
    </div>
  );

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Suspense fallback={fallback}><Dashboard /></Suspense></ProtectedRoute>} />
      <Route path={ROUTES.STOCK} element={<ProtectedRoute><Suspense fallback={fallback}><StockManagement /></Suspense></ProtectedRoute>} />
      <Route path={ROUTES.DEMAND_FORECAST} element={<ProtectedRoute><Suspense fallback={fallback}><DemandForecast /></Suspense></ProtectedRoute>} />
      <Route path={ROUTES.REORDER_TIMELINE} element={<ProtectedRoute><Suspense fallback={fallback}><ReorderTimeline /></Suspense></ProtectedRoute>} />
      <Route path={ROUTES.ALERTS} element={<ProtectedRoute><Suspense fallback={fallback}><Alerts /></Suspense></ProtectedRoute>} />
      <Route path={ROUTES.PROMOTIONS} element={<ProtectedRoute><Suspense fallback={fallback}><Promotions /></Suspense></ProtectedRoute>} />

      <Route path={ROUTES.SETTINGS} element={<ProtectedRoute><Suspense fallback={fallback}><Settings /></Suspense></ProtectedRoute>} />
    </Routes>
  );
}
