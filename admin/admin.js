// === ADMIN PANEL AUTHENTICATION ===

// Configuration
const ADMIN_CONFIG = {
  username: 'admin',
  defaultPassword: 'admin123',
  sessionKey: 'adminLoggedIn',
  passwordKey: 'adminPassword',
  lastLoginKey: 'adminLastLogin',
  visitCountKey: 'siteVisitCount',
  editorContentKey: 'editorContent'
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

// Switch between sections
function switchSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll('.admin-section');
  sections.forEach(section => section.classList.remove('active'));
  
  // Show target section
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update navigation
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  
  const activeMenuItem = document.querySelector(`[data-section="${sectionName}"]`);
  if (activeMenuItem) {
    activeMenuItem.classList.add('active');
  }
  
  // Update section title
  const sectionTitle = document.getElementById('section-title');
  if (sectionTitle) {
    const titles = {
      'dashboard': 'Dashboard',
      'analytics': 'Analytics',
      'editor': 'Content Editor', 
      'settings': 'Settings'
    };
    sectionTitle.textContent = titles[sectionName] || 'Dashboard';
  }
  
  // Initialize section-specific functionality
  if (sectionName === 'analytics') {
    initAnalytics();
  } else if (sectionName === 'editor') {
    initEditor();
  }
}

// Toggle sidebar (for mobile)
function toggleSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

// === ANALYTICS FUNCTIONS ===

// Initialize analytics section
function initAnalytics() {
  updateAnalyticsData();
  initVisitorChart();
  startRealTimeUpdates();
}

// Update analytics data
function updateAnalyticsData() {
  // Update visit counter
  let visitCount = parseInt(localStorage.getItem(ADMIN_CONFIG.visitCountKey)) || 1247;
  visitCount += Math.floor(Math.random() * 5); // Simulate new visits
  localStorage.setItem(ADMIN_CONFIG.visitCountKey, visitCount.toString());
  
  const visitCounter = document.getElementById('visit-counter');
  if (visitCounter) {
    visitCounter.textContent = visitCount.toLocaleString();
  }
  
  // Update page views
  const pageViews = document.getElementById('page-views');
  if (pageViews) {
    pageViews.textContent = (visitCount * 3.1).toLocaleString();
  }
  
  // Update active users
  const activeUsers = document.getElementById('active-users');
  if (activeUsers) {
    activeUsers.textContent = Math.floor(Math.random() * 20) + 10;
  }
  
  // Update last updated time
  const lastUpdated = document.getElementById('last-updated');
  if (lastUpdated) {
    lastUpdated.textContent = 'Just now';
  }
}

// Initialize visitor chart
function initVisitorChart() {
  const ctx = document.getElementById('visitorChart');
  if (!ctx) return;
  
  // Check if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.log('Chart.js not available, using fallback visualization');
    createFallbackChart(ctx);
    return;
  }
  
  // Check if chart already exists and destroy it
  if (window.visitorChartInstance) {
    window.visitorChartInstance.destroy();
  }
  
  // Generate sample data for the last 7 days
  const data = [];
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    data.push(Math.floor(Math.random() * 200) + 50);
  }
  
  window.visitorChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Daily Visitors',
        data: data,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Fallback chart visualization when Chart.js is not available
function createFallbackChart(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Generate sample data
  const data = [];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    data.push(Math.floor(Math.random() * 150) + 50);
  }
  
  // Chart styling
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  const maxValue = Math.max(...data);
  
  // Draw background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);
  
  // Draw grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  
  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Vertical grid lines
  for (let i = 0; i <= 6; i++) {
    const x = padding + (chartWidth / 6) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }
  
  // Draw line chart
  ctx.strokeStyle = '#667eea';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  for (let i = 0; i < data.length; i++) {
    const x = padding + (chartWidth / 6) * i;
    const y = height - padding - (data[i] / maxValue) * chartHeight;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // Draw data points
  ctx.fillStyle = '#667eea';
  for (let i = 0; i < data.length; i++) {
    const x = padding + (chartWidth / 6) * i;
    const y = height - padding - (data[i] / maxValue) * chartHeight;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Draw labels
  ctx.fillStyle = '#4a5568';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (chartWidth / 6) * i;
    ctx.fillText(labels[i], x, height - 10);
  }
  
  // Draw title
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Daily Visitors (Fallback Chart)', padding, 25);
}

// Start real-time updates
function startRealTimeUpdates() {
  // Update analytics every 30 seconds
  setInterval(updateAnalyticsData, 30000);
}

// === CONTENT EDITOR FUNCTIONS ===

