import React from 'react';
import { Chip } from '@mui/material';

export default function StatusBadge({ label, severity = 'low' }){
  const color = severity === 'critical' ? 'error' : severity === 'high' ? 'warning' : severity === 'medium' ? 'info' : 'success';
  return <Chip label={label} size="small" color={color} sx={{ fontWeight: 700 }} />;
}
