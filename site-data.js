/**
 * Loads and caches scraped-data.json for all pages.
 */
let _siteDataCache = null;

async function loadSiteData() {
  if (_siteDataCache) return _siteDataCache;
  const response = await fetch('scraped-data.json');
  if (!response.ok) throw new Error('Failed to load scraped-data.json');
  _siteDataCache = await response.json();
  return _siteDataCache;
}

function formatPersonName(name) {
  if (!name) return '';
  if (name === name.toUpperCase()) {
    return name
      .split(' ')
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }
  return name;
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function findProgramUrl(programs, nameIncludes) {
  const match = programs.find((p) =>
    p.name.toLowerCase().includes(nameIncludes.toLowerCase())
  );
  return match ? match.url : null;
}

function getDonateUrl(data) {
  const donor = data.get_involved?.roles?.find((r) => r.role === 'Donor');
  return donor?.url || 'https://actionforindia.org/contact-afi-donate.html';
}

function getRoleUrl(data, roleName) {
  const role = data.get_involved?.roles?.find((r) =>
    r.role.toLowerCase().includes(roleName.toLowerCase())
  );
  return role?.url || '#';
}

const ARCHIVE_CATEGORY_MAP = {
  coverage: 'recognition',
  newsletter: 'program',
  news: 'recognition',
};

function normalizeArchiveItem(item, index) {
  const category = ARCHIVE_CATEGORY_MAP[item.category] || item.category || 'recognition';
  const tag =
    item.category === 'newsletter'
      ? 'Newsletter'
      : item.category === 'coverage'
        ? 'Coverage'
        : 'News';
  return {
    id: `archive-${index}`,
    category,
    tag,
    title: item.title,
    excerpt: item.excerpt || '',
    date: item.date || '',
    featured: index < 2,
    image: item.image || 'https://actionforindia.org/assets/img/dummy-image-768x384.png',
    url: item.url || null,
  };
}

/** News articles — merges curated list with scraped news archive. */
function getNewsArticles(data) {
  const base = [...(data?.news_articles || [])];
  const seen = new Set(base.map((a) => a.url || a.title));

  (data?.news_archive?.items || []).forEach((item, i) => {
    const key = item.url || item.title;
    if (key && !seen.has(key)) {
      seen.add(key);
      base.push(normalizeArchiveItem(item, i));
    }
  });

  return base;
}
