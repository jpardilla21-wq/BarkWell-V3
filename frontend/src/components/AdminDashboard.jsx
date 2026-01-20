/**
 * Admin Dashboard Component
 * Phase 5: Advanced Analytics
 * Displays comprehensive analytics for subscriptions, affiliates, users, and revenue
 */

import { useState, useEffect } from 'react';
import {
  getAnalyticsDashboard,
  getSubscriptionMetrics,
  getAffiliatePerformance,
  getUserGrowth,
  getRevenueOverview,
  getConversionFunnel,
  getCohortAnalysis,
  getChurnAnalysis
} from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [affiliates, setAffiliates] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [churn, setChurn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      // Fetch all analytics data in parallel
      const [
        dashboardData,
        subMetrics,
        affPerformance,
        growth,
        revenueData,
        funnelData,
        cohortData,
        churnData
      ] = await Promise.all([
        getAnalyticsDashboard(),
        getSubscriptionMetrics(startDate, endDate),
        getAffiliatePerformance(startDate, endDate),
        getUserGrowth(dateRange),
        getRevenueOverview(startDate, endDate),
        getConversionFunnel(),
        getCohortAnalysis(),
        getChurnAnalysis(12)
      ]);

      setOverview(dashboardData.overview);
      setSubscriptions(dashboardData.subscriptions);
      setAffiliates(affPerformance.topProducts || []);
      setUserGrowth(growth);
      setRevenue(revenueData.summary);
      setFunnel(funnelData.funnel);
      setCohorts(cohortData);
      setChurn(churnData);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value || 0);
  };

  const formatPercent = (value) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <div className="date-range-selector">
          <label>Time Period:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'subscriptions' ? 'active' : ''}
          onClick={() => setActiveTab('subscriptions')}
        >
          Subscriptions
        </button>
        <button
          className={activeTab === 'affiliates' ? 'active' : ''}
          onClick={() => setActiveTab('affiliates')}
        >
          Affiliates
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'revenue' ? 'active' : ''}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </button>
      </nav>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="dashboard-content">
          {/* Key Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Users</h3>
              <div className="metric-value">{formatNumber(overview?.totalUsers)}</div>
              <div className="metric-label">
                {formatNumber(overview?.paidUsers)} paid ({formatPercent(overview?.conversionRate)})
              </div>
            </div>

            <div className="metric-card highlight">
              <h3>Monthly Recurring Revenue</h3>
              <div className="metric-value">{formatCurrency(overview?.mrr)}</div>
              <div className="metric-label">
                ARR: {formatCurrency(overview?.arr)}
              </div>
            </div>

            <div className="metric-card">
              <h3>Avg Revenue Per User</h3>
              <div className="metric-value">{formatCurrency(overview?.avgRevenuePerUser)}</div>
              <div className="metric-label">Paid users only</div>
            </div>

            <div className="metric-card">
              <h3>Affiliate Revenue</h3>
              <div className="metric-value">{formatCurrency(overview?.affiliateRevenue)}</div>
              <div className="metric-label">
                {formatNumber(overview?.affiliateClicks)} clicks
              </div>
            </div>
          </div>

          {/* Subscription Breakdown */}
          <div className="section">
            <h2>Subscription Distribution</h2>
            <div className="subscription-breakdown">
              <div className="tier-bar">
                <div
                  className="tier-segment free"
                  style={{
                    width: `${(subscriptions?.free / overview?.totalUsers * 100) || 0}%`
                  }}
                >
                  <span>Free: {formatNumber(subscriptions?.free)}</span>
                </div>
                <div
                  className="tier-segment plus"
                  style={{
                    width: `${(subscriptions?.plus / overview?.totalUsers * 100) || 0}%`
                  }}
                >
                  <span>Plus: {formatNumber(subscriptions?.plus)}</span>
                </div>
                <div
                  className="tier-segment pro"
                  style={{
                    width: `${(subscriptions?.pro / overview?.totalUsers * 100) || 0}%`
                  }}
                >
                  <span>Pro: {formatNumber(subscriptions?.pro)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          {funnel && (
            <div className="section">
              <h2>Conversion Funnel</h2>
              <div className="funnel-chart">
                <div className="funnel-stage" style={{ width: '100%' }}>
                  <div className="funnel-label">Total Users</div>
                  <div className="funnel-value">{formatNumber(funnel.totalUsers)}</div>
                </div>
                <div
                  className="funnel-stage"
                  style={{ width: `${(funnel.paidUsers / funnel.totalUsers * 100) || 0}%` }}
                >
                  <div className="funnel-label">Paid Users</div>
                  <div className="funnel-value">{formatNumber(funnel.paidUsers)}</div>
                </div>
                <div
                  className="funnel-stage"
                  style={{ width: `${(funnel.plusUsers / funnel.totalUsers * 100) || 0}%` }}
                >
                  <div className="funnel-label">Plus Tier</div>
                  <div className="funnel-value">{formatNumber(funnel.plusUsers)}</div>
                </div>
                <div
                  className="funnel-stage"
                  style={{ width: `${(funnel.proUsers / funnel.totalUsers * 100) || 0}%` }}
                >
                  <div className="funnel-label">Pro Tier</div>
                  <div className="funnel-value">{formatNumber(funnel.proUsers)}</div>
                </div>
              </div>
              <div className="funnel-conversion-rate">
                Overall Conversion Rate: {formatPercent(funnel.conversionRate)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="dashboard-content">
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Free Users</h3>
              <div className="metric-value">{formatNumber(subscriptions?.free)}</div>
            </div>
            <div className="metric-card">
              <h3>Plus Subscribers</h3>
              <div className="metric-value">{formatNumber(subscriptions?.plus)}</div>
              <div className="metric-label">{formatCurrency(subscriptions?.plus * 4.99)}/mo</div>
            </div>
            <div className="metric-card">
              <h3>Pro Subscribers</h3>
              <div className="metric-value">{formatNumber(subscriptions?.pro)}</div>
              <div className="metric-label">{formatCurrency(subscriptions?.pro * 9.99)}/mo</div>
            </div>
            <div className="metric-card highlight">
              <h3>Total MRR</h3>
              <div className="metric-value">{formatCurrency(overview?.mrr)}</div>
            </div>
          </div>

          {/* Churn Analysis */}
          {churn && churn.churnByMonth && churn.churnByMonth.length > 0 && (
            <div className="section">
              <h2>Churn Analysis</h2>
              <div className="churn-stats">
                <div className="stat">
                  <strong>Average Monthly Churn Rate:</strong>{' '}
                  {formatPercent(churn.averageMonthlyChurnRate)}
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Churned</th>
                    <th>Upgrades</th>
                    <th>Downgrades</th>
                    <th>MRR Lost</th>
                    <th>MRR Gained</th>
                  </tr>
                </thead>
                <tbody>
                  {churn.churnByMonth.slice(0, 6).map((row, index) => (
                    <tr key={index}>
                      <td>{new Date(row.month).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</td>
                      <td>{formatNumber(row.churned_users)}</td>
                      <td className="positive">{formatNumber(row.upgrades)}</td>
                      <td className="negative">{formatNumber(row.downgrades)}</td>
                      <td className="negative">{formatCurrency(row.mrr_lost)}</td>
                      <td className="positive">{formatCurrency(row.mrr_gained)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Affiliates Tab */}
      {activeTab === 'affiliates' && (
        <div className="dashboard-content">
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Clicks</h3>
              <div className="metric-value">{formatNumber(overview?.affiliateClicks)}</div>
            </div>
            <div className="metric-card highlight">
              <h3>Affiliate Revenue</h3>
              <div className="metric-value">{formatCurrency(overview?.affiliateRevenue)}</div>
              <div className="metric-label">Last {dateRange} days</div>
            </div>
          </div>

          <div className="section">
            <h2>Top Performing Products</h2>
            {affiliates.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Clicks</th>
                    <th>Conversions</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{formatNumber(product.click_count)}</td>
                      <td>{formatNumber(product.conversion_count)}</td>
                      <td>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No affiliate data available for this period.</p>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="dashboard-content">
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Users</h3>
              <div className="metric-value">{formatNumber(overview?.totalUsers)}</div>
            </div>
            <div className="metric-card">
              <h3>Paid Users</h3>
              <div className="metric-value">{formatNumber(overview?.paidUsers)}</div>
            </div>
            <div className="metric-card">
              <h3>Conversion Rate</h3>
              <div className="metric-value">{formatPercent(overview?.conversionRate)}</div>
            </div>
          </div>

          {/* User Growth Chart */}
          {userGrowth.length > 0 && (
            <div className="section">
              <h2>User Growth Trend</h2>
              <div className="simple-chart">
                {userGrowth.slice(-30).map((day, index) => (
                  <div key={index} className="chart-bar" title={day.date}>
                    <div
                      className="bar-fill"
                      style={{
                        height: `${(day.new_users / Math.max(...userGrowth.map(d => d.new_users)) * 100)}%`
                      }}
                    ></div>
                    <div className="bar-label">{day.new_users}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">Daily new user signups</div>
            </div>
          )}

          {/* Cohort Analysis */}
          {cohorts.length > 0 && (
            <div className="section">
              <h2>Cohort Analysis</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cohort</th>
                    <th>Size</th>
                    <th>Paid at Signup</th>
                    <th>Eventually Paid</th>
                    <th>Avg LTV</th>
                    <th>Churn Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.slice(0, 12).map((cohort, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(cohort.cohort_month).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short'
                        })}
                      </td>
                      <td>{formatNumber(cohort.cohort_size)}</td>
                      <td>{formatNumber(cohort.paid_at_signup)}</td>
                      <td>{formatNumber(cohort.eventually_paid)}</td>
                      <td>{formatCurrency(cohort.avg_ltv)}</td>
                      <td>{formatPercent(cohort.churn_rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="dashboard-content">
          <div className="metrics-grid">
            <div className="metric-card highlight">
              <h3>Total Revenue</h3>
              <div className="metric-value">{formatCurrency(revenue?.totalRevenue)}</div>
              <div className="metric-label">Last {dateRange} days</div>
            </div>
            <div className="metric-card">
              <h3>Subscription Revenue</h3>
              <div className="metric-value">{formatCurrency(revenue?.totalSubscriptionRevenue)}</div>
            </div>
            <div className="metric-card">
              <h3>Affiliate Revenue</h3>
              <div className="metric-value">{formatCurrency(revenue?.totalAffiliateRevenue)}</div>
            </div>
            <div className="metric-card">
              <h3>Current MRR</h3>
              <div className="metric-value">{formatCurrency(revenue?.currentMRR)}</div>
              <div className="metric-label">ARR: {formatCurrency(revenue?.currentARR)}</div>
            </div>
          </div>

          <div className="section">
            <h2>Revenue Breakdown</h2>
            <div className="revenue-breakdown">
              <div className="revenue-source">
                <div className="source-label">Subscription Revenue</div>
                <div className="source-bar">
                  <div
                    className="source-fill subscription"
                    style={{
                      width: `${(revenue?.totalSubscriptionRevenue / revenue?.totalRevenue * 100) || 0}%`
                    }}
                  ></div>
                </div>
                <div className="source-value">{formatCurrency(revenue?.totalSubscriptionRevenue)}</div>
              </div>
              <div className="revenue-source">
                <div className="source-label">Affiliate Revenue</div>
                <div className="source-bar">
                  <div
                    className="source-fill affiliate"
                    style={{
                      width: `${(revenue?.totalAffiliateRevenue / revenue?.totalRevenue * 100) || 0}%`
                    }}
                  ></div>
                </div>
                <div className="source-value">{formatCurrency(revenue?.totalAffiliateRevenue)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
