// ===== Data-driven content =====
let testimonialsData = [];
let currentTestimonial = 0;

const SECTOR_ICON = {
  Education: 'graduation-cap',
  Healthcare: 'heart-pulse',
  Agriculture: 'wheat',
  Energy: 'zap',
  Livelihoods: 'briefcase-business',
  'Financial Inclusion': 'indian-rupee',
};

const SECTOR_COLOR_CLASS = ['red', 'orange', 'orange', 'red', 'orange', 'red'];

async function populateHomePage(data) {
  const org = data.organization;
  const banner = data.banner_images?.[0];

  // Hero
  if (banner) {
    const badge = document.getElementById('hero-badge');
    if (badge) {
      badge.querySelector('.hero__badge-text').textContent = `Applications Open — ${banner.name}`;
    }
  }

  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    heroTitle.innerHTML = `Since ${org.founded}, <em>Action For India</em> Has Been Scaling High-Potential Social Entrepreneurs`;
  }

  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroSubtitle) {
    heroSubtitle.textContent = org.mission_statement;
  }

  // Hero images from scraped about/banner URLs
  const heroImages = [
    data.about_page_images?.[0],
    data.about_page_images?.[1],
    data.about_page_images?.[2],
    data.about_page_images?.[3],
  ].filter(Boolean);
  document.querySelectorAll('.hero__image-item img').forEach((img, i) => {
    if (heroImages[i]) img.src = heroImages[i];
  });

  const missionImg = document.querySelector('.mission__image img');
  if (missionImg && data.initiatives_image) {
    missionImg.src = data.initiatives_image;
    missionImg.alt = 'AFI Initiatives';
  }

  const impactImg = document.getElementById('impact-infographic');
  if (impactImg && data.impact_image) impactImg.src = data.impact_image;

  // Mission
  const missionDesc = document.getElementById('mission-desc');
  if (missionDesc) {
    missionDesc.textContent = `Founded in ${org.founded}, ${org.description_footer.split('.')[0]}.`;
  }

  const missionTitle = document.getElementById('mission-title');
  if (missionTitle) {
    missionTitle.textContent = org.tagline;
  }

  const pillars = document.getElementById('mission-pillars');
  if (pillars && data.value_propositions) {
    pillars.innerHTML = data.value_propositions
      .map((vp, i) => {
        const color = i % 2 === 0 ? 'red' : 'orange';
        return `
          <div class="mission__pillar">
            <div class="mission__pillar-bar mission__pillar-bar--${color}"></div>
            <div>
              <div class="mission__pillar-title mission__pillar-title--${color}">${vp.title}</div>
              <div class="mission__pillar-desc">${vp.description}</div>
            </div>
          </div>`;
      })
      .join('');
  }

  const missionLink = document.getElementById('mission-link');
  if (missionLink) missionLink.href = 'about.html';

  // Impact areas grid
  const impactGrid = document.getElementById('impact-grid');
  if (impactGrid && data.impact_areas) {
    impactGrid.innerHTML = data.impact_areas
      .map((area, i) => {
        const color = SECTOR_COLOR_CLASS[i % SECTOR_COLOR_CLASS.length];
        const iconClass = color === 'red' ? 'pink' : 'peach';
        return `
          <div class="impact__card reveal">
            <div class="impact__card-icon impact__card-icon--${iconClass}"><i data-lucide="${SECTOR_ICON[area.sector] || 'sparkles'}" aria-hidden="true"></i></div>
            <h3 class="impact__card-title impact__card-title--${color}">${area.sector}</h3>
            <p class="impact__card-desc">${area.impact_stat}</p>
          </div>`;
      })
      .join('');
    impactGrid.querySelectorAll('.impact__card').forEach((card) => {
      cardObserver.observe(card);
    });
  }

  const impactReportBtn = document.getElementById('impact-report-btn');
  if (impactReportBtn) {
    impactReportBtn.addEventListener('click', () => {
      window.location.href = 'impact.html';
    });
  }

  // Annual forum
  const forum = data.annual_forum;
  if (forum) {
    const forumTitle = document.getElementById('forum-title');
    const forumDesc = document.getElementById('forum-desc');
    const forumCta = document.getElementById('forum-cta');
    const forumImage = document.getElementById('forum-image');
    if (forumTitle) forumTitle.textContent = forum.current_edition;
    if (forumDesc) forumDesc.textContent = forum.description;
    if (forumCta) forumCta.href = 'forum.html';
    if (forumImage) forumImage.src = forum.banner_url;
  }

  // What we provide
  const provideGrid = document.getElementById('provide-grid');
  if (provideGrid && data.what_we_provide) {
    provideGrid.innerHTML = data.what_we_provide
      .map(
        (item) => `
        <div class="home-provide__card reveal">
          <h3 class="home-provide__card-title">${item.title}</h3>
          <p class="home-provide__card-desc">${item.description}</p>
        </div>`
      )
      .join('');
  }

  // Partners
  const partnersGroups = document.getElementById('partners-groups');
  if (partnersGroups) {
    renderPartnerGroups(partnersGroups, data, { reveal: true });
  }

  // Testimonials — all 7 from scraped data
  testimonialsData = data.testimonials.map((t) => ({
    quote: t.quote,
    name: formatPersonName(t.name),
    role: t.title,
    initials: getInitials(formatPersonName(t.name)),
  }));
  initTestimonials();

  // Get involved links
  const roles = data.get_involved?.roles || [];
  const entrepreneur = roles.find((r) => r.role === 'Social Entrepreneur');
  const mentor = roles.find((r) => r.role === 'Mentor');
  const investor = roles.find((r) => r.role === 'Investor');
  const partner = roles.find((r) => r.role === 'Partner');
  const donor = roles.find((r) => r.role === 'Donor');

  if (entrepreneur) {
    const card = document.getElementById('card-entrepreneur');
    if (card) {
      card.querySelector('.get-involved__card-desc').textContent = entrepreneur.description;
    }
    const link = document.getElementById('link-apply');
    if (link) {
      link.href = entrepreneur.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    const applyBtn = document.getElementById('apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => window.open(entrepreneur.url, '_blank'));
    }
  }

  if (mentor) {
    const card = document.getElementById('card-mentor');
    if (card) card.querySelector('.get-involved__card-desc').textContent = mentor.description;
    const link = document.getElementById('link-mentor');
    if (link) {
      link.href = mentor.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }

  if (investor) {
    const card = document.getElementById('card-investor');
    if (card) card.querySelector('.get-involved__card-desc').textContent = investor.description;
    const link = document.getElementById('link-invest');
    if (link) {
      link.href = investor.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }

  if (partner) {
    const link = document.getElementById('link-partner');
    if (link) {
      link.href = partner.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }

  if (donor) {
    const link = document.getElementById('link-donate');
    if (link) {
      link.href = donor.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }

  const impactBtn = document.getElementById('impact-btn');
  if (impactBtn) {
    impactBtn.addEventListener('click', () => {
      window.location.href = 'impact.html';
    });
  }
}

function initTestimonials() {
  const dotsContainer = document.getElementById('testimonials-dots');
  if (!dotsContainer || !testimonialsData.length) return;

  dotsContainer.innerHTML = testimonialsData
    .map(
      (_, i) =>
        `<div class="testimonials__dot ${i === 0 ? 'testimonials__dot--active' : 'testimonials__dot--inactive'}" data-index="${i}"></div>`
    )
    .join('');

  const dots = dotsContainer.querySelectorAll('.testimonials__dot');
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      updateTestimonial(parseInt(dot.getAttribute('data-index'), 10));
    });
  });

  updateTestimonial(0);

  setInterval(() => {
    const next = (currentTestimonial + 1) % testimonialsData.length;
    updateTestimonial(next);
  }, 6000);
}

