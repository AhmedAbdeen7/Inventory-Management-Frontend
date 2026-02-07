import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';
import { DRAWER_WIDTH } from './Sidebar';
import useAuth from '../../hooks/useAuth';

const pageTitles = {
  '/': 'Dashboard',
  '/stock': 'Stock Management',
  '/forecast': 'Demand Forecast',
  '/reorder': 'Reorder Timeline',
  '/alerts': 'Alerts',
  '/promotions': 'Promotions & Bundles',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = pageTitles[pathname] || 'FreshFlow';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid #E0E0E0',
        ml: { md: `${DRAWER_WIDTH}px` },
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: '#1B5E20', width: 36, height: 36, fontWeight: 600 }}>
            {user?.firstName?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
