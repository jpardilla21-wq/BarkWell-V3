/**
 * API Service
 * Handles all API calls to the backend
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================================================
// PETS API
// ================================================

export const getPets = async (userId = 1) => {
  const response = await api.get(`/pets?userId=${userId}`);
  return response.data;
};

export const getPet = async (petId) => {
  const response = await api.get(`/pets/${petId}`);
  return response.data;
};

export const createPet = async (petData) => {
  const response = await api.post('/pets', petData);
  return response.data;
};

// ================================================
// HEALTH RECORDS API
// ================================================

export const getVaccinations = async (petId) => {
  const response = await api.get(`/health-records/vaccinations/${petId}`);
  return response.data;
};

export const createVaccination = async (vaccinationData) => {
  const response = await api.post('/health-records/vaccinations', vaccinationData);
  return response.data;
};

export const deleteVaccination = async (id) => {
  const response = await api.delete(`/health-records/vaccinations/${id}`);
  return response.data;
};

export const getMedications = async (petId) => {
  const response = await api.get(`/health-records/medications/${petId}`);
  return response.data;
};

export const createMedication = async (medicationData) => {
  const response = await api.post('/health-records/medications', medicationData);
  return response.data;
};

export const deleteMedication = async (id) => {
  const response = await api.delete(`/health-records/medications/${id}`);
  return response.data;
};

export const getVetVisits = async (petId) => {
  const response = await api.get(`/health-records/vet-visits/${petId}`);
  return response.data;
};

export const createVetVisit = async (vetVisitData) => {
  const response = await api.post('/health-records/vet-visits', vetVisitData);
  return response.data;
};

export const deleteVetVisit = async (id) => {
  const response = await api.delete(`/health-records/vet-visits/${id}`);
  return response.data;
};

// ================================================
// DAILY LOGS & WELLNESS SCORE API
// ================================================

export const getDailyLogs = async (petId, days = 30) => {
  const response = await api.get(`/daily-logs/${petId}?days=${days}`);
  return response.data;
};

export const createDailyLog = async (logData) => {
  const response = await api.post('/daily-logs', logData);
  return response.data;
};

export const getWellnessTrend = async (petId, days = 30) => {
  const response = await api.get(`/daily-logs/${petId}/wellness-trend?days=${days}`);
  return response.data;
};

export const getCurrentScore = async (petId) => {
  const response = await api.get(`/daily-logs/${petId}/current-score`);
  return response.data;
};

// ================================================
// WEIGHT LOGS API
// ================================================

export const getWeightLogs = async (petId, months = 6) => {
  const response = await api.get(`/weight-logs/${petId}?months=${months}`);
  return response.data;
};

export const getWeightTrend = async (petId, months = 6) => {
  const response = await api.get(`/weight-logs/${petId}/trend?months=${months}`);
  return response.data;
};

export const createWeightLog = async (weightData) => {
  const response = await api.post('/weight-logs', weightData);
  return response.data;
};

export const deleteWeightLog = async (id) => {
  const response = await api.delete(`/weight-logs/${id}`);
  return response.data;
};

// ================================================
// NUTRITION & DIET API (Phase 2)
// ================================================

export const getNutritionPlan = async (petId) => {
  const response = await api.get(`/nutrition/plan/${petId}`);
  return response.data;
};

export const calculateCalories = async (data) => {
  const response = await api.post('/nutrition/calculate', data);
  return response.data;
};

export const createNutritionPlan = async (planData) => {
  const response = await api.post('/nutrition/plan', planData);
  return response.data;
};

export const getFoods = async (lifeStage) => {
  const response = await api.get('/nutrition/foods', { params: { lifeStage } });
  return response.data;
};

export const calculatePortion = async (data) => {
  const response = await api.post('/nutrition/portion', data);
  return response.data;
};

export const getTreats = async (petId, date) => {
  const response = await api.get(`/nutrition/treats/${petId}`, { params: { date } });
  return response.data;
};

export const logTreat = async (treatData) => {
  const response = await api.post('/nutrition/treats', treatData);
  return response.data;
};

export const deleteTreat = async (id) => {
  const response = await api.delete(`/nutrition/treats/${id}`);
  return response.data;
};

// ================================================
// CONTENT LIBRARY API (Phase 2)
// ================================================

export const getContent = async (category, format) => {
  const response = await api.get('/content', { params: { category, format } });
  return response.data;
};

export const getRecommendedContent = async (petId, limit = 6) => {
  const response = await api.get(`/content/recommend/${petId}`, { params: { limit } });
  return response.data;
};

export const getContentCategories = async () => {
  const response = await api.get('/content/categories/list');
  return response.data;
};

// ================================================
// BREED INFO API (Phase 2)
// ================================================

export const getAllBreeds = async () => {
  const response = await api.get('/breeds');
  return response.data;
};

export const getBreedInfo = async (breedName) => {
  const response = await api.get(`/breeds/${breedName}`);
  return response.data;
};

// ================================================
// SUBSCRIPTIONS API (Phase 3 - Monetization)
// ================================================

export const getSubscriptionTiers = async () => {
  const response = await api.get('/subscriptions/tiers');
  return response.data;
};

export const getSubscriptionStatus = async (userId) => {
  const response = await api.get(`/subscriptions/status/${userId}`);
  return response.data;
};

export const subscribeToTier = async (userId, tier, paymentMethod = 'mock_payment') => {
  const response = await api.post('/subscriptions/subscribe', {
    userId,
    tier,
    paymentMethod,
  });
  return response.data;
};

export const cancelSubscription = async (userId) => {
  const response = await api.post('/subscriptions/cancel', { userId });
  return response.data;
};

export const getPaymentHistory = async (userId, limit = 10) => {
  const response = await api.get(`/subscriptions/payments/${userId}`, { params: { limit } });
  return response.data;
};

// ================================================
// SHOP & AFFILIATE API (Phase 3 - Monetization)
// ================================================

export const getProducts = async (filters = {}) => {
  const response = await api.get('/shop/products', { params: filters });
  return response.data;
};

export const getCuratedProducts = async (petId) => {
  const response = await api.get(`/shop/curated/${petId}`);
  return response.data;
};

export const getProductCategories = async () => {
  const response = await api.get('/shop/categories');
  return response.data;
};

export const getInsurancePartners = async () => {
  const response = await api.get('/shop/insurance');
  return response.data;
};

export const trackAffiliateClick = async (productId, petId, clickType = 'product') => {
  const response = await api.post('/shop/track-click', {
    productId,
    petId,
    clickType,
  });
  return response.data;
};

// ================================================
// ANALYTICS API (Phase 5 - Advanced Analytics)
// ================================================

export const getAnalyticsDashboard = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};

export const getSubscriptionMetrics = async (startDate, endDate) => {
  const response = await api.get('/analytics/subscriptions/metrics', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getChurnAnalysis = async (months = 12) => {
  const response = await api.get('/analytics/subscriptions/churn', {
    params: { months }
  });
  return response.data;
};

export const getConversionFunnel = async () => {
  const response = await api.get('/analytics/subscriptions/funnel');
  return response.data;
};

export const getAffiliatePerformance = async (startDate, endDate, productType) => {
  const response = await api.get('/analytics/affiliates/performance', {
    params: { startDate, endDate, productType }
  });
  return response.data;
};

export const getAffiliateCategoryPerformance = async () => {
  const response = await api.get('/analytics/affiliates/categories');
  return response.data;
};

export const getUserGrowth = async (period = 30) => {
  const response = await api.get('/analytics/users/growth', {
    params: { period }
  });
  return response.data;
};

export const getCohortAnalysis = async () => {
  const response = await api.get('/analytics/users/cohorts');
  return response.data;
};

export const getEngagementMetrics = async (period = 30) => {
  const response = await api.get('/analytics/users/engagement', {
    params: { period }
  });
  return response.data;
};

export const getRevenueOverview = async (startDate, endDate) => {
  const response = await api.get('/analytics/revenue/overview', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getRevenueProjections = async () => {
  const response = await api.get('/analytics/revenue/projections');
  return response.data;
};

export const getInsurancePerformance = async () => {
  const response = await api.get('/analytics/insurance/performance');
  return response.data;
};

export const trackEvent = async (eventData) => {
  const response = await api.post('/analytics/track', eventData);
  return response.data;
};

export const trackAffiliateClickDetailed = async (clickData) => {
  const response = await api.post('/analytics/affiliate-click', clickData);
  return response.data;
};

export const updateDailyMetrics = async (date) => {
  const response = await api.post('/analytics/update-metrics', { date });
  return response.data;
};

export default api;
