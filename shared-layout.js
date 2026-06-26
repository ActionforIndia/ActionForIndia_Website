/**
 * Shared layout: mega-menu nav, footer newsletter, modals, analytics, carousel, logos.
 */
const NAV_MENU = [
  { label: 'Home', href: 'index.html', page: 'home' },
  {
    label: 'Get to Know Us',
    children: [
      { label: 'About Us', href: 'about.html' },
      { label: 'People', href: 'about.html#team' },
      { label: 'Our Social Entrepreneurs', href: 'entrepreneurs.html' },
      { label: 'Our Mentors', href: 'mentors.html' },
      { label: 'Our Partners', href: 'about.html#partners' },
      { label: 'International Chapters', href: 'chapters.html' },
    ],
  },
  {
    label: 'What We Do',
    children: [
      { label: 'All Programs', href: 'programs.html' },
      { label: 'Agri Cohort 2.0', href: 'program-detail.html?id=agri-2' },
      { label: 'AI+Impact Cohort', href: 'program-detail.html?id=ai-impact' },
      { label: 'Impact Catalyzer', href: 'program-detail.html?id=catalyzer' },
      { label: 'Women Entrepreneurship', href: 'program-detail.html?id=wise' },
      { label: 'Funding', href: 'program-detail.html?id=funding' },
      { label: 'Media', href: 'media.html' },
      { label: 'Learning & Networking', href: 'program-detail.html?id=learning' },
    ],
  },
  { label: 'Our Impact', href: 'impact.html', page: 'impact' },
  {
    label: 'Get Involved',
    children: [
      { label: 'Overview', href: 'get-involved.html' },
      { label: 'As a Social Entrepreneur', href: 'get-involved.html#roles-section' },
      { label: 'As a Mentor', href: 'get-involved.html#roles-section' },
      { label: 'As an Investor', href: 'get-involved.html#roles-section' },
      { label: 'As a Partner', href: 'get-involved.html#roles-section' },
      { label: 'Donate', href: 'get-involved.html#donation-section' },
    ],
  },
  {
    label: 'More',
    children: [
      { label: 'Annual Forum', href: 'forum.html' },
      { label: 'News & Media', href: 'news.html' },
      { label: 'Blog', href: 'blog.html' },
      { label: 'Careers at AFI', href: 'careers.html' },
      { label: 'Opportunities with SEs', href: 'opportunities.html' },
    ],
  },
];

function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path.replace('.html', '') || 'index';
}

function buildMegaNav(currentPage) {
  const nav = document.querySelector('.navbar__nav');
  if (!nav) return;

  nav.classList.add('navbar__nav--mega');
  nav.innerHTML = NAV_MENU.map((item) => {
    if (item.children) {
      return `
        <div class="nav-item">
          <button class="nav-item__trigger" type="button" aria-expanded="false">
            ${item.label} <span class="nav-item__chevron">▾</span>
          </button>
          <div class="nav-item__dropdown">
            ${item.children.map((c) => `<a href="${c.href}">${c.label}</a>`).join('')}
          </div>
        </div>`;
    }
    const active =
      (item.page === 'home' && (currentPage === 'index' || currentPage === 'home')) ||
      (item.href === `${currentPage}.html`)
        ? ' nav-item__link--active'
        : '';
    return `<a href="${item.href}" class="nav-item__link${active}">${item.label}</a>`;
  }).join('');

  const inner = document.querySelector('.navbar__inner');
  if (inner && !document.querySelector('.navbar__menu-btn')) {
    const btn = document.createElement('button');
    btn.className = 'navbar__menu-btn';
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '☰';
    btn.addEventListener('click', () => nav.classList.toggle('navbar__nav--open'));
    inner.insertBefore(btn, document.getElementById('donate-btn'));
  }

  nav.querySelectorAll('.nav-item__trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (window.innerWidth <= 968) {
        trigger.closest('.nav-item').classList.toggle('nav-item--open');
      }
    });
  });
}

