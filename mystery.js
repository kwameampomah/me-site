// ==========================================================================
// PROJECT BLACKOUT: Gamified Engine, Multi-Spectrum Lighting, Mini-Games & Audio
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;

  // Visual Elements
  const flashlightMask = document.getElementById('flashlight');
  const flickerEl = document.getElementById('flicker');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const spectrumToggleBtn = document.getElementById('spectrum-toggle');
  const spectrumIcon = document.getElementById('spectrum-icon');
  const beamModeText = document.getElementById('beam-mode-text');
  
  // Audio & Voice Elements
  const audioToggleBtn = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const voiceBriefingBtn = document.getElementById('voice-briefing-btn');
  const heroPlayVoice = document.getElementById('hero-play-voice');

  // Terminal & Modals
  const terminalTrigger = document.getElementById('terminal-trigger');
  const heroLaunchTerminal = document.getElementById('hero-launch-terminal');
  const heroOpenBench = document.getElementById('hero-open-bench');
  const terminalModal = document.getElementById('terminal-modal');
  const termClose = document.getElementById('term-close');
  const termForm = document.getElementById('term-form');
  const termInput = document.getElementById('term-input');
  const termOutput = document.getElementById('term-output');

  // Badges & ID Card Modals
  const badgesTrigger = document.getElementById('badges-trigger');
  const clearanceBox = document.getElementById('clearance-box');
  const badgesModal = document.getElementById('badges-modal');
  const badgesClose = document.getElementById('badges-close');
  const badgesGridContainer = document.getElementById('badges-grid-container');
  const modalClearanceText = document.getElementById('modal-clearance-text');
  const modalXpText = document.getElementById('modal-xp-text');
  const modalXpBar = document.getElementById('modal-xp-bar');
  const hudLevel = document.getElementById('hud-level');
  const hudXp = document.getElementById('hud-xp');
  const openIdCardBtn = document.getElementById('open-id-card-btn');
  const idCardModal = document.getElementById('id-card-modal');
  const idCardClose = document.getElementById('id-card-close');
  const achToast = document.getElementById('achievement-toast');
  const achToastDesc = document.getElementById('ach-toast-desc');

  // State Management
  const SPECTRUMLIST = ['normal', 'uv', 'nvg', 'thermal'];
  let currentSpectrumIndex = 0;
  let isAudioActive = false;
  let audioCtx = null;
  let ambientOsc = null;
  let ambientGain = null;
  let isMatrixRainActive = false;
  let matrixInterval = null;

  // Detective Achievements Database
  const ACHIEVEMENTS = [
    { id: 'flash_start', title: 'Flashlight Pioneer', desc: 'Explored the darkness with your torch beam.', icon: '🔦', xp: 15, unlocked: false },
    { id: 'spectrum_shift', title: 'Spectrum Explorer', desc: 'Cycled through all 4 visual spectrums.', icon: '🔮', xp: 15, unlocked: false },
    { id: 'bench_mod', title: 'Hardware Surgeon', desc: 'Customized a rig on the Modding Bench.', icon: '🛠️', xp: 15, unlocked: false },
    { id: 'case_inspect', title: 'Forensic Investigator', desc: 'Inspected a classified incident log.', icon: '🔍', xp: 15, unlocked: false },
    { id: 'terminal_cmd', title: 'Console Infiltrator', desc: 'Executed commands in the CLI terminal.', icon: '💻', xp: 15, unlocked: false },
    { id: 'konami_hack', title: 'Matrix Overdrive', desc: 'Triggered the secret Konami code.', icon: '⚡', xp: 15, unlocked: false },
    { id: 'game_victor', title: 'Arcade Champion', desc: 'Launched a terminal mini-game.', icon: '👾', xp: 10, unlocked: false }
  ];

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('project_blackout_achievements');
      if (saved) {
        const savedIds = JSON.parse(saved);
        ACHIEVEMENTS.forEach(ach => {
          if (savedIds.includes(ach.id)) ach.unlocked = true;
        });
      }
    } catch (e) {}
  };
  loadSavedState();

  const calculateXP = () => {
    const totalXP = ACHIEVEMENTS.reduce((sum, ach) => sum + (ach.unlocked ? ach.xp : 0), 0);
    let levelTitle = 'LVL 1 [RECRUIT]';
    if (totalXP >= 100) levelTitle = 'LVL 5 [MASTER OPERATIVE]';
    else if (totalXP >= 75) levelTitle = 'LVL 4 [SPECIALIST]';
    else if (totalXP >= 50) levelTitle = 'LVL 3 [INVESTIGATOR]';
    else if (totalXP >= 25) levelTitle = 'LVL 2 [FIELD AGENT]';

    if (hudLevel) hudLevel.textContent = levelTitle;
    if (hudXp) hudXp.textContent = totalXP;
    if (modalClearanceText) modalClearanceText.textContent = levelTitle;
    if (modalXpText) modalXpText.textContent = `${totalXP} / 100 XP`;
    if (modalXpBar) modalXpBar.style.width = `${totalXP}%`;

    if (openIdCardBtn) {
      if (totalXP >= 100) {
        openIdCardBtn.disabled = false;
        openIdCardBtn.textContent = '👑 VIEW CLASSIFIED OPERATIVE ID CARD (UNLOCKED)';
      } else {
        openIdCardBtn.disabled = true;
        openIdCardBtn.textContent = `VIEW OPERATIVE ID CARD (${totalXP}/100 XP REQUIRED)`;
      }
    }
    renderBadgesModal();
  };

  const unlockAchievement = (id) => {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach || ach.unlocked) return;

    ach.unlocked = true;
    try {
      const unlockedIds = ACHIEVEMENTS.filter(a => a.unlocked).map(a => a.id);
      localStorage.setItem('project_blackout_achievements', JSON.stringify(unlockedIds));
    } catch (e) {}

    calculateXP();
    showAchievementToast(ach);
    playSynthSound('achievement');
  };

  const showAchievementToast = (ach) => {
    if (!achToast) return;
    achToastDesc.textContent = `${ach.title}: ${ach.desc}`;
    achToast.classList.add('show');
    setTimeout(() => achToast.classList.remove('show'), 3500);
  };

  const renderBadgesModal = () => {
    if (!badgesGridContainer) return;
    badgesGridContainer.innerHTML = ACHIEVEMENTS.map(ach => `
      <div class="badge-card ${ach.unlocked ? 'unlocked' : ''}">
        <div class="badge-icon">${ach.icon}</div>
        <div class="badge-info">
          <div class="badge-title">${ach.title} (+${ach.xp} XP)</div>
          <div class="badge-desc">${ach.unlocked ? ach.desc : '[CLASSIFIED - COMPLETE MISSION TO UNLOCK]'}</div>
        </div>
      </div>
    `).join('');
  };

  // --------------------------------------------------------------------------
  // DYNAMIC FLASHLIGHT TRACKING & FLICKER
  // --------------------------------------------------------------------------
  let firstMoveTriggered = false;
  const updateLightPosition = (x, y) => {
    root.style.setProperty('--mouse-x', `${x}px`);
    root.style.setProperty('--mouse-y', `${y}px`);

    if (!firstMoveTriggered) {
      firstMoveTriggered = true;
      unlockAchievement('flash_start');
    }
  };

  window.addEventListener('mousemove', (e) => updateLightPosition(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) updateLightPosition(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  updateLightPosition(window.innerWidth / 2, window.innerHeight / 2);

  const triggerFlicker = () => {
    if (flickerEl) {
      flickerEl.classList.add('flickering');
      setTimeout(() => flickerEl.classList.remove('flickering'), 160 + Math.random() * 180);
    }
    setTimeout(triggerFlicker, 7000 + Math.random() * 12000);
  };
  setTimeout(triggerFlicker, 4000);

  // --------------------------------------------------------------------------
  // MULTI-SPECTRUM VISION SWITCHER
  // --------------------------------------------------------------------------
  let spectraVisited = new Set();
  const setSpectrum = (mode) => {
    body.classList.remove('torch-mode-normal', 'torch-mode-uv', 'torch-mode-nvg', 'torch-mode-thermal');
    body.classList.add(`torch-mode-${mode}`);

    spectraVisited.add(mode);
    if (spectraVisited.size >= 4) {
      unlockAchievement('spectrum_shift');
    }

    if (mode === 'normal') {
      spectrumIcon.textContent = '💡';
      beamModeText.textContent = 'WHITE TORCH';
      spectrumToggleBtn.classList.remove('highlight');
      playSynthSound('click');
    } else if (mode === 'uv') {
      spectrumIcon.textContent = '🟣';
      beamModeText.textContent = 'UV BLACKLIGHT';
      spectrumToggleBtn.classList.add('highlight');
      playSynthSound('uv');
    } else if (mode === 'nvg') {
      spectrumIcon.textContent = '🟢';
      beamModeText.textContent = 'NIGHT VISION';
      spectrumToggleBtn.classList.add('highlight');
      playSynthSound('nvg');
    } else if (mode === 'thermal') {
      spectrumIcon.textContent = '🔴';
      beamModeText.textContent = 'THERMAL HEAT-MAP';
      spectrumToggleBtn.classList.add('highlight');
      playSynthSound('thermal');
    }
  };

  const cycleSpectrum = () => {
    currentSpectrumIndex = (currentSpectrumIndex + 1) % SPECTRUMLIST.length;
    setSpectrum(SPECTRUMLIST[currentSpectrumIndex]);
  };

  if (spectrumToggleBtn) spectrumToggleBtn.addEventListener('click', cycleSpectrum);

  // --------------------------------------------------------------------------
  // WEB AUDIO SYNTHESIZER SOUNDBOARD (Zero external audio files)
  // --------------------------------------------------------------------------
  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playSynthSound = (soundType) => {
    initAudio();
    if (!audioCtx) return;

    try {
      const t = audioCtx.currentTime;

      if (soundType === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(650, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      } else if (soundType === 'uv') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.12);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      } else if (soundType === 'nvg') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(4500, t);
        osc.frequency.exponentialRampToValueAtTime(2200, t + 0.25);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      } else if (soundType === 'thermal') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(480, t + 0.15);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      } else if (soundType === 'ps3-chime') {
        const freqs = [220, 329.63, 440, 659.25, 880];
        freqs.forEach((f, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5 + idx * 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 2.8);
        });
      } else if (soundType === 'dialup') {
        for (let i = 0; i < 6; i++) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
          osc.frequency.setValueAtTime(800 + i * 280, t + i * 0.15);
          gain.gain.setValueAtTime(0.04, t + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.18);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t + i * 0.15);
          osc.stop(t + i * 0.15 + 0.2);
        }
      } else if (soundType === 'ventoy-boot') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1760, t + 0.1);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      } else if (soundType === 'geiger') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2000 + Math.random() * 2000, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.03);
      } else if (soundType === 'achievement') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + i * 0.08);
          gain.gain.setValueAtTime(0.12, t + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.4);
        });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleAmbientDrone = () => {
    initAudio();
    isAudioActive = !isAudioActive;

    if (isAudioActive) {
      audioIcon.textContent = '🔊';
      audioToggleBtn.classList.add('highlight');
      ambientOsc = audioCtx.createOscillator();
      ambientGain = audioCtx.createGain();
      ambientOsc.type = 'sine';
      ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime);
      ambientGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      ambientOsc.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);
      ambientOsc.start();
    } else if (ambientOsc) {
      audioIcon.textContent = '🔇';
      audioToggleBtn.classList.remove('highlight');
      ambientOsc.stop();
      ambientOsc.disconnect();
      ambientOsc = null;
    }
  };

  if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAmbientDrone);

  document.querySelectorAll('.snd-pad').forEach(pad => {
    pad.addEventListener('click', () => {
      const snd = pad.getAttribute('data-sound');
      if (snd === 'nvg-activate') playSynthSound('nvg');
      else playSynthSound(snd);
    });
  });

  // --------------------------------------------------------------------------
  // AI VOICE DEBRIEF (Native Web Speech API)
  // --------------------------------------------------------------------------
  const playVoiceDebrief = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();

    const debriefText = 'Classified archive unlocked. Subject: Kwame Afriyie Ampomah. Known operative alias: Mayer. Clearance profile: Information Technology operative stationed at Valley View University and Maxim Nyansa. Specializing in web systems administration, version control, storage forensics, and networking infrastructure. Zero constraint deployment verified.';

    const utterance = new SpeechSynthesisUtterance(debriefText);
    utterance.rate = 1.05;
    utterance.pitch = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David')));
    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
    playSynthSound('click');
  };

  if (voiceBriefingBtn) voiceBriefingBtn.addEventListener('click', playVoiceDebrief);
  if (heroPlayVoice) heroPlayVoice.addEventListener('click', playVoiceDebrief);

  // --------------------------------------------------------------------------
  // FULL MATRIX DIGITAL RAIN (Konami Code & Command)
  // --------------------------------------------------------------------------
  const initMatrixRain = () => {
    if (!matrixCanvas) return;
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const chars = '0123456789ABCDEFKWAMEMAYER81801OPTANEVENTOYMOK';
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = '#22c55e';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 35);
  };

  const toggleMatrixRain = () => {
    isMatrixRainActive = !isMatrixRainActive;
    if (isMatrixRainActive) {
      matrixCanvas.classList.add('active');
      initMatrixRain();
      unlockAchievement('konami_hack');
      playSynthSound('achievement');
    } else {
      matrixCanvas.classList.remove('active');
      if (matrixInterval) clearInterval(matrixInterval);
    }
  };

  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  window.addEventListener('keydown', (e) => {
    if (document.activeElement === termInput) return;

    if (e.key.toLowerCase() === konamiSequence[konamiIndex].toLowerCase()) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        toggleMatrixRain();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // --------------------------------------------------------------------------
  // INTERACTIVE HARDWARE MOD BENCH
  // --------------------------------------------------------------------------
  const btnPs3Ssd = document.getElementById('btn-ps3-ssd');
  const btnPs3Cfw = document.getElementById('btn-ps3-cfw');
  const btnPs3Webman = document.getElementById('btn-ps3-webman');
  const ps3DriveText = document.getElementById('ps3-drive-text');
  const ps3FwText = document.getElementById('ps3-fw-text');
  const ps3TempText = document.getElementById('ps3-temp-text');
  const ps3StreamText = document.getElementById('ps3-stream-text');
  const ps3StatusPill = document.getElementById('ps3-status-pill');

  if (btnPs3Ssd) {
    btnPs3Ssd.addEventListener('click', () => {
      ps3DriveText.textContent = 'High-Speed SATA SSD (1TB)';
      ps3DriveText.className = 'v success';
      ps3TempText.textContent = 'CELL: 58°C | RSX: 54°C (Optimized)';
      ps3TempText.className = 'v success';
      ps3StatusPill.textContent = 'SSD INSTALLED';
      unlockAchievement('bench_mod');
      playSynthSound('click');
    });
  }
  if (btnPs3Cfw) {
    btnPs3Cfw.addEventListener('click', () => {
      ps3FwText.textContent = 'Evilnat 4.90.2 PEX Custom Firmware';
      ps3FwText.className = 'v success';
      ps3StatusPill.textContent = 'CFW ACTIVE';
      unlockAchievement('bench_mod');
      playSynthSound('ps3-chime');
    });
  }
  if (btnPs3Webman) {
    btnPs3Webman.addEventListener('click', () => {
      ps3StreamText.textContent = 'ONLINE [FTP: 192.168.0.45:21 | webMAN: PORT 80]';
      ps3StreamText.className = 'v success';
      unlockAchievement('bench_mod');
      playSynthSound('click');
    });
  }

  const btnRouterFlash = document.getElementById('btn-router-flash');
  const btnRouterIp = document.getElementById('btn-router-ip');
  const btnRouterDhcp = document.getElementById('btn-router-dhcp');
  const routerFwText = document.getElementById('router-fw-text');
  const routerIpText = document.getElementById('router-ip-text');
  const routerDhcpText = document.getElementById('router-dhcp-text');
  const routerBridgeText = document.getElementById('router-bridge-text');
  const routerStatusPill = document.getElementById('router-status-pill');

  if (btnRouterFlash) {
    btnRouterFlash.addEventListener('click', () => {
      routerFwText.textContent = 'v1.0.5 Build 2024 (Patched & Flashed)';
      routerFwText.className = 'v success';
      unlockAchievement('bench_mod');
      playSynthSound('click');
    });
  }
  if (btnRouterIp) {
    btnRouterIp.addEventListener('click', () => {
      routerIpText.textContent = '192.168.0.2 (Subnet Aligned with Tenda)';
      routerIpText.className = 'v success';
      unlockAchievement('bench_mod');
      playSynthSound('click');
    });
  }
  if (btnRouterDhcp) {
    btnRouterDhcp.addEventListener('click', () => {
      routerDhcpText.textContent = 'DISABLED (Zero IP Collisions)';
      routerDhcpText.className = 'v success';
      routerBridgeText.textContent = 'LAN-to-LAN BRIDGE ONLINE (100% Throughput)';
      routerBridgeText.className = 'v success';
      routerStatusPill.textContent = 'BRIDGE ACTIVE';
      unlockAchievement('bench_mod');
      playSynthSound('click');
    });
  }

  const bootOptBtns = document.querySelectorAll('.boot-opt-btn');
  const ventoyOutputText = document.getElementById('ventoy-output-text');
  const btnVentoyBoot = document.getElementById('btn-ventoy-boot');
  const btnVentoyMok = document.getElementById('btn-ventoy-mok');

  let selectedBootTarget = 'win11';
  bootOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bootOptBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedBootTarget = btn.getAttribute('data-target');
      playSynthSound('click');

      if (selectedBootTarget === 'win11') {
        ventoyOutputText.textContent = '> Selected: Windows 11 with Local Account OOBE Bypass';
      } else if (selectedBootTarget === 'macos') {
        ventoyOutputText.textContent = '> Selected: macOS Monterey Internet Recovery & Partition Nullifier';
      } else {
        ventoyOutputText.textContent = '> Selected: Intel Optane Hybrid Storage Sector Rescue';
      }
    });
  });

  if (btnVentoyBoot) {
    btnVentoyBoot.addEventListener('click', () => {
      ventoyOutputText.textContent = `[BOOT SIMULATION] Launching ${selectedBootTarget.toUpperCase()} EFI Kernel... [SUCCESS]`;
      unlockAchievement('bench_mod');
      playSynthSound('ventoy-boot');
    });
  }
  if (btnVentoyMok) {
    btnVentoyMok.addEventListener('click', () => {
      ventoyOutputText.textContent = '[MOK MANAGER] Certificate Key Enrolled into Secure Boot Database.';
      unlockAchievement('bench_mod');
      playSynthSound('click');
    });
  }

  document.querySelectorAll('.mini-inspect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const inc = btn.getAttribute('data-inspect');
      openTerminal();
      setTimeout(() => handleCommand(inc), 150);
      unlockAchievement('case_inspect');
    });
  });

  // --------------------------------------------------------------------------
  // MODALS & NAVIGATION HANDLERS
  // --------------------------------------------------------------------------
  const openTerminal = () => {
    if (terminalModal) {
      terminalModal.classList.add('open');
      playSynthSound('click');
      setTimeout(() => termInput.focus(), 50);
    }
  };
  const closeTerminal = () => {
    if (terminalModal) terminalModal.classList.remove('open');
  };

  if (terminalTrigger) terminalTrigger.addEventListener('click', openTerminal);
  if (heroLaunchTerminal) heroLaunchTerminal.addEventListener('click', openTerminal);
  if (termClose) termClose.addEventListener('click', closeTerminal);
  if (terminalModal) {
    terminalModal.addEventListener('click', (e) => {
      if (e.target === terminalModal) closeTerminal();
    });
  }

  if (heroOpenBench) {
    heroOpenBench.addEventListener('click', () => {
      document.getElementById('mod-bench').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const openBadgesModal = () => {
    calculateXP();
    if (badgesModal) badgesModal.classList.add('open');
    playSynthSound('click');
  };
  const closeBadgesModal = () => {
    if (badgesModal) badgesModal.classList.remove('open');
  };
  if (badgesTrigger) badgesTrigger.addEventListener('click', openBadgesModal);
  if (clearanceBox) clearanceBox.addEventListener('click', openBadgesModal);
  if (badgesClose) badgesClose.addEventListener('click', closeBadgesModal);

  const openIdCard = () => {
    if (idCardModal) idCardModal.classList.add('open');
    playSynthSound('achievement');
  };
  const closeIdCard = () => {
    if (idCardModal) idCardModal.classList.remove('open');
  };
  if (openIdCardBtn) openIdCardBtn.addEventListener('click', openIdCard);
  if (idCardClose) idCardClose.addEventListener('click', closeIdCard);

  // --------------------------------------------------------------------------
  // INTERACTIVE HACKER TERMINAL & MINI-GAMES
  // --------------------------------------------------------------------------
  const printLine = (html, className = '') => {
    const div = document.createElement('div');
    div.className = `term-msg ${className}`;
    div.innerHTML = html;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
  };

  let activeGame = null;
  let hackSecret = 'VENT';
  let hackWords = ['VENT', 'BYTE', 'PORT', 'BIOS', 'DISK', 'CORE'];
  let hackAttempts = 4;

  const startHackGame = () => {
    activeGame = 'hack';
    hackAttempts = 4;
    hackSecret = hackWords[Math.floor(Math.random() * hackWords.length)];
    printLine(`
[TERMINAL MEMORY BREACH v2.4]
Attempts remaining: 4
Select password from memory dump:
0xF4A2: VENT   BYTE   PORT
0xF4B8: BIOS   DISK   CORE

Type your 4-letter guess:`, 'system');
    unlockAchievement('game_victor');
  };

  const handleHackInput = (guess) => {
    guess = guess.toUpperCase();
    if (!hackWords.includes(guess)) {
      printLine(`Word not in memory bank. Options: ${hackWords.join(', ')}`, 'error');
      return;
    }

    if (guess === hackSecret) {
      printLine(`[+] ACCESS GRANTED. Memory decrypt unlocked!`, 'system');
      playSynthSound('achievement');
      activeGame = null;
      unlockAchievement('terminal_cmd');
    } else {
      hackAttempts--;
      let likeness = 0;
      for (let i = 0; i < 4; i++) {
        if (guess[i] === hackSecret[i]) likeness++;
      }
      if (hackAttempts <= 0) {
        printLine(`[-] LOCKOUT TRIGGERED. Password was: ${hackSecret}`, 'error');
        activeGame = null;
      } else {
        printLine(`[-] Entry Denied. Likeness=${likeness}/4. Attempts left: ${hackAttempts}`, 'error');
      }
    }
  };

  let snakeInterval = null;
  let snakeBody = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  let snakeFood = { x: 10, y: 5 };
  let snakeDir = { x: 1, y: 0 };
  const gridW = 20;
  const gridH = 10;

  const startSnakeGame = () => {
    activeGame = 'snake';
    snakeBody = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    snakeFood = { x: 12, y: 5 };
    snakeDir = { x: 1, y: 0 };

    printLine(`
[ASCII SNAKE LAUNCHED]
Use W/A/S/D or Arrow keys to steer.
Type 'q' to quit.`, 'system');

    unlockAchievement('game_victor');

    if (snakeInterval) clearInterval(snakeInterval);
    snakeInterval = setInterval(updateSnake, 200);
  };

  const updateSnake = () => {
    const head = { x: snakeBody[0].x + snakeDir.x, y: snakeBody[0].y + snakeDir.y };

    if (head.x < 0 || head.x >= gridW || head.y < 0 || head.y >= gridH) {
      printLine(`[GAME OVER] Snake crashed into wall!`, 'error');
      clearInterval(snakeInterval);
      activeGame = null;
      return;
    }

    snakeBody.unshift(head);
    if (head.x === snakeFood.x && head.y === snakeFood.y) {
      playSynthSound('click');
      snakeFood = {
        x: Math.floor(Math.random() * gridW),
        y: Math.floor(Math.random() * gridH)
      };
    } else {
      snakeBody.pop();
    }

    let board = '';
    for (let y = 0; y < gridH; y++) {
      let row = '';
      for (let x = 0; x < gridW; x++) {
        if (x === head.x && y === head.y) row += 'O';
        else if (snakeBody.some(b => b.x === x && b.y === y)) row += 'o';
        else if (x === snakeFood.x && y === snakeFood.y) row += '*';
        else row += '.';
      }
      board += row + '\n';
    }
    termOutput.innerHTML = `<div class="term-msg system">[SNAKE GAME // SCORE: ${snakeBody.length - 3}]</div><pre style="color:#22c55e;">${board}</pre>`;
  };

  let optaneTarget = 512;
  let optaneCurrent = 2048;

  const startOptanePuzzle = () => {
    activeGame = 'optane-puzzle';
    optaneCurrent = 2048;
    printLine(`
[INTEL OPTANE RECOVERY CONSOLE]
Current Partition: 2048 GB (Corrupted Binding)
Target Partition: 512 GB

Available Directives:
- <span class="glow-cyan">flush</span>   : Purges 1024 GB invalid BIOS descriptor
- <span class="glow-cyan">unbind</span>  : Decreases 256 GB metadata cache
- <span class="glow-cyan">rebind</span>  : Adds 512 GB volume map
- <span class="glow-cyan">verify</span>  : Tests current allocation against 512 GB target`, 'system');
    unlockAchievement('game_victor');
  };

  const handleOptaneInput = (cmd) => {
    if (cmd === 'flush') {
      optaneCurrent = Math.max(0, optaneCurrent - 1024);
      printLine(`[>] Flushed BIOS binding cache. Partition size: ${optaneCurrent} GB`);
    } else if (cmd === 'unbind') {
      optaneCurrent = Math.max(0, optaneCurrent - 256);
      printLine(`[>] Metadata descriptor unbound. Partition size: ${optaneCurrent} GB`);
    } else if (cmd === 'rebind') {
      optaneCurrent += 512;
      printLine(`[>] Volume map rebound. Partition size: ${optaneCurrent} GB`);
    } else if (cmd === 'verify') {
      if (optaneCurrent === 512) {
        printLine(`[+] SUCCESS! 512 GB Real Capacity restored and verified.`, 'system');
        playSynthSound('achievement');
        activeGame = null;
        unlockAchievement('terminal_cmd');
      } else {
        printLine(`[-] VERIFICATION FAILED. Current: ${optaneCurrent} GB. Target: 512 GB.`, 'error');
      }
    } else {
      printLine(`Unknown puzzle directive. Use: flush, unbind, rebind, verify`, 'error');
    }
  };

  const handleCommand = (cmdStr) => {
    const raw = cmdStr.trim();
    const cmd = raw.toLowerCase();

    if (activeGame === 'hack') {
      handleHackInput(raw);
      return;
    }
    if (activeGame === 'snake') {
      if (cmd === 'q') {
        clearInterval(snakeInterval);
        activeGame = null;
        printLine(`Snake game exited.`);
      }
      return;
    }
    if (activeGame === 'optane-puzzle') {
      handleOptaneInput(cmd);
      return;
    }

    printLine(`<span class="term-user-prompt">kwame@blackout:~$</span> ${cmdStr}`);
    unlockAchievement('terminal_cmd');

    switch (cmd) {
      case 'help':
        printLine(`CLASSIFIED OPERATIVE DIRECTIVES:
- <span class="glow-cyan">hack</span>           : Launch Fallout/Cyberpunk password breach game
- <span class="glow-cyan">snake</span>          : Play real-time ASCII arcade snake in CLI
- <span class="glow-cyan">optane-repair</span>  : Launch Intel Optane sector restoration puzzle
- <span class="glow-cyan">scan</span>           : Reconnaissance scan of operative workstation
- <span class="glow-cyan">dossier</span>        : View complete file #81801 for Kwame (Mayer)
- <span class="glow-cyan">bench</span>          : Jump to Interactive Hardware Mod Bench
- <span class="glow-cyan">matrix</span>         : Toggle full-screen Matrix digital rain
- <span class="glow-cyan">uv</span> / <span class="glow-cyan">nvg</span> / <span class="glow-cyan">thermal</span> / <span class="glow-cyan">torch</span> : Switch lighting spectrums
- <span class="glow-cyan">voice</span>          : Trigger synthesized AI mission voice debrief
- <span class="glow-cyan">soundboard</span>     : Trigger vintage audio test chimes
- <span class="glow-cyan">achievements</span>   : View detective clearance badges
- <span class="glow-cyan">idcard</span>         : Inspect Master Operative ID Card
- <span class="glow-cyan">contact</span>        : Print secure connection channels
- <span class="glow-cyan">clear</span>          : Flush terminal log
- <span class="glow-cyan">exit</span>           : Close console`);
        break;

      case 'hack':
        startHackGame();
        break;

      case 'snake':
        startSnakeGame();
        break;

      case 'optane-repair':
      case 'optane':
        startOptanePuzzle();
        break;

      case 'scan':
        printLine(`[+] RUNNING SYSTEM RECONNAISSANCE...`, 'system');
        setTimeout(() => {
          printLine(`
HARDWARE SPECS:
- Laptop: Acer Aspire Go 14
- Mobile Link: Samsung Galaxy A06
- Multiboot: Ventoy (MOK Signed)
- Storage Health: 100% (512GB Verified)
- Subnet Gateway: 192.168.0.1 (Tenda & TP-Link Bridge Online)
- Operative Status: READY TO DEPLOY`);
        }, 300);
        break;

      case 'dossier':
      case 'whoami':
        printLine(`
[CLASSIFIED DOSSIER FILE #81801]
- NAME: Kwame Afriyie Ampomah
- ALIAS: Mayer
- BASE: Taifa, Greater Accra Region, Ghana
- ACADEMICS: Valley View University (B.Ed in IT)
- ASSIGNMENTS: Maxim Nyansa, Valley View Univ, KEY WATCH GHANA`);
        break;

      case 'bench':
        closeTerminal();
        document.getElementById('mod-bench').scrollIntoView({ behavior: 'smooth' });
        break;

      case 'matrix':
        toggleMatrixRain();
        printLine(`[+] Matrix Digital Rain toggled.`);
        break;

      case 'uv':
        setSpectrum('uv');
        printLine(`[+] Spectrum set to UV Blacklight.`, 'system');
        break;
      case 'nvg':
        setSpectrum('nvg');
        printLine(`[+] Spectrum set to Night Vision (NVG).`, 'system');
        break;
      case 'thermal':
        setSpectrum('thermal');
        printLine(`[+] Spectrum set to Thermal Heat-Map.`, 'system');
        break;
      case 'torch':
        setSpectrum('normal');
        printLine(`[+] Spectrum set to White Torch.`, 'system');
        break;

      case 'voice':
        playVoiceDebrief();
        printLine(`[+] Synthesizing vocal mission briefing...`, 'system');
        break;

      case 'soundboard':
        playSynthSound('ps3-chime');
        printLine(`[+] Soundboard chime triggered.`, 'system');
        break;

      case 'achievements':
      case 'badges':
        openBadgesModal();
        break;

      case 'idcard':
        openIdCard();
        break;

      case 'contact':
        printLine(`
SECURE TRANSMISSION CHANNELS:
- Email: kwameampomah111@gmail.com
- Phone: 0200121912
- GitHub: https://github.com/kwameampomah
- LinkedIn: https://www.linkedin.com/in/kwame-ampomah-10175931b`);
        break;

      case 'secret':
        printLine(`
🔓 [SECRET SIGNALS DECRYPTED]
- Steam: bigkwamz1
- Discord: attackingattitude_81801
- Passcode: "VENTOY-MOK-2026"`, 'system');
        break;

      case 'clear':
        termOutput.innerHTML = '';
        break;

      case 'exit':
        closeTerminal();
        break;

      case '':
        break;

      default:
        printLine(`Directive not recognized: "${cmdStr}". Type <span class="glow-cyan">help</span> for available commands.`, 'error');
        break;
    }
  };

  if (termForm) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = termInput.value;
      if (val.trim()) {
        handleCommand(val);
        termInput.value = '';
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (activeGame === 'snake') {
      if (['ArrowUp', 'w', 'W'].includes(e.key) && snakeDir.y === 0) snakeDir = { x: 0, y: -1 };
      else if (['ArrowDown', 's', 'S'].includes(e.key) && snakeDir.y === 0) snakeDir = { x: 0, y: 1 };
      else if (['ArrowLeft', 'a', 'A'].includes(e.key) && snakeDir.x === 0) snakeDir = { x: -1, y: 0 };
      else if (['ArrowRight', 'd', 'D'].includes(e.key) && snakeDir.x === 0) snakeDir = { x: 1, y: 0 };
      return;
    }

    if (document.activeElement === termInput) {
      if (e.key === 'Escape') closeTerminal();
      return;
    }

    if (e.key === ' ' || e.key.toLowerCase() === 'u') {
      e.preventDefault();
      cycleSpectrum();
    } else if (e.key.toLowerCase() === 't' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      openTerminal();
    } else if (e.key.toLowerCase() === 'b') {
      e.preventDefault();
      openBadgesModal();
    } else if (e.key === 'Escape') {
      closeTerminal();
      closeBadgesModal();
      closeIdCard();
    }
  });

  calculateXP();
});
