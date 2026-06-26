let allEntrepreneurs = [];
let activeSector = 'all';

const SECTOR_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'education', label: 'Education' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'agriculture', label: 'Agriculture' },
  { key: 'cleanenergy', label: 'Energy' },
  { key: 'energy', label: 'Clean Energy' },
  { key: 'livelihoods', label: 'Livelihoods' },
  { key: 'financial', label: 'Financial Inclusion' },
  { key: 'other', label: 'Other Tech' },
];

function renderSECard(e) {
  const links = [];
  if (e.website) links.push(`<a href="${e.website}" target="_blank" rel="noopener noreferrer">Website</a>`);
  if (e.linkedin) links.push(`<a href="${e.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
  return `
    <div class="info-card se-card reveal" data-sector="${e.sector_key || 'other'}">
      <img src="${e.logo_url}" alt="${e.name}" loading="lazy" onerror="this.style.display='none'" />
      <div class="info-card__title">${e.name}</div>
      <div class="info-card__meta">${e.sector}</div>
      ${e.founder ? `<div class="se-card__founder">Founder: ${e.founder}</div>` : ''}
      <div class="se-card__links">${links.join('')}</div>
    </div>`;
}

function filterAndRender(query = '') {
  const q = query.toLowerCase().trim();
  const filtered = allEntrepreneurs.filter((e) => {
    const sectorMatch = activeSector === 'all' || e.sector_key === activeSector;
    const text = `${e.name} ${e.founder} ${e.sector} ${e.venture}`.toLowerCase();
    const searchMatch = !q || text.includes(q);
    return sectorMatch && searchMatch;
  });

  const grid = document.getElementById('entrepreneurs-grid');
  const count = document.getElementById('se-count');
  if (grid) grid.innerHTML = filtered.map(renderSECard).join('');
  if (count) count.textContent = `Showing ${filtered.length} of ${allEntrepreneurs.length} social entrepreneurs`;
  observeRevealElements(grid);
}

function initEntrepreneursPage(data) {
  const dir = data.social_entrepreneurs_directory;
  if (!dir) return;

  document.getElementById('page-desc').textContent =
    dir.intro || "Here's a select list of our top social entrepreneurs across sectors.";

  allEntrepreneurs = dir.entrepreneurs || [];

  const filtersEl = document.getElementById('se-filters');
  filtersEl.innerHTML = SECTOR_FILTERS.map(
    (f) => `<button type="button" data-sector="${f.key}" class="${f.key === 'all' ? 'active' : ''}">${f.label}</button>`
  ).join('');

  filtersEl.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      filtersEl.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeSector = btn.getAttribute('data-sector');
      filterAndRender(document.getElementById('se-search').value);
    });
  });

  document.getElementById('se-search').addEventListener('input', (e) => {
    filterAndRender(e.target.value);
  });

  filterAndRender();
}

initPage(initEntrepreneursPage);
