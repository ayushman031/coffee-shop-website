// =============================================
//  CHAI & BREW — MAIN JAVASCRIPT
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar Scroll Effect ----
  const nav = document.getElementById('mainNav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // ---- Back to Top ----
  const btn = document.getElementById('backToTop');
  if (btn) {
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('.counter');
  const runCounter = (el) => {
    const target = +el.dataset.target;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString('en-IN') + (target >= 1000 ? '+' : '');
    }, 16);
  };
  if (counters.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  // ---- Fade-up Animation ----
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 100);
          fadeObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => fadeObs.observe(el));
  }

  // ---- Newsletter Form Validation ----
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const errorEl = document.getElementById('newsletterError');
      const val = emailInput.value.trim();
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        errorEl.textContent = 'Please enter your email address.';
        emailInput.classList.add('is-invalid');
      } else if (!emailReg.test(val)) {
        errorEl.textContent = 'Please enter a valid email address.';
        emailInput.classList.add('is-invalid');
      } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        errorEl.textContent = '';
        showToast('🎉 Subscribed! Check your inbox for your 10% off coupon.', 'success');
        nlForm.reset();
        emailInput.classList.remove('is-valid');
      }
    });
  }

  // ---- Contact Form Validation ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let valid = true;
      const fields = contactForm.querySelectorAll('[required]');
      fields.forEach(field => {
        const val = field.value.trim();
        if (!val) {
          field.classList.add('is-invalid'); valid = false;
        } else if (field.type === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            field.classList.add('is-invalid'); valid = false;
          } else field.classList.remove('is-invalid');
        } else if (field.name === 'phone') {
          if (!/^[6-9]\d{9}$/.test(val)) {
            field.classList.add('is-invalid'); valid = false;
          } else field.classList.remove('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });
      if (valid) {
        showToast('✅ Message sent! We\'ll get back to you within 24 hours.', 'success');
        contactForm.reset();
      }
    });
    // Live validation
    contactForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('is-invalid'));
    });
  }

  // ---- Reservation Form Validation ----
  const resForm = document.getElementById('reservationForm');
  if (resForm) {
    // Set min date to today
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
    resForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let valid = true;
      const fields = resForm.querySelectorAll('[required]');
      fields.forEach(field => {
        const val = field.value.trim();
        if (!val) { field.classList.add('is-invalid'); valid = false; }
        else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          field.classList.add('is-invalid'); valid = false;
        } else if (field.name === 'phone' && !/^[6-9]\d{9}$/.test(val)) {
          field.classList.add('is-invalid'); valid = false;
        } else { field.classList.remove('is-invalid'); }
      });
      if (valid) {
        showToast('🎊 Reservation confirmed! Check your email/WhatsApp for details.', 'success');
        resForm.reset();
        // Reset step indicator
        document.querySelectorAll('.step').forEach((s, i) => s.classList.toggle('active', i === 0));
      }
    });
    resForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('is-invalid'));
    });
  }

  // ---- Menu Filter ----
  const filterTabs = document.querySelectorAll('.filter-tab');
  if (filterTabs.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        document.querySelectorAll('.menu-section').forEach(section => {
          if (filter === 'all' || section.dataset.category === filter) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Gallery Lightbox ----
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      const lightbox = document.createElement('div');
      lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
      lightbox.innerHTML = `<img src="${imgSrc}" style="max-width:90%;max-height:90vh;border-radius:12px;object-fit:contain;" alt="Gallery">
        <button style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.2);border:none;color:white;font-size:28px;width:50px;height:50px;border-radius:50%;cursor:pointer;">×</button>`;
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      lightbox.addEventListener('click', () => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
      });
    });
  });

  // ---- Toast Notification ----
  window.showToast = (msg, type = 'success') => {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: ${type === 'success' ? '#2ECC71' : '#E74C3C'};
      color: white; padding: 16px 30px; border-radius: 50px;
      font-family: 'Roboto', sans-serif; font-weight: 600; font-size: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 99999;
      opacity: 0; transition: all 0.4s ease; max-width: 90vw; text-align: center;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // ---- Active Nav Link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
    else link.classList.remove('active');
  });

});
