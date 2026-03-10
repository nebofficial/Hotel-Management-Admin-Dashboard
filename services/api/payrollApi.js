const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchStaffForPayroll(apiBase) {
  if (!apiBase) return { staff: [] };
  const res = await fetch(`${apiBase}/payroll/staff`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load staff');
}

export async function fetchSalaryStructure(apiBase, params = {}) {
  if (!apiBase) return { structures: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/payroll/salary-structure${qs ? `?${qs}` : ''}`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load salary structure');
}

export async function setupSalaryStructure(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/payroll/salary-structure`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
  return handle(res, 'Failed to setup salary');
}

export async function fetchAllowanceTypes(apiBase) {
  if (!apiBase) return { allowanceTypes: [] };
  const res = await fetch(`${apiBase}/payroll/allowance-types`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load allowance types');
}

export async function fetchStaffAllowances(apiBase, params = {}) {
  if (!apiBase) return { allowances: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/payroll/allowances${qs ? `?${qs}` : ''}`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load allowances');
}

export async function upsertAllowance(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/payroll/allowances`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
  return handle(res, 'Failed to save allowance');
}

export async function fetchDeductionTypes(apiBase) {
  if (!apiBase) return { deductionTypes: [] };
  const res = await fetch(`${apiBase}/payroll/deduction-types`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load deduction types');
}

export async function fetchStaffDeductions(apiBase, params = {}) {
  if (!apiBase) return { deductions: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/payroll/deductions${qs ? `?${qs}` : ''}`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load deductions');
}

export async function upsertDeduction(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/payroll/deductions`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
  return handle(res, 'Failed to save deduction');
}

export async function addBonus(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/payroll/bonus`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
  return handle(res, 'Failed to add bonus');
}

export async function generatePayroll(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/payroll/generate`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
  return handle(res, 'Failed to generate payroll');
}

export async function fetchPayrollList(apiBase, params = {}) {
  if (!apiBase) return { runs: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/payroll/list${qs ? `?${qs}` : ''}`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load payroll');
}

export async function markPayrollPaid(apiBase, entryId, payload = {}) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/payroll/entries/${entryId}/paid`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
  return handle(res, 'Failed to mark paid');
}

export async function fetchPaymentHistory(apiBase) {
  if (!apiBase) return { history: [] };
  const res = await fetch(`${apiBase}/payroll/payment-history`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load payment history');
}

export async function fetchPayrollReports(apiBase, params = {}) {
  if (!apiBase) return { summary: {}, byDepartment: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiBase}/payroll/reports${qs ? `?${qs}` : ''}`, { headers: { Authorization: headers().Authorization } });
  return handle(res, 'Failed to load reports');
}
