(function () {
  const canvas = document.getElementById('parkour-canvas');
  const ctx = canvas.getContext('2d');
  const W = 1024;
  const H = 576;
  const KEY = 'charliesCherries.funGames.cherryParkour';
  const SOUND = 'charliesCherries.funGames.sound';
  const $ = (selector) => document.querySelector(selector);

  const els = {
    level: $('[data-level-name]'),
    people: $('[data-people]'),
    food: $('[data-food]'),
    cherries: $('[data-cherries]'),
    checkpoint: $('[data-checkpoint]'),
    message: $('[data-message]'),
    start: $('[data-start-panel]'),
    pause: $('[data-pause-panel]'),
    complete: $('[data-complete-panel]'),
    completeTitle: $('[data-complete-title]'),
    completeLevel: $('[data-complete-level]'),
    finalPeople: $('[data-final-people]'),
    finalCherries: $('[data-final-cherries]'),
    peopleChampion: $('[data-people-champion]'),
    date: $('[data-win-date]'),
    sound: $('[data-sound-toggle]')
  };

  const defaults = {
    version: 2,
    voucherUnlocked: false,
    completionDate: '',
    levels: {
      easy: { started: false, completed: false, bestPeople: 0, bestCherries: 0 },
      challenge: { started: false, completed: false, bestPeople: 0, bestCherries: 0 }
    }
  };

  function readProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
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
      return JSON.parse(JSON.stringify(defaults));
    }
  }

  function writeProgress(progress) {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch (error) {
      // The game remains playable when local storage is unavailable.
    }
  }

  const levels = {
    easy: {
      id: 'easy',
      number: 'Level 1',
      title: 'Restaurant Rush',
      description: 'Big platforms, friendly checkpoints and lots of restaurant people.',
      worldWidth: 2580,
      finishX: 2350,
      speed: 4.05,
      gravity: 0.48,
      jump: -11.7,
      platforms: [
        { x: 0, y: 500, w: 260, h: 38, c: '#f0b15a', n: 'Kitchen Start' },
        { x: 290, y: 475, w: 220, h: 32, c: '#ffe5a3', n: 'Welcome Table' },
        { x: 540, y: 445, w: 250, h: 32, c: '#d8f5df', n: 'Nana’s Station' },
        { x: 820, y: 470, w: 240, h: 32, c: '#ffd1dc', n: 'Checkpoint 1', cp: 1 },
        { x: 1090, y: 430, w: 260, h: 32, c: '#f6d66d', n: 'Party Table' },
        { x: 1380, y: 455, w: 240, h: 32, c: '#d8f5df', n: 'Neighbour Table' },
        { x: 1650, y: 420, w: 270, h: 32, c: '#ffd1dc', n: 'Checkpoint 2', cp: 2 },
        { x: 1950, y: 445, w: 250, h: 32, c: '#ffe5a3', n: 'Customer Table' },
        { x: 2230, y: 400, w: 350, h: 40, c: '#f0b15a', n: 'Dessert Counter' }
      ],
      cherries: [
        { x: 680, y: 392 },
        { x: 1510, y: 402 },
        { x: 2110, y: 392 }
      ],
      foods: [
        { x: 620, y: 398, name: 'Nana’s Sausage Roll', icon: '🥐' },
        { x: 1190, y: 382, name: 'Chicken Nuggets', icon: '⭐' },
        { x: 2040, y: 397, name: 'Ice Cream', icon: '🍨' }
      ],
      people: [
        { x: 90, y: 446, name: 'Mum', text: 'Welcome to the obby!', shirt: '#e46a92' },
        { x: 350, y: 421, name: 'Dad', text: 'These jumps are nice and wide.', shirt: '#4d85d1' },
        { x: 690, y: 391, name: 'Nana', text: 'My sausage rolls are ready!', shirt: '#9a6bc4' },
        { x: 900, y: 416, name: 'Kim', text: 'Checkpoint! Keep going.', shirt: '#2fa47b' },
        { x: 1180, y: 376, name: 'Bernie', text: 'Party table this way!', shirt: '#e2823d' },
        { x: 1470, y: 401, name: 'Staggs', text: 'Great jump, Chef Charlie!', shirt: '#5e6a78' },
        { x: 1740, y: 366, name: 'Vigo Visitor', text: 'Second checkpoint!', shirt: '#4d85d1' },
        { x: 2050, y: 391, name: 'Hungry Customer', text: 'Dessert is just ahead!', shirt: '#e46a92' }
      ],
      checkpoints: [
        { x: 70, y: 430, label: 'Kitchen Start' },
        { x: 860, y: 400, label: 'Checkpoint 1' },
        { x: 1690, y: 350, label: 'Checkpoint 2' }
      ]
    },
    challenge: {
      id: 'challenge',
      number: 'Level 3',
      title: 'Dessert Dash Challenge',
      description: 'The original harder course, kept for when Charlie wants a bigger challenge.',
      worldWidth: 3090,
      finishX: 2870,
      speed: 4.4,
      gravity: 0.55,
      jump: -11.5,
      platforms: [
        { x: 0, y: 500, w: 210, h: 38, c: '#f0b15a', n: 'Kitchen Start' },
        { x: 245, y: 468, w: 160, h: 30, c: '#e8c07a', n: 'Prep Table' },
        { x: 435, y: 440, w: 150, h: 30, c: '#f6d66d', n: 'Food Crate' },
        { x: 640, y: 414, w: 170, h: 30, c: '#d8f5df', n: 'Picnic Bench' },
        { x: 870, y: 388, w: 150, h: 30, c: '#ffd1dc', n: 'Checkpoint 1', cp: 1 },
        { x: 1110, y: 430, w: 150, h: 28, c: '#f0b15a', n: 'Carpark Table' },
        { x: 1320, y: 392, w: 130, h: 28, c: '#ffe5a3', n: 'Takeaway Boxes' },
        { x: 1535, y: 352, w: 145, h: 28, c: '#d8f5df', n: 'Moving Tray', move: 45, base: 1535 },
        { x: 1755, y: 330, w: 135, h: 28, c: '#ffd1dc', n: 'Party Platform' },
        { x: 1980, y: 374, w: 155, h: 28, c: '#f6d66d', n: 'Checkpoint 2', cp: 2 },
        { x: 2225, y: 338, w: 120, h: 28, c: '#e8c07a', n: 'Dessert Display' },
        { x: 2425, y: 302, w: 120, h: 28, c: '#d8f5df', n: 'Ice Cream Tub' },
        { x: 2635, y: 326, w: 115, h: 28, c: '#ffd1dc', n: 'Final Jump' },
        { x: 2845, y: 374, w: 220, h: 34, c: '#ffe5a3', n: 'Dessert Counter' }
      ],
      cherries: [
        { x: 320, y: 430 },
        { x: 945, y: 350 },
        { x: 1605, y: 314 },
        { x: 2290, y: 300 },
        { x: 2690, y: 288 }
      ],
      foods: [
        { x: 690, y: 370, name: 'Nana’s Sausage Roll', icon: '🥐' },
        { x: 1830, y: 286, name: 'Chicken Nuggets', icon: '⭐' },
        { x: 2468, y: 260, name: 'Ice Cream', icon: '🍨' }
      ],
      people: [
        { x: 90, y: 446, name: 'Mum', text: 'Hard mode starts here!', shirt: '#e46a92' },
        { x: 480, y: 386, name: 'Dad', text: 'Take your time.', shirt: '#4d85d1' },
        { x: 690, y: 360, name: 'Nana', text: 'Grab the sausage roll!', shirt: '#9a6bc4' },
        { x: 920, y: 334, name: 'Kim', text: 'Checkpoint one!', shirt: '#2fa47b' },
        { x: 1360, y: 338, name: 'Bernie', text: 'Watch the moving tray.', shirt: '#e2823d' },
        { x: 1810, y: 276, name: 'Staggs', text: 'Big jump coming up!', shirt: '#5e6a78' },
        { x: 2025, y: 320, name: 'Vigo Visitor', text: 'Checkpoint two!', shirt: '#4d85d1' },
        { x: 2915, y: 320, name: 'Hungry Customer', text: 'You made it!', shirt: '#e46a92' }
      ],
      checkpoints: [
        { x: 70, y: 430, label: 'Kitchen Start' },
        { x: 910, y: 318, label: 'Checkpoint 1' },
        { x: 2015, y: 304, label: 'Checkpoint 2' }
      ]
    }
  };

  let level;
  let player;
  let keys = {};
  let running = false;
  let paused = false;
  let won = false;
  let cameraX = 0;
  let currentCheckpoint = 0;
  let lastFrame = 0;
  let audio;
  let muted = false;

  try {
    muted = localStorage.getItem(SOUND) === 'off';
  } catch (error) {
    muted = false;
  }

  function cloneLevel(source) {
    return {
      ...source,
      platforms: source.platforms.map((item) => ({ ...item })),
      cherries: source.cherries.map((item) => ({ ...item, got: false })),
      foods: source.foods.map((item) => ({ ...item, got: false })),
      people: source.people.map((item) => ({ ...item, met: false })),
      checkpoints: source.checkpoints.map((item) => ({ ...item }))
    };
  }

  function chooseLevel(mode) {
    level = cloneLevel(levels[mode] || levels.easy);
    reset(true);
    els.start.hidden = true;
    running = true;
    paused = false;
    const progress = readProgress();
    progress.levels[level.id].started = true;
    writeProgress(progress);
    setMessage(`${level.number}: ${level.title}. Meet the people, collect the food and reach dessert!`);
    if (audio) audio.resume();
  }

  function reset(full) {
    if (!level) level = cloneLevel(levels.easy);
    const start = level.checkpoints[0];
    player = { x: start.x, y: start.y, w: 38, h: 58, vx: 0, vy: 0, onGround: false };
    cameraX = 0;

    if (full) {
      level.cherries.forEach((item) => { item.got = false; });
      level.foods.forEach((item) => { item.got = false; });
      level.people.forEach((item) => { item.met = false; });
      currentCheckpoint = 0;
      won = false;
      els.complete.hidden = true;
    }

    updateHud();
  }

  function beep(frequency = 440, duration = 0.08) {
    if (muted) return;
    try {
      audio = audio || new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      gain.connect(audio.destination);
      gain.gain.value = 0.04;
      oscillator.start();
      oscillator.stop(audio.currentTime + duration);
    } catch (error) {
      // Sound is optional.
    }
  }

  function setMessage(text) {
    els.message.textContent = text;
    clearTimeout(setMessage.timer);
    setMessage.timer = setTimeout(() => {
      if (running && !paused && !won) {
        els.message.textContent = 'Meet the restaurant people, collect 3 foods and reach the dessert counter.';
      }
    }, 2600);
  }

  function collectItems() {
    level.cherries.forEach((item) => {
      if (!item.got && Math.abs(player.x - item.x) < 38 && Math.abs(player.y - item.y) < 54) {
        item.got = true;
        beep(760);
        setMessage('Bonus cherry collected!');
      }
    });

    level.foods.forEach((item) => {
      if (!item.got && Math.abs(player.x - item.x) < 46 && Math.abs(player.y - item.y) < 58) {
        item.got = true;
        beep(520);
        setMessage(`${item.name} collected!`);
      }
    });

    level.people.forEach((person) => {
      if (!person.met && Math.abs(player.x - person.x) < 74 && Math.abs(player.y - person.y) < 90) {
        person.met = true;
        beep(620);
        setMessage(`${person.name}: “${person.text}”`);
      }
    });

    updateHud();
  }

  function updateHud() {
    const peopleMet = level.people.filter((item) => item.met).length;
    const foodCollected = level.foods.filter((item) => item.got).length;
    const cherriesCollected = level.cherries.filter((item) => item.got).length;
    els.level.textContent = `${level.number}: ${level.title}`;
    els.people.textContent = `${peopleMet} / ${level.people.length}`;
    els.food.textContent = `${foodCollected} / ${level.foods.length}`;
    els.cherries.textContent = `${cherriesCollected} / ${level.cherries.length}`;
    els.checkpoint.textContent = level.checkpoints[currentCheckpoint].label;
  }

  function respawn() {
    const checkpoint = level.checkpoints[currentCheckpoint];
    player.x = checkpoint.x;
    player.y = checkpoint.y;
    player.vx = 0;
    player.vy = 0;
    setMessage([
      'Almost! Try that jump again.',
      'Chef Charlie is back at the checkpoint.',
      'The restaurant people are cheering for you!'
    ][Math.floor(Math.random() * 3)]);
    beep(220);
  }

  function step(time) {
    const delta = Math.min((time - lastFrame) / 16.67, 2) || 1;
    lastFrame = time;

    if (running && !paused && !won) {
      level.platforms.forEach((platform) => {
        if (platform.move) platform.x = platform.base + Math.sin(time / 1300) * platform.move;
      });

      player.vx = ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * level.speed;
      player.vy += level.gravity * delta;
      player.x += player.vx * delta;
      player.y += player.vy * delta;
      player.x = Math.max(0, Math.min(player.x, level.worldWidth - player.w));
      player.onGround = false;

      level.platforms.forEach((platform) => {
        const landing = player.x + player.w > platform.x &&
          player.x < platform.x + platform.w &&
          player.y + player.h > platform.y &&
          player.y + player.h < platform.y + 34 &&
          player.vy >= 0;

        if (landing) {
          player.y = platform.y - player.h;
          player.vy = 0;
          player.onGround = true;

          if (platform.cp && currentCheckpoint < platform.cp) {
            currentCheckpoint = platform.cp;
            setMessage(`${platform.n} reached!`);
            beep(660);
          }
        }
      });

      collectItems();

      if (player.y > 650) respawn();

      if (player.x > level.finishX) {
        if (level.foods.every((item) => item.got)) {
          win();
        } else {
          setMessage('Collect all three food items before dessert opens!');
        }
      }

      cameraX = Math.max(0, Math.min(player.x - 230, level.worldWidth - W));
    }

    draw(time);
    requestAnimationFrame(step);
  }

  function jump() {
    if (player.onGround && running && !paused && !won) {
      player.vy = level.jump;
      player.onGround = false;
      beep(330);
    }
  }

  function win() {
    won = true;
    running = false;

    const peopleMet = level.people.filter((item) => item.met).length;
    const cherriesCollected = level.cherries.filter((item) => item.got).length;
    const date = new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });
    const progress = readProgress();
    const savedLevel = progress.levels[level.id];

    savedLevel.started = true;
    savedLevel.completed = true;
    savedLevel.bestPeople = Math.max(peopleMet, savedLevel.bestPeople || 0);
    savedLevel.bestCherries = Math.max(cherriesCollected, savedLevel.bestCherries || 0);
    progress.voucherUnlocked = true;
    progress.completionDate = date;
    writeProgress(progress);

    els.completeTitle.textContent = `${level.number} complete!`;
    els.completeLevel.textContent = level.title;
    els.finalPeople.textContent = `${peopleMet} / ${level.people.length}`;
    els.finalCherries.textContent = `${cherriesCollected} / ${level.cherries.length}`;
    els.peopleChampion.hidden = peopleMet !== level.people.length;
    els.date.textContent = date;
    els.complete.hidden = false;
    beep(880, 0.2);
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#9ed8ff');
    gradient.addColorStop(0.72, '#fff8ec');
    gradient.addColorStop(1, '#f8dba8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    drawCloud(130 - cameraX * 0.08, 105, 1.1);
    drawCloud(620 - cameraX * 0.06, 145, 0.9);
    drawCloud(920 - cameraX * 0.04, 82, 0.7);

    ctx.fillStyle = '#7b1530';
    ctx.font = '900 24px sans-serif';
    ctx.fillText('CHARLIES CHERRIES PEOPLE OBBY', 34 - cameraX * 0.12, 52);

    level.platforms.forEach((platform) => drawPlatform(platform));
    level.people.forEach((person) => drawPerson(person));

    level.cherries.forEach((item) => {
      if (!item.got) {
        ctx.font = '28px sans-serif';
        ctx.fillText('🍒', item.x - cameraX, item.y);
      }
    });

    level.foods.forEach((item) => {
      if (!item.got) {
        ctx.font = '31px sans-serif';
        ctx.fillText(item.icon, item.x - cameraX, item.y);
        ctx.fillStyle = '#7b1530';
        ctx.font = '900 12px sans-serif';
        ctx.fillText(item.name, item.x - cameraX - 36, item.y + 28);
      }
    });

    drawPlayer(player.x - cameraX, player.y, time);

    ctx.fillStyle = '#7b1530';
    ctx.font = '900 22px sans-serif';
    ctx.fillText('DESSERT', level.finishX - cameraX + 10, 345);
  }

  function drawPlatform(platform) {
    const x = platform.x - cameraX;
    ctx.fillStyle = platform.c;
    roundedRect(x, platform.y, platform.w, platform.h, 8);
    ctx.fillStyle = 'rgba(255,255,255,.38)';
    ctx.fillRect(x + 8, platform.y + 6, Math.max(0, platform.w - 16), 5);
    ctx.fillStyle = '#7b1530';
    ctx.font = '900 13px sans-serif';
    ctx.fillText(platform.n, x + 10, platform.y + 22);

    if (platform.cp) {
      ctx.fillStyle = '#38a169';
      ctx.fillRect(x + platform.w - 34, platform.y - 28, 24, 28);
      ctx.fillStyle = '#fff';
      ctx.font = '900 15px sans-serif';
      ctx.fillText('✓', x + platform.w - 29, platform.y - 8);
    }
  }

  function drawPerson(person) {
    const x = person.x - cameraX;
    const y = person.y;
    const metMark = person.met ? ' ✓' : '';

    ctx.fillStyle = 'rgba(255,255,255,.96)';
    roundedRect(x - 34, y - 54, 168, 38, 11);
    ctx.fillStyle = '#33212a';
    ctx.font = '900 12px sans-serif';
    ctx.fillText(`${person.name}${metMark}`, x - 26, y - 31);

    drawBlockCharacter(x, y, person.shirt, false);
  }

  function drawPlayer(x, y, time) {
    drawBlockCharacter(x, y, '#b4234a', true);
    const bob = player.onGround ? 0 : Math.sin(time / 80) * 2;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 7, y - 9 + bob, 24, 8);
    ctx.fillRect(x + 11, y - 15 + bob, 16, 7);
    ctx.fillStyle = '#b4234a';
    ctx.font = '18px sans-serif';
    ctx.fillText('🍒', x + 8, y + 38);
  }

  function drawBlockCharacter(x, y, shirt, chef) {
    ctx.fillStyle = '#f3c6a5';
    ctx.fillRect(x + 7, y, 24, 22);
    ctx.fillStyle = '#33212a';
    ctx.fillRect(x + 11, y + 7, 3, 3);
    ctx.fillRect(x + 24, y + 7, 3, 3);
    ctx.fillRect(x + 15, y + 15, 9, 2);

    ctx.fillStyle = shirt;
    ctx.fillRect(x + 5, y + 22, 28, 26);
    ctx.fillRect(x - 2, y + 24, 7, 25);
    ctx.fillRect(x + 33, y + 24, 7, 25);

    ctx.fillStyle = chef ? '#fff' : '#334155';
    ctx.fillRect(x + 7, y + 48, 10, 19);
    ctx.fillRect(x + 22, y + 48, 10, 19);
  }

  function drawCloud(x, y, scale) {
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.beginPath();
    ctx.arc(x, y, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 28 * scale, y - 10 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 62 * scale, y, 24 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
    ctx.strokeStyle = 'rgba(123,21,48,.25)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function setPause(value) {
    if (!running || won) return;
    paused = value;
    els.pause.hidden = !value;
  }

  window.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'a', 'A'].includes(event.key)) keys.left = true;
    if (['ArrowRight', 'd', 'D'].includes(event.key)) keys.right = true;
    if ([' ', 'ArrowUp', 'w', 'W'].includes(event.key)) {
      event.preventDefault();
      jump();
    }
    if (event.key === 'Escape') setPause(!paused);
  });

  window.addEventListener('keyup', (event) => {
    if (['ArrowLeft', 'a', 'A'].includes(event.key)) keys.left = false;
    if (['ArrowRight', 'd', 'D'].includes(event.key)) keys.right = false;
  });

  document.querySelectorAll('[data-hold]').forEach((button) => {
    const direction = button.dataset.hold;
    const press = (event) => {
      event.preventDefault();
      keys[direction] = true;
      button.classList.add('is-down');
    };
    const release = (event) => {
      event.preventDefault();
      keys[direction] = false;
      button.classList.remove('is-down');
    };

    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
  });

  $('[data-jump]').addEventListener('pointerdown', (event) => {
    event.preventDefault();
    jump();
  });

  document.querySelectorAll('[data-start-mode]').forEach((button) => {
    button.addEventListener('click', () => chooseLevel(button.dataset.startMode));
  });

  $('[data-pause]').addEventListener('click', () => setPause(true));
  $('[data-resume]').addEventListener('click', () => setPause(false));
  $('[data-restart-checkpoint]').addEventListener('click', () => {
    setPause(false);
    respawn();
  });
  $('[data-restart-level]').addEventListener('click', () => {
    setPause(false);
    reset(true);
    running = true;
  });
  $('[data-play-again]').addEventListener('click', () => {
    reset(true);
    els.start.hidden = true;
    running = true;
  });

  document.querySelectorAll('[data-print-voucher]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });

  $('[data-sound-toggle]').addEventListener('click', () => {
    muted = !muted;
    try {
      localStorage.setItem(SOUND, muted ? 'off' : 'on');
    } catch (error) {
      // Sound preference is optional.
    }
    els.sound.textContent = muted ? 'Sound off' : 'Sound on';
  });

  const requestedMode = new URLSearchParams(window.location.search).get('level');
  if (requestedMode === 'challenge') {
    document.querySelector('[data-mode-card="challenge"]')?.classList.add('mode-card--selected');
    document.querySelector('[data-start-mode="challenge"]')?.focus();
  } else {
    document.querySelector('[data-mode-card="easy"]')?.classList.add('mode-card--selected');
  }

  els.sound.textContent = muted ? 'Sound off' : 'Sound on';
  level = cloneLevel(levels.easy);
  reset(true);
  requestAnimationFrame(step);
}());
