/**
 * Waste2Farm Admin Dashboard — Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderRecentOrders();
  renderUsersTable();
  renderListingsGrid();
  renderOrdersTable();
  renderCitiesGrid();
  initAllCharts();
});

/* ─── Navigation ─── */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('pageTitle');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  const titles = {
    overview: 'Overview',
    users: 'User Management',
    listings: 'Waste Listings',
    orders: 'Order Management',
    analytics: 'Sustainability Analytics',
    revenue: 'Revenue Dashboard',
    cities: 'City Expansion',
  };

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;

      navItems.forEach((n) => n.classList.remove('active'));
      item.classList.add('active');

      sections.forEach((s) => s.classList.remove('active'));
      document.getElementById(`section-${section}`).classList.add('active');

      pageTitle.textContent = titles[section] || 'Dashboard';

      if (window.innerWidth <= 768) sidebar.classList.remove('open');
    });
  });

  menuToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
}

/* ─── Recent Orders ─── */
function renderRecentOrders() {
  const tbody = document.getElementById('recentOrdersBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_ORDERS.slice(0, 5)
    .map((o) => `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${o.buyer}</td>
        <td>${o.type}</td>
        <td>${o.qty}</td>
        <td>${o.amount}</td>
        <td><span class="status ${o.status}">${formatStatus(o.status)}</span></td>
        <td>${o.city}</td>
      </tr>
    `)
    .join('');
}

/* ─── Users Table ─── */
function renderUsersTable(filter = '') {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const users = filter ? MOCK_USERS.filter((u) => u.role === filter) : MOCK_USERS;

  tbody.innerHTML = users
    .map((u) => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="status ${u.role}">${capitalize(u.role)}</span></td>
        <td>${u.city}</td>
        <td>${u.orders}</td>
        <td>⭐ ${u.rating}</td>
        <td><span class="status ${u.isActive ? 'active' : 'inactive'}">${u.isActive ? 'Active' : 'Inactive'}</span></td>
        <td>
          <button class="btn btn-sm" onclick="alert('Edit user: ${u.name}')">Edit</button>
        </td>
      </tr>
    `)
    .join('');

  // Filter handler
  const roleFilter = document.getElementById('userRoleFilter');
  if (roleFilter && !roleFilter.hasListener) {
    roleFilter.hasListener = true;
    roleFilter.addEventListener('change', (e) => renderUsersTable(e.target.value));
  }
}

/* ─── Listings Grid ─── */
function renderListingsGrid() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  grid.innerHTML = MOCK_LISTINGS
    .map((l) => `
      <div class="listing-card">
        <div class="listing-type">${l.type}</div>
        <div class="listing-title">${l.title}</div>
        <div class="listing-meta">
          <span>📦 ${l.qty}</span>
          <span>📍 ${l.city}</span>
          <span>👤 ${l.generator}</span>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:12px;">
          <span class="listing-price">${l.price}</span>
          <span class="status ${l.status}">${capitalize(l.status)}</span>
        </div>
      </div>
    `)
    .join('');
}

/* ─── Orders Table ─── */
function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  tbody.innerHTML = MOCK_ORDERS
    .map((o) => `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${o.buyer}</td>
        <td>${o.generator}</td>
        <td>${o.driver}</td>
        <td>${o.amount}</td>
        <td><span class="status ${o.status}">${formatStatus(o.status)}</span></td>
        <td>${o.date}</td>
        <td><button class="btn btn-sm" onclick="alert('View order #${o.id}')">View</button></td>
      </tr>
    `)
    .join('');
}

/* ─── Cities Grid ─── */
function renderCitiesGrid() {
  const grid = document.getElementById('citiesGrid');
  if (!grid) return;

  grid.innerHTML = MOCK_CITIES
    .map((c) => `
      <div class="city-card">
        <div class="city-name">${c.name}</div>
        <div class="city-status">
          <span class="status ${c.status}">${capitalize(c.status)}</span>
        </div>
        <div class="city-stats">
          <div><div class="city-stat-value">${c.users.toLocaleString()}</div><div class="city-stat-label">Users</div></div>
          <div><div class="city-stat-value">${c.orders.toLocaleString()}</div><div class="city-stat-label">Orders</div></div>
          <div><div class="city-stat-value">${c.waste}</div><div class="city-stat-label">Waste</div></div>
          <div><div class="city-stat-value">${c.revenue}</div><div class="city-stat-label">Revenue</div></div>
        </div>
      </div>
    `)
    .join('');
}

/* ─── Helpers ─── */
function formatStatus(status) {
  return status.split('_').map(capitalize).join(' ');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
