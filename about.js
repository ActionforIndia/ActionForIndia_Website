function renderPersonCard(person) {
  const avatar = person.photo_url
    ? `<img src="${person.photo_url}" alt="${person.name}" loading="lazy" />`
    : `<span class="team__avatar-initials">${getInitials(person.name)}</span>`;

  const linkedin = person.linkedin
    ? `<a href="${person.linkedin}" class="team__linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>`
    : '';

  const chapter = person.chapter
    ? `<div class="team__chapter">${person.chapter}</div>`
    : '';

  return `
    <div class="team__card reveal">
      <div class="team__avatar">${avatar}</div>
      <div>
        <div class="team__name">${person.name} ${linkedin}</div>
        <div class="team__role">${person.title}</div>
        ${person.description ? `<div class="team__role">${person.description}</div>` : ''}
        ${chapter}
      </div>
    </div>`;
}

function populateAboutPage(data) {
  const org = data.organization;

  const heroDesc = document.getElementById('about-hero-desc');
  if (heroDesc) heroDesc.textContent = org.mission_statement;

  const heroTitle = document.getElementById('about-hero-title');
  if (heroTitle) {
    heroTitle.innerHTML = `Since ${org.founded}, <em>Building India's</em> Social Impact Ecosystem`;
  }

  // Story paragraphs
  const storyParas = document.getElementById('story-paragraphs');
  if (storyParas) {
    const paragraphs = [
      org.mission_statement,
      org.mission_goal,
      org.vision,
      org.social_enterprise_definition,
      data.international_chapters?.description,
    ].filter(Boolean);
    storyParas.innerHTML = paragraphs
      .map((p) => `<p class="story__paragraph">${p}</p>`)
      .join('');
  }

  const storyImage = document.getElementById('story-image');
  if (storyImage && data.journey_image) storyImage.src = data.journey_image;

  // Journey timeline
  const timeline = document.getElementById('journey-timeline');
  if (timeline && data.journey_timeline) {
    timeline.innerHTML = data.journey_timeline
      .map((item, i) => {
        const side = i % 2 === 0 ? 'left' : 'right';
        const color = i % 2 === 0 ? 'red' : 'orange';
        const descClass = side === 'right' ? ' journey__item-desc--right' : '';
        return `
          <div class="journey__item journey__item--${side} reveal">
            <div class="journey__item-content">
              <div class="journey__item-year journey__item-year--${color}">${item.year}</div>
              <p class="journey__item-desc${descClass}">${item.event}</p>
            </div>
            <div class="journey__item-dot-wrapper">
              <div class="journey__item-dot journey__item-dot--${color}"></div>
            </div>
            <div class="journey__item-spacer"></div>
          </div>`;
      })
      .join('');
    timeline.querySelectorAll('.reveal').forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
    });
  }

  // Team sections
  const trusteesGrid = document.getElementById('trustees-grid');
  if (trusteesGrid) {
    trusteesGrid.innerHTML = data.board_of_trustees.map(renderPersonCard).join('');
  }

  const directorsGrid = document.getElementById('directors-grid');
  if (directorsGrid) {
    directorsGrid.innerHTML = data.board_of_directors.map(renderPersonCard).join('');
  }

  const teamGrid = document.getElementById('team-grid');
  if (teamGrid) {
    teamGrid.innerHTML = data.team.map(renderPersonCard).join('');
  }

  // Partners
  const partnersGroups = document.getElementById('partners-groups');
  if (partnersGroups && data.partners) {
    const groups = [
      { title: 'Investors and Foundations', items: data.partners.investors_and_foundations },
      { title: 'Corporates', items: data.partners.corporates },
      { title: 'Academia and Government', items: data.partners.academia_and_government },
    ];
    partnersGroups.innerHTML = groups
      .map(
        (g) => `
        <div class="partners__group">
          <h3 class="partners__group-title">${g.title}</h3>
          <div class="partners__tags">
            ${g.items.map((name) => `<span class="partners__tag">${name}</span>`).join('')}
          </div>
        </div>`
      )
      .join('');
  }

  // About gallery
  const gallery = document.getElementById('about-gallery-grid');
  if (gallery && data.about_page_images) {
    gallery.innerHTML = data.about_page_images
      .map((url) => `<img src="${url}" alt="AFI community" loading="lazy" />`)
      .join('');
  }

  // Chapters — link international chapters to detail pages
  const chaptersIntro = document.getElementById('chapters-intro');
  if (chaptersIntro) {
    chaptersIntro.textContent = data.international_chapters.description;
    if (data.international_chapters.future_plans) {
      chaptersIntro.textContent += ` Future chapters planned: ${data.international_chapters.future_plans}.`;
    }
  }

  const chaptersGrid = document.getElementById('chapters-grid');
  if (chaptersGrid && data.contact?.offices) {
    const flags = {
      delhi: '🇮🇳',
      bangalore: '🇮🇳',
      us: '🇺🇸',
      silicon: '🇺🇸',
      uk: '🇬🇧',
    };

    const intlChapters = data.international_chapters?.chapters || [];
    const chapterKeyMap = {
      'Silicon Valley Chapter': 'silicon-valley',
      'UK Chapter': 'uk',
    };

    chaptersGrid.innerHTML = data.contact.offices
      .map((office) => {
        const key = office.name.toLowerCase();
        let flag = '🇮🇳';
        if (key.includes('uk')) flag = '🇬🇧';
        else if (key.includes('us') || key.includes('silicon')) flag = '🇺🇸';

        const city = office.location || office.name.replace(' Office', '').replace(' Chapter', '');
        const detail = office.address || office.email || '';
        const badge = office.phone || office.email || 'Contact';

        const chapterMatch = intlChapters.find((c) => office.name.includes(c.name.split(' ')[0]) || office.email === c.email);
        const chapterKey = chapterMatch ? chapterKeyMap[chapterMatch.name] : null;
        const wrapper = chapterKey
          ? `<a href="chapter-detail.html?chapter=${chapterKey}" class="chapters__card" style="text-decoration:none">`
          : `<div class="chapters__card">`;
        const close = chapterKey ? '</a>' : '</div>';

        return `${wrapper}
            <div class="chapters__card-flag">${flag}</div>
            <div class="chapters__card-city">${city}</div>
            <div class="chapters__card-country">${detail}</div>
            <div class="chapters__card-badge">${badge}</div>
          ${close}`;
      })
      .join('');

    const chaptersLink = document.querySelector('#chapters-title');
    if (chaptersLink) {
      const parent = chaptersLink.closest('.section-header');
      if (parent) {
        const viewAll = document.createElement('a');
        viewAll.href = 'chapters.html';
        viewAll.textContent = 'View all chapters →';
        viewAll.style.cssText = 'display:block;margin-top:12px;font-size:14px;color:var(--color-primary)';
        parent.appendChild(viewAll);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await initSite();
  if (data) {
    populateAboutPage(data);
    observeRevealElements();
  }
});
