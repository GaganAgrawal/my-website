// === ADMIN PANEL AUTHENTICATION ===

// Configuration
const ADMIN_CONFIG = {
  username: 'admin',
  password: 'admin123',
  sessionKey: 'adminLoggedIn'
};

// === AUTHENTICATION FUNCTIONS ===

// Check if user is authenticated
function isAuthenticated() {
  return localStorage.getItem(ADMIN_CONFIG.sessionKey) === 'true';
}

// Set authentication status
function setAuthenticated(status) {
  if (status) {
    localStorage.setItem(ADMIN_CONFIG.sessionKey, 'true');
  } else {
    localStorage.removeItem(ADMIN_CONFIG.sessionKey);
  }
}

// Validate credentials
function validateCredentials(username, password) {
  return username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password;
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
  
  // Attach logout handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Update welcome message with current time
  updateWelcomeMessage();
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
      Welcome to the admin dashboard!<br>
      <small style="color: #666; font-size: 0.9rem;">
        Logged in on ${dateString} at ${timeString}
      </small>
    `;
  }
}

// === UTILITY FUNCTIONS ===

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
  protectPage: protectDashboard
};