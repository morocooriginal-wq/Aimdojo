/* ================================================================
   AimDojo — 3D FPS Precision Trainer
   10 Distinct Modes · 160° Clamped Arc · Daily Challenge · Modern Architecture
   ================================================================ */

// ─────────────── Audio Feedback (Web Audio API) ───────────────
const SFX = (() => {
  let ctx;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function getVolume() {
    return (Settings.get().volume || 80) / 100;
  }

  function playHit() {
    try {
      const vol = getVolume(); if (vol <= 0) return;
      const c = getCtx(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'triangle';
      o.frequency.setValueAtTime(987.77, c.currentTime); // B5
      o.frequency.exponentialRampToValueAtTime(1318.51, c.currentTime + 0.06); // E6
      g.gain.setValueAtTime(0.25 * vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.09);
      o.start(c.currentTime); o.stop(c.currentTime + 0.09);
    } catch (e) { /* ignore */ }
  }

  function playHeadshot() {
    try {
      const vol = getVolume(); if (vol <= 0) return;
      const c = getCtx(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(1400, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(2200, c.currentTime + 0.08);
      g.gain.setValueAtTime(0.3 * vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
      o.start(c.currentTime); o.stop(c.currentTime + 0.12);
    } catch (e) { /* ignore */ }
  }

  function playMiss() {
    try {
      const vol = getVolume(); if (vol <= 0) return;
      const c = getCtx(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(180, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(75, c.currentTime + 0.11);
      g.gain.setValueAtTime(0.1 * vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.11);
      o.start(c.currentTime); o.stop(c.currentTime + 0.11);
    } catch (e) { /* ignore */ }
  }

  function playCountdown() {
    try {
      const vol = getVolume(); if (vol <= 0) return;
      const c = getCtx(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(600, c.currentTime);
      g.gain.setValueAtTime(0.15 * vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
      o.start(c.currentTime); o.stop(c.currentTime + 0.18);
    } catch (e) { /* ignore */ }
  }

  function playGo() {
    try {
      const vol = getVolume(); if (vol <= 0) return;
      const c = getCtx(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(950, c.currentTime);
      g.gain.setValueAtTime(0.25 * vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
      o.start(c.currentTime); o.stop(c.currentTime + 0.3);
    } catch (e) { /* ignore */ }
  }

  function playClick() {
    try {
      const vol = getVolume(); if (vol <= 0) return;
      const c = getCtx(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(800, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.04);
      g.gain.setValueAtTime(0.12 * vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);
      o.start(c.currentTime); o.stop(c.currentTime + 0.04);
    } catch (e) { /* ignore */ }
  }

  return { playHit, playHeadshot, playMiss, playCountdown, playGo, playClick };
})();

// ─────────────── 2D Ambient Background Particles (Menu) ───────────────
const BG = (() => {
  const canvas = document.getElementById('bgCanvas');
  const cx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  const NUM = 60;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < NUM; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.5 ? '255,70,85' : '0,229,255'
      });
    }
    animate();
  }

  function animate() {
    cx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(${p.color},${p.a})`;
      cx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          cx.beginPath();
          cx.moveTo(particles[i].x, particles[i].y);
          cx.lineTo(particles[j].x, particles[j].y);
          cx.strokeStyle = `rgba(0,229,255,${0.05 * (1 - dist / 110)})`;
          cx.lineWidth = 0.5;
          cx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  return { init };
})();

// ─────────────── FPS Counter ───────────────
const FPS = (() => {
  let frames = 0, lastTime = performance.now();
  const el = document.getElementById('fpsCounter');

  function update() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 500) {
      if (el) el.textContent = Math.round(frames / ((now - lastTime) / 1000)) + ' FPS';
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(update);
  }

  return { start: () => requestAnimationFrame(update) };
})();

// ─────────────── 10 MODES (Ranked Easy to Pro with Unique Aesthetics) ───────────────
const MODES = [
  {
    id: 'static',
    name: 'Static Targets',
    difficulty: 'Easy',
    desc: '3 big stationary spheres. Build rhythm and clean center-screen clicks.',
    rules: ['3 persistent targets', 'Immediate respawn on hit', 'Accuracy focus'],
    icon: '🎯',
    duration: 30,
    targetRadius: 0.42,
    targetCount: 3,
    minAcc: 40,
    speed: 0,
    distance: 11.5,
    theme: {
      bg: 0x070b12,
      fog: 0x070b12,
      floor: 0x0d131f,
      grid1: 0x00e5ff,
      grid2: 0x142033,
      wall: 0x101726,
      wallTrim: 0x00e5ff,
      ambient: 0x22334d,
      dirLight1: 0xaaccff,
      dirLight2: 0x00e5ff,
      targetColor: 0x00e5ff,
      targetEmissive: 0x0088aa,
      targetRing: 0xff4655,
      targetDot: 0xffffff
    }
  },
  {
    id: 'timing',
    name: 'Click Timing',
    difficulty: 'Easy',
    desc: 'Targets appear and disappear rapidly. Shoot each one before it vanishes.',
    rules: ['Targets vanish after 1.6s', 'Despawn counts as a miss', 'Rhythm and pacing'],
    icon: '⏱️',
    duration: 30,
    targetRadius: 0.38,
    targetCount: 3,
    minAcc: 45,
    speed: 0,
    lifespan: 1.6, // seconds before vanishing
    distance: 12.0,
    theme: {
      bg: 0x140d05,
      fog: 0x140d05,
      floor: 0x1f1408,
      grid1: 0xff9100,
      grid2: 0x33200a,
      wall: 0x24170a,
      wallTrim: 0xff9100,
      ambient: 0x4a3010,
      dirLight1: 0xffd599,
      dirLight2: 0xff9100,
      targetColor: 0xffb300,
      targetEmissive: 0xcc6600,
      targetRing: 0xffffff,
      targetDot: 0xff3d00
    }
  },
  {
    id: 'tracking',
    name: 'Smooth Tracking',
    difficulty: 'Medium',
    desc: 'Continuously follow a moving target. Hold your crosshair locked on target.',
    rules: ['Target glides along smooth 3D curves', 'Score increases while on target', 'Smooth mouse motion'],
    icon: '🏹',
    duration: 30,
    targetRadius: 0.40,
    targetCount: 1,
    minAcc: 30,
    speed: 3.8,
    distance: 11.0,
    theme: {
      bg: 0x050c17,
      fog: 0x050c17,
      floor: 0x091424,
      grid1: 0x2979ff,
      grid2: 0x11233d,
      wall: 0x0e1c33,
      wallTrim: 0x2979ff,
      ambient: 0x1c355e,
      dirLight1: 0x82b1ff,
      dirLight2: 0x2979ff,
      targetColor: 0x2979ff,
      targetEmissive: 0x0044cc,
      targetRing: 0x00e5ff,
      targetDot: 0xffffff
    }
  },
  {
    id: 'flicks',
    name: 'Flick Shots',
    difficulty: 'Medium',
    desc: 'Targets spawn at wide angles across your 160° view. Rapid peripheral snaps.',
    rules: ['Wide peripheral spawn angles', 'Snap quickly to each target', 'Reset to center'],
    icon: '💥',
    duration: 30,
    targetRadius: 0.32,
    targetCount: 1,
    minAcc: 35,
    speed: 0,
    distance: 12.5,
    wideFlick: true,
    theme: {
      bg: 0x140507,
      fog: 0x140507,
      floor: 0x21080b,
      grid1: 0xff1744,
      grid2: 0x3d0f14,
      wall: 0x290a0f,
      wallTrim: 0xff1744,
      ambient: 0x471018,
      dirLight1: 0xff8a80,
      dirLight2: 0xff1744,
      targetColor: 0xff1744,
      targetEmissive: 0x99001a,
      targetRing: 0xffffff,
      targetDot: 0xffeb3b
    }
  },
  {
    id: 'micro',
    name: 'Micro Flicks',
    difficulty: 'Medium',
    desc: '4 very small targets clustered closely together. Train fine wrist & fingertip aim.',
    rules: ['Small target radius (0.24m)', 'Tight grouping', 'Micro precision adjustments'],
    icon: '⚡',
    duration: 30,
    targetRadius: 0.24,
    targetCount: 4,
    minAcc: 40,
    speed: 0,
    distance: 12.0,
    tightGroup: true,
    theme: {
      bg: 0x05140b,
      fog: 0x05140b,
      floor: 0x0a2414,
      grid1: 0x00e676,
      grid2: 0x113d21,
      wall: 0x0d2e19,
      wallTrim: 0x00e676,
      ambient: 0x1a4d2b,
      dirLight1: 0xb9f6ca,
      dirLight2: 0x00e676,
      targetColor: 0x00e676,
      targetEmissive: 0x009944,
      targetRing: 0xffffff,
      targetDot: 0x004d20
    }
  },
  {
    id: 'strafe',
    name: 'Strafe Tracking',
    difficulty: 'Hard',
    desc: 'Target performs erratic counter-strafes and speed changes like a real player.',
    rules: ['Unpredictable direction switches', 'Variable strafe speed', 'Read player movement'],
    icon: '↔️',
    duration: 30,
    targetRadius: 0.35,
    targetCount: 1,
    minAcc: 30,
    speed: 5.2,
    distance: 11.5,
    theme: {
      bg: 0x100517,
      fog: 0x100517,
      floor: 0x1b0a26,
      grid1: 0xd500f9,
      grid2: 0x331247,
      wall: 0x250c38,
      wallTrim: 0xd500f9,
      ambient: 0x471866,
      dirLight1: 0xea80fc,
      dirLight2: 0xd500f9,
      targetColor: 0xd500f9,
      targetEmissive: 0x770088,
      targetRing: 0x00e5ff,
      targetDot: 0xffffff
    }
  },
  {
    id: 'headshot',
    name: 'Headshot Line',
    difficulty: 'Hard',
    desc: 'Targets strictly locked at head height (1.7m). Body hits count as misses!',
    rules: ['Locked at eye-level horizon', 'Hit cyan head sphere only', 'Body shots count as miss'],
    icon: '💀',
    duration: 35,
    targetRadius: 0.22,
    targetCount: 2,
    minAcc: 35,
    speed: 0,
    distance: 12.5,
    headshotOnly: true,
    theme: {
      bg: 0x120a05,
      fog: 0x120a05,
      floor: 0x1f120a,
      grid1: 0xff3d00,
      grid2: 0x381f12,
      wall: 0x29160d,
      wallTrim: 0xff3d00,
      ambient: 0x4f2b1a,
      dirLight1: 0xff9e80,
      dirLight2: 0xff3d00,
      targetColor: 0x00e5ff,
      targetEmissive: 0x0088aa,
      targetRing: 0xff3d00,
      targetDot: 0xffffff
    }
  },
  {
    id: 'reaction',
    name: 'Reaction Test',
    difficulty: 'Hard',
    desc: 'Target flashes after random idle delay (1.0s - 2.5s). Click with instant reflex.',
    rules: ['Wait for target flash', 'Reaction measured in milliseconds', 'Speed under 220ms is elite'],
    icon: '⚡',
    duration: 30,
    targetRadius: 0.38,
    targetCount: 1,
    minAcc: 50,
    speed: 0,
    distance: 12.0,
    reactionMode: true,
    theme: {
      bg: 0x030305,
      fog: 0x030305,
      floor: 0x08080d,
      grid1: 0x555577,
      grid2: 0x151522,
      wall: 0x0c0c14,
      wallTrim: 0xffffff,
      ambient: 0x1a1a2e,
      dirLight1: 0xffffff,
      dirLight2: 0x7777aa,
      targetColor: 0xffffff,
      targetEmissive: 0xaaaaaa,
      targetRing: 0xffd700,
      targetDot: 0xff0055
    }
  },
  {
    id: 'precision',
    name: 'Precision Longshot',
    difficulty: 'Pro',
    desc: 'Tiny targets at extended 16m distance. Requires surgical pixel accuracy.',
    rules: ['Micro target radius (0.17m)', 'Long range (16m)', 'Extreme punishment for misses'],
    icon: '🔬',
    duration: 35,
    targetRadius: 0.17,
    targetCount: 3,
    minAcc: 45,
    speed: 0,
    distance: 16.0,
    theme: {
      bg: 0x07111a,
      fog: 0x07111a,
      floor: 0x0c1e2e,
      grid1: 0x00e5ff,
      grid2: 0x15354f,
      wall: 0x10273b,
      wallTrim: 0x00e5ff,
      ambient: 0x204e73,
      dirLight1: 0xe0f7fa,
      dirLight2: 0x00e5ff,
      targetColor: 0x00e5ff,
      targetEmissive: 0x0099bb,
      targetRing: 0xffffff,
      targetDot: 0x003344
    }
  },
  {
    id: 'promix',
    name: 'Pro Mix Arena',
    difficulty: 'Pro',
    desc: 'The ultimate test: 4 agile targets mixing strafes, flicks, and varying heights.',
    rules: ['Moving + static targets', 'Dynamic heights & angles', 'High target velocity'],
    icon: '🏆',
    duration: 40,
    targetRadius: 0.22,
    targetCount: 4,
    minAcc: 40,
    speed: 5.8,
    distance: 13.0,
    isProMix: true,
    theme: {
      bg: 0x140e02,
      fog: 0x140e02,
      floor: 0x241904,
      grid1: 0xffd700,
      grid2: 0x47320a,
      wall: 0x2e2007,
      wallTrim: 0xffd700,
      ambient: 0x573e0d,
      dirLight1: 0xffecb3,
      dirLight2: 0xffd700,
      targetColor: 0xffd700,
      targetEmissive: 0xb8860b,
      targetRing: 0xff4655,
      targetDot: 0xffffff
    }
  }
];

// 5-Stage Progressive Daily Challenge (Easiest to Hardest, 30s each)
const DAILY_STAGES = [
  { modeId: 'static', duration: 30 },
  { modeId: 'timing', duration: 30 },
  { modeId: 'tracking', duration: 30 },
  { modeId: 'strafe', duration: 30 },
  { modeId: 'promix', duration: 30 }
];

// ─────────────── Simplified Settings ───────────────
const Settings = (() => {
  const DEFAULTS = {
    sens: 1.0,
    volume: 80,
    fov: 103,
    xhairColor: '#00ff00',
    xhairSize: 6,
    xhairGap: 3,
    xhairThick: 2
  };

  let current = { ...DEFAULTS };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem('aimdojo_settings'));
      if (saved) {
        current = { ...DEFAULTS, ...saved };
        // Normalize single sens
        if (typeof current.sens !== 'number' || isNaN(current.sens) || current.sens <= 0) {
          current.sens = 1.0;
        }
      }
    } catch (e) { /* ignore */ }
    applyToDOM();
    update();
  }

  function save() {
    localStorage.setItem('aimdojo_settings', JSON.stringify(current));
  }

  function applyToDOM() {
    const sensNum = document.getElementById('set-sens');
    const sensSlider = document.getElementById('set-sens-slider');
    if (sensNum) sensNum.value = current.sens.toFixed(2);
    if (sensSlider) sensSlider.value = current.sens;

    const volEl = document.getElementById('set-volume'); if (volEl) volEl.value = current.volume;
    const fovEl = document.getElementById('set-fov'); if (fovEl) fovEl.value = current.fov;
    const colorEl = document.getElementById('set-xhair-color'); if (colorEl) colorEl.value = current.xhairColor;
    const sizeEl = document.getElementById('set-xhair-size'); if (sizeEl) sizeEl.value = current.xhairSize;
    const gapEl = document.getElementById('set-xhair-gap'); if (gapEl) gapEl.value = current.xhairGap;
    const thickEl = document.getElementById('set-xhair-thick'); if (thickEl) thickEl.value = current.xhairThick;
  }

  function onSliderChange() {
    const slider = document.getElementById('set-sens-slider');
    const num = document.getElementById('set-sens');
    if (slider && num) {
      num.value = parseFloat(slider.value).toFixed(2);
    }
    update();
  }

  function onNumberChange() {
    const slider = document.getElementById('set-sens-slider');
    const num = document.getElementById('set-sens');
    if (slider && num) {
      slider.value = num.value;
    }
    update();
  }

  function update() {
    const sensNum = document.getElementById('set-sens');
    if (sensNum) current.sens = Math.max(0.05, Math.min(10, parseFloat(sensNum.value) || 1.0));

    const volEl = document.getElementById('set-volume');
    if (volEl) current.volume = parseInt(volEl.value) || 80;

    const fovEl = document.getElementById('set-fov');
    if (fovEl) current.fov = parseInt(fovEl.value) || 103;

    const colorEl = document.getElementById('set-xhair-color');
    if (colorEl) current.xhairColor = colorEl.value;

    const sizeEl = document.getElementById('set-xhair-size');
    if (sizeEl) current.xhairSize = parseInt(sizeEl.value) || 6;

    const gapEl = document.getElementById('set-xhair-gap');
    if (gapEl) current.xhairGap = parseInt(gapEl.value) || 3;

    const thickEl = document.getElementById('set-xhair-thick');
    if (thickEl) current.xhairThick = parseInt(thickEl.value) || 2;

    const volVal = document.getElementById('volumeVal');
    if (volVal) volVal.textContent = current.volume + '%';

    const fovVal = document.getElementById('fovVal');
    if (fovVal) fovVal.textContent = current.fov + '°';

    const sizeVal = document.getElementById('xhairSizeVal');
    if (sizeVal) sizeVal.textContent = current.xhairSize;

    const gapVal = document.getElementById('xhairGapVal');
    if (gapVal) gapVal.textContent = current.xhairGap;

    const thickVal = document.getElementById('xhairThickVal');
    if (thickVal) thickVal.textContent = current.xhairThick;

    drawCrosshairPreview();
    updateCrosshairOverlay();

    if (window.Game && Game.updateFOV) {
      Game.updateFOV(current.fov);
    }

    save();
  }

  function drawCrosshairPreview() {
    const canvas = document.getElementById('xhairCanvas');
    if (!canvas) return;
    const cx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    cx.clearRect(0, 0, W, H);

    cx.fillStyle = '#141420';
    cx.fillRect(0, 0, W, H);

    const s = current.xhairSize;
    const g = current.xhairGap;
    const t = current.xhairThick;
    const color = current.xhairColor;
    const x = W / 2, y = H / 2;

    cx.fillStyle = color;
    cx.fillRect(x - t / 2, y - g - s, t, s);
    cx.fillRect(x - t / 2, y + g, t, s);
    cx.fillRect(x - g - s, y - t / 2, s, t);
    cx.fillRect(x + g, y - t / 2, s, t);
  }

  function updateCrosshairOverlay() {
    const overlay = document.getElementById('crosshairOverlay');
    if (!overlay) return;

    const s = current.xhairSize;
    const g = current.xhairGap;
    const t = current.xhairThick;
    const color = current.xhairColor;

    overlay.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 64 64" style="pointer-events:none;">
        <rect x="${32 - t/2}" y="${32 - g - s}" width="${t}" height="${s}" fill="${color}" />
        <rect x="${32 - t/2}" y="${32 + g}" width="${t}" height="${s}" fill="${color}" />
        <rect x="${32 - g - s}" y="${32 - t/2}" width="${s}" height="${t}" fill="${color}" />
        <rect x="${32 + g}" y="${32 - t/2}" width="${s}" height="${t}" fill="${color}" />
      </svg>
    `;
  }

  function get() { return current; }

  function hFovToVFov(hFov, aspect) {
    return 2 * Math.atan(Math.tan(((hFov || 103) * Math.PI) / 360) / (aspect || 16 / 9)) * (180 / Math.PI);
  }

  return { load, update, get, onSliderChange, onNumberChange, updateCrosshairOverlay, hFovToVFov };
})();

// ─────────────── Progress & LocalStorage ───────────────
const Progress = (() => {
  const STORAGE_KEY = 'aimdojo_save_v3';
  let data = {
    bestScores: {},
    history: [],
    dailyHistory: []
  };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        data = { ...data, ...saved };
        if (!data.bestScores) data.bestScores = {};
        if (!data.history) data.history = [];
        if (!data.dailyHistory) data.dailyHistory = [];
      }
    } catch (e) { /* ignore */ }
    updateDailyHeroCard();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateDailyHeroCard();
  }

  function getBest(modeId) {
    return data.bestScores[modeId] || null;
  }

  function recordResult(modeId, result) {
    const { score, accuracy, stars, avgReaction, hits, misses } = result;
    const prev = data.bestScores[modeId];
    if (!prev || score > prev.score) {
      data.bestScores[modeId] = { score, accuracy, stars, avgReaction, hits, misses, date: new Date().toISOString() };
    }
    data.history.push({
      date: new Date().toISOString(),
      modeId, accuracy, score
    });
    if (data.history.length > 250) data.history = data.history.slice(-250);
    save();
  }

  function recordDailyResult(dailyResult) {
    data.dailyHistory.push({
      date: new Date().toISOString(),
      dateKey: getTodayKey(),
      ...dailyResult
    });
    if (data.dailyHistory.length > 100) data.dailyHistory = data.dailyHistory.slice(-100);
    save();
  }

  function getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function getTodayDailyResult() {
    const key = getTodayKey();
    const found = [...data.dailyHistory].reverse().find(d => d.dateKey === key);
    return found || null;
  }

  function updateDailyHeroCard() {
    const statusEl = document.getElementById('dailyHeroStatus');
    if (!statusEl) return;
    const today = getTodayDailyResult();
    if (today) {
      statusEl.innerHTML = `Completed Today: <span style="color:var(--gold);font-weight:700;">${today.ratingOutOf10}/10 (${today.ratingText})</span>`;
    } else {
      statusEl.textContent = "Ready for today's test (5 Stages • 2.5 min)";
    }
  }

  function getHistory() { return data.history; }
  function getAll() { return data; }

  return { load, save, getBest, recordResult, recordDailyResult, getTodayDailyResult, getHistory, getAll };
})();

// ─────────────── UI Manager ───────────────
const UI = (() => {
  let currentFilter = 'all';

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');

    if (id === 'screen-modes') renderModes();
    if (id === 'screen-stats') renderStats();
    if (id === 'screen-settings') Settings.update();
    if (id === 'screen-menu') {
      if (window.Game && Game.cancelDaily) Game.cancelDaily();
      Progress.load();
    }

    if (id !== 'screen-game' && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  function filterModes(diff) {
    currentFilter = diff;
    document.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-filter') === diff);
    });
    renderModes();
  }

  function renderModes() {
    const grid = document.getElementById('modesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const list = currentFilter === 'all'
      ? MODES
      : MODES.filter(m => m.difficulty.toLowerCase() === currentFilter.toLowerCase());

    list.forEach(mode => {
      const best = Progress.getBest(mode.id);
      const card = document.createElement('div');
      card.className = 'level-card' + (best ? ' completed' : '');
      const diffClass = mode.difficulty.toLowerCase();

      card.innerHTML = `
        <div class="card-top-row">
          <span class="level-num">${mode.icon} ${mode.id.toUpperCase()}</span>
          <span class="diff-badge ${diffClass}">${mode.difficulty}</span>
        </div>
        <div class="level-name">${mode.name}</div>
        <div class="level-desc">${mode.desc}</div>
        <div class="card-footer-row">
          <div class="level-stars">${best ? '★'.repeat(best.stars) + '☆'.repeat(3 - best.stars) : '☆☆☆'}</div>
          <div class="level-best">${best ? `Best: ${best.score} pts (${best.accuracy}%)` : 'Not played'}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        SFX.playClick();
        showInstructions(mode);
      });

      grid.appendChild(card);
    });
  }

  function showInstructions(mode) {
    const modal = document.getElementById('screen-instructions');
    document.getElementById('instBadge').textContent = mode.difficulty.toUpperCase();
    document.getElementById('instBadge').className = 'inst-badge diff-badge ' + mode.difficulty.toLowerCase();
    document.getElementById('instTitle').textContent = mode.name;
    document.getElementById('instIcon').textContent = mode.icon;
    document.getElementById('instDesc').textContent = mode.desc;

    const rulesEl = document.getElementById('instRules');
    rulesEl.innerHTML = '';
    mode.rules.forEach(r => {
      const div = document.createElement('div');
      div.className = 'inst-rule-item';
      div.innerHTML = `<span class="dot"></span><span>${r}</span>`;
      rulesEl.appendChild(div);
    });

    Game.prepareMode(mode);
    showScreen('screen-instructions');
  }

  function renderStats() {
    const overview = document.getElementById('statsOverview');
    const history = Progress.getHistory();
    const totalGames = history.length;
    const avgAcc = totalGames > 0 ? (history.reduce((s, h) => s + h.accuracy, 0) / totalGames).toFixed(1) : 0;
    const totalScore = history.reduce((s, h) => s + h.score, 0);
    const bestAcc = totalGames > 0 ? Math.max(...history.map(h => h.accuracy)).toFixed(1) : 0;

    overview.innerHTML = `
      <div class="stat-card"><div class="stat-val">${totalGames}</div><div class="stat-label">Games Played</div></div>
      <div class="stat-card"><div class="stat-val">${avgAcc}%</div><div class="stat-label">Avg Accuracy</div></div>
      <div class="stat-card"><div class="stat-val">${totalScore}</div><div class="stat-label">Total Score</div></div>
      <div class="stat-card"><div class="stat-val">${bestAcc}%</div><div class="stat-label">Best Accuracy</div></div>
    `;

    drawStatsChart(history);
  }

  function drawStatsChart(history) {
    const canvas = document.getElementById('statsChart');
    if (!canvas) return;
    const cx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth || 700;
    const H = canvas.height = 260;
    cx.clearRect(0, 0, W, H);

    if (history.length < 2) {
      cx.fillStyle = '#8888a0';
      cx.font = '14px Segoe UI';
      cx.textAlign = 'center';
      cx.fillText('Play more games to see your accuracy progression chart', W / 2, H / 2);
      return;
    }

    const last = history.slice(-30);
    const pad = { l: 50, r: 20, t: 20, b: 40 };
    const gw = W - pad.l - pad.r;
    const gh = H - pad.t - pad.b;

    cx.strokeStyle = '#2a2a3a'; cx.lineWidth = 1;
    cx.beginPath(); cx.moveTo(pad.l, pad.t); cx.lineTo(pad.l, H - pad.b); cx.lineTo(W - pad.r, H - pad.b); cx.stroke();

    cx.fillStyle = '#8888a0'; cx.font = '11px Consolas'; cx.textAlign = 'right';
    for (let v = 0; v <= 100; v += 25) {
      const y = pad.t + gh * (1 - v / 100);
      cx.fillText(v + '%', pad.l - 8, y + 4);
      cx.strokeStyle = '#1e1e2e';
      cx.beginPath(); cx.moveTo(pad.l, y); cx.lineTo(W - pad.r, y); cx.stroke();
    }

    cx.beginPath();
    cx.strokeStyle = '#00e5ff'; cx.lineWidth = 2;
    last.forEach((h, i) => {
      const x = pad.l + (i / (last.length - 1)) * gw;
      const y = pad.t + gh * (1 - h.accuracy / 100);
      if (i === 0) cx.moveTo(x, y); else cx.lineTo(x, y);
    });
    cx.stroke();

    last.forEach((h, i) => {
      const x = pad.l + (i / (last.length - 1)) * gw;
      const y = pad.t + gh * (1 - h.accuracy / 100);
      cx.beginPath(); cx.arc(x, y, 3, 0, Math.PI * 2);
      cx.fillStyle = '#00e5ff'; cx.fill();
    });

    cx.fillStyle = '#8888a0'; cx.font = '11px Segoe UI'; cx.textAlign = 'center';
    cx.fillText(`Last ${last.length} sessions — Accuracy progression`, W / 2, H - 8);
  }

  return { showScreen, filterModes, renderModes, showInstructions, renderStats };
})();

// ─────────────── Ripple Button Animation ───────────────
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// ─────────────── Three.js 3D Game Engine ───────────────
const Game = (() => {
  const canvas = document.getElementById('gameCanvas');

  // Three.js Core
  let renderer, scene, camera, raycaster;
  const screenCenter = new THREE.Vector2(0, 0);

  // Arena Objects for Dynamic Theming
  let floorMesh, gridHelper, frontWallMesh, backWallMesh;
  let boundaryPillarLeft, boundaryPillarRight, boundaryRing;
  let ambientLight, dirLight1, dirLight2, pointLight;

  // Camera angles in degrees (Clamped strictly to 160° horizontal range: -80° to +80°)
  let cameraYaw = 0;   // Yaw in degrees [-80, +80]
  let cameraPitch = 0; // Pitch in degrees [-35, +35]

  // Game States
  let running = false;
  let isPaused = false;
  let activeMode = null;
  let timer = 0;
  let score = 0;
  let hits = 0;
  let misses = 0;
  let reactionTimes = [];
  let targets = [];
  let targetIdCounter = 0;
  let particles3D = [];
  let lastFrame = 0;
  let timerInterval = null;
  let trackingOnTarget = 0;
  let trackingTotalTime = 0;

  // Daily Challenge State
  let isDaily = false;
  let dailyStageIdx = 0;
  let dailyResults = [];

  // Initialize Three.js Scene and World
  function initThree() {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b12);
    scene.fog = new THREE.FogExp2(0x070b12, 0.015);

    const aspect = window.innerWidth / window.innerHeight;
    const vFov = Settings.hFovToVFov(Settings.get().fov, aspect);

    camera = new THREE.PerspectiveCamera(vFov, aspect, 0.1, 100);
    camera.rotation.order = 'YXZ';
    camera.position.set(0, 1.7, 0); // Eye height at 1.7m

    raycaster = new THREE.Raycaster();

    buildArena();

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
  }

  // Build Arena with Visual 160° Boundary Cues and Enclosed Back Wall
  function buildArena() {
    // 1. Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0d131f,
      roughness: 0.6,
      metalness: 0.2
    });
    floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    scene.add(floorMesh);

    // 2. Cyan Floor Grid
    gridHelper = new THREE.GridHelper(60, 60, 0x00e5ff, 0x142033);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 3. Front Cylindrical Target Wall (spanning the front 160° arc)
    const frontWallGeo = new THREE.CylinderGeometry(18, 18, 16, 48, 1, true, -Math.PI * 0.444, Math.PI * 0.888);
    const frontWallMat = new THREE.MeshStandardMaterial({
      color: 0x101726,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.BackSide
    });
    frontWallMesh = new THREE.Mesh(frontWallGeo, frontWallMat);
    frontWallMesh.position.set(0, 8, 0);
    scene.add(frontWallMesh);

    // 4. Rear Boundary Wall (enclosing the back 200° so the player is inside an authentic range)
    const backWallGeo = new THREE.CylinderGeometry(18, 18, 16, 48, 1, true, Math.PI * 0.444, Math.PI * 1.112);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e17,
      roughness: 0.9,
      metalness: 0.3,
      side: THREE.BackSide
    });
    backWallMesh = new THREE.Mesh(backWallGeo, backWallMat);
    backWallMesh.position.set(0, 8, 0);
    scene.add(backWallMesh);

    // 5. Visual 160° Boundary Pillars (Glowing Pylons at -80° and +80°)
    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 16, 16);
    const pillarMat = new THREE.MeshBasicMaterial({ color: 0xff4655 });

    // Left Pillar at -80°
    const radLeft = THREE.MathUtils.degToRad(-80);
    boundaryPillarLeft = new THREE.Mesh(pillarGeo, pillarMat);
    boundaryPillarLeft.position.set(17.8 * Math.sin(radLeft), 8, -17.8 * Math.cos(radLeft));
    scene.add(boundaryPillarLeft);

    // Right Pillar at +80°
    const radRight = THREE.MathUtils.degToRad(80);
    boundaryPillarRight = new THREE.Mesh(pillarGeo, pillarMat);
    boundaryPillarRight.position.set(17.8 * Math.sin(radRight), 8, -17.8 * Math.cos(radRight));
    scene.add(boundaryPillarRight);

    // Boundary Arch Ring at head height (1.7m)
    const ringGeo = new THREE.TorusGeometry(17.7, 0.05, 8, 64, Math.PI * 0.888);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    boundaryRing = new THREE.Mesh(ringGeo, ringMat);
    boundaryRing.rotation.x = Math.PI / 2;
    boundaryRing.rotation.z = Math.PI * 0.056;
    boundaryRing.position.set(0, 1.7, 0);
    scene.add(boundaryRing);

    // 6. Lights
    ambientLight = new THREE.AmbientLight(0x22334d, 1.4);
    scene.add(ambientLight);

    dirLight1 = new THREE.DirectionalLight(0xaaccff, 0.85);
    dirLight1.position.set(5, 12, 6);
    scene.add(dirLight1);

    dirLight2 = new THREE.DirectionalLight(0x00e5ff, 0.45);
    dirLight2.position.set(-6, 8, -4);
    scene.add(dirLight2);

    pointLight = new THREE.PointLight(0xff4655, 0.6, 25);
    pointLight.position.set(0, 0.5, -10);
    scene.add(pointLight);
  }

  // Dynamically Apply Unique Environment Aesthetic for each Mode
  function applyModeTheme(mode) {
    if (!mode || !mode.theme) return;
    const t = mode.theme;

    // Scene & Fog
    scene.background.setHex(t.bg);
    scene.fog.color.setHex(t.fog);

    // Floor & Wall Materials
    if (floorMesh) floorMesh.material.color.setHex(t.floor);
    if (frontWallMesh) frontWallMesh.material.color.setHex(t.wall);

    // Grid Colors: recreate grid for new colors
    if (gridHelper) {
      scene.remove(gridHelper);
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();
      gridHelper = new THREE.GridHelper(60, 60, t.grid1, t.grid2);
      gridHelper.position.y = 0.02;
      scene.add(gridHelper);
    }

    // Boundary Neon accents
    if (boundaryPillarLeft) boundaryPillarLeft.material.color.setHex(t.wallTrim);
    if (boundaryPillarRight) boundaryPillarRight.material.color.setHex(t.wallTrim);
    if (boundaryRing) boundaryRing.material.color.setHex(t.grid1);

    // Lighting
    if (ambientLight) ambientLight.color.setHex(t.ambient);
    if (dirLight1) dirLight1.color.setHex(t.dirLight1);
    if (dirLight2) dirLight2.color.setHex(t.dirLight2);
    if (pointLight) pointLight.color.setHex(t.wallTrim);
  }

  function updateFOV(hFov) {
    if (camera) {
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;
      camera.fov = Settings.hFovToVFov(hFov || Settings.get().fov, aspect);
      camera.updateProjectionMatrix();
    }
  }

  function onWindowResize() {
    if (!renderer || !camera) return;
    const aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = aspect;
    camera.fov = Settings.hFovToVFov(Settings.get().fov, aspect);
    camera.updateProjectionMatrix();
  }

  // ─────────────── Mouse Look Clamped to 160° Horizontal Arc ───────────────
  let boundaryToastTimer = null;
  function triggerBoundaryToast() {
    const el = document.getElementById('boundaryWarning');
    if (!el) return;
    el.classList.add('show');
    clearTimeout(boundaryToastTimer);
    boundaryToastTimer = setTimeout(() => el.classList.remove('show'), 700);
  }

  function onMouseMove(e) {
    if (!running || isPaused) return;

    // Single unified sensitivity setting (direct, smooth 1:1 control)
    const sens = Settings.get().sens;
    const baseFactor = 0.055;

    const deltaYaw = e.movementX * sens * baseFactor;
    const deltaPitch = e.movementY * sens * baseFactor;

    const prevYaw = cameraYaw;
    cameraYaw -= deltaYaw;
    cameraPitch -= deltaPitch;

    // CLAMP STRICTLY TO 160° HORIZONTAL ARC: -80° to +80°
    if (cameraYaw < -80) {
      cameraYaw = -80;
      if (prevYaw > -80) triggerBoundaryToast();
    } else if (cameraYaw > 80) {
      cameraYaw = 80;
      if (prevYaw < 80) triggerBoundaryToast();
    }

    // CLAMP VERTICAL LOOK: -35° to +35°
    cameraPitch = Math.max(-35, Math.min(35, cameraPitch));

    camera.rotation.y = THREE.MathUtils.degToRad(cameraYaw);
    camera.rotation.x = THREE.MathUtils.degToRad(cameraPitch);
    camera.rotation.z = 0;
  }

  // ─────────────── Target Creation & Spawning in 3D ───────────────
  function createTargetMesh(radius, modeDef) {
    const group = new THREE.Group();
    const t = modeDef.theme;

    if (modeDef.headshotOnly) {
      // Body torso (dark grey cylinder)
      const bodyGeo = new THREE.CylinderGeometry(radius * 0.9, radius * 1.1, radius * 2.5, 16);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.7 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = -radius * 1.6;
      body.userData.isBody = true;
      group.add(body);

      // Cyan head sphere with bright neon outline ring
      const headGeo = new THREE.SphereGeometry(radius * 0.75, 24, 24);
      const headMat = new THREE.MeshStandardMaterial({
        color: t.targetColor,
        emissive: t.targetEmissive,
        emissiveIntensity: 0.5,
        roughness: 0.25,
        metalness: 0.2
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.userData.isHead = true;
      group.add(head);

      const ringGeo = new THREE.TorusGeometry(radius * 0.85, radius * 0.05, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: t.targetRing });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.userData.isHead = true;
      group.add(ring);

      return { group, hitMesh: head, isHeadshot: true };
    }

    // Standard high-contrast spherical target with mode-specific theme colors
    const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: t.targetColor,
      emissive: t.targetEmissive,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.25
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.userData.isTarget = true;
    group.add(sphere);

    // Glowing outer ring halo
    const ringGeo = new THREE.TorusGeometry(radius * 1.08, radius * 0.055, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: t.targetRing });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.userData.isTarget = true;
    group.add(ring);

    // Center bullseye dot
    const dotGeo = new THREE.SphereGeometry(radius * 0.18, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: t.targetDot });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.z = radius * 0.92;
    dot.userData.isTarget = true;
    group.add(dot);

    // Click Timing: add a pulsing countdown timer ring
    if (modeDef.lifespan) {
      const timerRingGeo = new THREE.TorusGeometry(radius * 1.3, radius * 0.03, 8, 32);
      const timerRingMat = new THREE.MeshBasicMaterial({ color: t.targetRing, transparent: true, opacity: 0.8 });
      const timerRing = new THREE.Mesh(timerRingGeo, timerRingMat);
      timerRing.userData.isTimerRing = true;
      group.add(timerRing);
    }

    return { group, hitMesh: sphere, isHeadshot: false };
  }

  function spawnTarget(index = 0) {
    const id = ++targetIdCounter;
    const mode = activeMode;
    const radius = mode.targetRadius;
    const D = mode.distance || 12.0;

    const targetObj = {
      id,
      index,
      alive: true,
      spawnTime: performance.now(),
      radius,
      vx: 0, vy: 0,
      strafeDir: 1,
      nextDirChange: 0,
      reactionTimer: 0,
      lifespan: mode.lifespan || null,
      modeDef: mode
    };

    const targetData = createTargetMesh(radius, mode);
    targetObj.mesh = targetData.group;
    targetObj.hitMesh = targetData.hitMesh;
    targetObj.isHeadshot = targetData.isHeadshot;

    targetObj.mesh.userData.targetId = id;
    targetObj.mesh.traverse(child => { child.userData.targetId = id; });

    // Spawn ONLY inside 160° arc in front of player (yaw clamped between -68° and +68°)
    let bestPos = null;
    let maxMinDist = -1;
    const minSeparation = Math.max(1.4, radius * 4.2);

    for (let attempt = 0; attempt < 70; attempt++) {
      let yawDeg, pitchDeg;

      if (mode.wideFlick) {
        // Peripheral flick shots
        const sign = Math.random() > 0.5 ? 1 : -1;
        yawDeg = sign * (32 + Math.random() * 34); // between ±32° and ±66°
        pitchDeg = -8 + Math.random() * 20;
      } else if (mode.tightGroup) {
        // Micro flicks: closer clusters
        yawDeg = -22 + Math.random() * 44;
        pitchDeg = -6 + Math.random() * 16;
      } else if (mode.headshotOnly) {
        yawDeg = -60 + Math.random() * 120; // -60° to +60°
        pitchDeg = 0; // Exactly head height
      } else {
        // Standard spread inside front 160° arc
        yawDeg = -65 + Math.random() * 130; // -65° to +65°
        pitchDeg = -14 + Math.random() * 30; // -14° to +16°
      }

      const yawRad = THREE.MathUtils.degToRad(yawDeg);
      const pitchRad = THREE.MathUtils.degToRad(pitchDeg);

      const x = D * Math.sin(yawRad) * Math.cos(pitchRad);
      let y = camera.position.y + D * Math.sin(pitchRad);
      const z = -D * Math.cos(yawRad) * Math.cos(pitchRad);

      // Clamped universal floor rule ($y \ge 0.45\text{m}$)
      y = Math.max(0.45, Math.min(4.2, y));

      const pos = new THREE.Vector3(x, y, z);

      let minDistToOthers = Infinity;
      for (const other of targets) {
        if (!other || !other.alive || other.id === id || !other.mesh) continue;
        const dist = pos.distanceTo(other.mesh.position);
        if (dist < minDistToOthers) minDistToOthers = dist;
      }

      if (minDistToOthers >= minSeparation) {
        bestPos = pos;
        break;
      }
      if (minDistToOthers > maxMinDist) {
        maxMinDist = minDistToOthers;
        bestPos = pos;
      }
    }

    if (!bestPos) bestPos = new THREE.Vector3(0, 1.7, -D);

    targetObj.mesh.position.copy(bestPos);
    targetObj.mesh.lookAt(camera.position);

    // Mode-specific target setups
    if (mode.id === 'tracking') {
      targetObj.mesh.position.set(0, 1.7, -D);
      targetObj.angle = 0;
      targetObj.speed = mode.speed;
    } else if (mode.id === 'strafe') {
      targetObj.mesh.position.set(0, 1.7, -D);
      targetObj.strafeDir = Math.random() > 0.5 ? 1 : -1;
      targetObj.speed = mode.speed;
      targetObj.nextDirChange = performance.now() + 450 + Math.random() * 1000;
    } else if (mode.reactionMode) {
      targetObj.mesh.visible = false;
      targetObj.alive = false;
      targetObj.reactionTimer = performance.now() + 1000 + Math.random() * 2000;
    } else if (mode.isProMix) {
      if (index % 2 === 0) {
        targetObj.vx = (Math.random() - 0.5) * mode.speed;
        targetObj.vy = (Math.random() - 0.5) * mode.speed * 0.4;
        targetObj.nextDirChange = performance.now() + 350 + Math.random() * 800;
      }
    }

    scene.add(targetObj.mesh);
    return targetObj;
  }

  function clearTargets() {
    targets.forEach(t => {
      if (t.mesh) {
        scene.remove(t.mesh);
        t.mesh.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }
    });
    targets = [];
  }

  function clearParticles() {
    particles3D.forEach(p => {
      if (p.pSystem) {
        scene.remove(p.pSystem);
        if (p.pSystem.geometry) p.pSystem.geometry.dispose();
        if (p.pSystem.material) p.pSystem.material.dispose();
      }
    });
    particles3D = [];
  }

  // ─────────────── 3D Particle Explosion ───────────────
  function spawn3DExplosion(pos, colorHex = 0x00e5ff) {
    const count = 30;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = [];

    const baseColor = new THREE.Color(colorHex);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      const c = Math.random() > 0.4 ? baseColor : whiteColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 4 + Math.random() * 6;
      velocities.push(new THREE.Vector3(
        speed * Math.sin(phi) * Math.cos(theta),
        speed * Math.sin(phi) * Math.sin(theta),
        speed * Math.cos(phi)
      ));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    });

    const pSystem = new THREE.Points(geometry, material);
    scene.add(pSystem);

    particles3D.push({
      pSystem,
      positions,
      velocities,
      life: 0.4,
      maxLife: 0.4
    });
  }

  function update3DParticles(dt) {
    for (let i = particles3D.length - 1; i >= 0; i--) {
      const p = particles3D[i];
      p.life -= dt;
      if (p.life <= 0) {
        scene.remove(p.pSystem);
        p.pSystem.geometry.dispose();
        p.pSystem.material.dispose();
        particles3D.splice(i, 1);
        continue;
      }

      const count = p.velocities.length;
      for (let j = 0; j < count; j++) {
        p.positions[j * 3] += p.velocities[j].x * dt;
        p.positions[j * 3 + 1] += p.velocities[j].y * dt;
        p.positions[j * 3 + 2] += p.velocities[j].z * dt;
        p.velocities[j].y -= 9.8 * dt; // Gravity
      }
      p.pSystem.geometry.attributes.position.needsUpdate = true;
      p.pSystem.material.opacity = p.life / p.maxLife;
    }
  }

  // ─────────────── Target Animation & Watchdog Loop ───────────────
  function updateTargets(dt) {
    const now = performance.now();
    const mode = activeMode;

    // Continuous Watchdog: Ensure targets never run out before the timer ends
    if (running && !isPaused && mode.id !== 'tracking' && mode.id !== 'strafe' && !mode.reactionMode) {
      const liveCount = targets.filter(t => t && t.alive).length;
      if (liveCount < mode.targetCount) {
        const needed = mode.targetCount - liveCount;
        for (let i = 0; i < needed; i++) {
          targets.push(spawnTarget(targets.length));
        }
      }
    }

    for (let i = targets.length - 1; i >= 0; i--) {
      const t = targets[i];
      if (!t) continue;

      // Reaction Mode Reveal
      if (mode.reactionMode && !t.alive && t.reactionTimer && now >= t.reactionTimer) {
        t.alive = true;
        t.mesh.visible = true;
        t.spawnTime = now;
        t.reactionTimer = 0;
        SFX.playCountdown();
        continue;
      }

      if (!t.alive || !t.mesh) continue;

      // Click Timing: Check Lifespan Expiration
      if (t.lifespan) {
        const age = (now - t.spawnTime) / 1000;
        const remaining = Math.max(0, 1 - (age / t.lifespan));

        // Animate timer ring scaling down
        t.mesh.traverse(child => {
          if (child.userData.isTimerRing) {
            child.scale.set(remaining, remaining, remaining);
          }
        });

        if (age >= t.lifespan) {
          // Expired before being shot -> counts as miss!
          misses++;
          SFX.playMiss();
          showScorePopup('EXPIRED');
          updateHUD();

          // Remove target
          t.alive = false;
          scene.remove(t.mesh);
          t.mesh.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
          });
          targets.splice(i, 1);

          // Replenish immediately so arena is never empty
          targets.push(spawnTarget(i));
          continue;
        }
      }

      // Tracking mode movement (smooth figure-8)
      if (mode.id === 'tracking') {
        t.angle += t.speed * 0.38 * dt;
        t.mesh.position.x = 5.2 * Math.sin(t.angle);
        t.mesh.position.y = 1.7 + 1.6 * Math.sin(t.angle * 2) * 0.5;
        t.mesh.position.z = -11.0;
      } else if (mode.id === 'strafe') {
        t.mesh.position.x += t.strafeDir * t.speed * dt;
        if (t.mesh.position.x > 6.0) { t.mesh.position.x = 6.0; t.strafeDir = -1; }
        if (t.mesh.position.x < -6.0) { t.mesh.position.x = -6.0; t.strafeDir = 1; }

        if (now >= t.nextDirChange) {
          t.strafeDir = -t.strafeDir;
          t.nextDirChange = now + 400 + Math.random() * 950;
        }
      } else if (mode.isProMix && t.vx) {
        t.mesh.position.x += t.vx * dt;
        t.mesh.position.y += t.vy * dt;
        if (Math.abs(t.mesh.position.x) > 6.2) t.vx = -t.vx;
        if (t.mesh.position.y > 3.6 || t.mesh.position.y < 0.6) t.vy = -t.vy;

        if (now >= t.nextDirChange) {
          t.vx = (Math.random() - 0.5) * mode.speed;
          t.vy = (Math.random() - 0.5) * mode.speed * 0.4;
          t.nextDirChange = now + 400 + Math.random() * 850;
        }
      }

      t.mesh.lookAt(camera.position);
    }

    // Tracking Score Update (Continuous time on target)
    if (mode.id === 'tracking' || mode.id === 'strafe') {
      trackingTotalTime += dt;
      scene.updateMatrixWorld(true);
      raycaster.setFromCamera(screenCenter, camera);
      const activeMeshes = targets.filter(t => t.alive && t.mesh).map(t => t.hitMesh || t.mesh);
      const hitsArr = raycaster.intersectObjects(activeMeshes, false);
      const isOnTarget = hitsArr.length > 0;
      if (isOnTarget) {
        trackingOnTarget += dt;
      }
      targets.forEach(t => {
        if (t.alive && t.hitMesh && t.hitMesh.material) {
          t.hitMesh.material.emissiveIntensity = isOnTarget ? 0.95 : 0.4;
        }
      });
      const liveAcc = trackingTotalTime > 0 ? Math.round((trackingOnTarget / trackingTotalTime) * 100) : 100;
      const liveScore = Math.round(trackingOnTarget * 125);
      document.getElementById('hudScore').textContent = liveScore;
      document.getElementById('hudAccuracy').textContent = liveAcc + '%';
    }
  }

  // ─────────────── Raycast Shooting (Dead Center Crosshair) ───────────────
  function onMouseDown(e) {
    if (e.button !== 0 || !running) return;

    if (isPaused) {
      resume();
      return;
    }

    if (!document.pointerLockElement) {
      try {
        const p = canvas.requestPointerLock();
        if (p && p.catch) p.catch(() => {});
      } catch (err) {}
      return;
    }

    shoot();
  }

  function shoot() {
    const mode = activeMode;
    if (mode.id === 'tracking' || mode.id === 'strafe') return;

    scene.updateMatrixWorld(true);
    raycaster.setFromCamera(screenCenter, camera);

    const hitCandidates = [];
    targets.forEach(t => {
      if (t.alive && t.mesh && t.mesh.visible) {
        hitCandidates.push(t.mesh);
      }
    });

    const intersects = raycaster.intersectObjects(hitCandidates, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const hitObj = hit.object;
      const target = targets.find(t => t.id === hitObj.userData.targetId);

      if (target) {
        if (target.isHeadshot && hitObj.userData.isBody) {
          // Body shot in headshot-only mode -> penalty miss!
          misses++;
          SFX.playMiss();
          showScorePopup('BODY HIT');
          updateHUD();
          return;
        }
        hitTarget(target, hit.point);
        return;
      }
    }

    misses++;
    SFX.playMiss();
    updateHUD();
  }

  function hitTarget(t, hitPoint) {
    hits++;
    const reactionMs = performance.now() - t.spawnTime;
    reactionTimes.push(reactionMs);

    // Scoring
    const basePoints = 100;
    const reactionBonus = Math.max(0, Math.floor((2000 - reactionMs) / 10));
    const pts = basePoints + reactionBonus;
    score += pts;

    // SFX & Explosions
    if (t.isHeadshot) SFX.playHeadshot(); else SFX.playHit();
    spawn3DExplosion(hitPoint || t.mesh.position, activeMode.theme.targetRing);
    showHitMarker();

    if (activeMode.reactionMode) {
      showScorePopup(Math.round(reactionMs) + 'ms (+' + pts + ')');
    } else {
      showScorePopup('+' + pts);
    }

    // Despawn target
    t.alive = false;
    scene.remove(t.mesh);
    t.mesh.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });

    const idx = targets.indexOf(t);
    if (idx !== -1) {
      targets.splice(idx, 1);
    }

    // Continuous Spawning: Instantly replenish target so targets NEVER run out
    if (running) {
      targets.push(spawnTarget(targets.length));
    }

    updateHUD();
  }

  function showHitMarker() {
    const el = document.getElementById('hitMarker');
    if (!el) return;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  function showScorePopup(text) {
    const el = document.getElementById('scorePopup');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  function updateHUD() {
    const scoreEl = document.getElementById('hudScore');
    const accEl = document.getElementById('hudAccuracy');
    if (scoreEl) scoreEl.textContent = score;
    const total = hits + misses;
    const acc = total > 0 ? Math.round((hits / total) * 100) : 100;
    if (accEl) accEl.textContent = acc + '%';
  }

  // ─────────────── Main 3D Animation Loop ───────────────
  function gameLoop(timestamp) {
    if (!running) return;

    requestAnimationFrame(gameLoop);

    if (isPaused) {
      lastFrame = timestamp;
      return;
    }

    const dt = Math.min((timestamp - lastFrame) / 1000, 0.05);
    lastFrame = timestamp;

    updateTargets(dt);
    update3DParticles(dt);

    renderer.render(scene, camera);
  }

  // ─────────────── Mode Setup & Game Flow ───────────────
  function prepareMode(mode) {
    activeMode = mode;
  }

  function confirmStartGameplay() {
    if (!activeMode) return;
    startMode(activeMode);
  }

  function startMode(mode, overrideDuration) {
    activeMode = mode;
    score = 0; hits = 0; misses = 0;
    reactionTimes = [];
    clearParticles();
    clearTargets();
    trackingOnTarget = 0;
    trackingTotalTime = 0;

    // Reset camera to center (0° yaw, 0° pitch)
    cameraYaw = 0;
    cameraPitch = 0;
    camera.rotation.set(0, 0, 0);

    // Apply distinct visual theme to arena
    applyModeTheme(activeMode);

    // Update HUD
    const hudMode = document.getElementById('hudModeName');
    const hudDiff = document.getElementById('hudDifficulty');
    const hudDaily = document.getElementById('hudDailyStage');

    if (hudMode) hudMode.textContent = activeMode.name;
    if (hudDiff) {
      hudDiff.textContent = activeMode.difficulty.toUpperCase();
      hudDiff.className = 'hud-badge diff-badge ' + activeMode.difficulty.toLowerCase();
    }

    if (isDaily) {
      if (hudDaily) {
        hudDaily.style.display = 'inline-block';
        hudDaily.textContent = `STAGE ${dailyStageIdx + 1}/5`;
      }
    } else {
      if (hudDaily) hudDaily.style.display = 'none';
    }

    updateHUD();

    showCountdown(() => {
      startGameplay(overrideDuration || activeMode.duration);
    });
  }

  function showCountdown(callback) {
    UI.showScreen('screen-countdown');
    let count = 3;
    const badge = document.getElementById('countdownBadge');
    const num = document.getElementById('countdownNum');
    const label = document.getElementById('countdownLabel');

    if (badge) {
      badge.textContent = isDaily ? `DAILY CHALLENGE // STAGE ${dailyStageIdx + 1}` : activeMode.name.toUpperCase();
    }
    if (num) num.textContent = count;
    if (label) label.textContent = 'PREPARE YOUR AIM';
    SFX.playCountdown();

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        if (num) {
          num.textContent = count;
          num.style.animation = 'none';
          void num.offsetWidth;
          num.style.animation = 'countPulse 0.5s ease forwards';
        }
        SFX.playCountdown();
      } else if (count === 0) {
        if (num) {
          num.textContent = 'GO!';
          num.style.color = '#00e5ff';
          num.style.animation = 'none';
          void num.offsetWidth;
          num.style.animation = 'countPulse 0.5s ease forwards';
        }
        if (label) label.textContent = '';
        SFX.playGo();
      } else {
        clearInterval(interval);
        if (num) num.style.color = '';
        callback();
      }
    }, 700);
  }

  function startGameplay(duration) {
    UI.showScreen('screen-game');
    onWindowResize();

    running = true;
    isPaused = false;
    const pauseEl = document.getElementById('pauseOverlay');
    if (pauseEl) pauseEl.classList.remove('active');

    timer = duration;
    const timerEl = document.getElementById('hudTimer');
    if (timerEl) {
      timerEl.textContent = timer;
      timerEl.style.color = '';
    }

    // Engage pointer lock
    canvas.requestPointerLock();

    // Spawn initial targets
    clearTargets();
    for (let i = 0; i < activeMode.targetCount; i++) {
      targets.push(spawnTarget(i));
    }

    lastFrame = performance.now();
    requestAnimationFrame(gameLoop);

    // Continuous Timer: counts down until exact 0, then calls endLevel()
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (isPaused) return;
      timer--;
      if (timerEl) {
        timerEl.textContent = Math.max(0, timer);
        if (timer <= 5) timerEl.style.color = '#ff4655';
      }
      if (timer <= 0) {
        clearInterval(timerInterval);
        endLevel();
      }
    }, 1000);
  }

  function pause() {
    if (!running || isPaused) return;
    isPaused = true;
    const p = document.getElementById('pauseOverlay');
    if (p) p.classList.add('active');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  function resume() {
    if (!running || !isPaused) return;
    isPaused = false;
    const p = document.getElementById('pauseOverlay');
    if (p) p.classList.remove('active');
    canvas.requestPointerLock();
  }

  function exitToMenu() {
    isPaused = false;
    const p = document.getElementById('pauseOverlay');
    if (p) p.classList.remove('active');
    endLevel(true);
    UI.showScreen('screen-menu');
  }

  function endLevel(cancelled = false) {
    running = false;
    isPaused = false;
    clearInterval(timerInterval);

    if (document.pointerLockElement) {
      document.exitPointerLock();
    }

    clearTargets();

    if (cancelled) {
      isDaily = false;
      return;
    }

    let accuracy;
    if (activeMode.id === 'tracking' || activeMode.id === 'strafe') {
      accuracy = trackingTotalTime > 0
        ? Math.round((trackingOnTarget / trackingTotalTime) * 100)
        : 0;
      score = Math.round(trackingOnTarget * 125);
      hits = Math.round(trackingOnTarget * 10);
      misses = Math.round((trackingTotalTime - trackingOnTarget) * 10);
    } else {
      const total = hits + misses;
      accuracy = total > 0 ? Math.round((hits / total) * 100) : 0;
    }

    const avgReaction = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

    let stars = 0;
    if (accuracy >= activeMode.minAcc) stars = 1;
    if (accuracy >= activeMode.minAcc + 15) stars = 2;
    if (accuracy >= activeMode.minAcc + 28 && score > 350) stars = 3;

    const result = { score, accuracy, stars, avgReaction, hits, misses };
    const passed = accuracy >= activeMode.minAcc;

    if (isDaily) {
      dailyResults.push({
        stage: dailyStageIdx + 1,
        modeName: activeMode.name,
        difficulty: activeMode.difficulty,
        score, accuracy, hits, misses
      });
      dailyStageIdx++;

      if (dailyStageIdx < DAILY_STAGES.length) {
        // Proceed to next daily stage
        proceedNextDailyStage();
      } else {
        // Daily Complete: Show Final Rating Screen
        finishDailyChallenge();
      }
      return;
    }

    // Standard Single Mode Result
    Progress.recordResult(activeMode.id, result);
    showSingleResults(result, passed);
  }

  function showSingleResults(result, passed) {
    UI.showScreen('screen-results');

    const titleEl = document.getElementById('resultsTitle');
    const badgeEl = document.getElementById('resultsDifficulty');
    const starsEl = document.getElementById('resultsStars');
    const gridEl = document.getElementById('resultsGrid');
    const passEl = document.getElementById('resultsPass');
    const nextBtn = document.getElementById('btnNextLevel');

    if (titleEl) titleEl.textContent = activeMode.name + ' — Results';
    if (badgeEl) {
      badgeEl.textContent = activeMode.difficulty.toUpperCase();
      badgeEl.className = 'results-badge diff-badge ' + activeMode.difficulty.toLowerCase();
    }
    if (starsEl) starsEl.textContent = '★'.repeat(result.stars) + '☆'.repeat(3 - result.stars);

    if (gridEl) {
      gridEl.innerHTML = `
        <div class="result-item"><div class="r-val">${result.score}</div><div class="r-label">Score</div></div>
        <div class="result-item"><div class="r-val">${result.accuracy}%</div><div class="r-label">Accuracy</div></div>
        <div class="result-item"><div class="r-val">${result.hits}</div><div class="r-label">Hits</div></div>
        <div class="result-item"><div class="r-val">${result.misses}</div><div class="r-label">Misses</div></div>
        <div class="result-item"><div class="r-val">${result.avgReaction || '—'}ms</div><div class="r-label">Avg Reaction</div></div>
        <div class="result-item"><div class="r-val">${result.stars}/3</div><div class="r-label">Stars</div></div>
      `;
    }

    if (passEl) {
      if (passed) {
        passEl.className = 'results-pass pass';
        passEl.textContent = `✓ COMPLETED — ${activeMode.minAcc}% target accuracy achieved!`;
      } else {
        passEl.className = 'results-pass fail';
        passEl.textContent = `✗ TRY AGAIN — Aim for ${activeMode.minAcc}% accuracy`;
      }
    }

    const currentIdx = MODES.findIndex(m => m.id === activeMode.id);
    if (nextBtn) {
      if (currentIdx >= 0 && currentIdx < MODES.length - 1) {
        nextBtn.style.display = '';
        nextBtn.onclick = () => {
          SFX.playClick();
          startMode(MODES[currentIdx + 1]);
        };
      } else {
        nextBtn.style.display = 'none';
      }
    }
  }

  function retry() {
    if (activeMode) startMode(activeMode);
  }

  function nextLevel() {
    const currentIdx = MODES.findIndex(m => m.id === activeMode.id);
    if (currentIdx >= 0 && currentIdx < MODES.length - 1) {
      startMode(MODES[currentIdx + 1]);
    }
  }

  // ─────────────── Daily Challenge System (5 Progressive Stages) ───────────────
  function startDailyChallenge() {
    isDaily = true;
    dailyStageIdx = 0;
    dailyResults = [];
    proceedNextDailyStage();
  }

  function proceedNextDailyStage() {
    const stageDef = DAILY_STAGES[dailyStageIdx];
    const mode = MODES.find(m => m.id === stageDef.modeId);
    if (!mode) return;
    startMode(mode, stageDef.duration);
  }

  function cancelDaily() {
    isDaily = false;
    dailyStageIdx = 0;
    dailyResults = [];
  }

  function finishDailyChallenge() {
    isDaily = false;
    UI.showScreen('screen-daily-results');

    // Calculate rating out of 10 based on performance across all 5 stages
    const totalScore = dailyResults.reduce((sum, r) => sum + r.score, 0);
    const avgAccuracy = dailyResults.reduce((sum, r) => sum + r.accuracy, 0) / dailyResults.length;
    const totalHits = dailyResults.reduce((sum, r) => sum + r.hits, 0);
    const totalMisses = dailyResults.reduce((sum, r) => sum + r.misses, 0);

    // Rating formula: blend accuracy (70%) and score throughput (30%)
    let rawRating = (avgAccuracy / 10) * 0.7 + Math.min(3.0, (totalScore / 1800) * 3.0);
    rawRating = Math.max(1.0, Math.min(10.0, rawRating));
    const ratingOutOf10 = rawRating.toFixed(1);

    let ratingText = 'WARM-UP COMPLETE!';
    let ratingColor = 'var(--cyan)';

    if (rawRating >= 9.0) {
      ratingText = 'GODLIKE AIM! 🏆';
      ratingColor = 'var(--gold)';
    } else if (rawRating >= 7.5) {
      ratingText = 'GREAT PRECISION! ⚡';
      ratingColor = 'var(--green)';
    } else if (rawRating >= 6.0) {
      ratingText = 'SOLID PERFORMANCE! 🎯';
      ratingColor = 'var(--cyan)';
    } else if (rawRating >= 4.0) {
      ratingText = 'KEEP PRACTICING! 💪';
      ratingColor = 'var(--orange)';
    } else {
      ratingText = 'WARM-UP COMPLETE — KEEP GRINDING! 🔥';
      ratingColor = 'var(--red)';
    }

    const valEl = document.getElementById('dailyScoreVal');
    const textEl = document.getElementById('dailyRatingText');
    const tbody = document.getElementById('dailyTableBody');

    if (valEl) valEl.innerHTML = `${ratingOutOf10}<span class="daily-score-max">/10</span>`;
    if (textEl) {
      textEl.textContent = ratingText;
      textEl.style.color = ratingColor;
    }

    if (tbody) {
      tbody.innerHTML = '';
      dailyResults.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>Stage ${r.stage}</td>
          <td><strong>${r.modeName}</strong> <span class="diff-badge ${r.difficulty.toLowerCase()}">${r.difficulty}</span></td>
          <td style="color:var(--cyan);">${r.accuracy}%</td>
          <td>${r.hits}</td>
          <td style="color:${r.misses > 0 ? 'var(--red)' : 'var(--text-dim)'};">${r.misses}</td>
          <td style="color:var(--gold); font-weight:700;">${r.score}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Persist daily challenge completion
    Progress.recordDailyResult({
      ratingOutOf10,
      ratingText,
      totalScore,
      avgAccuracy: Math.round(avgAccuracy),
      totalHits,
      totalMisses,
      stages: dailyResults
    });
  }

  // ─────────────── Pointer Lock (Pause on ESC or P) ───────────────
  document.addEventListener('pointerlockchange', () => {
    if (!document.pointerLockElement && running && !isPaused) {
      pause();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyP' || e.code === 'Escape') {
      if (running) {
        if (isPaused) resume(); else pause();
      }
    } else if (e.code === 'Space') {
      const modal = document.getElementById('screen-instructions');
      if (modal && modal.classList.contains('active')) {
        confirmStartGameplay();
      }
    }
  });

  return {
    initThree,
    prepareMode,
    confirmStartGameplay,
    startMode,
    retry,
    nextLevel,
    startDailyChallenge,
    cancelDaily,
    updateFOV,
    pause,
    resume,
    exitToMenu
  };
})();

// ─────────────── Bootstrapper ───────────────
document.addEventListener('DOMContentLoaded', () => {
  BG.init();
  FPS.start();
  Game.initThree();
  Settings.load();
  Progress.load();
  UI.showScreen('screen-menu');
});
