// Fade-in effect
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('appear'));
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuContainer = document.querySelector('.mobile-menu-container');
  
  if (mobileToggle && mobileMenuContainer) {
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileMenuContainer.classList.toggle('mobile-menu-open');
      
      // Update button text
      if (mobileMenuContainer.classList.contains('mobile-menu-open')) {
        mobileToggle.innerHTML = '✕';
        mobileToggle.setAttribute('aria-expanded', 'true');
      } else {
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.header-main')) {
        mobileMenuContainer.classList.remove('mobile-menu-open');
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close mobile menu when clicking on a navigation link
    mobileMenuContainer.addEventListener('click', function(e) {
      if (e.target.tagName === 'A' && e.target.closest('nav')) {
        mobileMenuContainer.classList.remove('mobile-menu-open');
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});