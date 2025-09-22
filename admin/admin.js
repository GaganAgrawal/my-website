// === ADMIN PANEL AUTHENTICATION & DASHBOARD ===

// Configuration
const ADMIN_CONFIG = {
  username: 'admin',
  defaultPassword: 'admin123',
  sessionKey: 'adminLoggedIn',
  passwordKey: 'adminPassword',
  contentKey: 'adminContent',
  visitCountKey: 'adminVisitCount',
  lastLoginKey: 'adminLastLogin'
};

// === AUTHENTICATION FUNCTIONS ===

// Get stored admin password or default
function getAdminPassword() {
  return localStorage.getItem(ADMIN_CONFIG.passwordKey) || ADMIN_CONFIG.defaultPassword;
}

// Set admin password in localStorage
function setAdminPassword(password) {
  localStorage.setItem(ADMIN_CONFIG.passwordKey, password);
}

// Check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem(ADMIN_CONFIG.sessionKey) === 'true';
}

// Set authentication status
function setAuthenticated(status) {
  if (status) {
    localStorage.setItem(ADMIN_CONFIG.sessionKey, 'true');
    localStorage.setItem(ADMIN_CONFIG.lastLoginKey, new Date().toISOString());
  } else {
    localStorage.removeItem(ADMIN_CONFIG.sessionKey);
  }
}

// Validate credentials
function validateCredentials(username, password) {
  return username === ADMIN_CONFIG.username && password === getAdminPassword();
}

// Redirect to login page
function redirectToLogin() {
  window.location.href = '/admin/index.html';
}

// Redirect to dashboard
function redirectToDashboard() {
  window.location.href = '/admin/dashboard.html';
}

// === LOGIN PAGE FUNCTIONS ===

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('error-message');
  
  // Hide previous error
  errorElement.style.display = 'none';
  
  // Validate credentials
  if (validateCredentials(username, password)) {
    // Set authentication
    setAuthenticated(true);
    
    // Increment visit count
    incrementVisitCount();
    
    // Redirect to dashboard
    redirectToDashboard();
  } else {
    // Show error message
    errorElement.textContent = 'Invalid username or password. Please try again.';
    errorElement.style.display = 'block';
    
    // Clear password field
    document.getElementById('password').value = '';
  }
}

// === DASHBOARD PAGE FUNCTIONS ===

// Handle password change
function handlePasswordChange(event) {
  event.preventDefault();
  
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const messageElement = document.getElementById('password-change-message');
  
  // Clear previous messages
  messageElement.style.display = 'none';
  messageElement.className = 'password-change-message';
  
  // Validate current password
  if (currentPassword !== getAdminPassword()) {
    showPasswordMessage('Current password is incorrect.', 'error');
    return;
  }
  
  // Validate new password
  if (newPassword.length < 6) {
    showPasswordMessage('New password must be at least 6 characters long.', 'error');
    return;
  }
  
  // Validate password confirmation
  if (newPassword !== confirmPassword) {
    showPasswordMessage('New password and confirmation do not match.', 'error');
    return;
  }
  
  // Update password
  setAdminPassword(newPassword);
  
  // Clear form
  document.getElementById('password-change-form').reset();
  
  // Show success message
  showPasswordMessage('Password successfully changed!', 'success');
}

// Show password change message
function showPasswordMessage(message, type) {
  const messageElement = document.getElementById('password-change-message');
  messageElement.textContent = message;
  messageElement.className = `password-change-message ${type}`;
  messageElement.style.display = 'block';
  
  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 3000);
  }
}

// Handle logout
function handleLogout() {
  // Clear authentication
  setAuthenticated(false);
  
  // Redirect to login
  redirectToLogin();
}

// Protect dashboard page
function protectDashboard() {
  if (!isAuthenticated()) {
    redirectToLogin();
  }
}

// === NAVIGATION FUNCTIONS ===

