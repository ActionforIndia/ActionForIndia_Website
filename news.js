// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Category Filters =====
const filterButtons = document.querySelectorAll('.news-filters__btn');
const featuredCards = document.querySelectorAll('.news-card--featured');
const rowArticles = document.querySelectorAll('.news-row');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    // Update active filter
    filterButtons.forEach((b) => b.classList.remove('news-filters__btn--active'));
    btn.classList.add('news-filters__btn--active');

    // Filter featured cards
    featuredCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('news-card--hidden');
      } else {
        card.classList.add('news-card--hidden');
      }
    });

    // Filter row articles
    rowArticles.forEach((row) => {
      const category = row.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        row.classList.remove('news-row--hidden');
      } else {
        row.classList.add('news-row--hidden');
      }
    });
  });
});

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.news-card--featured, .news-row');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

// Set initial state for reveal animation
revealElements.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  revealObserver.observe(el);
});

// ===== Newsletter Form =====
const newsletterForm = document.getElementById('newsletter-form');
const newsletterBtn = document.getElementById('newsletter-submit');
const newsletterInput = document.getElementById('newsletter-email');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterInput.value.trim();
    if (email) {
      newsletterBtn.textContent = 'Subscribed ✓';
      newsletterBtn.style.background = '#065F46';
      newsletterInput.value = '';
      newsletterInput.disabled = true;
      newsletterBtn.disabled = true;

      setTimeout(() => {
        newsletterBtn.textContent = 'Subscribe';
        newsletterBtn.style.background = '';
        newsletterInput.disabled = false;
        newsletterBtn.disabled = false;
      }, 3000);
    }
  });
}

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('.navbar__nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
