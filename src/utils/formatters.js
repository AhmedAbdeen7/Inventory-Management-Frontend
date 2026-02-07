export function formatCurrency(amount) {
  const value = typeof amount === 'number' ? amount : Number(amount || 0);
  return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(value);
}

export function formatDate(input) {
  const d = input ? new Date(input) : new Date();
  return new Intl.DateTimeFormat('da-DK', { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
}

export function toISODate(input) {
  const d = input ? new Date(input) : new Date();
  return d.toISOString().split('T')[0];
}

export default { formatCurrency, formatDate, toISODate };
