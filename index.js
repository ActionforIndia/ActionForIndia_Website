// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
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

// ===== Stats Counter Animation =====
const statsSection = document.getElementById('stats-bar');
let statsCounted = false;

function animateCounters() {
  if (statsCounted) return;
  statsCounted = true;

  const statValues = statsSection.querySelectorAll('.stats-bar__value');
  statValues.forEach((el) => {
    const display = el.getAttribute('data-display');
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      if (currentStep >= steps) {
        el.textContent = display;
        clearInterval(interval);
      } else {
        // Show a random-ish intermediate value
        const chars = display.split('');
        const result = chars.map((c) => {
          if (/\d/.test(c)) {
            if (easedProgress < 0.8) {
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

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

// ===== Testimonial Dots Interaction =====
const testimonials = [
  {
    quote: 'AFI has been instrumental in bridging the gap for social enterprises, connecting us with the right investors and mentors.',
    name: 'Sombhodi Ghosh',
    role: 'Aakar Innovations',
    initials: 'SG'
  },
  {
    quote: 'The mentorship program transformed our approach to scaling impact. We went from serving 500 to 50,000 beneficiaries in just two years.',
    name: 'Priya Sharma',
    role: 'EduBridge Foundation',
    initials: 'PS'
  },
  {
    quote: 'Action For India provided the network and resources that allowed us to attract our first round of impact investment.',
    name: 'Rajiv Mehta',
    role: 'AgriGrow Technologies',
    initials: 'RM'
  }
];

const dots = document.querySelectorAll('.testimonials__dot');
const quoteText = document.getElementById('testimonial-quote');
const authorName = document.getElementById('testimonial-author-name');
const authorRole = document.getElementById('testimonial-author-role');
const avatar = document.getElementById('testimonial-avatar');

let currentTestimonial = 0;

function updateTestimonial(index) {
  const card = document.getElementById('testimonials-card');
  card.style.opacity = '0';
  card.style.transform = 'translateY(10px)';

  setTimeout(() => {
    const t = testimonials[index];
    quoteText.textContent = t.quote;
    authorName.textContent = t.name;
    authorRole.textContent = t.role;
    avatar.textContent = t.initials;

    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 300);

  dots.forEach((dot, i) => {
    dot.className = 'testimonials__dot ' +
      (i === index ? 'testimonials__dot--active' : 'testimonials__dot--inactive');
  });

  currentTestimonial = index;
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    updateTestimonial(i);
  });
});

// Auto-rotate testimonials every 5 seconds
setInterval(() => {
  const next = (currentTestimonial + 1) % testimonials.length;
  updateTestimonial(next);
}, 5000);

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

// ===== Impact Card Stagger Animation =====
const impactCards = document.querySelectorAll('.impact__card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

impactCards.forEach((card) => cardObserver.observe(card));
