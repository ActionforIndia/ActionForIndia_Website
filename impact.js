/* ===== Impact Page JavaScript ===== */

// Scroll reveal observer
document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Navbar scroll effect ---
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
      const hasPrefix = finalText.startsWith('₹');
      const hasSuffix = finalText.match(/[A-Za-z+]+$/);

      // Extract the numeric part
      const numericStr = finalText.replace(/[^0-9.]/g, '');
      const targetNum = parseFloat(numericStr);

      if (isNaN(targetNum) || targetNum === 0) return;

      const duration = 1800;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(eased * targetNum);

        // Format the number
        let formatted;
        if (targetNum >= 1000) {
          formatted = currentVal.toLocaleString('en-IN');
        } else {
          formatted = currentVal.toString();
        }

        // Re-add prefix/suffix
        let display = '';
        if (hasPrefix) display += '₹';
        display += formatted;
        if (hasSuffix) display += hasSuffix[0];

        el.textContent = display;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Ensure final text is exact
          el.textContent = finalText;
        }
      }

      requestAnimationFrame(update);
    });
  }

  // --- Sector cards stagger animation ---
  const sectorCards = document.querySelectorAll('.sector__card');
  const sectorObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        sectorObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sectorCards.forEach((card) => sectorObserver.observe(card));

  // --- SDG card hover counter effect ---
  const sdgCards = document.querySelectorAll('.sdg__card');
  sdgCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--color-primary)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'rgba(200, 52, 10, 0.15)';
    });
  });
});
