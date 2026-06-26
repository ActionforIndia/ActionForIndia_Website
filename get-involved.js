document.addEventListener('DOMContentLoaded', async () => {
  const data = await initSite();
  if (!data) return;

  const roles = data.get_involved?.roles || [];
  const entrepreneur = roles.find((r) => r.role === 'Social Entrepreneur');
  const mentor = roles.find((r) => r.role === 'Mentor');
  const investor = roles.find((r) => r.role === 'Investor');
  const partner = roles.find((r) => r.role === 'Partner');

  const tabData = {
    entrepreneur: {
      title: 'Social Entrepreneur',
      icon: '🚀',
      subtitle: entrepreneur?.description || 'Apply to AFI accelerator programs',
      desc: 'Are you a social entrepreneur looking to unleash your potential? Apply to our cohorts and get mentorship, funding, and network support.',
      url: entrepreneur?.url,
      steps: [
        'Submit your application via the AFI application portal',
        'Shortlisting and screening call with the AFI team',
        'Panel presentation to mentors and investors',
        'Cohort kick-off and program participation',
      ],
    },
    mentor: {
      title: 'Mentor',
      icon: '🧭',
      subtitle: 'Share expertise with high-potential social entrepreneurs',
      desc: mentor?.description || 'Are you a mentor looking for high potential social entrepreneurs?',
      url: mentor?.url,
      steps: [
        'Complete the mentor interest form',
        'Match with entrepreneurs in your area of expertise',
        'Provide guidance through structured mentorship sessions',
        'Join the AFI Annual Forum and networking events',
      ],
    },
    investor: {
      title: 'Investor',
      icon: '💡',
      subtitle: investor?.description || 'Discover high-potential social enterprises',
      desc: 'Connect with curated social enterprises addressing education, healthcare, agriculture, energy, livelihoods, and financial inclusion.',
      url: investor?.url,
      steps: [
        'Register your interest as an impact investor',
        'Access AFI\'s portfolio of social enterprises',
        'Meet founders at the Annual Forum and demo days',
        'Explore co-investment opportunities with AFI partners',
      ],
    },
    corporate: {
      title: 'Corporate Partner',
      icon: '🤝',
      subtitle: `Partners include ${data.partners?.corporates?.slice(0, 4).join(', ')}`,
      desc: 'Partner with AFI to support social entrepreneurs through technology, resources, and ecosystem access.',
      url: partner?.url,
      steps: [
        'Express interest in a corporate partnership',
        'Collaborate on program design and support',
        'Provide technology, mentorship, or funding',
        'Amplify impact through joint initiatives',
      ],
    },
  };

  const tabs = document.querySelectorAll('.role-tab');
  const roleSelect = document.getElementById('interest_role');
  const contentArea = document.getElementById('role-content-area');

  function renderPane(roleId) {
    const info = tabData[roleId];
    if (!info || !contentArea) return;

    contentArea.innerHTML = `
      <div class="role-pane role-pane--active" id="pane-${roleId}">
        <div class="role-pane__info">
          <div class="role-pane__header">
            <span class="role-pane__icon-large">${info.icon}</span>
            <h2 class="role-pane__title">${info.title}</h2>
          </div>
          <p class="role-pane__subtitle">${info.subtitle}</p>
          <p class="role-pane__desc">${info.desc}</p>
          <h3 class="role-pane__list-title">How it works:</h3>
          <ol class="role-pane__list">
            ${info.steps.map((s) => `<li>${s}</li>`).join('')}
          </ol>
          ${info.url ? `<a href="${info.url}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Apply / Register Now</a>` : ''}
        </div>
        <div class="role-pane__form-card">
          <h3 class="form-card__title">Express Your Interest</h3>
          <form class="gi-form" id="gi-form">
            <div class="form-group">
              <label for="full_name">Full Name</label>
              <input type="text" id="full_name" placeholder="Your name" required>
            </div>
            <div class="form-group">
              <label for="email_address">Email Address</label>
              <input type="email" id="email_address" placeholder="you@email.com" required>
            </div>
            <div class="form-group">
              <label for="organization">Organization / Venture</label>
              <input type="text" id="organization" placeholder="Organization name">
            </div>
            <div class="form-group">
              <label for="interest_role">I am interested in joining as</label>
              <div class="custom-select">
                <select id="interest_role_inner">
                  <option value="entrepreneur" ${roleId === 'entrepreneur' ? 'selected' : ''}>Social Entrepreneur</option>
                  <option value="mentor" ${roleId === 'mentor' ? 'selected' : ''}>Mentor</option>
                  <option value="investor" ${roleId === 'investor' ? 'selected' : ''}>Investor</option>
                  <option value="corporate" ${roleId === 'corporate' ? 'selected' : ''}>Corporate Partner</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="about_yourself">Tell us about yourself</label>
              <textarea id="about_yourself" rows="4" placeholder="Briefly describe your work..." required></textarea>
            </div>
            <button type="submit" class="btn btn--primary btn--full">Submit Interest</button>
          </form>
        </div>
      </div>`;

    const form = document.getElementById('gi-form');
    const innerSelect = document.getElementById('interest_role_inner');

    if (innerSelect) {
      innerSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const targetTab = document.querySelector(`.role-tab[data-tab="${val}"]`);
        if (targetTab) targetTab.click();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = tabData[roleId]?.url;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          alert('Thank you for your interest! We will be in touch.');
        }
      });
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('role-tab--active'));
      tab.classList.add('role-tab--active');
      const roleId = tab.getAttribute('data-tab');
      if (roleSelect) roleSelect.value = roleId;
      renderPane(roleId);
    });
  });

  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const targetTab = document.querySelector(`.role-tab[data-tab="${e.target.value}"]`);
      if (targetTab) targetTab.click();
    });
  }

  renderPane('entrepreneur');

  // Donation — open PayPal modal
  const donateBtn = document.getElementById('btn-donate-now');
  if (donateBtn) {
    donateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof openModal === 'function') openModal('donate-modal');
    });
  }

  const donationAmounts = document.querySelectorAll('.donation-amount:not(.donation-amount--custom)');
  const customAmountBtn = document.querySelector('.donation-amount--custom');
  const displayAmount = document.getElementById('donation-display');
  const displayImpact = document.getElementById('donation-impact');
  const donateBtnLabel = document.getElementById('btn-donate-now');

  const impactMapping = {
    500: 'supports AFI workshop materials for entrepreneurs',
    1000: 'helps fund mentorship program sessions',
    2500: 'contributes to the AFI Annual Forum',
    5000: 'supports accelerator program operations',
    10000: 'helps social entrepreneurs scale their impact',
  };

  function updateDonation(amount) {
    const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);
    displayAmount.textContent = `₹${formattedAmount}`;
    donateBtnLabel.textContent = `Donate ₹${formattedAmount} Now`;
    displayImpact.textContent = impactMapping[amount] || 'fuels the growth of impactful social enterprises';
  }

  donationAmounts.forEach((btn) => {
    btn.addEventListener('click', () => {
      donationAmounts.forEach((b) => b.classList.remove('donation-amount--active'));
      customAmountBtn?.classList.remove('donation-amount--active');
      btn.classList.add('donation-amount--active');
      updateDonation(parseInt(btn.getAttribute('data-amount'), 10));
    });
  });

  if (customAmountBtn) {
    customAmountBtn.addEventListener('click', () => {
      const amountStr = prompt('Enter custom amount (₹):', '1500');
      if (amountStr && !isNaN(amountStr)) {
        const amount = parseInt(amountStr, 10);
        if (amount > 0) {
          donationAmounts.forEach((b) => b.classList.remove('donation-amount--active'));
          customAmountBtn.classList.add('donation-amount--active');
          updateDonation(amount);
        }
      }
    });
  }
});