function updateTestimonial(index) {
  const card = document.getElementById('testimonials-card');
  const quoteText = document.getElementById('testimonial-quote');
  const authorName = document.getElementById('testimonial-author-name');
  const authorRole = document.getElementById('testimonial-author-role');
  const avatar = document.getElementById('testimonial-avatar');
  const dots = document.querySelectorAll('.testimonials__dot');

  if (!card || !testimonialsData[index]) return;

  card.style.opacity = '0';
  card.style.transform = 'translateY(10px)';

  setTimeout(() => {
    const t = testimonialsData[index];
    quoteText.textContent = t.quote;
    authorName.textContent = t.name;
    authorRole.textContent = t.role;
    avatar.textContent = t.initials;
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 300);

  dots.forEach((dot, i) => {
    dot.className =
      'testimonials__dot ' + (i === index ? 'testimonials__dot--active' : 'testimonials__dot--inactive');
  });

  currentTestimonial = index;
}

// ===== Navbar Scroll Effect — handled by site-common.js =====

// ===== Scroll Reveal — initial elements handled by site-common.js =====

// ===== Stats Counter Animation =====
const statsSection = document.getElementById('stats-bar');
let statsCounted = false;

function animateCounters() {
  if (statsCounted || !statsSection) return;
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
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      if (currentStep >= steps) {
        el.textContent = display;
        clearInterval(interval);
      } else {
        const chars = display.split('');
        const result = chars
          .map((c) => {
            if (/\d/.test(c)) {
              if (easedProgress < 0.8) {
                return Math.floor(Math.random() * 10).toString();
              }
              return c;
            }
            return c;
          })
          .join('');
        el.textContent = result;
      }
    }, stepTime);
  });
}

if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  statsObserver.observe(statsSection);
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

// ===== Impact Card Stagger Animation =====
const impactCards = document.querySelectorAll('.impact__card');
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

impactCards.forEach((card) => cardObserver.observe(card));

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  const data = await initSite();
  if (data) {
    populateHomePage(data);
    observeRevealElements();
    if (typeof refreshLucideIcons === 'function') {
      refreshLucideIcons();
    }
  }
});
