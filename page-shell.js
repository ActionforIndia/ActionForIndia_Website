/** Minimal init for inner pages — calls initSite + optional populate callback. */
function initPage(populateFn) {
  document.addEventListener('DOMContentLoaded', async () => {
    const data = await initSite();
    if (data && populateFn) populateFn(data);
    observeRevealElements();
  });
}

function renderPageHero(label, title, desc) {
  const labelEl = document.querySelector('.page-hero__label');
  const titleEl = document.querySelector('.page-hero__title');
  const descEl = document.querySelector('.page-hero__desc');
  if (labelEl) labelEl.textContent = label;
  if (titleEl) titleEl.innerHTML = title;
  if (descEl) descEl.textContent = desc;
}
