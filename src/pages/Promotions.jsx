import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip, Button, Stack, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PercentIcon from '@mui/icons-material/Percent';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageWrapper from '../components/layout/PageWrapper';
import promotionsData from '../mocks/promotionsData.json';

export default function Promotions() {
  const { promotions, suggestionsCount } = promotionsData;
  const [expandedId, setExpandedId] = useState(null);

  return (
    <PageWrapper>
      {/* Header Banner */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #E65100 0%, #FB8C00 100%)', color: 'white', border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 48, height: 48 }}>
                <AutoAwesomeIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800}>AI Promotion Engine</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Smart bundles & discounts generated from demand forecasts, expiry dates, and margin data.
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<SmartToyIcon sx={{ color: 'white !important' }} />}
              label={`${suggestionsCount} suggestions`}
              sx={{ bgcolor: alpha('#fff', 0.2), color: 'white', fontWeight: 600 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Promotion Cards Grid */}
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
        {promotions.map((promo) => (
          <Card key={promo.id}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header: Title & Discount */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: alpha('#FF8F00', 0.1), color: '#FF8F00' }}>
                    <LocalOfferIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>{promo.name}</Typography>
                </Box>
                <Chip
                  label={promo.discount}
                  size="small"
                  sx={{ bgcolor: '#FF8F00', color: 'white', fontWeight: 800, borderRadius: 1.5 }}
                />
              </Stack>

              {/* Items Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Target Items
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {promo.items.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: alpha('#E0E0E0', 0.8),
                        fontWeight: 500,
                        bgcolor: alpha('#F9FAFB', 0.5)
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Impact Section */}
              <Box sx={{ mb: 3, p: 2, bgcolor: alpha('#F9FAFB', 0.8), borderRadius: 2, border: '1px solid #F3F4F6' }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Projected Impact
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight={800} color="#D32F2F" sx={{ mb: 0.5 }}>
                        {promo.metrics.wasteSaved}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>Waste saved</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight={800} color="#15803d" sx={{ mb: 0.5 }}>
                        {promo.metrics.unitsMoved}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>Proj. Sales</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight={800} color="#0369a1" sx={{ mb: 0.5 }}>
                        {promo.metrics.marginRetained}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>Margin ret.</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Strategy Section */}
              <Box sx={{ mb: 2, flexGrow: 1 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  AI Strategy
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5 }}>
                  {promo.reason}
                </Typography>
              </Box>

              {/* AI Explanation Accordion */}
              <Accordion
                expanded={expandedId === promo.id}
                onChange={() => setExpandedId(expandedId === promo.id ? null : promo.id)}
                sx={{
                  boxShadow: 'none',
                  border: '1px solid #F3F4F6',
                  '&:before': { display: 'none' },
                  borderRadius: '8px !important',
                  mb: 2.5,
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
                  sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 1 } }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyIcon sx={{ fontSize: 16, color: '#1B5E20' }} />
                    <Typography variant="body2" fontWeight={600} color="#1B5E20">Technical Rationale</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.4 }}>
                    {promo.aiExplanation}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {/* Activate Button */}
              <Button
                variant="contained"
                fullWidth
                startIcon={<RocketLaunchIcon fontSize="small" />}
                sx={{
                  bgcolor: '#1B5E20',
                  '&:hover': { bgcolor: '#064E3B' },
                  py: 1.25,
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 15
                }}
              >
                Launch Promotion
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </PageWrapper>
  );
}
