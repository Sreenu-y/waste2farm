/**
 * Chart.js configurations for the admin dashboard
 */

const chartDefaults = {
  color: '#8899aa',
  borderColor: '#1e2a3a',
  font: { family: 'Inter' },
};

Chart.defaults.color = chartDefaults.color;
Chart.defaults.borderColor = chartDefaults.borderColor;
Chart.defaults.font.family = chartDefaults.font.family;

function initOrdersChart() {
  const ctx = document.getElementById('ordersChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: CHART_MONTHS,
      datasets: [
        {
          label: 'Orders',
          data: CHART_DATA.orders,
          backgroundColor: 'rgba(13, 159, 79, 0.6)',
          borderColor: '#0d9f4f',
          borderWidth: 1,
          borderRadius: 6,
          yAxisID: 'y',
        },
        {
          label: 'Revenue (₹)',
          data: CHART_DATA.revenue,
          type: 'line',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6',
          yAxisID: 'y2',
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'top' } },
      scales: {
        y: { position: 'left', grid: { color: 'rgba(30,42,58,0.5)' }, title: { display: true, text: 'Orders' } },
        y2: {
          position: 'right', grid: { display: false },
          title: { display: true, text: 'Revenue (₹)' },
          ticks: { callback: (v) => '₹' + (v / 1000) + 'K' },
        },
      },
    },
  });
}

function initWasteTypeChart() {
  const ctx = document.getElementById('wasteTypeChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Vegetable', 'Fruit', 'Food', 'Garden', 'Dairy', 'Other'],
      datasets: [{
        data: Object.values(CHART_DATA.wasteTypes),
        backgroundColor: ['#0d9f4f', '#3b82f6', '#f59e0b', '#14b8a6', '#8b5cf6', '#ef4444'],
        borderColor: '#161d27',
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'right', labels: { padding: 16 } },
      },
    },
  });
}

function initWasteCollectionChart() {
  const ctx = document.getElementById('wasteCollectionChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: CHART_MONTHS,
      datasets: [{
        label: 'Waste Collected (tons)',
        data: CHART_DATA.wasteCollected,
        borderColor: '#0d9f4f',
        backgroundColor: 'rgba(13, 159, 79, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#12c760',
        pointBorderColor: '#161d27',
        pointBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      scales: { y: { grid: { color: 'rgba(30,42,58,0.5)' } } },
    },
  });
}

function initCarbonChart() {
  const ctx = document.getElementById('carbonChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: CHART_MONTHS,
      datasets: [{
        label: 'Carbon Saved (tons CO₂)',
        data: CHART_DATA.carbonSaved,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#161d27',
        pointBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      scales: { y: { grid: { color: 'rgba(30,42,58,0.5)' } } },
    },
  });
}

function initRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: CHART_MONTHS,
      datasets: [
        {
          label: 'Waste Sales',
          data: CHART_DATA.revenue.map((v) => v * 0.7),
          backgroundColor: 'rgba(13, 159, 79, 0.7)',
          borderRadius: 4,
          stack: 'revenue',
        },
        {
          label: 'Delivery Fees',
          data: CHART_DATA.revenue.map((v) => v * 0.2),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderRadius: 4,
          stack: 'revenue',
        },
        {
          label: 'Platform Fees',
          data: CHART_DATA.revenue.map((v) => v * 0.1),
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          borderRadius: 4,
          stack: 'revenue',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          stacked: true,
          grid: { color: 'rgba(30,42,58,0.5)' },
          ticks: { callback: (v) => '₹' + (v / 1000) + 'K' },
        },
        x: { stacked: true },
      },
    },
  });
}

function initAllCharts() {
  initOrdersChart();
  initWasteTypeChart();
  initWasteCollectionChart();
  initCarbonChart();
  initRevenueChart();
}