// Initialize sidebar navigation
function initNavigation() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.admin-main');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Sidebar toggle functionality
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-collapsed');
    });
  }
  
  // Navigation link handlers
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      switchSection(section);
      
      // Update active nav item
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      link.closest('.nav-item').classList.add('active');
    });
  });
  
  // Mobile responsive sidebar
  if (window.innerWidth <= 768) {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('sidebar-collapsed');
  }
}

// Switch between sections
function switchSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Initialize section-specific functionality
  if (sectionName === 'analytics') {
    initAnalytics();
  } else if (sectionName === 'editor') {
    initEditor();
  }
}

// === ANALYTICS FUNCTIONS ===

let visitorChart, pageViewChart;

function initAnalytics() {
  // Only initialize charts once
  if (visitorChart && pageViewChart) {
    return;
  }
  
  // Wait for next tick to ensure DOM is ready
  setTimeout(() => {
    if (typeof Chart !== 'undefined') {
      // Chart.js is available, use it
      initVisitorChart();
      initPageViewChart();
    } else {
      // Chart.js not available, create fallback
      initFallbackCharts();
    }
  }, 100);
}

function initVisitorChart() {
  const ctx = document.getElementById('visitorChart');
  if (!ctx) return;
  
  const chartCtx = ctx.getContext('2d');
  
  visitorChart = new Chart(chartCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Visitors',
        data: [65, 89, 52, 81, 96, 45, 72],
        borderColor: '#FF6E40',
        backgroundColor: 'rgba(255, 110, 64, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#E2E8F0'
          }
        },
        x: {
          grid: {
            color: '#E2E8F0'
          }
        }
      }
    }
  });
}

