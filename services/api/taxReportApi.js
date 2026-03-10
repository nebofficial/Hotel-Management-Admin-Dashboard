const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchTaxSummary(apiBase, params = {}) {
  if (!apiBase) return { totalTaxCollected: 0, gstVatCollected: 0, serviceChargesCollected: 0, totalTaxableRevenue: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/tax-report/summary${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load tax summary');
}

export async function fetchGSTVATReport(apiBase, params = {}) {
  if (!apiBase) return { invoiceCount: 0, totalTaxAmount: 0, taxableSales: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/tax-report/gst-vat${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load GST/VAT report');
}

export async function fetchServiceChargeReport(apiBase, params = {}) {
  if (!apiBase) return { totalServiceCharges: 0, serviceChargeRevenue: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/tax-report/service-charge${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load service charge report');
}

export async function fetchTaxBreakdownByInvoice(apiBase, params = {}) {
  if (!apiBase) return { breakdown: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/tax-report/breakdown${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load tax breakdown');
}

export async function fetchTaxFilingReport(apiBase, params = {}) {
  if (!apiBase) return { monthlySummary: [], totalTaxPayable: 0 };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/tax-report/filing${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load tax filing report');
}

export async function fetchTaxTrend(apiBase, params = {}) {
  if (!apiBase) return { trend: [], taxDistribution: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/tax-report/trend${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to load tax trend');
}

export async function exportTaxReport(apiBase, params = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/tax-report/export${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to export tax report');
}
