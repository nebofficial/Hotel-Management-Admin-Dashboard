const getToken = () =>
  (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function handle(res, fallbackMsg) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
}

export async function fetchCampaigns(apiBase, params = {}) {
  if (!apiBase) return { items: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/campaigns${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load campaigns');
}

export async function createEmailCampaign(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/campaigns/email`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to create email campaign');
}

export async function createSmsCampaign(apiBase, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/campaigns/sms`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to create SMS campaign');
}

export async function scheduleCampaign(apiBase, id, payload) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/campaigns/${id}/schedule`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload || {}),
  });
  return handle(res, 'Failed to schedule campaign');
}

export async function sendBulkCampaign(apiBase, id) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/campaigns/${id}/send`, {
    method: 'POST',
    headers: { Authorization: headers().Authorization },
  });
  return handle(res, 'Failed to send campaign');
}

export async function fetchCampaignAnalytics(apiBase) {
  if (!apiBase) return {
    totals: { totalCampaigns: 0, activeCampaigns: 0, emailsSent: 0, smsSent: 0 },
    usageTrend: [],
    topCampaigns: [],
    distribution: [],
  };
  const res = await fetch(
    `${apiBase}/campaigns/analytics`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load campaign analytics');
}

export async function updateCampaignStatus(apiBase, id, status) {
  if (!apiBase) throw new Error('apiBase required');
  const res = await fetch(`${apiBase}/campaigns/${id}/status`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ status }),
  });
  return handle(res, 'Failed to update campaign status');
}

