/* ===== Impact Page JavaScript ===== */

const SECTOR_STYLES = [
  { icon: 'yellow', stat: 'amber', lucide: 'graduation-cap' },
  { icon: 'green', stat: 'green', lucide: 'heart-pulse' },
  { icon: 'blue', stat: 'blue', lucide: 'wheat' },
  { icon: 'pink', stat: 'pink', lucide: 'zap' },
  { icon: 'purple', stat: 'purple', lucide: 'briefcase-business' },
  { icon: 'lemon', stat: 'lemon', lucide: 'indian-rupee' },
];

function extractSdgNumber(sdg) {
  const match = sdg?.match(/SDG\s*(\d+)/i);
  return match ? match[1] : '';
}

function extractSdgName(sdg) {
  if (!sdg) return '';
  const parts = sdg.split('-');
  return parts.length > 1 ? parts.slice(1).join('-').trim() : sdg;
}

function renderSectorCard(area, index) {
  const style = SECTOR_STYLES[index % SECTOR_STYLES.length];
  const reverse = index % 2 === 1 ? ' sector__card--reverse' : '';
  const sdgNum = extractSdgNumber(area.sdg);
  const statParts = area.impact_stat.split(/[;,]/);
  const mainStat = statParts[0].replace(/^Over\s+/i, '').trim();
  const statLabel = area.sector.toLowerCase();

  return `
    <div class="sector__card${reverse} reveal">
      <div class="sector__card-body">
        <div class="sector__card-header">
          <div class="sector__card-icon sector__card-icon--${style.icon}"><i data-lucide="${style.lucide}" aria-hidden="true"></i></div>
          <div class="sector__card-meta">
            <span class="sector__card-sdg">SDG ${sdgNum}</span>
            <span class="sector__card-name">${area.sector}</span>
          </div>
        </div>
        <div class="sector__card-stat sector__card-stat--${style.stat}">${mainStat}</div>
        <div class="sector__card-stat-label">${area.sector.toLowerCase()} impact</div>
        <p class="sector__card-desc">${area.description}</p>
        <div class="sector__card-metrics">
          <div class="sector__card-metric">
            <span class="sector__card-metric-value">${area.impact_stat}</span>
          </div>
        </div>
      </div>
      <div class="sector__card-visual sector__card-visual--${style.icon}">
        <div class="sector__card-icon-bg"><i data-lucide="${style.lucide}" aria-hidden="true"></i></div>
        <div class="sector__card-badge">
          <span class="sector__card-badge-value sector__card-badge-value--${style.stat}">${mainStat}</span>
          <span class="sector__card-badge-label">${statLabel}</span>
        </div>
      </div>
    </div>`;
}

function populateImpactPage(data) {
  const org = data.organization;
  const stats = data.key_stats;

  const heroDesc = document.getElementById('impact-hero-desc');
  if (heroDesc) {
    heroDesc.textContent = org.un_alignment;
  }

  const livesStat = document.querySelector('#imp-stat-lives .impact-stats__value');
  if (livesStat) livesStat.textContent = stats.lives_impacted;

  const entrepreneursStat = document.querySelector('#imp-stat-entrepreneurs .impact-stats__value');
  if (entrepreneursStat) entrepreneursStat.textContent = stats.entrepreneurs_supported;

  const areasStat = document.querySelector('#imp-stat-areas .impact-stats__value');
  if (areasStat) areasStat.textContent = String(stats.impact_areas_count);

  const forumStat = document.querySelector('#imp-stat-forum .impact-stats__value');
  if (forumStat) forumStat.textContent = `${stats.annual_forum_count}th`;

  const sectorGrid = document.getElementById('sector-grid');
  if (sectorGrid && data.impact_areas) {
    sectorGrid.innerHTML = data.impact_areas.map(renderSectorCard).join('');
    sectorGrid.querySelectorAll('.sector__card').forEach((card, index) => {
      const sectorObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('visible'), index * 100);
              sectorObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      sectorObserver.observe(card);
    });
  }

  const sdgDesc = document.getElementById('sdg-desc');
  if (sdgDesc) sdgDesc.textContent = org.un_alignment;

  const sdgGrid = document.getElementById('sdg-grid');
  if (sdgGrid && data.impact_areas) {
    sdgGrid.innerHTML = data.impact_areas
      .map(
        (area) => `
        <div class="sdg__card">
          <div class="sdg__card-number">SDG ${extractSdgNumber(area.sdg)}</div>
          <div class="sdg__card-name">${extractSdgName(area.sdg)}</div>
          <div class="sdg__card-ventures">${area.sector}</div>
        </div>`
      )
      .join('');
  }

  const mentorCta = document.getElementById('cta-mentor');
  if (mentorCta) {
    mentorCta.href = getRoleUrl(data, 'Mentor');
    mentorCta.target = '_blank';
    mentorCta.rel = 'noopener noreferrer';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await initSite();
  if (data) {
    populateImpactPage(data);
    if (typeof refreshLucideIcons === 'function') {
      refreshLucideIcons();
    }
  }

  // --- Animated stat counters ---
  const statValues = document.querySelectorAll('.impact-stats__value');
  const statsSection = document.getElementById('impact-stats');

  if (statsSection) {
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  function animateCounters() {
    statValues.forEach((el) => {
      const finalText = el.textContent;
      const numericStr = finalText.replace(/[^0-9.]/g, '');
      const targetNum = parseFloat(numericStr);

      if (isNaN(targetNum) || targetNum === 0) return;

      const duration = 1800;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(eased * targetNum);

        let formatted =
          targetNum >= 1000 ? currentVal.toLocaleString('en-IN') : currentVal.toString();

        if (finalText.includes('M')) formatted += 'M';
        if (finalText.includes('+')) formatted += '+';
        if (finalText.includes('th')) formatted += 'th';

        el.textContent = formatted;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = finalText;
        }
      }

      requestAnimationFrame(update);
    });
  }

  // --- SDG card hover ---
  document.querySelectorAll('.sdg__card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--color-primary)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'rgba(200, 52, 10, 0.15)';
    });
  });
});

