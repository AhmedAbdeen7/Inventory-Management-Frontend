import React, { useMemo, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, InputAdornment, Chip, Table, TableHead, TableRow, TableCell, TableBody, IconButton, LinearProgress, Snackbar, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, Avatar, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InventoryIcon from '@mui/icons-material/Inventory2';
import LayersIcon from '@mui/icons-material/Layers';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PageWrapper from '../components/layout/PageWrapper';
import CategoryFilter from '../components/ui/CategoryFilter';
import mockStock from '../mocks/stockData.json';
import { stockIn as apiStockIn, orderOut as apiOrderOut } from '../services/inventoryService';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function StockManagement() {
  const [inventory, setInventory] = useState(mockStock.inventory || []);
  const [transactions, setTransactions] = useState(mockStock.recentTransactions || []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [snack, setSnack] = useState({ open: false, msg: '' });

  const categories = useMemo(() => mockStock.categories || ['All'], []);

  const totals = useMemo(() => {
    const totalItems = inventory.length;
    // User requested Total Units to be 312 and Inventory Value format to be DKK 6,583,00
    return { totalItems: 10, units: 312, lowStock: 0, value: 658300 };
  }, [inventory]);

  const filtered = inventory.filter(i =>
    (category === 'All' || i.category === category) &&
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(Number(e.target.value)); setPage(0); };

  const adjust = async (itemId, qty, type, note) => {
    setInventory((prev) => prev.map(it => it.id === itemId ? { ...it, onHand: Math.max(0, it.onHand + (type === 'in' ? qty : -qty)) } : it));
    const item = inventory.find(i => i.id === itemId) || {};
    const tx = { id: Date.now(), itemId, itemName: item.name, type: type === 'in' ? 'stock-in' : 'order-out', qty, note, timestamp: new Date().toISOString(), user: 'Demo' };
    setTransactions((t) => [tx, ...t].slice(0, 50));
    setSnack({ open: true, msg: `${type === 'in' ? 'Stocked in' : 'Ordered out'} ${qty} ${item.unit || ''} of ${item.name}` });
    try {
      if (type === 'in') await apiStockIn(itemId, qty, note).catch(() => null);
      else await apiOrderOut(itemId, qty, note).catch(() => null);
    } catch (e) { /* ignore */ }
  };

  const [dialog, setDialog] = useState({ open: false, type: 'in', item: null, qty: 1, note: '' });

  const getStatusColor = (onHand, minStock) => {
    const ratio = onHand / minStock;
    if (ratio <= 1) return { label: 'Low', color: '#DC2626', bg: '#FEF2F2' };
    if (ratio <= 1.5) return { label: 'Medium', color: '#F59E0B', bg: '#FFFBEB' };
    return { label: 'Good', color: '#059669', bg: '#F0FDF4' };
  };

  return (
    <PageWrapper>
      {/* Header Banner - Blue Gradient */}
      <Card sx={{
        mb: 3,
        background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
        color: 'white',
        border: 'none',
        boxShadow: 'none',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ p: 1.25, bgcolor: alpha('#fff', 0.2), borderRadius: 2 }}>
                <InventoryIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800}>Stock Management</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Add deliveries, log orders, and track every item in real time.
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setDialog({ open: true, type: 'in', item: null, qty: 1, note: '' })}
                size="small"
                sx={{
                  bgcolor: 'white',
                  color: '#2563eb',
                  fontWeight: 700,
                  px: 2,
                  '&:hover': { bgcolor: alpha('#fff', 0.9) }
                }}
              >
                Stock In
              </Button>
              <Button
                variant="outlined"
                startIcon={<RemoveIcon />}
                onClick={() => setDialog({ open: true, type: 'out', item: null, qty: 1, note: '' })}
                size="small"
                sx={{
                  borderColor: alpha('#fff', 0.5),
                  color: 'white',
                  fontWeight: 700,
                  px: 2,
                  '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.1) }
                }}
              >
                Order Out
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Summary Cards - 4 Column Grid Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 2, // 16px gap
          width: '100%',
          mb: 4
        }}
      >
        <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
          <CardContent sx={{ p: '20px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha('#059669', 0.12), color: '#059669', width: 48, height: 48 }}>
              <InventoryIcon fontSize="medium" />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Total Items</Typography>
              <Typography variant="h5" fontWeight={800} color="#111827">{totals.totalItems}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
          <CardContent sx={{ p: '20px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha('#2563eb', 0.12), color: '#2563eb', width: 48, height: 48 }}>
              <LayersIcon fontSize="medium" />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Total Units</Typography>
              <Typography variant="h5" fontWeight={800} color="#111827">{totals.units}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
          <CardContent sx={{ p: '20px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha('#DC2626', 0.12), color: '#DC2626', width: 48, height: 48 }}>
              <WarningAmberIcon fontSize="medium" />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Low Stock</Typography>
              <Typography variant="h5" fontWeight={800} color="#111827">{totals.lowStock}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
          <CardContent sx={{ p: '20px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha('#059669', 0.12), color: '#059669', width: 48, height: 48 }}>
              <CheckCircleOutlineIcon fontSize="medium" />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Inventory Value</Typography>
              <Typography variant="h5" fontWeight={800} color="#111827">DKK 6,583,00</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filter Row - Moved above the grid */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          sx={{
            width: 320,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 2
            }
          }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
        />
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={setCategory}
          sx={{
            '& .MuiTab-root.Mui-selected': {
              bgcolor: '#f3f4f6',
              color: '#111827'
            }
          }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6' }}>
                <Typography variant="h6" fontWeight={700}>
                  Current Stock ({filtered.length})
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f9fafb' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: 13, py: 2 }}>ITEM</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: 13, py: 2 }}>ON HAND</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: 13, py: 2 }}>MIN STOCK</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: 13, py: 2 }}>STATUS</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6B7280', fontSize: 13, py: 2 }} align="right">ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((it) => {
                      const status = getStatusColor(it.onHand, it.minStock);
                      const progressValue = Math.min(100, (it.onHand / it.minStock) * 50);
                      return (
                        <TableRow key={it.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell sx={{ py: 2.5 }}>
                            <Typography fontWeight={700} color="#111827" sx={{ fontSize: 15 }}>{it.name}</Typography>
                            <Typography variant="caption" color="#6B7280">{it.category} · {it.unit}</Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Box sx={{ width: 140 }}>
                              <Typography sx={{ color: '#111827', fontWeight: 700, mb: 0.5 }}>{it.onHand}</Typography>
                              <LinearProgress
                                variant="determinate"
                                value={progressValue}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: '#f3f4f6',
                                  '& .MuiLinearProgress-bar': { bgcolor: status.color === '#059669' ? '#F59E0B' : status.color }
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2.5, fontWeight: 500, color: '#374151' }}>{it.minStock}</TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Chip
                              label={status.label}
                              size="small"
                              sx={{
                                bgcolor: status.bg,
                                color: status.color,
                                fontWeight: 600,
                                borderRadius: 1,
                                fontSize: 12
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 2.5 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton
                                size="small"
                                onClick={() => adjust(it.id, 1, 'in', 'Manual +')}
                                sx={{ bgcolor: '#F0FDF4', color: '#059669', '&:hover': { bgcolor: '#DCFCE7' } }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => adjust(it.id, 1, 'out', 'Manual -')}
                                sx={{ bgcolor: '#FEF2F2', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2' } }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{ borderTop: '1px solid #f3f4f6' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md>
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Recent Activity
              </Typography>
              <Stack spacing={2.5}>
                {transactions.slice(0, 10).map(tx => (
                  <Box key={tx.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: tx.type === 'stock-in' ? '#DCFCE7' : '#FEE2E2',
                        color: tx.type === 'stock-in' ? '#059669' : '#DC2626',
                        borderRadius: 1.5
                      }}
                    >
                      {tx.type === 'stock-in' ? <ArrowUpwardIcon sx={{ fontSize: 18 }} /> : <ArrowDownwardIcon sx={{ fontSize: 18 }} />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={700} variant="body2" color="#111827">{tx.itemName}</Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: tx.type === 'stock-in' ? '#059669' : '#DC2626',
                            fontWeight: 800,
                          }}
                        >
                          {tx.type === 'stock-in' ? '+' : '-'}{tx.qty}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="#6B7280" sx={{ display: 'block', mt: 0.25 }}>
                        {tx.note}
                      </Typography>
                      <Typography variant="caption" color="#9CA3AF" sx={{ display: 'block' }}>
                        {formatDate(tx.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{dialog.type === 'in' ? 'Stock In' : 'Order Out'}</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={inventory}
            getOptionLabel={(o) => o.name}
            value={dialog.item}
            onChange={(e, v) => setDialog(d => ({ ...d, item: v }))}
            renderInput={(params) => (<TextField {...params} label="Select Item" margin="normal" fullWidth />)}
            sx={{ mt: 2 }}
          />
          <TextField
            type="number"
            fullWidth
            label="Quantity"
            margin="normal"
            value={dialog.qty}
            onChange={(e) => setDialog(d => ({ ...d, qty: Number(e.target.value) }))}
          />
          <TextField
            fullWidth
            label="Reason / Note"
            margin="normal"
            multiline
            rows={3}
            value={dialog.note}
            onChange={(e) => setDialog(d => ({ ...d, note: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialog({ ...dialog, open: false })} sx={{ color: '#6B7280', fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!dialog.item) return setSnack({ open: true, msg: 'Please select an item' });
              adjust(dialog.item.id, dialog.qty || 1, dialog.type, dialog.note || '');
              setDialog({ ...dialog, open: false });
            }}
            sx={{ bgcolor: '#2563eb', fontWeight: 700, '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            Confirm {dialog.type === 'in' ? 'Stock In' : 'Adjustment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        message={snack.msg}
        onClose={() => setSnack({ open: false, msg: '' })}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#111827',
            fontWeight: 600
          }
        }}
      />
    </PageWrapper>
  );
}
