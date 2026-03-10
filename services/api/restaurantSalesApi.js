const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchRestaurantSalesSummary(apiBase, params = {}) {
  if (!apiBase) return { totalRestaurantRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/restaurant-sales/summary${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load restaurant sales summary');
}

export async function fetchDailyRestaurantSales(apiBase, params = {}) {
  if (!apiBase) return { daily: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/restaurant-sales/daily${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load daily sales');
}

export async function fetchItemWiseSales(apiBase, params = {}) {
  if (!apiBase) return { itemWise: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/restaurant-sales/item-wise${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load item-wise sales');
}

export async function fetchCategoryWiseSales(apiBase, params = {}) {
  if (!apiBase) return { categoryWise: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/restaurant-sales/category-wise${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load category-wise sales');
}

export async function fetchTopSellingItems(apiBase, params = {}) {
  if (!apiBase) return { topItems: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/restaurant-sales/top-selling${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load top selling items');
}

export async function fetchPaymentMethodAnalysis(apiBase, params = {}) {
  if (!apiBase) return { paymentAnalysis: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/restaurant-sales/payment-analysis${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load payment analysis');
}

export async function fetchRestaurantSalesTrend(apiBase, params = {}) {
  if (!apiBase) return { trend: [], categorySales: [], paymentDistribution: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/restaurant-sales/trend${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load sales trend');
}

export async function exportRestaurantSalesReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/restaurant-sales/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export restaurant sales report');
}
