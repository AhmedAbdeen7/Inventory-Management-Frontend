import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

export default function App() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      {isLoggedIn && <TopBar />}
      {isLoggedIn && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: isLoggedIn ? '64px' : 0,
          ml: isLoggedIn ? { xs: 0, md: '250px' } : 0,
          overflow: 'auto',
        }}
      >
        <AppRoutes />
      </Box>
    </Box>
  );
}
