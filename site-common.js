/**
 * Shared wiring: footer links, social media, donate button, nav consistency.
 */
function initSiteCommon(data) {
  const org = data.organization;
  const social = data.social_media;
  const programs = data.programs?.main_programs || [];
  const forumUrl = data.annual_forum?.url;
  const donateUrl = getDonateUrl(data);

  // Footer brand description
  document.querySelectorAll('.footer__brand-desc').forEach((el) => {
    el.textContent = org.description_footer;
  });

  // Footer & nav program links
  const programLinks = {
    'footer-agri': findProgramUrl(programs, 'Agri Cohort 2'),
    'footer-ai': findProgramUrl(programs, 'AI+Impact'),
    'footer-women': findProgramUrl(programs, 'Women'),
    'footer-accelerator': findProgramUrl(programs, 'Accelerator'),
  };

  Object.entries(programLinks).forEach(([id, url]) => {
    if (!url) return;
    document.querySelectorAll(`#${id}`).forEach((el) => {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  });

  // Annual forum links
  if (forumUrl) {
    document.querySelectorAll('#footer-forum').forEach((el) => {
      el.href = forumUrl;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  }

  // Footer about/team/partners internal links
  document.querySelectorAll('#footer-about').forEach((el) => {
    if (!el.getAttribute('href') || el.getAttribute('href') === '#') {
      el.href = 'about.html';
    }
  });
  document.querySelectorAll('#footer-team').forEach((el) => {
    if (!el.getAttribute('href') || el.getAttribute('href') === '#') {
      el.href = 'about.html#team';
    }
  });
  document.querySelectorAll('#footer-partners').forEach((el) => {
    if (!el.getAttribute('href') || el.getAttribute('href') === '#') {
      el.href = 'about.html#partners';
    }
  });

  // Social media
  const socialMap = {
    'social-facebook': social.facebook,
    'social-twitter': social.twitter,
    'social-linkedin': social.linkedin,
    'social-youtube': social.youtube,
  };
  Object.entries(socialMap).forEach(([id, url]) => {
    document.querySelectorAll(`#${id}`).forEach((el) => {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });
  });

  // Donate buttons — modal handled by shared-layout; external links for cta-donate
  document.querySelectorAll('#cta-donate').forEach((el) => {
    if (el.tagName === 'BUTTON' || el.tagName === 'A') {
      el.addEventListener('click', (e) => {
        if (el.tagName === 'BUTTON') {
          e.preventDefault();
          window.open(donateUrl, '_blank', 'noopener,noreferrer');
        }
      });
      if (el.tagName === 'A') {
        el.href = donateUrl;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      }
    }
  });

  // Normalize Get Involved nav link
  document.querySelectorAll('#nav-involved').forEach((el) => {
    const href = el.getAttribute('href') || '';
    if (href.includes('get-involved') || href.endsWith('#get-involved')) {
      el.href = 'get-involved.html';
    }
  });

  // Logo links to home
  document.querySelectorAll('.navbar__logo').forEach((el) => {
    if (!el.getAttribute('href') || el.getAttribute('href') === '#') {
      el.href = 'index.html';
    }
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Add light reveal animation to common content blocks.
  document
    .querySelectorAll('.page-section, .section-header, .info-card, .impact__card, .home-provide__card, .get-involved__card, .partner-logos__item, .testimonials__card, .home-forum__content, .home-forum__image, .mission__content, .footer__columns, .footer__newsletter')
    .forEach((el) => el.classList.add('reveal'));

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // Contact info in footer
  const delhi = data.contact?.offices?.find((o) =>
    o.name.toLowerCase().includes('delhi')
  );
  if (delhi) {
    document.querySelectorAll('#footer-email').forEach((el) => {
      el.href = `mailto:${delhi.email}`;
      el.textContent = delhi.email;
    });
    document.querySelectorAll('#footer-phone').forEach((el) => {
      el.href = `tel:${delhi.phone.replace(/\s/g, '')}`;
      el.textContent = delhi.phone;
    });
  }
}

function observeRevealElements(root = document) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  root.querySelectorAll('.reveal:not(.visible)').forEach((el) => revealObserver.observe(el));
}

async function initSite() {
  try {
    const data = await loadSiteData();
    initSiteCommon(data);
    if (typeof initSharedLayout === 'function') {
      initSharedLayout(data);
    }
    if (typeof observeRevealElements === 'function') {
      observeRevealElements(document);
    }
    return data;
  } catch (err) {
    console.error('AFI site data failed to load:', err);
    return null;
  }
}
