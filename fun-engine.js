// ==========================================================================
// FUN ENGINE: Shared Achievements, XP Tracker, Konami Code & Chiptune Audio
// ==========================================================================

class FunEngine {
  constructor() {
    this.storageKey = 'mayer_fun_state_v1';
    this.state = this.loadState();
    this.audioCtx = null;
    this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.konamiIndex = 0;
    
    this.initAudio();
    this.initDOM();
    this.initKonami();
    this.initConfetti();
    this.checkInitialAchievements();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return {
      xp: 0,
      level: 1,
      achievements: {},
      stats: {
        torchSwings: 0,
        commandsRun: 0,
        relicsFound: 0,
        minigamesWon: 0
      }
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    this.updateHUD();
  }

  initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    }
  }

  ensureAudio() {
    if (!this.audioCtx) {
      this.initAudio();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playChiptuneJingle(type = 'achievement') {
    this.ensureAudio();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      if (type === 'achievement') {
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.18, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.09 + 0.18);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.2);
        });
      } else if (type === 'party') {
        const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.2, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.28);
        });
      } else if (type === 'levelup') {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.12, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.15);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.18);
        });
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  addXP(amount, reason = 'Action') {
    this.state.xp += amount;
    const nextLevelXP = this.state.level * 100;

    if (this.state.xp >= nextLevelXP) {
      this.state.level++;
      this.playChiptuneJingle('levelup');
      this.triggerConfetti();
      this.showToast({
        tag: 'LEVEL UP!',
        title: `Reached Level ${this.state.level}!`,
        desc: 'New rank unlocked in Mayer Systems Universe.',
        icon: '🌟',
        xp: `Level ${this.state.level}`
      });
    }

    this.saveState();
  }

  unlockAchievement(id, title, desc, icon = '🏆', xpBonus = 50) {
    if (this.state.achievements[id]) return; // Already unlocked

    this.state.achievements[id] = {
      title,
      desc,
      icon,
      unlockedAt: new Date().toISOString()
    };

    this.addXP(xpBonus, `Achievement: ${title}`);
    this.playChiptuneJingle('achievement');
    this.showToast({
      tag: 'ACHIEVEMENT UNLOCKED',
      title,
      desc,
      icon,
      xp: `+${xpBonus} XP`
    });
  }

  showToast({ tag, title, desc, icon, xp }) {
    let container = document.querySelector('.achievement-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'achievement-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="achievement-icon">${icon}</div>
      <div class="achievement-details">
        <span class="achievement-tag">${tag}</span>
        <span class="achievement-title">${title}</span>
        <span class="achievement-desc">${desc}</span>
        <span class="achievement-xp-gain">${xp}</span>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 5200);
  }

  initDOM() {
    // Create XP HUD at bottom left if not present
    if (!document.querySelector('.mayer-xp-hud')) {
      const hud = document.createElement('div');
      hud.className = 'mayer-xp-hud';
      hud.title = 'Mayer Systems Explorer Level & XP Progress';
      hud.innerHTML = `
        <div class="xp-badge" id="hud-level-badge">LVL ${this.state.level}</div>
        <div class="xp-bar-container">
          <div class="xp-text-row">
            <span>XP</span>
            <span id="hud-xp-text">${this.state.xp} / ${this.state.level * 100}</span>
          </div>
          <div class="xp-progress-track">
            <div class="xp-progress-fill" id="hud-xp-fill" style="width: ${(this.state.xp % 100)}%;"></div>
          </div>
        </div>
      `;
      document.body.appendChild(hud);
    }
    this.updateHUD();
  }

  updateHUD() {
    const badge = document.getElementById('hud-level-badge');
    const xpText = document.getElementById('hud-xp-text');
    const fill = document.getElementById('hud-xp-fill');

    if (badge) badge.textContent = `LVL ${this.state.level}`;
    if (xpText) {
      const levelBase = (this.state.level - 1) * 100;
      const currentLevelXP = Math.max(0, this.state.xp - levelBase);
      xpText.textContent = `${currentLevelXP} / 100`;
      if (fill) {
        fill.style.width = `${Math.min(100, (currentLevelXP / 100) * 100)}%`;
      }
    }
  }

  initKonami() {
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === this.konamiCode[this.konamiIndex].toLowerCase()) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiCode.length) {
          this.konamiIndex = 0;
          this.triggerKonamiParty();
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  }

  triggerKonamiParty() {
    document.body.classList.add('konami-party-mode');
    this.playChiptuneJingle('party');
    this.triggerConfetti(150);

    this.unlockAchievement(
      'konami_master',
      'Retro Cheat Master',
      'Discovered the secret 8-bit Konami code in the dark!',
      '🕹️',
      100
    );

    const banner = document.createElement('div');
    banner.className = 'party-banner';
    banner.innerHTML = `
      <h1>🎉 RETRO ARCADE PARTY MODE! 🎉</h1>
      <p>+100 XP REWARDED // SYSTEM OVERCLOCKED</p>
    `;
    document.body.appendChild(banner);

    setTimeout(() => {
      document.body.classList.remove('konami-party-mode');
      if (banner.parentElement) banner.remove();
    }, 4500);
  }

  initConfetti() {
    if (!document.getElementById('confetti-canvas')) {
      const canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      document.body.appendChild(canvas);
    }
  }

  triggerConfetti(count = 80) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#38bdf8', '#a855f7', '#4ade80', '#fb7185', '#ffd778'];
    const particles = Array.from({ length: count }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10,
      life: 1
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rSpeed;
        p.life -= 0.012;

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      if (alive && frame < 180) {
        frame++;
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animate();
  }

  checkInitialAchievements() {
    // Check page context
    const path = window.location.pathname;
    if (path.includes('adventure.html')) {
      this.unlockAchievement('first_expedition', 'The Flashlight Pioneer', 'Entered the dark lost vault of Mayer.', '🔦', 25);
    } else if (path.includes('mystery.html')) {
      this.unlockAchievement('classified_clearance', 'Level-4 Clearance', 'Accessed the classified dossiers archive.', '📁', 25);
    } else {
      this.unlockAchievement('visitor_welcome', 'System Connect', 'Established link with Kwame Afriyie Ampomah.', '⚡', 15);
    }
  }
}

// Instantiate globally
window.mayerFun = new FunEngine();
