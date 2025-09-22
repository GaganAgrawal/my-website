// Admin Authentication System
// Client-side only authentication for GitHub Pages compatibility

class AdminAuth {
  constructor() {
    this.credentials = {
      username: 'admin',
      password: 'admin123'
    };
    this.sessionKey = 'webloom_admin_session';
    this.init();
  }

  init() {
    // Check if we're on login page
    if (window.location.pathname.includes('/admin/index.html') || window.location.pathname.endsWith('/admin/')) {
      this.initLogin();
    } 
    // Check if we're on dashboard page
    else if (window.location.pathname.includes('/admin/dashboard.html')) {
      this.initDashboard();
    }
  }

  initLogin() {
    // If already logged in, redirect to dashboard
    if (this.isLoggedIn()) {
      this.redirectToDashboard();
      return;
    }

    // Setup login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
  }

  initDashboard() {
    // If not logged in, redirect to login
    if (!this.isLoggedIn()) {
      this.redirectToLogin();
      return;
    }

    // Setup logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Update last access time
    this.updateSession();
  }

  handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('login-message');

    // Clear previous messages
    messageElement.textContent = '';
    messageElement.className = 'form-message';

    // Validate credentials
    if (username === this.credentials.username && password === this.credentials.password) {
      // Success - create session
      this.createSession();
      messageElement.textContent = 'Login successful! Redirecting...';
      messageElement.classList.add('success');
      
      // Redirect after short delay
      setTimeout(() => {
        this.redirectToDashboard();
      }, 1000);
    } else {
      // Failure
      messageElement.textContent = 'Invalid username or password';
      document.getElementById('password').value = ''; // Clear password field
    }
  }

  handleLogout() {
    this.clearSession();
    this.redirectToLogin();
  }

  createSession() {
    const sessionData = {
      loggedIn: true,
      loginTime: Date.now(),
      lastAccess: Date.now()
    };
    localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  updateSession() {
    const sessionData = this.getSessionData();
    if (sessionData) {
      sessionData.lastAccess = Date.now();
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }
  }

  clearSession() {
    localStorage.removeItem(this.sessionKey);
  }

  isLoggedIn() {
    const sessionData = this.getSessionData();
    if (!sessionData || !sessionData.loggedIn) {
      return false;
    }

    // Check if session has expired (24 hours)
    const now = Date.now();
    const sessionAge = now - sessionData.loginTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (sessionAge > maxAge) {
      this.clearSession();
      return false;
    }

    return true;
  }

  getSessionData() {
    try {
      const data = localStorage.getItem(this.sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  redirectToLogin() {
    // Handle different possible admin paths
    const adminPath = this.getAdminPath();
    window.location.href = adminPath + 'index.html';
  }

  redirectToDashboard() {
    // Handle different possible admin paths
    const adminPath = this.getAdminPath();
    window.location.href = adminPath + 'dashboard.html';
  }

  getAdminPath() {
    // Get the current path and determine admin folder location
    const currentPath = window.location.pathname;
    if (currentPath.includes('/admin/')) {
      // We're already in admin folder
      return '/admin/';
    } else {
      // We're likely at root level
      return './admin/';
    }
  }

  // Utility method to get session info for dashboard
  getSessionInfo() {
    const sessionData = this.getSessionData();
    if (sessionData) {
      return {
        loginTime: new Date(sessionData.loginTime).toLocaleString(),
        lastAccess: new Date(sessionData.lastAccess).toLocaleString()
      };
    }
    return null;
  }
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adminAuth = new AdminAuth();
});

// Additional security: Clear session if tab is hidden for too long
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && window.adminAuth) {
    // Tab became visible - check if session is still valid
    if (window.location.pathname.includes('/admin/dashboard.html')) {
      if (!window.adminAuth.isLoggedIn()) {
        window.adminAuth.redirectToLogin();
      }
    }
  }
});