// ==========================================
// JJ TECH - FORMATTERS UTILITY
// ==========================================

export const formatCOP = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "$ 0 COP";
  const num = Math.round(Number(amount));
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(num) + ' COP';
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return new Intl.NumberFormat('es-CO').format(num);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(d);
};
