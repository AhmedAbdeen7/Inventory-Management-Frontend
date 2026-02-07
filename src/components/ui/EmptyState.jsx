import React from 'react';
import { Box, Typography } from '@mui/material';

export default function EmptyState({ title = 'Nothing here', subtitle = '' }){
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h6" color="text.secondary">{title}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{subtitle}</Typography>}
    </Box>
  );
}
