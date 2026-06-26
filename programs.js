// ===== Programs Tabs =====
const tabButtons = document.querySelectorAll('.programs-tabs__btn');
const panels = document.querySelectorAll('.programs-panel');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-tab');
    tabButtons.forEach((b) => b.classList.remove('programs-tabs__btn--active'));
    btn.classList.add('programs-tabs__btn--active');
    panels.forEach((panel) => {
      if (panel.getAttribute('data-panel') === target) {
        panel.classList.add('programs-panel--active');
        panel.style.animation = 'none';
        panel.offsetHeight;
        panel.style.animation = '';
      } else {
        panel.classList.remove('programs-panel--active');
      }
    });
  });
});

const PANEL_PROGRAM_IDS = {
  ai: 'ai-impact',
  agri: 'agri-2',
  catalyzer: 'catalyzer',
  women: 'wise',
};

function populateProgramPanel(panelId, program) {
  const panel = document.querySelector(`[data-panel="${panelId}"]`);
  if (!panel || !program) return;

  const title = panel.querySelector('.programs-panel__title');
  if (title) title.textContent = program.name;

  const desc = panel.querySelector('.programs-panel__desc');
  if (desc) desc.textContent = program.description;

  const cta = panel.querySelector('.programs-panel__cta');
  if (cta) {
    cta.href = `program-detail.html?id=${program.id}`;
    cta.textContent = 'View Program Details';
  }

  const img = panel.querySelector('.programs-panel__image img');
  if (img && program.image) {
    img.src = program.image;
    img.alt = program.name;
  }

  const meta = panel.querySelector('.programs-panel__meta');
  if (meta) meta.remove();

  const benefitsGrid = panel.querySelector('.programs-panel__benefits-grid');
  if (benefitsGrid && program.benefits) {
    benefitsGrid.innerHTML = program.benefits
      .map((b) => `<div class="programs-panel__benefit"><span class="programs-panel__benefit-dot"></span>${b}</div>`)
      .join('');
  }
}

function populateProgramsPage(data) {
  const details = data.program_details || [];
  const forum = data.annual_forum;

  Object.entries(PANEL_PROGRAM_IDS).forEach(([panelId, programId]) => {
    const program = details.find((p) => p.id === programId);
    populateProgramPanel(panelId, program);
  });

  if (forum) {
    const forumTitle = document.getElementById('forum-title');
    const forumDesc = document.querySelector('.forum__desc');
    const forumCta = document.getElementById('forum-register-btn');
    const forumImage = document.querySelector('.forum__image img');
    const editionStat = document.querySelector('#forum-stat-edition .forum__stat-value');

    if (forumTitle) forumTitle.textContent = forum.current_edition;
    if (forumDesc) forumDesc.textContent = forum.description;
    if (forumCta) {
      forumCta.href = 'forum.html';
      forumCta.textContent = 'View Annual Forum';
    }
    if (forumImage) forumImage.src = forum.banner_url;
    if (editionStat) editionStat.textContent = `${data.key_stats?.annual_forum_count || 9}th`;
  }

  const resourcesGrid = document.getElementById('resources-grid');
  if (resourcesGrid && data.what_we_provide) {
    const RESOURCE_EMOJI = { Funding: '💰', Mentorship: '🧭', 'Technology & Resources': '💻' };
    resourcesGrid.innerHTML = data.what_we_provide
      .map(
        (item) => `
        <div class="resources__card reveal">
          <div class="resources__card-emoji">${RESOURCE_EMOJI[item.title] || '✦'}</div>
          <h3 class="resources__card-title">${item.title}</h3>
          <p class="resources__card-desc">${item.description}</p>
        </div>`
      )
      .join('');
  }

  const allGrid = document.getElementById('all-programs-grid');
  if (allGrid) {
    allGrid.innerHTML = details
      .map(
        (p) => `
        <a href="program-detail.html?id=${p.id}" class="all-programs__card reveal">
          <span class="all-programs__name">${p.name}</span>
          <span class="all-programs__arrow">→</span>
        </a>`
      )
      .join('');
  }
}

// Forum stats animation
const forumStats = document.getElementById('forum-stats');
if (forumStats) {
  const forumObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) forumObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  forumObserver.observe(forumStats);
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await initSite();
  if (data) {
    populateProgramsPage(data);
    observeRevealElements();
  }
});
