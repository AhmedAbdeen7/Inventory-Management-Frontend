import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Stack, Chip, Button, Table, TableHead, TableRow, TableCell, TableBody, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SavingsIcon from '@mui/icons-material/Savings';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import useAuth from '../hooks/useAuth';
import KPICard from '../components/ui/KPICard';
import mockDashboard from '../mocks/dashboardData.json';
import DemandChart from '../components/charts/DemandChart';
import WasteBarChart from '../components/charts/WasteBarChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { kpis, alertsSummary, demandTrend, wasteByItem, priorities } = mockDashboard;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const getUrgencyColor = (severity) => {
    switch (severity) {
      case 'critical': return { bg: '#FFEBEE', text: '#D32F2F', border: '#D32F2F' };
      case 'high': return { bg: '#FFF3E0', text: '#E65100', border: '#FF8F00' };
      default: return { bg: '#E8F5E9', text: '#1B5E20', border: '#1B5E20' };
    }
  };

  return (
    <PageWrapper>
      {/* Welcome Banner */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1B5E20 0%, #43A047 100%)', color: 'white', border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Good morning, {user?.firstName || 'Demo'} 👋
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                📅 {dateStr}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/alerts')}
              sx={{
                bgcolor: alpha('#fff', 0.15),
                color: 'white',
                '&:hover': { bgcolor: alpha('#fff', 0.25) },
              }}
              startIcon={<WarningAmberIcon />}
            >
              {alertsSummary.total} alerts need attention
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* KPI Cards - Fluid Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        <KPICard
          title="Estimated Savings"
          value={kpis.savings}
          subtitle="vs. last month"
          delta={kpis.savingsDelta}
          trend={kpis.savingsTrend}
          icon={<SavingsIcon />}
          color="#1B5E20"
        />
        <KPICard
          title="Waste Rate"
          value={kpis.wastePercent}
          subtitle="of total inventory value"
          delta={kpis.wasteDelta}
          trend={kpis.wasteTrend}
          icon={<DeleteOutlineIcon />}
          color="#D32F2F"
        />
        <KPICard
          title="Stockout Risks"
          value={kpis.stockoutRisks}
          subtitle="items below reorder point"
          delta={kpis.stockoutDelta}
          trend={kpis.stockoutTrend}
          icon={<WarningAmberIcon />}
          color="#FF8F00"
        />
        <KPICard
          title="Pending Orders"
          value={kpis.recommendedOrderValue}
          subtitle="total recommended value"
          trend={kpis.ordersTrend}
          icon={<ShoppingCartIcon />}
          color="#1B5E20"
        />
      </Box>

      {/* Charts + Operations - 3 Column Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr'
          },
          gap: 3,
          mb: 4
        }}
      >
        {/* Left Column (2/3 width) */}
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: '24px !important' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Demand Trend</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                    Actual vs. AI-predicted · last 7 days + 3-day forecast
                  </Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/forecast')}>
                  View details
                </Button>
              </Stack>
              <DemandChart data={demandTrend} />
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: '24px !important' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Priority Reorders</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                    Items that need ordering soon based on AI forecasts
                  </Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/reorder')}>
                  View Timeline
                </Button>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '13px' }}>Item</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '13px' }}>On Hand</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '13px' }}>Forecast 7d</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '13px' }}>Reorder Qty</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '13px' }}>Urgency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {priorities.map((p) => {
                    const urgencyStyle = getUrgencyColor(p.severity);
                    return (
                      <TableRow key={p.id}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>{p.item}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{p.onHand}</TableCell>
                        <TableCell sx={{ fontSize: '14px' }}>{p.forecast7d}</TableCell>
                        <TableCell sx={{ color: '#D32F2F', fontWeight: 600, fontSize: '14px' }}>
                          {p.reorderQty || '—'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.urgency}
                            size="small"
                            sx={{
                              bgcolor: urgencyStyle.bg,
                              color: urgencyStyle.text,
                              border: `1px solid ${urgencyStyle.border}`,
                              fontWeight: 600,
                              fontSize: '12px'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Stack>

        {/* Right Column (1/3 width) */}
        <Stack spacing={3}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: '24px !important' }}>
              <Typography variant="h6" fontWeight={700}>Top Waste Contributors</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mb: 2, fontSize: '14px' }}>
                Highest waste value (DKK) this month
              </Typography>
              <WasteBarChart data={wasteByItem} />
            </CardContent>
          </Card>

          {/* Sidebar Cards Stacked */}
          <Stack spacing={2}>
            <Card
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}
              onClick={() => navigate('/alerts')}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '20px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#FFEBEE', color: '#D32F2F', width: 44, height: 44 }}>
                    <NotificationsIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} sx={{ fontSize: '15px' }}>Active Alerts</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                      {alertsSummary.total} critical alerts
                    </Typography>
                  </Box>
                </Box>
                <Chip label={alertsSummary.total} size="small" color="error" />
              </CardContent>
            </Card>

            <Card
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}
              onClick={() => navigate('/promotions')}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '20px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FF8F00', width: 44, height: 44 }}>
                    <AutoAwesomeIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} sx={{ fontSize: '15px' }}>AI Promotions</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                      2 bundle suggestions
                    </Typography>
                  </Box>
                </Box>
                <ArrowForwardIcon sx={{ color: 'text.secondary' }} />
              </CardContent>
            </Card>

            <Card
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}
              onClick={() => navigate('/forecast')}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '20px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#E8F5E9', color: '#1B5E20', width: 44, height: 44 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} sx={{ fontSize: '15px' }}>Demand Forecast</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                      87% model confidence
                    </Typography>
                  </Box>
                </Box>
                <ArrowForwardIcon sx={{ color: 'text.secondary' }} />
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Box>
    </PageWrapper>
  );
}
