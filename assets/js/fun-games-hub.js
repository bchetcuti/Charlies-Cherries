(function () {
  const key = 'charliesCherries.funGames.cherryParkour';
  const defaults = {
    version: 2,
    voucherUnlocked: false,
    completionDate: '',
    levels: {
      easy: { started: false, completed: false, bestPeople: 0, bestCherries: 0 },
      challenge: { started: false, completed: false, bestPeople: 0, bestCherries: 0 }
    }
  };

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || '{}');
      if (raw.levels) {
        return {
          ...defaults,
          ...raw,
          levels: {
            easy: { ...defaults.levels.easy, ...(raw.levels.easy || {}) },
            challenge: { ...defaults.levels.challenge, ...(raw.levels.challenge || {}) }
          }
        };
      }

      return {
        ...defaults,
        voucherUnlocked: Boolean(raw.voucherUnlocked),
        completionDate: raw.completionDate || '',
        levels: {
          easy: { ...defaults.levels.easy },
          challenge: {
            started: Boolean(raw.started),
            completed: Boolean(raw.completed),
            bestPeople: 0,
            bestCherries: Number(raw.bestCherries) || 0
          }
        }
      };
    } catch (error) {
      return defaults;
    }
  }

  function write(value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Progress is optional.
    }
  }

  function status(level) {
    if (level.completed) return 'Completed';
    if (level.started || level.bestPeople > 0 || level.bestCherries > 0) return 'In progress';
    return 'Not started';
  }

  const progress = read();
  const easy = progress.levels.easy;
  const challenge = progress.levels.challenge;
  const panel = document.querySelector('[data-voucher-panel]');
  const date = document.querySelector('[data-completion-date]');

  document.querySelector('[data-level1-status]').textContent = status(easy);
  document.querySelector('[data-level1-people]').textContent = `${easy.bestPeople || 0} / 8`;
  document.querySelector('[data-level3-status]').textContent = status(challenge);
  document.querySelector('[data-level3-people]').textContent = `${challenge.bestPeople || 0} / 8`;

  if (progress.voucherUnlocked && panel) {
    panel.hidden = false;
    if (date) date.textContent = progress.completionDate || 'Completed on this device';
  }

  document.querySelector('[data-print-voucher]')?.addEventListener('click', () => window.print());
  document.querySelector('[data-reset-games]')?.addEventListener('click', () => {
    write(defaults);
    location.reload();
  });
}());
