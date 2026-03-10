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

export async function fetchRoomPricingOverview(apiBase, params = {}) {
  if (!apiBase) return { items: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/marketing-dashboard/room-pricing${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load room pricing overview');
}

export async function fetchBookingPerformance(apiBase, params = {}) {
  if (!apiBase) return { summary: null, dailyTrend: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/marketing-dashboard/booking-performance${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load booking performance');
}

export async function fetchCampaignSummary(apiBase, params = {}) {
  if (!apiBase) return { campaigns: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/marketing-dashboard/campaigns${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load campaign summary');
}

export async function fetchOTABookingInsights(apiBase, params = {}) {
  if (!apiBase) return { channels: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/marketing-dashboard/ota-insights${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load OTA booking insights');
}

export async function fetchRatePlanPerformance(apiBase, params = {}) {
  if (!apiBase) return { ratePlans: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/marketing-dashboard/rate-plans${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load rate plan performance');
}

export async function fetchRevenueByRoomCategory(apiBase, params = {}) {
  if (!apiBase) return { byRoomCategory: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/marketing-dashboard/revenue-by-room-category${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load revenue by room category');
}

export async function fetchRecentMarketingActivities(apiBase, params = {}) {
  if (!apiBase) return { items: [] };
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(
    `${apiBase}/marketing-dashboard/recent-activity${qs ? `?${qs}` : ''}`,
    { headers: { Authorization: headers().Authorization } },
  );
  return handle(res, 'Failed to load recent marketing activity');
}

