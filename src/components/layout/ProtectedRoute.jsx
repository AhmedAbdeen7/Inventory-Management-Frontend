import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}><CircularProgress /></Box>;
  if (!user) return <Navigate to={ROUTES.REGISTER} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
}
