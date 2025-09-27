/* ===========================================================
   Webloom Professional Website JS (Animated)
   Author: GaganAgrawal
   Last Updated: 2025-09-25
=========================================================== */

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

/* ===== 1. Section Fade-in/Scroll-triggered Animation ===== */
document.addEventListener("DOMContentLoaded", function() {
  // IntersectionObserver for fade-in/slide-in classes
  const animatedEls = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
  if ('IntersectionObserver' in window) {
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.17 });
    animatedEls.forEach(el => observer.observe(el));
  } else {
    // fallback for old browsers
    animatedEls.forEach(el => el.classList.add('appear'));
  }

  /* ===== 2. Animated Info Strip: Infinite Horizontal Scroll ===== */
  const infoTrack = document.querySelector('.info-strip-track');
  if(infoTrack) {
    // Infinite loop by duplicating cards for seamless scroll
    const cards = Array.from(infoTrack.children);
    if(cards.length && cards.length <= 6) {
      cards.forEach(card => infoTrack.appendChild(card.cloneNode(true)));
    }
    // Pause/resume animation on hover
    infoTrack.addEventListener('mouseenter', ()=> infoTrack.style.animationPlayState = 'paused');
    infoTrack.addEventListener('mouseleave', ()=> infoTrack.style.animationPlayState = 'running');
  }

  /* ===== 3. Button Ripple Effect ===== */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      let oldRipple = this.querySelector('.ripple');
      if (oldRipple) oldRipple.remove();
      let ripple = document.createElement('span');
      ripple.className = 'ripple';
      this.appendChild(ripple);
      let rect = this.getBoundingClientRect();
      let size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      setTimeout(()=>{ripple.remove();}, 600);
    });
  });

  /* ===== 4. Staggered Cards Animation (for about grid/cards) ===== */
  const staggeredSections = [
    ...document.querySelectorAll('.about-cards-grid, .cards-row, .testimonial-row')
  ];
  staggeredSections.forEach(section => {
    let children = section.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.animationDelay = (0.08 * i + 0.2) + 's';
    }
  });
});

/* ===== 5. Button Ripple CSS (Inject if not in CSS) ===== */
(function(){
  const rippleStyleId = "we-bloom-ripple-style";
  if(!document.getElementById(rippleStyleId)){
    const style = document.createElement('style');
    style.id = rippleStyleId;
    style.innerHTML = `
      .ripple {
        position: absolute;
        background: rgba(255,110,64,0.18);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple-effect .55s cubic-bezier(0,0,.2,1) forwards;
        z-index: 2;
      }
      @keyframes ripple-effect {
        to { transform: scale(2.4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();
      }
      .btn { position: relative; overflow: hidden; }
    `;
    document.head.appendChild(style);
  }
})();
