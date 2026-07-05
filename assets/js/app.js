(function () {
  const storageKeys = {
    announcement: 'charliesCherries.announcement',
    special: 'charliesCherries.special',
    table: 'charliesCherries.table'
  };

  const defaults = {
    announcement: 'Now open for pretend dinner service',
    special: 'Slow-cooked BBQ pork ribs',
    table: 'VIP Family Table'
  };

  const chefNotes = [
    'Chef note: “Ribs must be delicious and a little bit messy.”',
    'Chef note: “Lasagne needs lots of layers and boss energy.”',
    'Chef note: “Chicken wings are best when everyone says wow.”',
    'Chef note: “All customers must arrive hungry.”',
    'Chef note: “Dessert is an important business decision.”'
  ];

  applyBossSettings();
  setupBossMode();
  setupChefNotes();
  setupPrintButtons();
  setupBookingForm();
  setupMenuCards();
  setupQrFallback();

  function getSetting(name) {
    try {
      return window.localStorage.getItem(storageKeys[name]) || defaults[name];
    } catch (error) {
      return defaults[name];
    }
  }

  function setSetting(name, value) {
    try {
      window.localStorage.setItem(storageKeys[name], value || defaults[name]);
    } catch (error) {
      // Local storage can be unavailable in some private browsing contexts. The site still works without it.
    }
  }

  function resetSettings() {
    try {
      Object.values(storageKeys).forEach(function (key) { window.localStorage.removeItem(key); });
    } catch (error) {
      // Ignore storage reset failures.
    }
    applyBossSettings();
  }

  function applyBossSettings() {
    setText('[data-live-announcement]', getSetting('announcement'));
    setText('[data-live-special]', getSetting('special'));
    setText('[data-live-table]', getSetting('table'));
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.textContent = value;
    });
  }

  function setupBossMode() {
    const form = document.querySelector('[data-boss-form]');
    const resetButton = document.querySelector('[data-boss-reset]');

    if (form) {
      form.elements.announcement.value = getSetting('announcement');
      form.elements.special.value = getSetting('special');
      form.elements.table.value = getSetting('table');

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(form);
        setSetting('announcement', cleanShortText(data.get('announcement'), defaults.announcement));
        setSetting('special', cleanShortText(data.get('special'), defaults.special));
        setSetting('table', cleanShortText(data.get('table'), defaults.table));
        applyBossSettings();
        confetti(42);
      });
    }

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        resetSettings();
        if (form) {
          form.elements.announcement.value = defaults.announcement;
          form.elements.special.value = defaults.special;
          form.elements.table.value = defaults.table;
        }
        sparkle(resetButton);
      });
    }
  }

  function setupChefNotes() {
    const noteButton = document.querySelector('[data-chef-note]');
    const noteOutput = document.querySelector('.chef-note');

    if (noteButton && noteOutput) {
      noteButton.addEventListener('click', function () {
        const current = noteOutput.textContent;
        const next = chefNotes.find((note) => note !== current) || chefNotes[0];
        noteOutput.textContent = next;
        sparkle(noteButton);
      });
    }
  }

  function setupPrintButtons() {
    document.querySelectorAll('[data-print]').forEach(function (button) {
      button.addEventListener('click', function () { window.print(); });
    });
  }

  function setupBookingForm() {
    const form = document.querySelector('[data-booking-form]');
    const confirmation = document.querySelector('[data-confirmation]');

    if (form && confirmation) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(form);
        const guest = cleanShortText(data.get('guest'), 'Guest');
        const guests = cleanShortText(data.get('guests'), '1 hungry person');
        const meal = cleanShortText(data.get('meal'), 'BBQ pork ribs');

        confirmation.hidden = false;
        confirmation.innerHTML = '<h3>Booking confirmed!</h3>' +
          '<p>Chef Charlie has approved a pretend table for <strong>' + escapeHtml(guest) + '</strong>.</p>' +
          '<p>Guests: <strong>' + escapeHtml(guests) + '</strong><br>Kitchen alert: <strong>' + escapeHtml(meal) + '</strong></p>' +
          '<p>Please arrive hungry and ready for five-cherry service.</p>';
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        confetti(34);
      });
    }
  }

  function setupMenuCards() {
    document.querySelectorAll('[data-menu-card]').forEach(function (card) {
      card.addEventListener('click', function () { sparkle(card); });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          sparkle(card);
        }
      });
    });
  }

  function setupQrFallback() {
    const qrImage = document.querySelector('[data-qr-image]');
    const fallback = document.querySelector('[data-qr-fallback]');

    if (qrImage && fallback) {
      const showFallback = function () {
        qrImage.hidden = true;
        fallback.hidden = false;
      };

      qrImage.addEventListener('error', showFallback);

      if (qrImage.complete && qrImage.naturalWidth === 0) {
        showFallback();
      }
    }
  }

  function sparkle(target) {
    const rect = target.getBoundingClientRect();
    for (let i = 0; i < 8; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = (rect.left + rect.width / 2 + (Math.random() * 80 - 40)) + 'px';
      piece.style.background = ['#b4234a', '#ffe5a3', '#d8f5df', '#7b1530'][i % 4];
      piece.style.animationDuration = (700 + Math.random() * 500) + 'ms';
      document.body.appendChild(piece);
      window.setTimeout(function () { piece.remove(); }, 1300);
    }
  }

  function confetti(count) {
    const total = count || 34;
    for (let i = 0; i < total; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = (Math.random() * 100) + 'vw';
      piece.style.background = ['#b4234a', '#ffe5a3', '#d8f5df', '#7b1530', '#ff8fab'][i % 5];
      piece.style.animationDelay = (Math.random() * 120) + 'ms';
      piece.style.animationDuration = (900 + Math.random() * 800) + 'ms';
      document.body.appendChild(piece);
      window.setTimeout(function () { piece.remove(); }, 1900);
    }
  }

  function cleanShortText(value, fallback) {
    const cleaned = String(value || '').replace(/[\n\r\t]+/g, ' ').replace(/\s+/g, ' ').trim();
    return cleaned || fallback;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, function (char) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;'
      })[char];
    });
  }
})();
