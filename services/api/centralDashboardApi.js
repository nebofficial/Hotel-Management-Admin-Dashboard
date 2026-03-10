import {
  fetchPropertyStats,
  fetchOccupancyAcrossProperties,
  fetchTotalRevenue,
  fetchPropertyComparison,
  fetchRevenueDistribution,
  fetchTotalBookings,
  fetchMonthlyTrends,
} from './multiPropertyApi';

export { fetchPropertyStats };
export { fetchOccupancyAcrossProperties };
export { fetchTotalRevenue };
export { fetchPropertyComparison };
export { fetchRevenueDistribution };
export { fetchTotalBookings };
export { fetchMonthlyTrends };

export const fetchTotalBookingsApi = fetchTotalBookings;
export const fetchTotalRevenueApi = fetchTotalRevenue;
export const fetchOccupancyComparison = fetchOccupancyAcrossProperties;
export const fetchPropertyRevenue = fetchRevenueDistribution;
export const fetchPropertyRanking = fetchPropertyComparison;
export const fetchMonthlyPerformanceTrends = fetchMonthlyTrends;
export const fetchRevenueDistributionAnalytics = fetchRevenueDistribution;
