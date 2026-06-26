// ===== Category Filters =====
let featuredCards = [];
let rowArticles = [];

const filterButtons = document.querySelectorAll('.news-filters__btn');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    filterButtons.forEach((b) => b.classList.remove('news-filters__btn--active'));
    btn.classList.add('news-filters__btn--active');

    featuredCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      card.classList.toggle('news-card--hidden', filter !== 'all' && category !== filter);
    });

    rowArticles.forEach((row) => {
      const category = row.getAttribute('data-category');
      row.classList.toggle('news-row--hidden', filter !== 'all' && category !== filter);
    });
  });
});

function articleLinkStart(url) {
  return url
    ? `<a href="${url}" class="news-article-link" target="_blank" rel="noopener noreferrer">`
    : '';
}

function articleLinkEnd(url) {
  return url ? '</a>' : '';
}

function renderFeaturedArticle(article) {
  const wrap = articleLinkStart(article.url);
  const wrapEnd = articleLinkEnd(article.url);
  return `
    <article class="news-card news-card--featured" data-category="${article.category}">
      ${wrap}
      <div class="news-card__image">
        <img src="${article.image}" alt="${article.title}" loading="lazy" />
        <span class="news-card__badge">${article.tag}</span>
      </div>
      <div class="news-card__body">
        <div class="news-card__meta">
          <span class="news-card__date">${article.date}</span>
        </div>
        <h2 class="news-card__title">${article.title}</h2>
        <p class="news-card__excerpt">${article.excerpt}</p>
      </div>
      ${wrapEnd}
    </article>`;
}

function renderNewsRow(article) {
  const wrap = articleLinkStart(article.url);
  const wrapEnd = articleLinkEnd(article.url);
  return `
    <article class="news-row" data-category="${article.category}">
      ${wrap}
      <div class="news-row__image">
        <img src="${article.image}" alt="${article.title}" loading="lazy" />
      </div>
      <div class="news-row__body">
        <div class="news-row__meta">
          <span class="news-row__tag">${article.tag}</span>
          <span class="news-row__date">${article.date}</span>
        </div>
        <h3 class="news-row__title">${article.title}</h3>
        <p class="news-row__excerpt">${article.excerpt}</p>
      </div>
      ${wrapEnd}
    </article>`;
}

function populateNewsPage(data) {
  const featuredGrid = document.getElementById('news-featured-grid');
  const moreList = document.getElementById('news-more-list');

  const featured = getNewsArticles(data).filter((a) => a.featured);
  const more = getNewsArticles(data).filter((a) => !a.featured);

  if (featuredGrid) {
    featuredGrid.innerHTML = featured.map(renderFeaturedArticle).join('');
    featuredCards = Array.from(featuredGrid.querySelectorAll('.news-card--featured'));
  }

  if (moreList) {
    moreList.innerHTML = more.map(renderNewsRow).join('');
    rowArticles = Array.from(moreList.querySelectorAll('.news-row'));
  }

  // Mailchimp newsletter
  const form = document.getElementById('newsletter-form');
  if (form && data.mailchimp?.form_action) {
    form.action = data.mailchimp.form_action;
    form.method = 'post';
    form.target = '_blank';
  }

  initRevealAnimation();
}

function initRevealAnimation() {
  const revealElements = document.querySelectorAll('.news-card--featured, .news-row');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    revealObserver.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await initSite();
  if (data) populateNewsPage(data);
});
