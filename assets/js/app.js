(function () {
  const storageKeys = {
    announcement: 'charliesCherries.announcement',
    special: 'charliesCherries.special',
    table: 'charliesCherries.table',
    tableVigo: 'charliesCherries.tableVigo',
    tableStaggs: 'charliesCherries.tableStaggs',
    tableKim: 'charliesCherries.tableKim',
    mood: 'charliesCherries.mood',
    dessert: 'charliesCherries.dessert',
    openingHours: 'charliesCherries.openingHours',
    partyName: 'charliesCherries.partyName',
    partyDescription: 'charliesCherries.partyDescription',
    reviewQuote: 'charliesCherries.reviewQuote',
    reviewAuthor: 'charliesCherries.reviewAuthor',
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
    table: 'Vigo Views',
    tableVigo: 'Vigo Views',
    tableStaggs: 'Staggs Barber',
    tableKim: 'Eat with Kim',
    mood: 'Chef approved',
    dessert: 'Banana Split',
    openingHours: 'Open weekends for pretend dinner service',
    partyName: 'Weekend at Bernie’s Party Package',
    partyDescription: 'A very funny party with ribs, nuggets, donuts, ice cream and boss-approved table service.',
    reviewQuote: 'Best ribs I’ve had in Seddon.',
    reviewAuthor: 'A very serious local food critic',
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
    { id: 'dessert-boss', icon: '🍌', label: 'Added a dessert' },
    { id: 'renamed-tables', icon: '🪑', label: 'Named the tables' },
    { id: 'changed-hours', icon: '🕒', label: 'Set opening hours' },
    { id: 'party-package', icon: '🎉', label: 'Made a party package' },
    { id: 'review-added', icon: '💬', label: 'Added a review' },
    { id: 'invented-dish', icon: '✨', label: 'Invented a dish' },
    { id: 'booking', icon: '🧾', label: 'Took a booking' },
    { id: 'opening-day', icon: '✅', label: 'Visited Opening Day' },
    { id: 'ready', icon: '🏁', label: 'Restaurant ready' },
    { id: 'print', icon: '🖨️', label: 'Used the print station' },
    { id: 'menu-tap', icon: '⭐', label: 'Explored the menu' },
    { id: 'points', icon: '💯', label: 'Collected points' },
    { id: 'coffee', icon: '☕', label: 'Coffee helper' },
    { id: 'ice-cream', icon: '🍨', label: 'Ice cream expert' },
    { id: 'staff-badges', icon: '🏷️', label: 'Printed staff badges' }
  ];

  const chefNotes = [
    'Chef note: “Ribs must be delicious and a little bit messy.”',
    'Chef note: “Fried rice is excellent restaurant business.”',
    'Chef note: “Nana’s sausage rolls are very important.”',
    'Chef note: “Chicken nuggets are allowed at fancy restaurants.”',
    'Chef note: “Dessert is an important business decision.”',
    'Chef note: “Ice cream earns extra points.”'
  ];

  unlockPageSticker();
  applyRestaurantSettings();
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
  setupStickerButtons();
  renderStickerBooks();

  function unlockPageSticker() {
    const page = document.body.getAttribute('data-page');
    if (page === 'home') addSticker('opened', false);
    if (page === 'chef-desk') addSticker('chef-desk', false);
    if (page === 'opening-day') addSticker('opening-day', false);
    if (page === 'staff-badges') addSticker('staff-badges', false);
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
    [
      'announcement', 'special', 'table', 'tableVigo', 'tableStaggs', 'tableKim', 'mood',
      'dessert', 'openingHours', 'partyName', 'partyDescription', 'reviewQuote', 'reviewAuthor'
    ].forEach(removeSetting);
    applyRestaurantSettings();
  }

  function applyRestaurantSettings() {
    setText('[data-live-announcement]', getSetting('announcement'));
    setText('[data-live-special]', getSetting('special'));
    setText('[data-live-table]', getSetting('table'));
    setText('[data-live-table-vigo]', getSetting('tableVigo'));
    setText('[data-live-table-staggs]', getSetting('tableStaggs'));
    setText('[data-live-table-kim]', getSetting('tableKim'));
    setText('[data-live-mood]', getSetting('mood'));
    setText('[data-live-dessert]', getSetting('dessert'));
    setText('[data-live-hours]', getSetting('openingHours'));
    setText('[data-live-party-name]', getSetting('partyName'));
    setText('[data-live-party-description]', getSetting('partyDescription'));
    setText('[data-live-review-quote]', '“' + getSetting('reviewQuote') + '”');
    setText('[data-live-review-author]', getSetting('reviewAuthor'));
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
      setFormValue(form, 'announcement', getSetting('announcement'));
      setFormValue(form, 'special', getSetting('special'));
      setFormValue(form, 'table', getSetting('table'));
      setFormValue(form, 'tableVigo', getSetting('tableVigo'));
      setFormValue(form, 'tableStaggs', getSetting('tableStaggs'));
      setFormValue(form, 'tableKim', getSetting('tableKim'));
      setFormValue(form, 'mood', getSetting('mood'));
      setFormValue(form, 'dessert', getSetting('dessert'));
      setFormValue(form, 'openingHours', getSetting('openingHours'));
      setFormValue(form, 'partyName', getSetting('partyName'));
      setFormValue(form, 'partyDescription', getSetting('partyDescription'));
      setFormValue(form, 'reviewQuote', getSetting('reviewQuote'));
      setFormValue(form, 'reviewAuthor', getSetting('reviewAuthor'));

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(form);
        setSetting('announcement', cleanShortText(data.get('announcement'), defaults.announcement));
        setSetting('special', cleanShortText(data.get('special'), defaults.special));
        setSetting('table', cleanShortText(data.get('table'), defaults.table));
        setSetting('tableVigo', cleanShortText(data.get('tableVigo'), defaults.tableVigo));
        setSetting('tableStaggs', cleanShortText(data.get('tableStaggs'), defaults.tableStaggs));
        setSetting('tableKim', cleanShortText(data.get('tableKim'), defaults.tableKim));
        setSetting('mood', cleanShortText(data.get('mood'), defaults.mood));
        setSetting('dessert', cleanShortText(data.get('dessert'), defaults.dessert));
        setSetting('openingHours', cleanShortText(data.get('openingHours'), defaults.openingHours));
        setSetting('partyName', cleanShortText(data.get('partyName'), defaults.partyName));
        setSetting('partyDescription', cleanShortText(data.get('partyDescription'), defaults.partyDescription));
        setSetting('reviewQuote', cleanShortText(data.get('reviewQuote'), defaults.reviewQuote));
        setSetting('reviewAuthor', cleanShortText(data.get('reviewAuthor'), defaults.reviewAuthor));
        applyRestaurantSettings();
        addSticker('changed-special', false);
        addSticker('dessert-boss', false);
        addSticker('renamed-tables', false);
        addSticker('changed-hours', false);
        addSticker('party-package', false);
        addSticker('review-added', false);
        addSticker('points', false);
        confetti(48);
      });
    }

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        resetSettings();
        if (form) {
          Object.keys(defaults).forEach(function (name) { setFormValue(form, name, defaults[name]); });
          setFormValue(form, 'tableVigo', defaults.tableVigo);
          setFormValue(form, 'tableStaggs', defaults.tableStaggs);
          setFormValue(form, 'tableKim', defaults.tableKim);
          setFormValue(form, 'openingHours', defaults.openingHours);
          setFormValue(form, 'partyName', defaults.partyName);
          setFormValue(form, 'partyDescription', defaults.partyDescription);
          setFormValue(form, 'reviewQuote', defaults.reviewQuote);
          setFormValue(form, 'reviewAuthor', defaults.reviewAuthor);
        }
        sparkle(resetButton);
      });
    }
  }

  function setFormValue(form, name, value) {
    if (form.elements[name]) form.elements[name].value = value || '';
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
      setFormValue(form, 'emoji', getSetting('dishEmoji'));
      setFormValue(form, 'name', getSetting('dishName'));
      setFormValue(form, 'price', getSetting('dishPrice'));
      setFormValue(form, 'note', getSetting('dishNote'));
      setFormValue(form, 'stamp', getSetting('dishStamp'));

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
        addSticker('points', false);
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
        addSticker('print', false);
        if (document.body.getAttribute('data-page') === 'staff-badges') addSticker('staff-badges', false);
        addSticker('coffee', false);
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
              addSticker('print', false);
              addSticker('coffee', false);
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
        if (card.dataset.sticker) addSticker(card.dataset.sticker, false);
        sparkle(card);
        renderStickerBooks();
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          addSticker('menu-tap', false);
          if (card.dataset.sticker) addSticker(card.dataset.sticker, false);
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
      addSticker('points', false);
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

  function setupStickerButtons() {
    document.querySelectorAll('[data-unlock-sticker]').forEach(function (button) {
      button.addEventListener('click', function () {
        addSticker(button.getAttribute('data-unlock-sticker'), true);
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
