(function () {
  const storageKeys = {
    announcement: 'charliesCherries.announcement',
    special: 'charliesCherries.special',
    table: 'charliesCherries.table',
    mood: 'charliesCherries.mood',
    dishEmoji: 'charliesCherries.dishEmoji',
    dishName: 'charliesCherries.dishName',
    dishPrice: 'charliesCherries.dishPrice',
    dishNote: 'charliesCherries.dishNote',
    dishStamp: 'charliesCherries.dishStamp',
    stickers: 'charliesCherries.stickers',
    checklist: 'charliesCherries.openingChecklist'
  };

  const defaults = {
    announcement: 'Now open for pretend dinner service',
    special: 'Slow-cooked BBQ pork ribs',
    table: 'VIP Family Table',
    mood: 'Chef approved',
    dishEmoji: '',
    dishName: '',
    dishPrice: '5 cherries',
    dishNote: '',
    dishStamp: 'Chef approved'
  };

  const stickerList = [
    { id: 'opened', icon: '🍒', label: 'Opened the restaurant' },
    { id: 'chef-desk', icon: '👩‍🍳', label: 'Visited Chef Desk' },
    { id: 'changed-special', icon: '🍖', label: 'Changed the special' },
    { id: 'invented-dish', icon: '✨', label: 'Invented a dish' },
    { id: 'booking', icon: '🧾', label: 'Took a booking' },
    { id: 'opening-day', icon: '✅', label: 'Visited Opening Day' },
    { id: 'ready', icon: '🏁', label: 'Restaurant ready' },
    { id: 'print', icon: '🖨️', label: 'Used the print station' },
    { id: 'menu-tap', icon: '⭐', label: 'Explored the menu' }
  ];

  const chefNotes = [
    'Chef note: “Ribs must be delicious and a little bit messy.”',
    'Chef note: “Lasagne needs lots of layers and boss energy.”',
    'Chef note: “Chicken wings are best when everyone says wow.”',
    'Chef note: “All customers must arrive hungry.”',
    'Chef note: “Dessert is an important business decision.”'
  ];

  unlockPageSticker();
  applyBossSettings();
  applyInvention();
  setupBossMode();
  setupInventionForm();
  setupChefNotes();
  setupPrintButtons();
  setupBookingForm();
  setupMenuCards();
  setupQrFallback();
  setupOpeningChecklist();
  setupStickerReset();
  renderStickerBooks();

  function unlockPageSticker() {
    const page = document.body.getAttribute('data-page');
    if (page === 'home') addSticker('opened', false);
    if (page === 'chef-desk') addSticker('chef-desk', false);
    if (page === 'opening-day') addSticker('opening-day', false);
  }

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

  function removeSetting(name) {
    try {
      window.localStorage.removeItem(storageKeys[name]);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function resetSettings() {
    ['announcement', 'special', 'table', 'mood'].forEach(removeSetting);
    applyBossSettings();
  }

  function applyBossSettings() {
    setText('[data-live-announcement]', getSetting('announcement'));
    setText('[data-live-special]', getSetting('special'));
    setText('[data-live-table]', getSetting('table'));
    setText('[data-live-mood]', getSetting('mood'));
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
      form.elements.mood.value = getSetting('mood');

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(form);
        setSetting('announcement', cleanShortText(data.get('announcement'), defaults.announcement));
        setSetting('special', cleanShortText(data.get('special'), defaults.special));
        setSetting('table', cleanShortText(data.get('table'), defaults.table));
        setSetting('mood', cleanShortText(data.get('mood'), defaults.mood));
        applyBossSettings();
        addSticker('changed-special', true);
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
          form.elements.mood.value = defaults.mood;
        }
        sparkle(resetButton);
      });
    }
  }

  function hasInvention() {
    return Boolean(cleanShortText(getSetting('dishName'), ''));
  }

  function getInvention() {
    return {
      emoji: cleanShortText(getSetting('dishEmoji'), '🍒'),
      name: cleanShortText(getSetting('dishName'), 'Secret menu item'),
      price: cleanShortText(getSetting('dishPrice'), '5 cherries'),
      note: cleanShortText(getSetting('dishNote'), 'Made by Chef Charlie at the Chef Desk.'),
      stamp: cleanShortText(getSetting('dishStamp'), 'Chef approved')
    };
  }

  function applyInvention() {
    const exists = hasInvention();
    const invention = getInvention();

    document.querySelectorAll('[data-invention-home], [data-invention-preview]').forEach(function (card) {
      card.hidden = !exists;
    });

    setText('[data-invention-emoji]', invention.emoji);
    setText('[data-invention-name]', invention.name);
    setText('[data-invention-price]', invention.price);
    setText('[data-invention-note]', invention.note);
    setText('[data-invention-stamp]', invention.stamp);

    document.querySelectorAll('[data-meal-select]').forEach(function (select) {
      const existing = Array.from(select.options).some(function (option) { return option.value === invention.name; });
      if (exists && !existing) {
        const option = document.createElement('option');
        option.value = invention.name;
        option.textContent = invention.emoji + ' ' + invention.name;
        select.appendChild(option);
      }
    });
  }

  function setupInventionForm() {
    const form = document.querySelector('[data-invention-form]');
    const resetButton = document.querySelector('[data-invention-reset]');

    if (form) {
      form.elements.emoji.value = getSetting('dishEmoji');
      form.elements.name.value = getSetting('dishName');
      form.elements.price.value = getSetting('dishPrice');
      form.elements.note.value = getSetting('dishNote');
      form.elements.stamp.value = getSetting('dishStamp');

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(form);
        setSetting('dishEmoji', cleanShortText(data.get('emoji'), '🍒'));
        setSetting('dishName', cleanShortText(data.get('name'), 'Charlie’s Secret Dish'));
        setSetting('dishPrice', cleanShortText(data.get('price'), '5 cherries'));
        setSetting('dishNote', cleanShortText(data.get('note'), 'Made by Chef Charlie at the Chef Desk.'));
        setSetting('dishStamp', cleanShortText(data.get('stamp'), 'Chef approved'));
        applyInvention();
        addSticker('invented-dish', true);
        confetti(46);
      });
    }

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        ['dishEmoji', 'dishName', 'dishPrice', 'dishNote', 'dishStamp'].forEach(removeSetting);
        if (form) form.reset();
        applyInvention();
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
        const next = chefNotes.find(function (note) { return note !== current; }) || chefNotes[0];
        noteOutput.textContent = next;
        sparkle(noteButton);
      });
    }
  }

  function setupPrintButtons() {
    document.querySelectorAll('[data-print]').forEach(function (button) {
      button.addEventListener('click', function () {
        addSticker('print', true);
        window.print();
      });
    });
  }

  function setupBookingForm() {
    const form = document.querySelector('[data-booking-form]');
    const confirmation = document.querySelector('[data-confirmation]');
    const ticket = document.querySelector('[data-order-ticket]');

    if (form && confirmation) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(form);
        const guest = cleanShortText(data.get('guest'), 'Guest');
        const guests = cleanShortText(data.get('guests'), '1 hungry person');
        const meal = cleanShortText(data.get('meal'), 'BBQ pork ribs');
        const request = cleanShortText(data.get('request'), 'Chef decides');
        const table = getSetting('table');

        confirmation.hidden = false;
        confirmation.innerHTML = '<h3>Booking confirmed!</h3>' +
          '<p>Chef Charlie has approved a pretend table for <strong>' + escapeHtml(guest) + '</strong>.</p>' +
          '<p>Guests: <strong>' + escapeHtml(guests) + '</strong><br>Kitchen alert: <strong>' + escapeHtml(meal) + '</strong></p>' +
          '<p>Please arrive hungry and ready for five-cherry service.</p>';

        if (ticket) {
          ticket.hidden = false;
          ticket.innerHTML = '<p class="eyebrow">Kitchen order ticket</p>' +
            '<h3>Charlies Cherries</h3>' +
            '<dl>' +
            '<div><dt>Guest</dt><dd>' + escapeHtml(guest) + '</dd></div>' +
            '<div><dt>Table</dt><dd>' + escapeHtml(table) + '</dd></div>' +
            '<div><dt>Guests</dt><dd>' + escapeHtml(guests) + '</dd></div>' +
            '<div><dt>Meal</dt><dd>' + escapeHtml(meal) + '</dd></div>' +
            '<div><dt>Chef instruction</dt><dd>' + escapeHtml(request) + '</dd></div>' +
            '</dl>' +
            '<p class="ticket-approved">Approved by Chef Charlie</p>' +
            '<button class="button button-primary" type="button" data-print-ticket>Print order ticket</button>';

          const printTicketButton = ticket.querySelector('[data-print-ticket]');
          if (printTicketButton) {
            printTicketButton.addEventListener('click', function () {
              addSticker('print', true);
              document.body.classList.add('ticket-printing');
              window.print();
              window.setTimeout(function () { document.body.classList.remove('ticket-printing'); }, 1000);
            });
          }
        }

        confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        addSticker('booking', true);
        confetti(34);
      });
    }
  }

  function setupMenuCards() {
    document.querySelectorAll('[data-menu-card]').forEach(function (card) {
      card.addEventListener('click', function () {
        addSticker('menu-tap', false);
        sparkle(card);
        renderStickerBooks();
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          addSticker('menu-tap', false);
          sparkle(card);
          renderStickerBooks();
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

  function setupOpeningChecklist() {
    const form = document.querySelector('[data-opening-checklist]');
    const output = document.querySelector('[data-opening-progress]');
    const resetButton = document.querySelector('[data-checklist-reset]');

    if (!form) return;

    const saved = getChecklistState();
    Array.from(form.elements).forEach(function (input) {
      if (input.type === 'checkbox') input.checked = Boolean(saved[input.name]);
    });
    updateChecklistProgress(form, output);

    form.addEventListener('change', function () {
      const next = {};
      Array.from(form.elements).forEach(function (input) {
        if (input.type === 'checkbox') next[input.name] = input.checked;
      });
      saveChecklistState(next);
      updateChecklistProgress(form, output);
      sparkle(form);
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        try { window.localStorage.removeItem(storageKeys.checklist); } catch (error) {}
        Array.from(form.elements).forEach(function (input) {
          if (input.type === 'checkbox') input.checked = false;
        });
        updateChecklistProgress(form, output);
        sparkle(resetButton);
      });
    }
  }

  function getChecklistState() {
    try {
      return JSON.parse(window.localStorage.getItem(storageKeys.checklist) || '{}');
    } catch (error) {
      return {};
    }
  }

  function saveChecklistState(value) {
    try {
      window.localStorage.setItem(storageKeys.checklist, JSON.stringify(value));
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function updateChecklistProgress(form, output) {
    const boxes = Array.from(form.elements).filter(function (input) { return input.type === 'checkbox'; });
    const done = boxes.filter(function (input) { return input.checked; }).length;
    if (output) output.textContent = done + ' of ' + boxes.length + ' opening jobs done.';
    if (done === boxes.length && boxes.length > 0) {
      addSticker('ready', true);
      confetti(32);
    }
    renderStickerBooks();
  }

  function setupStickerReset() {
    document.querySelectorAll('[data-sticker-reset]').forEach(function (button) {
      button.addEventListener('click', function () {
        try { window.localStorage.removeItem(storageKeys.stickers); } catch (error) {}
        unlockPageSticker();
        renderStickerBooks();
        sparkle(button);
      });
    });
  }

  function getStickers() {
    try {
      return JSON.parse(window.localStorage.getItem(storageKeys.stickers) || '[]');
    } catch (error) {
      return [];
    }
  }

  function addSticker(id, celebrate) {
    const stickers = getStickers();
    if (!stickers.includes(id)) {
      stickers.push(id);
      try { window.localStorage.setItem(storageKeys.stickers, JSON.stringify(stickers)); } catch (error) {}
      if (celebrate) confetti(18);
    }
    renderStickerBooks();
  }

  function renderStickerBooks() {
    const unlocked = getStickers();
    document.querySelectorAll('[data-sticker-book]').forEach(function (book) {
      book.innerHTML = stickerList.map(function (sticker) {
        const isUnlocked = unlocked.includes(sticker.id);
        return '<div class="sticker ' + (isUnlocked ? 'is-unlocked' : 'is-locked') + '">' +
          '<span aria-hidden="true">' + (isUnlocked ? sticker.icon : '🔒') + '</span>' +
          '<strong>' + escapeHtml(sticker.label) + '</strong>' +
          '<small>' + (isUnlocked ? 'Unlocked' : 'Keep exploring') + '</small>' +
          '</div>';
      }).join('');
    });
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
    return String(value).replace(/[&<>'"]/g, function (char) {
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