function updateOrgLogo(data) {
  const logoUrl = data.organization?.logo_url;
  document.querySelectorAll('.navbar__logo-icon').forEach((el) => {
    if (logoUrl) {
      el.innerHTML = `<img src="${logoUrl}" alt="Action For India" class="navbar__logo-img" />`;
    }
  });
}

function injectFooterNewsletter(data) {
  document.querySelectorAll('.footer__inner').forEach((footerInner) => {
    if (footerInner.querySelector('.footer__newsletter')) return;

    const mc = data.mailchimp;
    const newsletter = document.createElement('div');
    newsletter.className = 'footer__newsletter';
    newsletter.innerHTML = `
      <div class="footer__newsletter-title">Subscribe to Our Newsletter</div>
      <p class="footer__newsletter-desc">Receive updates on news, events, cohort announcements, and impact stories from AFI.</p>
      <form class="footer__newsletter-form" action="${mc?.form_action || '#'}" method="post" target="_blank">
        <input type="email" name="EMAIL" placeholder="Email Address *" required />
        <input type="text" name="FNAME" placeholder="Name" />
        <input type="text" name="COMPANY" placeholder="Company" />
        <input type="text" name="COUNTRY" placeholder="Country" />
        <select name="CATEGORY">
          <option value="">Category</option>
          <option value="Entrepreneur">Entrepreneur</option>
          <option value="Mentor">Mentor</option>
          <option value="Investor">Investor</option>
        </select>
        <button type="submit">Subscribe</button>
      </form>
      <button type="button" class="footer__volunteer-link" id="open-volunteer-modal">Become a Volunteer →</button>
    `;
    footerInner.appendChild(newsletter);
  });
}

