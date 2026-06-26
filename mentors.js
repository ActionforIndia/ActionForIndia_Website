let allMentors = [];

function renderMentorCard(m) {
  return `
    <div class="info-card mentor-card reveal">
      <img src="${m.photo_url}" alt="${m.name}" loading="lazy" onerror="this.src='https://actionforindia.org/assets/img/mentors/male.jpg'" />
      <div class="info-card__title">${m.name}</div>
      <div class="info-card__meta">${m.title}</div>
      ${m.location ? `<div class="info-card__desc">${m.location}</div>` : ''}
      ${m.linkedin ? `<a href="${m.linkedin}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:var(--color-primary);margin-top:8px;display:inline-block">LinkedIn</a>` : ''}
    </div>`;
}

function filterMentors(query = '') {
  const q = query.toLowerCase().trim();
  const filtered = allMentors.filter((m) => {
    const text = `${m.name} ${m.title} ${m.location}`.toLowerCase();
    return !q || text.includes(q);
  });
  const grid = document.getElementById('mentors-grid');
  const count = document.getElementById('mentor-count');
  if (grid) grid.innerHTML = filtered.map(renderMentorCard).join('');
  if (count) count.textContent = `Showing ${filtered.length} of ${allMentors.length} mentors`;
  observeRevealElements(grid);
}

function initMentorsPage(data) {
  const dir = data.mentors_directory;
  if (!dir) return;

  document.getElementById('page-desc').textContent = dir.intro;
  allMentors = dir.mentors || [];

  document.getElementById('mentor-search').addEventListener('input', (e) => {
    filterMentors(e.target.value);
  });

  const btn = document.getElementById('mentor-apply-btn');
  btn.href = dir.apply_url || getRoleUrl(data, 'Mentor');
  btn.target = '_blank';

  filterMentors();
}

initPage(initMentorsPage);
