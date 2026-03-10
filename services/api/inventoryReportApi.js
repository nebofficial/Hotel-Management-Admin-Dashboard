const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchInventorySummary(apiBase, params = {}) {
  if (!apiBase) return { totalItems: 0, totalInventoryValue: 0, lowStockItems: 0, stockConsumedToday: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/inventory-report/summary${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load inventory summary');
}

export async function fetchCurrentStock(apiBase, params = {}) {
  if (!apiBase) return { currentStock: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/inventory-report/current-stock${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load current stock');
}

export async function fetchLowStockItems(apiBase, params = {}) {
  if (!apiBase) return { lowStock: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/inventory-report/low-stock${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load low stock items');
}

export async function fetchStockMovement(apiBase, params = {}) {
  if (!apiBase) return { stockAdded: 0, stockUsed: 0, stockAdjustments: 0, movements: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/inventory-report/stock-movement${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load stock movement');
}

export async function fetchInventoryConsumption(apiBase, params = {}) {
  if (!apiBase) return { consumption: [], byCategory: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/inventory-report/consumption${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load consumption');
}

export async function fetchInventoryValuation(apiBase, params = {}) {
  if (!apiBase) return { totalStockValue: 0, valuation: [], byCategory: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/inventory-report/valuation${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load valuation');
}

export async function fetchInventoryTrend(apiBase, params = {}) {
  if (!apiBase) return { trend: [], categoryDistribution: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/inventory-report/trend${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load trend');
}

export async function exportInventoryReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/inventory-report/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export inventory report');
}