// Initialize content editor
function initEditor() {
  loadEditorContent();
  updatePreview();
}

// Load content into editor
function loadEditorContent() {
  const fileSelector = document.getElementById('file-selector');
  const editor = document.getElementById('content-editor');
  
  if (!fileSelector || !editor) return;
  
  const selectedFile = fileSelector.value;
  const storageKey = `${ADMIN_CONFIG.editorContentKey}_${selectedFile}`;
  const savedContent = localStorage.getItem(storageKey);
  
  if (savedContent) {
    editor.value = savedContent;
  } else {
    // Default content for different files
    const defaultContent = {
      'welcome-message': 'Welcome to our website! This is a demo content editor where you can modify text content. Changes are saved to localStorage for demonstration purposes.',
      'about-content': '# About Us\n\nWe are a modern web development company focused on creating amazing digital experiences. Our team is passionate about technology and innovation.',
      'site-notice': '🔧 **Site Notice**: Our website is currently under development. Some features may be limited during this time.'
    };
    
    editor.value = defaultContent[selectedFile] || 'Start editing your content here...';
  }
  
  updatePreview();
}

// Update content preview
function updatePreview() {
  const editor = document.getElementById('content-editor');
  const preview = document.getElementById('content-preview');
  
  if (!editor || !preview) return;
  
  let content = editor.value;
  
  // Simple markdown-like processing
  content = content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  
  preview.innerHTML = content;
}

// Save editor content
function saveEditorContent() {
  const fileSelector = document.getElementById('file-selector');
  const editor = document.getElementById('content-editor');
  const messageElement = document.getElementById('editor-message');
  
  if (!fileSelector || !editor || !messageElement) return;
  
  const selectedFile = fileSelector.value;
  const content = editor.value;
  const storageKey = `${ADMIN_CONFIG.editorContentKey}_${selectedFile}`;
  
  try {
    localStorage.setItem(storageKey, content);
    showEditorMessage('Content saved successfully!', 'success');
  } catch (error) {
    showEditorMessage('Error saving content. Please try again.', 'error');
  }
}

// Show editor message
function showEditorMessage(message, type) {
  const messageElement = document.getElementById('editor-message');
  if (!messageElement) return;
  
  messageElement.textContent = message;
  messageElement.className = `editor-message ${type}`;
  messageElement.style.display = 'block';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 3000);
}

// === UTILITY FUNCTIONS ===

// Refresh stats
function refreshStats() {
  updateAnalyticsData();
  showToast('Statistics refreshed!');
}

// Show toast notification
function showToast(message) {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #48bb78;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  
  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.remove();
    style.remove();
  }, 3000);
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
  
  // Setup navigation
  setupNavigation();
  
  // Attach logout handlers
  const logoutBtn = document.getElementById('logout-btn');
  const headerLogoutBtn = document.getElementById('header-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener('click', handleLogout);
  }
  
  // Attach password change form handler
  const passwordChangeForm = document.getElementById('password-change-form');
  if (passwordChangeForm) {
    passwordChangeForm.addEventListener('submit', handlePasswordChange);
  }
  
  // Setup editor functionality
  const fileSelector = document.getElementById('file-selector');
  const contentEditor = document.getElementById('content-editor');
  const saveContentBtn = document.getElementById('save-content');
  
  if (fileSelector) {
    fileSelector.addEventListener('change', loadEditorContent);
  }
  
  if (contentEditor) {
    contentEditor.addEventListener('input', updatePreview);
  }
  
  if (saveContentBtn) {
    saveContentBtn.addEventListener('click', saveEditorContent);
  }
  
  // Update welcome message with current time
  updateWelcomeMessage();
  
  // Update last login time
  updateLastLoginTime();
  
  // Initialize dashboard with analytics
  updateAnalyticsData();
  
  // Show default dashboard section
  switchSection('dashboard');
}

// Setup navigation
function setupNavigation() {
  // Navigation menu items
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.getAttribute('data-section');
      if (section) {
        switchSection(section);
      }
    });
  });
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleSidebar);
  }
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('admin-sidebar');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    
    if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('active')) {
      if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    }
  });
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
        Logged in on ${dateString} at ${timeString}
      </small>
    `;
  }
}

// Update last login time
function updateLastLoginTime() {
  const lastLoginElement = document.getElementById('last-login-time');
  if (lastLoginElement) {
    const lastLogin = localStorage.getItem(ADMIN_CONFIG.lastLoginKey);
    if (lastLogin) {
      const date = new Date(lastLogin);
      lastLoginElement.textContent = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
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
  refreshStats: refreshStats
};