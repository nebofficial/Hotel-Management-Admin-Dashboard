const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchExpenseSummary(apiBase, params = {}) {
  if (!apiBase) return { totalExpenses: 0, totalVendorPayments: 0, operationalCosts: 0, maintenanceExpenses: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/expense-report/summary${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load expense summary');
}

export async function fetchDailyExpenses(apiBase, params = {}) {
  if (!apiBase) return { daily: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/expense-report/daily${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load daily expenses');
}

export async function fetchMonthlyExpenses(apiBase, params = {}) {
  if (!apiBase) return { monthly: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/expense-report/monthly${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load monthly expenses');
}

export async function fetchDepartmentExpenses(apiBase, params = {}) {
  if (!apiBase) return { departmentExpenses: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/expense-report/department${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load department expenses');
}

export async function fetchVendorPayments(apiBase, params = {}) {
  if (!apiBase) return { vendorPayments: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/expense-report/vendor-payments${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load vendor payments');
}

export async function fetchExpenseTrend(apiBase, params = {}) {
  if (!apiBase) return { trend: [], categoryDistribution: [], departmentExpenses: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/expense-report/trend${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load expense trend');
}

export async function fetchExpenseDetails(apiBase, params = {}) {
  if (!apiBase) return { breakdown: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/expense-report/details${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load expense details');
}

export async function exportExpenseReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/expense-report/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export expense report');
}
