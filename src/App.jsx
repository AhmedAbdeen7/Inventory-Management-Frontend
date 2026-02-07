import React from 'react';
import { Box } from '@mui/material';
import AppRoutes from './routes';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

export default function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <TopBar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          ml: { xs: 0, md: '250px' },
          overflow: 'auto',
        }}
      >
        <AppRoutes />
      </Box>
    </Box>
  );
}
