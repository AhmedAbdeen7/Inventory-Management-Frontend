import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, TextField, Switch, FormControlLabel, Button, Avatar, Stack, Divider, InputAdornment } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TuneIcon from '@mui/icons-material/Tune';
import PageWrapper from '../components/layout/PageWrapper';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    dailyDigest: true,
    weeklyReport: false,
    promotionSuggestions: true,
  });

  const [params, setParams] = useState({
    leadTime: 3,
    safetyBuffer: 50,
    lowStockThreshold: 20,
    budgetLimit: '',
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleParamChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <PageWrapper>
      {/* Header Banner */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1B5E20 0%, #43A047 100%)', color: 'white', border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 48, height: 48 }}>
              <SettingsIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800}>System Settings</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Configure forecasting parameters, alert thresholds, and notification preferences.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr'
          },
          gap: 3
        }}
      >
        {/* Profile Card */}
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#1B5E20',
                fontSize: 32,
                fontWeight: 700,
                mx: 'auto',
                mb: 2,
              }}
            >
              D
            </Avatar>
            <Typography variant="h5" fontWeight={700}>Demo Manager</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              demo@freshflow.dk
            </Typography>
            <Box
              sx={{
                display: 'inline-block',
                border: '1px solid #1B5E20',
                color: '#1B5E20',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Manager
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Notifications */}
            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <NotificationsIcon sx={{ color: '#FF8F00' }} />
                <Typography variant="h6" fontWeight={700}>Notifications</Typography>
              </Box>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.criticalAlerts}
                      onChange={() => handleNotificationChange('criticalAlerts')}
                      color="primary"
                    />
                  }
                  label="Critical stock alerts"
                  sx={{ ml: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.dailyDigest}
                      onChange={() => handleNotificationChange('dailyDigest')}
                      color="primary"
                    />
                  }
                  label="Daily inventory digest"
                  sx={{ ml: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.weeklyReport}
                      onChange={() => handleNotificationChange('weeklyReport')}
                      color="primary"
                    />
                  }
                  label="Weekly summary report"
                  sx={{ ml: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.promotionSuggestions}
                      onChange={() => handleNotificationChange('promotionSuggestions')}
                      color="primary"
                    />
                  }
                  label="Promotion suggestions"
                  sx={{ ml: 0 }}
                />
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Inventory Parameters */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TuneIcon sx={{ color: '#1B5E20' }} />
              <Typography variant="h6" fontWeight={700}>Inventory Parameters</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              These values are used by the AI forecasting model to calculate reorder points and purchase recommendations.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Default Lead Time"
                  type="number"
                  value={params.leadTime}
                  onChange={(e) => handleParamChange('leadTime', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">days</InputAdornment>,
                  }}
                  helperText="Average days between placing an order and receiving it."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Safety Stock Buffer"
                  type="number"
                  value={params.safetyBuffer}
                  onChange={(e) => handleParamChange('safetyBuffer', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  helperText="Extra buffer as a percentage of lead-time demand."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Low Stock Alert Threshold"
                  type="number"
                  value={params.lowStockThreshold}
                  onChange={(e) => handleParamChange('lowStockThreshold', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">units</InputAdornment>,
                  }}
                  helperText="Alert when any item drops below this count."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget Limit"
                  type="text"
                  placeholder="Optional"
                  value={params.budgetLimit}
                  onChange={(e) => handleParamChange('budgetLimit', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">DKK</InputAdornment>,
                  }}
                  helperText="Prioritise reorders within this budget."
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                size="large"
                sx={{ px: 4 }}
              >
                Save Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageWrapper>
  );
}
