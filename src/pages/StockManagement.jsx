import React, { useMemo, useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, InputAdornment, Chip, Table, TableHead, TableRow, TableCell, TableBody, IconButton, LinearProgress, Snackbar, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, Avatar, Stack, CircularProgress } from '@mui/material';
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
import { stockIn as apiStockIn, orderOut as apiOrderOut, getMenuItems, getAddons, getStock, getSales, getRestocks, getSettings } from '../services/inventoryService';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function StockManagement() {
  const [inventory, setInventory] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [transactions, setTransactions] = useState(mockStock.recentTransactions || []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [snack, setSnack] = useState({ open: false, msg: '' });
  const [settings, setSettings] = useState({ lowStockThreshold: 10 });
  const [inventoryValue, setInventoryValue] = useState(0);

  const categories = useMemo(() => ['All', 'MenuItem', 'Addon'], []);

  useEffect(() => {
    fetchStock();
    fetchTransactions();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const fetchStock = async () => {
    setLoadingStock(true);
    try {
      const data = await getStock();
      setInventory(data);
    } catch (error) {
      console.error("Failed to fetch stock", error);
    } finally {
      setLoadingStock(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const [sales, restocks] = await Promise.all([getSales(), getRestocks()]);

      // Calculate Inventory Value
      // Value = (Sum of all Restocks (qty * pricePerUnit)) - (Sum of all Sales (qty * pricePerUnit))
      const totalRestockValue = restocks.reduce((acc, r) => acc + (r.quantity * r.pricePerUnit), 0);
      const totalSaleValue = sales.reduce((acc, s) => acc + (s.quantity * s.pricePerUnit), 0);
      setInventoryValue(totalRestockValue - totalSaleValue);

      const formattedSales = sales.map(s => ({
        id: s._id,
        type: 'stock-out',
        itemName: s.menuItem ? s.menuItem.title : (s.addons && s.addons.length ? 'Addons' : 'Unknown'),
        qty: s.quantity,
        note: 'Sale', // You might want to add a note field to sales later
        timestamp: s.createdAt
      }));

      const formattedRestocks = restocks.map(r => ({
        id: r._id,
        type: 'stock-in',
        itemName: r.menuItem ? r.menuItem.title : (r.addons && r.addons.length ? 'Addons' : 'Unknown'),
        qty: r.quantity,
        note: 'Restock',
        timestamp: r.createdAt
      }));

      const allTransactions = [...formattedSales, ...formattedRestocks].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTransactions(allTransactions);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const totals = useMemo(() => {
    const totalItems = inventory.length;
    const units = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const lowStock = inventory.filter(item => (item.quantity || 0) < (settings.lowStockThreshold || 10)).length;
    return { totalItems, units, lowStock, value: inventoryValue };
  }, [inventory, settings, inventoryValue]);

  const filtered = inventory.filter(i => {
    const itemName = i.item ? (i.item.title || 'Unknown Item') : 'Unknown Item';
    return (category === 'All' || i.itemType === category) &&
      itemName.toLowerCase().includes(query.toLowerCase())
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(Number(e.target.value)); setPage(0); };

  const adjust = async (item, qty, type, note) => {
    // Optimistic update
    setInventory((prev) => prev.map(it => {
      // Optimistically update if we find the matching item in stock
      // Note: The backend restock creates a new entry if not found, forcing a re-fetch is safer but we can try optimistic
      if (it?.item?._id === item._id || it?.item === item._id) {
        return { ...it, quantity: Math.max(0, (it.quantity || 0) + (type === 'in' ? qty : -qty)) };
      }
      return it;
    }));

    try {
      if (type === 'in') await apiStockIn(item, qty);
      else await apiOrderOut(item, qty);

      setSnack({ open: true, msg: `${type === 'in' ? 'Stocked in' : 'Ordered out'} successfully` });
      fetchStock(); // Refresh stock to get updated values and potentially new rows
      fetchTransactions(); // Refresh transactions
    } catch (e) {
      console.error("Adjustment failed", e);
      setSnack({ open: true, msg: 'Adjustment failed' });
      fetchStock(); // Revert/Refresh
    }
  };

  const [dialog, setDialog] = useState({ open: false, type: 'in', item: null, qty: 1, note: '' });
  const [dialogOptions, setDialogOptions] = useState([]);
  const [dialogLoading, setDialogLoading] = useState(false);

  // Debounce search for dialog
  const handleDialogSearch = async (event, value, reason) => {
    if (reason === 'input') {
      setDialogLoading(true);
      try {
        const [menuItems, addons] = await Promise.all([
          getMenuItems(value),
          getAddons(value)
        ]);
        // standardize the format
        const formattedMenuItems = menuItems.map(i => ({ ...i, type: 'Menu Item', label: `${i.title} - DKK ${i.price}` }));
        const formattedAddons = addons.map(i => ({ ...i, type: 'Addon', label: `${i.title} - DKK ${i.price}` }));
        setDialogOptions([...formattedMenuItems, ...formattedAddons]);
      } catch (error) {
        console.error("Failed to fetch items", error);
        setDialogOptions([]);
      } finally {
        setDialogLoading(false);
      }
    }
  };


  const getStatusColor = (quantity) => {
    if (quantity < (settings.lowStockThreshold || 10)) return { label: 'Low', color: '#DC2626', bg: '#FEF2F2' };
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
              <Typography variant="h5" fontWeight={800} color="#111827">DKK {totals.value.toFixed(2)}</Typography>
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
        <Grid item xs={12} md={6}>
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
                    {loadingStock ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={30} />
                        </TableCell>
                      </TableRow>
                    ) : filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const item = row.item || {};
                      const itemName = item.title || 'Unknown Item #' + item;
                      const quantity = row.quantity || 0;
                      // Determine unit based on type or data? default to 'unit'
                      const unit = 'units';
                      const minStock = settings.lowStockThreshold || 10;

                      const status = getStatusColor(quantity);
                      const progressValue = Math.min(100, (quantity / minStock) * 50);

                      // We need a stable ID for key. Stock ID is best.
                      const key = row._id || (item._id + row.itemType);

                      return (
                        <TableRow key={key} hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell sx={{ py: 2.5 }}>
                            <Typography fontWeight={700} color="#111827" sx={{ fontSize: 15 }}>{itemName}</Typography>
                            <Typography variant="caption" color="#6B7280">{row.itemType}</Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Box sx={{ width: 140 }}>
                              <Typography sx={{ color: '#111827', fontWeight: 700, mb: 0.5 }}>{quantity}</Typography>
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
                          <TableCell sx={{ py: 2.5, fontWeight: 500, color: '#374151' }}>{minStock}</TableCell>
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
                                onClick={() => adjust(item, 1, 'in', 'Manual +')}
                                sx={{ bgcolor: '#F0FDF4', color: '#059669', '&:hover': { bgcolor: '#DCFCE7' } }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => adjust(item, 1, 'out', 'Manual -')}
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

        <Grid item xs={12} md={6}>
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
            options={dialogOptions}
            getOptionLabel={(o) => o.label || o.title || ''}
            value={dialog.item}
            onChange={(e, v) => setDialog(d => ({ ...d, item: v }))}
            onInputChange={handleDialogSearch}
            loading={dialogLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Item"
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {dialogLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
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
              // Use full item object for the API
              adjust(dialog.item, dialog.qty || 1, dialog.type, dialog.note || '');
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
