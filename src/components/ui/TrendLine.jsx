import React from 'react';
import { ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Box, Typography } from '@mui/material';

export default function TrendLine({ data = [], color = '#1B5E20', height = 100, showLabels = false }) {
  const series = data.map((d, i) => ({ x: i, y: d.value ?? d }));
  if (series.length === 0) return null;

  const minY = Math.min(...series.map(s => s.y));
  const maxY = Math.max(...series.map(s => s.y));

  return (
    <Box sx={{ width: '100%', height, position: 'relative' }}>
      {showLabels && (
        <Box sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', opacity: 0.7 }}>
            {maxY}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', opacity: 0.7 }}>
            {minY}
          </Typography>
        </Box>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 5, right: showLabels ? 25 : 0, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={3}
            fill={`url(#grad-${color.replace('#', '')})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
