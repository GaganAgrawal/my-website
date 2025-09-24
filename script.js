// Fade-in effect
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('appear'));
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav ul');
  const authBox = document.querySelector('.nav-auth-box');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      nav.classList.toggle('mobile-menu-open');
      authBox.classList.toggle('mobile-auth-open');
      
      // Update button text
      if (nav.classList.contains('mobile-menu-open')) {
        mobileToggle.innerHTML = '✕';
      } else {
        mobileToggle.innerHTML = '☰';
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav') && !e.target.closest('.nav-auth-box')) {
        nav.classList.remove('mobile-menu-open');
        authBox.classList.remove('mobile-auth-open');
        mobileToggle.innerHTML = '☰';
      }
    });
    
    // Close mobile menu when clicking on a link
    nav.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('mobile-menu-open');
        authBox.classList.remove('mobile-auth-open');
        mobileToggle.innerHTML = '☰';
      }
    });
  }
});