function initPageViewChart() {
  const ctx = document.getElementById('pageViewChart');
  if (!ctx) return;
  
  const chartCtx = ctx.getContext('2d');
  
  pageViewChart = new Chart(chartCtx, {
    type: 'bar',
    data: {
      labels: ['Home', 'About', 'Services', 'Portfolio', 'Contact'],
      datasets: [{
        label: 'Page Views',
        data: [320, 150, 200, 180, 90],
        backgroundColor: [
          '#132170',
          '#FF6E40',
          '#48BB78',
          '#4299E1',
          '#9F7AEA'
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#E2E8F0'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function initFallbackCharts() {
  // Create simple HTML-based charts as fallback
  createFallbackVisitorChart();
  createFallbackPageViewChart();
}

function createFallbackVisitorChart() {
  const canvas = document.getElementById('visitorChart');
  if (!canvas) return;
  
  const data = [65, 89, 52, 81, 96, 45, 72];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxValue = Math.max(...data);
  
  canvas.style.display = 'none';
  const container = canvas.parentElement;
  
  const chartHtml = `
    <div class="fallback-chart">
      <div class="chart-title">Visitor Traffic</div>
      <div class="line-chart">
        ${data.map((value, index) => `
          <div class="chart-point" style="left: ${(index / (data.length - 1)) * 100}%; bottom: ${(value / maxValue) * 60}%;">
            <div class="point-dot"></div>
            <div class="point-label">${labels[index]}</div>
            <div class="point-value">${value}</div>
          </div>
        `).join('')}
        <svg class="chart-line" viewBox="0 0 100 60" preserveAspectRatio="none">
          <polyline fill="none" stroke="#FF6E40" stroke-width="2" 
            points="${data.map((value, index) => `${(index / (data.length - 1)) * 100},${60 - (value / maxValue) * 60}`).join(' ')}" />
        </svg>
      </div>
    </div>
  `;
  
  container.innerHTML = chartHtml;
}

function createFallbackPageViewChart() {
  const canvas = document.getElementById('pageViewChart');
  if (!canvas) return;
  
  const data = [320, 150, 200, 180, 90];
  const labels = ['Home', 'About', 'Services', 'Portfolio', 'Contact'];
  const colors = ['#132170', '#FF6E40', '#48BB78', '#4299E1', '#9F7AEA'];
  const maxValue = Math.max(...data);
  
  canvas.style.display = 'none';
  const container = canvas.parentElement;
  
  const chartHtml = `
    <div class="fallback-chart">
      <div class="chart-title">Page Views</div>
      <div class="bar-chart">
        ${data.map((value, index) => `
          <div class="chart-bar" style="height: ${(value / maxValue) * 80}%; background-color: ${colors[index]};">
            <div class="bar-value">${value}</div>
            <div class="bar-label">${labels[index]}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = chartHtml;
}

// === EDITOR FUNCTIONS ===

function initEditor() {
  loadSavedContent();
}

function formatText(command) {
  const editor = document.getElementById('content-editor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  
  let formattedText = '';
  
  switch (command) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `*${selectedText}*`;
      break;
    case 'underline':
      formattedText = `<u>${selectedText}</u>`;
      break;
  }
  
  if (formattedText) {
    editor.value = editor.value.substring(0, start) + formattedText + editor.value.substring(end);
    editor.focus();
    editor.setSelectionRange(start + formattedText.length, start + formattedText.length);
  }
}

function insertHeading() {
  const editor = document.getElementById('content-editor');
  const start = editor.selectionStart;
  const heading = '## ';
  
  editor.value = editor.value.substring(0, start) + heading + editor.value.substring(start);
  editor.focus();
  editor.setSelectionRange(start + heading.length, start + heading.length);
}

function insertLink() {
  const editor = document.getElementById('content-editor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  const linkText = selectedText || 'Link Text';
  const linkMarkdown = `[${linkText}](https://example.com)`;
  
  editor.value = editor.value.substring(0, start) + linkMarkdown + editor.value.substring(end);
  editor.focus();
  editor.setSelectionRange(start + 1, start + 1 + linkText.length);
}

function insertList() {
  const editor = document.getElementById('content-editor');
  const start = editor.selectionStart;
  const listItem = '- List item\n';
  
  editor.value = editor.value.substring(0, start) + listItem + editor.value.substring(start);
  editor.focus();
  editor.setSelectionRange(start + 2, start + 2 + 'List item'.length);
}

function saveContent() {
  const editor = document.getElementById('content-editor');
  const content = editor.value;
  const statusElement = document.getElementById('save-status');
  
  // Save to localStorage
  localStorage.setItem(ADMIN_CONFIG.contentKey, content);
  
  // Update status
  statusElement.textContent = 'Saved successfully!';
  statusElement.style.color = '#38A169';
  
  // Reset status after 2 seconds
  setTimeout(() => {
    statusElement.textContent = 'Ready';
    statusElement.style.color = '#718096';
  }, 2000);
}

function loadSavedContent() {
  const editor = document.getElementById('content-editor');
  const savedContent = localStorage.getItem(ADMIN_CONFIG.contentKey);
  
  if (savedContent && editor) {
    editor.value = savedContent;
  }
}

function previewContent() {
  const editor = document.getElementById('content-editor');
  const content = editor.value;
  
  // Simple preview - you could enhance this with a proper markdown parser
  const previewWindow = window.open('', '_blank');
  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Content Preview</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #132170; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <pre>${content}</pre>
    </body>
    </html>
  `);
  previewWindow.document.close();
}

// === STATISTICS & DATA FUNCTIONS ===

function incrementVisitCount() {
  const currentCount = parseInt(localStorage.getItem(ADMIN_CONFIG.visitCountKey) || '1247');
  const newCount = currentCount + 1;
  localStorage.setItem(ADMIN_CONFIG.visitCountKey, newCount.toString());
}

function refreshStats() {
  // Simulate refreshing stats
  const visitElement = document.getElementById('visit-count');
  const userElement = document.getElementById('user-count');
  
  if (visitElement) {
    const currentCount = parseInt(localStorage.getItem(ADMIN_CONFIG.visitCountKey) || '1247');
    visitElement.textContent = currentCount.toLocaleString();
  }
  
  if (userElement) {
    // Simulate random user count
    const userCount = Math.floor(Math.random() * 100) + 300;
    userElement.textContent = userCount.toLocaleString();
  }
  
  // Show refresh feedback
  const refreshBtn = event.target;
  const originalText = refreshBtn.innerHTML;
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
  refreshBtn.disabled = true;
  
  setTimeout(() => {
    refreshBtn.innerHTML = originalText;
    refreshBtn.disabled = false;
  }, 1500);
}

function clearAllSessions() {
  if (confirm('Are you sure you want to clear all sessions? This will log you out.')) {
    localStorage.removeItem(ADMIN_CONFIG.sessionKey);
    localStorage.removeItem(ADMIN_CONFIG.lastLoginKey);
    redirectToLogin();
  }
}

// === PAGE INITIALIZATION ===

// Initialize login page
function initLoginPage() {
  // If already authenticated, redirect to dashboard
  if (isAuthenticated()) {
    redirectToDashboard();
    return;
  }
  
  // Attach login form handler
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Focus on username field
  const usernameField = document.getElementById('username');
  if (usernameField) {
    usernameField.focus();
  }
}

// Initialize dashboard page
function initDashboardPage() {
  // Protect the page
  protectDashboard();
  
  // Initialize navigation
  initNavigation();
  
  // Attach logout handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Attach password change form handler
  const passwordChangeForm = document.getElementById('password-change-form');
  if (passwordChangeForm) {
    passwordChangeForm.addEventListener('submit', handlePasswordChange);
  }
  
  // Update welcome message with current time
  updateWelcomeMessage();
  
  // Update last login display
  updateLastLogin();
  
  // Load initial stats
  refreshStats();
  
  // Initialize editor auto-save
  const editor = document.getElementById('content-editor');
  if (editor) {
    editor.addEventListener('input', debounce(() => {
      const statusElement = document.getElementById('save-status');
      statusElement.textContent = 'Auto-saving...';
      statusElement.style.color = '#4299E1';
      
      setTimeout(() => {
        saveContent();
      }, 500);
    }, 1000));
  }
}

// Update welcome message with current time
function updateWelcomeMessage() {
  const welcomeText = document.getElementById('welcome-text');
  if (welcomeText) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    welcomeText.innerHTML = `
      Welcome to your professional admin dashboard!<br>
      <small style="color: #718096; font-size: 0.9rem;">
        Last login: ${dateString} at ${timeString}
      </small>
    `;
  }
}

function updateLastLogin() {
  const lastLoginElement = document.getElementById('last-login');
  if (lastLoginElement) {
    const lastLogin = localStorage.getItem(ADMIN_CONFIG.lastLoginKey);
    if (lastLogin) {
      const date = new Date(lastLogin);
      lastLoginElement.textContent = date.toLocaleDateString();
    }
  }
}

// === UTILITY FUNCTIONS ===

// Debounce function for auto-save
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if we're on login page
function isLoginPage() {
  return window.location.pathname.includes('/admin/index.html') || 
         window.location.pathname.endsWith('/admin/') ||
         window.location.pathname.endsWith('/admin');
}

// Check if we're on dashboard page  
function isDashboardPage() {
  return window.location.pathname.includes('/admin/dashboard.html');
}

// === AUTO-INITIALIZATION ===

// Initialize appropriate page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Determine which page we're on and initialize accordingly
  if (isLoginPage()) {
    initLoginPage();
  } else if (isDashboardPage()) {
    initDashboardPage();
  }
});

// === GLOBAL ACCESS FOR MANUAL CALLS ===
// Export functions for manual access if needed
window.adminPanel = {
  login: handleLogin,
  logout: handleLogout,
  isAuthenticated: isAuthenticated,
  protectPage: protectDashboard,
  switchSection: switchSection,
  refreshStats: refreshStats,
  saveContent: saveContent
};