function injectModals(data) {
  if (document.getElementById('afi-modals-root')) return;

  const root = document.createElement('div');
  root.id = 'afi-modals-root';
  const volunteer = data.volunteer || {};
  const paypalId = data.paypal?.hosted_button_id || 'PTF7QVFY3HHXE';

  root.innerHTML = `
    <div class="afi-modal-overlay" id="volunteer-modal" aria-hidden="true">
      <div class="afi-modal" role="dialog">
        <button class="afi-modal__close" data-close-modal aria-label="Close">&times;</button>
        <h2 class="afi-modal__title">${volunteer.title || 'Become a Volunteer'}</h2>
        <p class="afi-modal__desc">${volunteer.description || ''}</p>
        <form class="afi-modal__form" id="volunteer-form">
          <div class="form-group"><label>Name *</label><input type="text" name="name" required /></div>
          <div class="form-group"><label>Last Name *</label><input type="text" name="lastname" required /></div>
          <div class="form-group"><label>Email *</label><input type="email" name="email" required /></div>
          <div class="form-group"><label>Phone *</label><input type="tel" name="phone" required /></div>
          <div class="form-group"><label>ZIP Code *</label><input type="text" name="zip" required /></div>
          <div class="form-group"><label>Why you want to volunteer *</label><textarea name="reason" rows="3" required></textarea></div>
          <button type="submit" class="btn btn--primary btn--full">Submit</button>
          <p class="afi-modal__desc" style="margin-top:12px">${volunteer.note || ''}</p>
        </form>
      </div>
    </div>
    <div class="afi-modal-overlay" id="donate-modal" aria-hidden="true">
      <div class="afi-modal" role="dialog">
        <button class="afi-modal__close" data-close-modal aria-label="Close">&times;</button>
        <h2 class="afi-modal__title">Donate to Action For India</h2>
        <p class="afi-modal__desc">Your donation helps social entrepreneurs scale impact across India.</p>
        <div class="donate-modal__amounts">
          <button type="button" class="donate-modal__amount donate-modal__amount--active" data-usd="12">$12</button>
          <button type="button" class="donate-modal__amount" data-usd="22">$22</button>
          <button type="button" class="donate-modal__amount" data-usd="32">$32</button>
        </div>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" id="paypal-donate-form">
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="${paypalId}" />
          <input type="hidden" name="amount" id="paypal-amount" value="12" />
          <button type="submit" class="btn btn--primary btn--full">Donate via PayPal</button>
        </form>
        <p class="afi-modal__desc" style="margin-top:12px">
          <a href="${getDonateUrl(data)}" target="_blank" rel="noopener noreferrer">More donation options →</a>
        </p>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeAllModals());
  });

  document.querySelectorAll('.afi-modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  document.getElementById('volunteer-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for volunteering! Our team will contact you shortly.');
    closeAllModals();
  });

  document.querySelectorAll('.donate-modal__amount').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.donate-modal__amount').forEach((b) => b.classList.remove('donate-modal__amount--active'));
      btn.classList.add('donate-modal__amount--active');
      const amount = document.getElementById('paypal-amount');
      if (amount) amount.value = btn.getAttribute('data-usd');
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'open-volunteer-modal' || e.target.closest('#open-volunteer-modal')) {
      openModal('volunteer-modal');
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('afi-modal-overlay--open');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeAllModals() {
  document.querySelectorAll('.afi-modal-overlay').forEach((m) => {
    m.classList.remove('afi-modal-overlay--open');
    m.setAttribute('aria-hidden', 'true');
  });
}

function initAnalytics(data) {
  const gaId = data.analytics?.google_analytics_id;
  const fbId = data.analytics?.facebook_pixel_id;

  if (gaId && !document.getElementById('gtag-script')) {
    const s = document.createElement('script');
    s.id = 'gtag-script';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId);
  }

  if (fbId && !document.getElementById('fb-pixel')) {
    const s = document.createElement('script');
    s.id = 'fb-pixel';
    s.textContent = `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init','${fbId}');fbq('track','PageView');
    `;
    document.head.appendChild(s);
  }
}

function initBannerCarousel(data) {
  const container = document.getElementById('banner-carousel');
  if (!container || !data.banner_images?.length) return;

  const track = container.querySelector('.banner-carousel__track');
  const dots = container.querySelector('.banner-carousel__dots');
  if (!track) return;

  track.innerHTML = data.banner_images
    .map(
      (b) => `
      <div class="banner-carousel__slide">
        <a href="${b.link}" target="_blank" rel="noopener noreferrer">
          <img src="${b.url}" alt="${b.name}" loading="lazy" />
        </a>
      </div>`
    )
    .join('');

  let current = 0;
  const total = data.banner_images.length;

  if (dots) {
    dots.innerHTML = data.banner_images
      .map((_, i) => `<button class="banner-carousel__dot${i === 0 ? ' banner-carousel__dot--active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`)
      .join('');
    dots.querySelectorAll('.banner-carousel__dot').forEach((dot) => {
      dot.addEventListener('click', () => goTo(parseInt(dot.getAttribute('data-index'), 10)));
    });
  }

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots?.querySelectorAll('.banner-carousel__dot').forEach((d, i) => {
      d.classList.toggle('banner-carousel__dot--active', i === current);
    });
  }

  setInterval(() => goTo((current + 1) % total), 5000);
}

function renderPartnerLogos(container, data) {
  if (!container || !data.partners?.partner_logos) return;
  const base = data.partners.partner_logos.base_url;
  container.innerHTML = data.partners.partner_logos.files
    .map(
      (file) => `
      <div class="partner-logos__item">
        <img src="${base}${file}" alt="Partner" loading="lazy" />
      </div>`
    )
    .join('');
}

function wireDonateButtons() {
  document.querySelectorAll('#donate-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('donate-modal');
    });
  });
}

function initSharedLayout(data) {
  const currentPage = getCurrentPage();
  buildMegaNav(currentPage);
  updateOrgLogo(data);
  injectFooterNewsletter(data);
  injectModals(data);
  initAnalytics(data);
  initBannerCarousel(data);
  wireDonateButtons();

  document.querySelectorAll('#partner-logos-grid').forEach((el) => {
    renderPartnerLogos(el, data);
  });
}
