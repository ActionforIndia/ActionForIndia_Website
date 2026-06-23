// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Programs Tabs =====
const tabButtons = document.querySelectorAll('.programs-tabs__btn');
const panels = document.querySelectorAll('.programs-panel');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');

    // Update active tab button
    tabButtons.forEach((b) => b.classList.remove('programs-tabs__btn--active'));
    btn.classList.add('programs-tabs__btn--active');

    // Show matching panel with animation
    panels.forEach((panel) => {
      if (panel.getAttribute('data-panel') === target) {
        panel.classList.add('programs-panel--active');
        // Re-trigger animation
        panel.style.animation = 'none';
        panel.offsetHeight; // force reflow
        panel.style.animation = '';
      } else {
        panel.classList.remove('programs-panel--active');
      }
    });
  });
});

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach((el) => revealObserver.observe(el));

// ===== Forum Stats Counter Animation =====
const forumStats = document.getElementById('forum-stats');
let forumCounted = false;

function animateForumStats() {
  if (forumCounted) return;
  forumCounted = true;

  const statValues = forumStats.querySelectorAll('.forum__stat-value');
  statValues.forEach((el) => {
    const finalText = el.textContent;
    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      if (currentStep >= steps) {
        el.textContent = finalText;
        clearInterval(interval);
      } else {
        const chars = finalText.split('');
        const result = chars.map((c) => {
          if (/\d/.test(c)) {
            if (easedProgress < 0.75) {
              return Math.floor(Math.random() * 10).toString();
            }
            return c;
          }
          return c;
        }).join('');
        el.textContent = result;
      }
    }, stepTime);
  });
}

const forumObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateForumStats();
      forumObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (forumStats) {
  forumObserver.observe(forumStats);
}

// ===== Resource Cards Stagger Animation =====
const resourceCards = document.querySelectorAll('.resources__card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 120);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

resourceCards.forEach((card) => cardObserver.observe(card));

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
