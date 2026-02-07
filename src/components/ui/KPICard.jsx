import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendLine from './TrendLine';

export default function KPICard({ title, value, subtitle, icon, delta, trend = [], color = '#1B5E20' }) {
  const isNegativeDelta = delta && delta.includes('-');

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '13px' }}>
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: alpha(color, 0.12), color: color, width: 36, height: 36 }}>
            {React.cloneElement(icon, { sx: { fontSize: 20 } })}
          </Avatar>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: color !== '#1B5E20' ? color : 'text.primary',
              fontSize: '1.6rem'
            }}
          >
            {value}
          </Typography>
          {delta && (
            <Typography
              variant="caption"
              sx={{
                color: isNegativeDelta ? '#D32F2F' : '#1B5E20',
                bgcolor: isNegativeDelta ? alpha('#D32F2F', 0.1) : alpha('#1B5E20', 0.1),
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              {delta}
            </Typography>
          )}
        </Box>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 1.5 }}>
            {subtitle}
          </Typography>
        )}

        {trend && trend.length > 0 && (
          <Box sx={{ mt: 2, height: 50 }}>
            <TrendLine data={trend} color={color} height={50} showLabels />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
