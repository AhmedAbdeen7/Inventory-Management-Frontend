import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip, Button, Stack, Avatar, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PageWrapper from '../components/layout/PageWrapper';
import alertsData from '../mocks/alertsData.json';

export default function Alerts() {
  const [filter, setFilter] = useState('all');
  const { alerts, summary } = alertsData;

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter(a => a.severity === filter);

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical': return { icon: <ErrorIcon />, color: '#D32F2F', bg: '#FFEBEE', border: '#D32F2F' };
      case 'high': return { icon: <WarningAmberIcon />, color: '#FF8F00', bg: '#FFF3E0', border: '#FF8F00' };
      case 'medium': return { icon: <InfoIcon />, color: '#1976D2', bg: '#E3F2FD', border: '#1976D2' };
      default: return { icon: <InfoIcon />, color: '#666', bg: '#F5F5F5', border: '#E0E0E0' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const diff = (new Date().getTime() - new Date(timestamp).getTime()) / 1000 / 60 / 60;
    if (diff < 1) return 'Just now';
    return `${Math.floor(diff)} hours ago`;
  };

  return (
    <PageWrapper>
      {/* Header Banner */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #D32F2F 0%, #E53935 60%)', color: 'white', border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 48, height: 48 }}>
                <NotificationsIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800}>Inventory Alerts</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Real-time notifications for stock-outs, low-stock, and inventory anomalies.
                </Typography>
              </Box>
            </Box>
            <Chip
              label={`${summary.total} total`}
              sx={{ bgcolor: alpha('#fff', 0.2), color: 'white', fontWeight: 600 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Summary Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)'
          },
          gap: 2,
          mb: 3
        }}
      >
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#D32F2F' }}>{summary.critical}</Typography>
            <Typography variant="body2" color="text.secondary">Critical</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#FF8F00' }}>{summary.high}</Typography>
            <Typography variant="body2" color="text.secondary">High</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: '#1976D2' }}>{summary.medium}</Typography>
            <Typography variant="body2" color="text.secondary">Medium</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(e, v) => v && setFilter(v)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              px: 3,
              '&.Mui-selected': { bgcolor: '#1B5E20', color: 'white', '&:hover': { bgcolor: '#1B5E20' } },
            },
          }}
        >
          <ToggleButton value="all">All ({summary.total})</ToggleButton>
          <ToggleButton value="critical">Critical</ToggleButton>
          <ToggleButton value="high">High</ToggleButton>
          <ToggleButton value="medium">Medium</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Alert Cards */}
      <Stack spacing={2}>
        {filteredAlerts.map((alert) => {
          const config = getSeverityConfig(alert.severity);
          return (
            <Card
              key={alert.id}
              sx={{
                border: `2px solid ${config.border}`,
                borderLeftWidth: 4,
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: config.bg, color: config.color }}>
                      {config.icon}
                    </Avatar>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Typography variant="h6" fontWeight={700}>{alert.item}</Typography>
                        <Chip
                          label={alert.severity}
                          size="small"
                          sx={{
                            bgcolor: config.bg,
                            color: config.color,
                            fontWeight: 500,
                            fontSize: 11,
                          }}
                        />
                      </Stack>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {alert.title}. {alert.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Daily usage {alert.dailyUsage} units/day · Lead time {alert.leadTime} days · {alert.action}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(alert.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <IconButton
                    sx={{
                      bgcolor: '#E8F5E9',
                      color: '#1B5E20',
                      '&:hover': { bgcolor: '#C8E6C9' },
                    }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </PageWrapper>
  );
}
