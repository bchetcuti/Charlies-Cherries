(function () {
  const chefNotes = [
    'Chef note: “Ribs must be delicious and a little bit messy.”',
    'Chef note: “Lasagne needs lots of layers and boss energy.”',
    'Chef note: “Chicken wings are best when everyone says wow.”',
    'Chef note: “All customers must arrive hungry.”',
    'Chef note: “Dessert is an important business decision.”'
  ];

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

  document.querySelectorAll('[data-print]').forEach(function (button) {
    button.addEventListener('click', function () { window.print(); });
  });

  const form = document.querySelector('[data-booking-form]');
  const confirmation = document.querySelector('[data-confirmation]');

  if (form && confirmation) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const guest = String(data.get('guest') || 'Guest').trim() || 'Guest';
      const guests = String(data.get('guests') || '1 hungry person');
      const meal = String(data.get('meal') || 'BBQ pork ribs');

      confirmation.hidden = false;
      confirmation.innerHTML = '<h3>Booking confirmed!</h3>' +
        '<p>Chef Charlie has approved a pretend table for <strong>' + escapeHtml(guest) + '</strong>.</p>' +
        '<p>Guests: <strong>' + escapeHtml(guests) + '</strong><br>Kitchen alert: <strong>' + escapeHtml(meal) + '</strong></p>' +
        '<p>Please arrive hungry and ready for five-cherry service.</p>';
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      confetti();
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
      window.setTimeout(() => piece.remove(), 1300);
    }
  }

  function confetti() {
    for (let i = 0; i < 34; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = (Math.random() * 100) + 'vw';
      piece.style.background = ['#b4234a', '#ffe5a3', '#d8f5df', '#7b1530', '#ff8fab'][i % 5];
      piece.style.animationDelay = (Math.random() * 120) + 'ms';
      piece.style.animationDuration = (900 + Math.random() * 800) + 'ms';
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 1900);
    }
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
