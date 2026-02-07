import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip, Button, LinearProgress, Stack, Avatar, Switch, TextField, InputAdornment } from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PageWrapper from '../components/layout/PageWrapper';
import reorderData from '../mocks/reorderData.json';

export default function ReorderTimeline() {
  const [budgetMode, setBudgetMode] = useState(reorderData.summary.budgetMode);
  const [budgetAmount, setBudgetAmount] = useState(5000);
  const { items, summary, urgencySummary } = reorderData;

  const parseCost = (costStr) => {
    return parseInt(costStr.replace(/[^\d]/g, ''), 10);
  };

  const filteredItems = useMemo(() => {
    if (!budgetMode) return items;

    let runningTotal = 0;
    return items.filter(item => {
      const cost = parseCost(item.estimatedCost);
      if (runningTotal + cost <= budgetAmount) {
        runningTotal += cost;
        return true;
      }
      return false;
    });
  }, [items, budgetMode, budgetAmount]);

  const currentTotalCost = useMemo(() => {
    const total = filteredItems.reduce((acc, item) => acc + parseCost(item.estimatedCost), 0);
    return `DKK ${total.toLocaleString()}`;
  }, [filteredItems]);

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'critical': return { color: '#D32F2F', bg: '#FFEBEE', label: 'Order Now' };
      case 'high': return { color: '#FF8F00', bg: '#FFF3E0', label: 'Soon' };
      case 'medium': return { color: '#1976D2', bg: '#E3F2FD', label: 'Plan' };
      default: return { color: '#1B5E20', bg: '#E8F5E9', label: 'OK' };
    }
  };

  const getProgressColor = (daysLeft) => {
    if (daysLeft <= 2) return '#D32F2F';
    if (daysLeft <= 4) return '#FF8F00';
    return '#1B5E20';
  };

  return (
    <PageWrapper>
      {/* Header Banner */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1B5E20 0%, #43A047 100%)', color: 'white', border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 48, height: 48 }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800}>Reorder Timeline</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  AI-calculated reorder dates based on usage velocity, lead times & safety stock.
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<WarningAmberIcon sx={{ color: 'white !important' }} />}
                label={`${urgencySummary.critical} critical`}
                sx={{ bgcolor: alpha('#fff', 0.2), color: 'white' }}
              />
              <Chip
                label={`${urgencySummary.high} high`}
                sx={{ bgcolor: alpha('#fff', 0.15), color: 'white' }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: alpha('#1B5E20', 0.1), color: '#1B5E20' }}>
                <LocalShippingIcon />
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} color="primary">{summary.itemsToOrder}</Typography>
                <Typography variant="body2" color="text.secondary">Items to order</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: alpha('#FF8F00', 0.1), color: '#FF8F00' }}>
                <AttachMoneyIcon />
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#FF8F00' }}>
                  {budgetMode ? currentTotalCost : summary.estimatedCost}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {budgetMode ? 'Cost of included items' : 'Estimated total cost'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ py: budgetMode ? 2 : 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: budgetMode ? 2 : 0 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Budget Mode</Typography>
                  {!budgetMode && (
                    <Typography variant="body2" color="text.secondary">
                      Prioritise orders within a spending limit.
                    </Typography>
                  )}
                </Box>
                <Switch
                  checked={budgetMode}
                  onChange={(e) => setBudgetMode(e.target.checked)}
                  color="primary"
                />
              </Box>

              {budgetMode && (
                <TextField
                  fullWidth
                  size="small"
                  label="Budget Limit (DKK)"
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">DKK</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha('#1B5E20', 0.05)
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Timeline Items */}
      <Stack spacing={2}>
        {filteredItems.map((item) => {
          const config = getUrgencyConfig(item.urgency);
          const progressColor = getProgressColor(item.daysLeft);
          const progressValue = Math.min(100, (item.daysLeft / 7) * 100);

          return (
            <Card
              key={item.id}
              sx={{
                border: item.urgency === 'critical' ? `2px solid ${config.color}` : '1px solid #E0E0E0',
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: config.color,
                        color: 'white',
                        fontWeight: 700,
                        width: 36,
                        height: 36,
                      }}
                    >
                      {item.priority}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{item.item}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Est. cost: {item.estimatedCost}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: config.color,
                        '&:hover': { bgcolor: config.color, opacity: 0.9 },
                      }}
                    >
                      {config.label}
                    </Button>
                    {item.urgency === 'critical' && <WarningAmberIcon sx={{ color: '#D32F2F' }} />}
                  </Stack>
                </Stack>

                {/* Stats Row */}
                <Box sx={{ display: 'flex', gap: 4, mt: 2, mb: 2, pl: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">On hand</Typography>
                    <Typography fontWeight={600}>{item.onHand}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Usage/day</Typography>
                    <Typography fontWeight={600}>{item.usagePerDay}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Lead time</Typography>
                    <Typography fontWeight={600}>{item.leadTime}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Order by</Typography>
                    <Typography fontWeight={600}>{item.orderBy}</Typography>
                  </Box>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ pl: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.daysLeft} days left
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#F0F0F0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: progressColor,
                            borderRadius: 4,
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </PageWrapper>
  );
}
