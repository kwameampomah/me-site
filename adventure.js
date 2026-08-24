// ==========================================================================
// THE EXPEDITION: Flashlight Adventure, Ambient Canvas & Audio Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;

  // HUD Elements
  const chamberIndicator = document.getElementById('chamber-indicator');
  const relicCounter = document.getElementById('relic-counter');
  const journalCount = document.getElementById('journal-count');
  const audioToggleBtn = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');

  // Lens Switchers
  const lensTorch = document.getElementById('lens-torch');
  const lensUV = document.getElementById('lens-uv');
  const lensLantern = document.getElementById('lens-lantern');
  const lensMatrix = document.getElementById('lens-matrix');

  // Battery Elements
  const batteryFill = document.getElementById('battery-fill');
  const batteryText = document.getElementById('battery-text');
  const crankBtn = document.getElementById('crank-btn');

  // Modals
  const journalToggle = document.getElementById('journal-toggle');
  const journalModal = document.getElementById('journal-modal');
  const journalClose = document.getElementById('journal-close');

  const relicModal = document.getElementById('relic-modal');
  const relicModalClose = document.getElementById('relic-modal-close');
  const inspectIcon = document.getElementById('inspect-icon');
  const inspectCat = document.getElementById('inspect-cat');
  const inspectTitle = document.getElementById('inspect-title');
  const inspectDesc = document.getElementById('inspect-desc');
  const inspectNote = document.getElementById('inspect-note');
  const claimRelicBtn = document.getElementById('claim-relic-btn');

  const chest1 = document.getElementById('chest-1');
  const chestModal = document.getElementById('chest-modal');
  const chestModalClose = document.getElementById('chest-modal-close');
  const chestClaimBtn = document.getElementById('chest-claim-btn');

  const vaultAltar = document.getElementById('vault-altar');
  const unlockVaultBtn = document.getElementById('unlock-vault-btn');
  const victoryModal = document.getElementById('victory-modal');
  const victoryClose = document.getElementById('victory-close');
  const arcadeToggle = document.getElementById('arcade-toggle');
  const phantomEl = document.getElementById('phantom-shadow');

  // --- Relic Database ---
  const relicsData = {
    1: {
      id: 1,
      name: "Optane Silicon Core",
      icon: "💎",
      category: "SYSTEMS ARTIFACT #01 // HARDWARE FORENSICS",
      desc: "A legendary storage module recovered from a corrupted BIOS binding. Kwame cleared the invalid 2TB GPT metadata and restored raw 512GB partition integrity.",
      note: "Recovered during Intel Optane H20 BIOS Binding Recovery Operation."
    },
    2: {
      id: 2,
      name: "Prism of Infinite Routes",
      icon: "🌐",
      category: "SYSTEMS ARTIFACT #02 // NETWORK BRIDGING",
      desc: "A glowing refraction crystal forged from repurposed TP-Link Archer hardware. Routes high-throughput wireless packets across isolated subnet channels without DHCP collisions.",
      note: "Flashed with firmware v1.0.5 and bridged across Tenda infrastructure."
    },
    3: {
      id: 3,
      name: "Codex of Terminal Scripts",
      icon: "📜",
      category: "SYSTEMS ARTIFACT #03 // OS & SCRIPTING",
      desc: "An ancient parchment containing terminal incantations that bypassed expired security certificate locks on locked MacBook hardware to install macOS Monterey.",
      note: "Leveraged diskutil clean, physical partition remap, and internet recovery."
    },
    4: {
      id: 4,
      name: "CFW Silicon Matrix",
      icon: "🎮",
      category: "SYSTEMS ARTIFACT #04 // EMBEDDED ARCHITECTURE",
      desc: "A custom firmware core extracted from a Sony PS3 Slim CECH-2504B. Supercharged with SSD caching and webMAN MOD remote stream diagnostics.",
      note: "Date Code 0D architecture exploit with remote thermal throttling control."
    },
    5: {
      id: 5,
      name: "Spectral Aegis of Taifa",
      icon: "🛡️",
      category: "SYSTEMS ARTIFACT #05 // CYBER ARCHON SEAL",
      desc: "The ultimate guardian seal cloaked in fluorescent UV wavelengths. Represents Kwame Afriyie Ampomah's technical base in Taifa, Accra.",
      note: "Revealed only to those with the vision to illuminate beyond the surface."
    }
  };

  // State
  let currentChamber = 'chamber-1';
  let collectedRelics = new Set();
  let currentInspectingRelic = null;
  let isAudioActive = false;
  let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let currentBeamRadius = 260;
  let baseBeamRadius = 260;
  let batteryLevel = 100;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let shakeVelocity = 0;

  // --- 1. Flashlight Tracking & Mouse Shake Dynamo ---
  const updateLightPosition = (x, y) => {
    const dx = x - lastMouseX;
    const dy = y - lastMouseY;
    shakeVelocity = Math.hypot(dx, dy);
    lastMouseX = x;
    lastMouseY = y;

    // Rapid shake recharges battery slightly
    if (shakeVelocity > 45) {
      rechargeBattery(0.4);
    }

    mousePos.x = x;
    mousePos.y = y;
    root.style.setProperty('--mouse-x', `${x}px`);
    root.style.setProperty('--mouse-y', `${y}px`);

    // Check distance to sconces to ignite them when flashlight touches
    document.querySelectorAll('.wall-sconce:not(.ignited)').forEach(sconce => {
      const rect = sconce.getBoundingClientRect();
      const sconceX = rect.left + rect.width / 2;
      const sconceY = rect.top + rect.height / 2;
      const dist = Math.hypot(x - sconceX, y - sconceY);
      if (dist < currentBeamRadius) {
        sconce.classList.add('ignited');
        playTone(360, 0.2, 'sine');
        if (window.mayerFun) {
          window.mayerFun.addXP(15, 'Ignited Ruin Sconce');
          if (document.querySelectorAll('.wall-sconce.ignited').length >= 3) {
            window.mayerFun.unlockAchievement('pyromancer', 'Torchbearer of Taifa', 'Ignited all ancient torches across the ruins.', '🔥', 50);
          }
        }
      }
    });

    // Clear cobwebs near cursor
    sweepCobwebs(x, y);
  };

  window.addEventListener('mousemove', (e) => {
    updateLightPosition(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updateLightPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  updateLightPosition(window.innerWidth / 2, window.innerHeight / 2);

  // --- 2. Battery & Dynamo Crank Mechanics ---
  const updateBatteryUI = () => {
    if (batteryFill) batteryFill.style.width = `${batteryLevel}%`;
    if (batteryText) batteryText.textContent = `${Math.round(batteryLevel)}%`;

    // Dynamic beam size based on battery
    const factor = Math.max(0.35, batteryLevel / 100);
    currentBeamRadius = baseBeamRadius * factor;
    root.style.setProperty('--beam-radius', `${currentBeamRadius}px`);
    root.style.setProperty('--beam-outer', `${currentBeamRadius * 1.5}px`);
  };

  const rechargeBattery = (amt = 35) => {
    batteryLevel = Math.min(100, batteryLevel + amt);
    updateBatteryUI();
    playTone(580, 0.15, 'triangle', 0.1);
  };

  // Battery drain loop
  setInterval(() => {
    if (batteryLevel > 15) {
      batteryLevel -= 0.6;
      updateBatteryUI();
    }
  }, 1200);

  const crankDynamo = () => {
    rechargeBattery(40);
    initAudio();
    playTone(700, 0.25, 'sawtooth', 0.2);
    if (window.mayerFun) {
      window.mayerFun.addXP(10, 'Cranked Flashlight Dynamo');
      window.mayerFun.unlockAchievement('dynamo_crank', 'Dynamo Survivor', 'Cranked the flashlight to maintain light in the dark.', '⚡', 30);
    }
  };

  if (crankBtn) crankBtn.addEventListener('click', crankDynamo);
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') crankDynamo();
  });

  // --- 3. Interactive Cobweb Canvas ---
  const cobwebCanvas = document.getElementById('cobweb-canvas');
  const cobwebCtx = cobwebCanvas ? cobwebCanvas.getContext('2d') : null;
  const webs = [];

  const initCobwebs = () => {
    if (!cobwebCanvas) return;
    cobwebCanvas.width = window.innerWidth;
    cobwebCanvas.height = window.innerHeight;

    // Generate random cobweb patches in corners
    for (let i = 0; i < 40; i++) {
      webs.push({
        x: Math.random() < 0.5 ? Math.random() * 300 : window.innerWidth - Math.random() * 300,
        y: Math.random() < 0.5 ? Math.random() * 250 : window.innerHeight - Math.random() * 250,
        radius: Math.random() * 25 + 15,
        alpha: 0.6
      });
    }
  };
  initCobwebs();

  const sweepCobwebs = (x, y) => {
    if (!cobwebCtx) return;
    let clearedCount = 0;
    webs.forEach(w => {
      const d = Math.hypot(w.x - x, w.y - y);
      if (d < currentBeamRadius) {
        w.alpha = Math.max(0, w.alpha - 0.04);
        if (w.alpha === 0) clearedCount++;
      }
    });

    // Redraw webs
    cobwebCtx.clearRect(0, 0, cobwebCanvas.width, cobwebCanvas.height);
    webs.forEach(w => {
      if (w.alpha > 0) {
        cobwebCtx.beginPath();
        cobwebCtx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        cobwebCtx.fillStyle = `rgba(200, 210, 230, ${w.alpha * 0.25})`;
        cobwebCtx.fill();
        cobwebCtx.strokeStyle = `rgba(255, 255, 255, ${w.alpha * 0.35})`;
        cobwebCtx.stroke();
      }
    });
  };

  // --- 4. Darting Shadow Phantoms ---
  const triggerPhantomScurry = () => {
    if (!phantomEl) return;
    const startX = Math.random() > 0.5 ? -100 : window.innerWidth + 50;
    const targetX = startX < 0 ? window.innerWidth + 100 : -100;
    const targetY = Math.random() * (window.innerHeight - 200) + 100;

    phantomEl.style.transform = `translate(${startX}px, ${targetY}px)`;
    phantomEl.classList.add('darting');

    setTimeout(() => {
      phantomEl.style.transform = `translate(${targetX}px, ${targetY + (Math.random() - 0.5) * 150}px)`;
    }, 50);

    setTimeout(() => {
      phantomEl.classList.remove('darting');
    }, 1300);

    // Schedule next phantom
    setTimeout(triggerPhantomScurry, 12000 + Math.random() * 18000);
  };
  setTimeout(triggerPhantomScurry, 8000);

  // --- 5. Dust Motes & Matrix Rain in Light Beam ---
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4 - 0.2,
    alpha: Math.random() * 0.5 + 0.2,
    char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
  }));

  const renderParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isMatrix = body.classList.contains('beam-matrix');

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Distance to light source
      const dist = Math.hypot(p.x - mousePos.x, p.y - mousePos.y);
      if (dist < currentBeamRadius + 80) {
        const illumination = Math.max(0, 1 - dist / (currentBeamRadius + 80));
        ctx.save();

        if (isMatrix) {
          ctx.font = '12px monospace';
          ctx.fillStyle = `rgba(74, 222, 128, ${illumination * p.alpha * 1.6})`;
          ctx.fillText(p.char, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          if (body.classList.contains('beam-uv')) {
            ctx.fillStyle = `rgba(180, 100, 255, ${illumination * p.alpha * 1.5})`;
            ctx.shadowColor = '#c084fc';
          } else {
            ctx.fillStyle = `rgba(255, 220, 140, ${illumination * p.alpha * 1.3})`;
            ctx.shadowColor = '#f59e0b';
          }
          ctx.shadowBlur = 6;
          ctx.fill();
        }
        ctx.restore();
      }
    }
    requestAnimationFrame(renderParticles);
  };
  renderParticles();

  // --- 6. Web Audio API Synthesizer ---
  let audioCtx = null;
  let ambientGain = null;
  let droneOsc1 = null;
  let droneOsc2 = null;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playTone = (freq = 440, duration = 0.2, type = 'sine', gainVal = 0.15) => {
    if (!audioCtx || !isAudioActive) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  };

  const playDiscoveryChime = () => {
    if (!audioCtx || !isAudioActive) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.4, 'sine', 0.2);
      }, idx * 100);
    });
  };

  const playVaultUnlockFanfare = () => {
    if (!audioCtx || !isAudioActive) return;
    const chords = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.5];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.8, 'triangle', 0.25);
      }, idx * 120);
    });
  };

  const toggleAmbientAudio = () => {
    initAudio();
    isAudioActive = !isAudioActive;

    if (isAudioActive) {
      audioIcon.textContent = '🔊';
      audioToggleBtn.style.borderColor = '#ffd778';
      audioToggleBtn.style.color = '#ffd778';

      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

      droneOsc1 = audioCtx.createOscillator();
      droneOsc1.type = 'sine';
      droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      droneOsc2 = audioCtx.createOscillator();
      droneOsc2.type = 'triangle';
      droneOsc2.frequency.setValueAtTime(110, audioCtx.currentTime);

      droneOsc1.connect(ambientGain);
      droneOsc2.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);

      droneOsc1.start();
      droneOsc2.start();
      playTone(440, 0.3, 'sine');
    } else {
      audioIcon.textContent = '🔇';
      audioToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      audioToggleBtn.style.color = '#e2e8f0';

      if (droneOsc1) {
        droneOsc1.stop();
        droneOsc2.stop();
        droneOsc1.disconnect();
        droneOsc2.disconnect();
        droneOsc1 = null;
        droneOsc2 = null;
      }
    }
  };

  audioToggleBtn.addEventListener('click', toggleAmbientAudio);

  // --- 7. Light Mode Switchers ---
  const setLightMode = (mode) => {
    body.classList.remove('beam-torch', 'beam-uv', 'beam-lantern', 'beam-matrix');
    lensTorch.classList.remove('active');
    lensUV.classList.remove('active');
    lensLantern.classList.remove('active');
    if (lensMatrix) lensMatrix.classList.remove('active');

    initAudio();

    if (mode === 'torch') {
      body.classList.add('beam-torch');
      lensTorch.classList.add('active');
      baseBeamRadius = 260;
      playTone(520, 0.1, 'sine');
    } else if (mode === 'uv') {
      body.classList.add('beam-uv');
      lensUV.classList.add('active');
      baseBeamRadius = 280;
      playTone(880, 0.15, 'sawtooth', 0.1);
    } else if (mode === 'lantern') {
      body.classList.add('beam-lantern');
      lensLantern.classList.add('active');
      baseBeamRadius = 380;
      playTone(330, 0.12, 'sine');
    } else if (mode === 'matrix') {
      body.classList.add('beam-matrix');
      if (lensMatrix) lensMatrix.classList.add('active');
      baseBeamRadius = 290;
      playTone(660, 0.15, 'square', 0.12);
    }
    updateBatteryUI();
  };

  lensTorch.addEventListener('click', () => setLightMode('torch'));
  lensUV.addEventListener('click', () => setLightMode('uv'));
  lensLantern.addEventListener('click', () => setLightMode('lantern'));
  if (lensMatrix) lensMatrix.addEventListener('click', () => setLightMode('matrix'));

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === '1') setLightMode('torch');
    if (e.key === '2') setLightMode('uv');
    if (e.key === '3') setLightMode('lantern');
    if (e.key === '4') setLightMode('matrix');
    if (e.key.toLowerCase() === 'j') toggleJournal();
    if (e.key.toLowerCase() === 'm') toggleAmbientAudio();
    if (e.key === 'Escape') closeAllModals();
  });

  // --- 8. Chamber Navigation ---
  const switchChamber = (targetId) => {
    document.querySelectorAll('.chamber-section').forEach(sec => {
      sec.classList.remove('active-chamber');
    });
    const targetSec = document.getElementById(targetId);
    if (targetSec) {
      targetSec.classList.add('active-chamber');
      currentChamber = targetId;
      chamberIndicator.textContent = targetSec.getAttribute('data-chamber-name') || targetId.toUpperCase();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initAudio();
      playTone(280, 0.3, 'triangle');
      if (window.mayerFun) window.mayerFun.addXP(20, 'Explored New Chamber');
    }
  };

  document.querySelectorAll('[data-target]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const target = trigger.getAttribute('data-target');
      switchChamber(target);
    });
  });

  // --- 9. Relic Inspection & Collection ---
  const openRelicInspect = (relicId) => {
    const relic = relicsData[relicId];
    if (!relic) return;
    currentInspectingRelic = relic;

    inspectIcon.textContent = relic.icon;
    inspectCat.textContent = relic.category;
    inspectTitle.textContent = relic.name;
    inspectDesc.textContent = relic.desc;
    inspectNote.textContent = relic.note;

    if (collectedRelics.has(relicId)) {
      claimRelicBtn.querySelector('.claim-text').textContent = "ALREADY SECURED IN JOURNAL";
      claimRelicBtn.style.opacity = "0.7";
    } else {
      claimRelicBtn.querySelector('.claim-text').textContent = "SECURE RELIC IN JOURNAL";
      claimRelicBtn.style.opacity = "1";
    }

    relicModal.classList.add('open');
    initAudio();
    playTone(600, 0.15, 'sine');
  };

  document.querySelectorAll('.relic-item').forEach(item => {
    item.addEventListener('click', () => {
      const relicId = parseInt(item.getAttribute('data-relic'), 10);
      openRelicInspect(relicId);
    });
  });

  claimRelicBtn.addEventListener('click', () => {
    if (!currentInspectingRelic) return;
    const rId = currentInspectingRelic.id;
    collectedRelics.add(rId);

    const relicEl = document.getElementById(`relic-${rId}`);
    if (relicEl) relicEl.classList.add('claimed');

    const jEntry = document.getElementById(`j-entry-${rId}`);
    if (jEntry) {
      jEntry.classList.add('unlocked');
      jEntry.querySelector('.entry-status').textContent = '✅';
    }

    const socketEl = document.getElementById(`socket-${rId}`);
    if (socketEl) socketEl.classList.add('active-socket');

    const count = collectedRelics.size;
    relicCounter.textContent = `${count}/5`;
    journalCount.textContent = count;

    if (window.mayerFun) {
      window.mayerFun.addXP(40, `Found Relic: ${currentInspectingRelic.name}`);
      if (count === 5) {
        window.mayerFun.unlockAchievement('archon_relics', 'Master of the Five Relics', 'Recovered all 5 systems relics across the vault.', '🏛️', 100);
      }
    }

    if (count === 5) {
      unlockVaultBtn.removeAttribute('disabled');
      unlockVaultBtn.querySelector('.btn-title').textContent = "⚡ ALL 5 RELICS SECURED // UNLOCK THE VAULT ⚡";
      unlockVaultBtn.querySelector('.btn-sub').textContent = "Click to break the seal and reveal Kwame's ultimate archives";
    }

    relicModal.classList.remove('open');
    playDiscoveryChime();
  });

  relicModalClose.addEventListener('click', () => {
    relicModal.classList.remove('open');
  });

  // Ancient Chest
  if (chest1) {
    chest1.addEventListener('click', () => {
      chestModal.classList.add('open');
      initAudio();
      playTone(400, 0.2, 'triangle');
    });
  }

  if (chestModalClose) {
    chestModalClose.addEventListener('click', () => {
      chestModal.classList.remove('open');
    });
  }

  if (chestClaimBtn) {
    chestClaimBtn.addEventListener('click', () => {
      chestModal.classList.remove('open');
      playDiscoveryChime();
      if (window.mayerFun) {
        window.mayerFun.addXP(30, 'Opened Secret Memoir Stash');
        window.mayerFun.unlockAchievement('chest_finder', 'Cache Hunter', 'Found the hidden diagnostics toolkit in the ancient chest.', '📦', 35);
      }
    });
  }

  // --- 10. Arcade Selector ---
  if (arcadeToggle) {
    arcadeToggle.addEventListener('click', () => {
      window.playOptaneGame();
    });
  }

  // --- 11. Expedition Journal Modal ---
  const toggleJournal = () => {
    if (journalModal.classList.contains('open')) {
      journalModal.classList.remove('open');
    } else {
      journalModal.classList.add('open');
      initAudio();
      playTone(480, 0.1, 'sine');
    }
  };

  journalToggle.addEventListener('click', toggleJournal);
  journalClose.addEventListener('click', () => journalModal.classList.remove('open'));

  // --- 12. Grand Vault Opening / Victory ---
  unlockVaultBtn.addEventListener('click', () => {
    if (collectedRelics.size >= 5) {
      victoryModal.classList.add('open');
      playVaultUnlockFanfare();
      if (window.mayerFun) {
        window.mayerFun.addXP(150, 'Vault of Mayer Fully Unlocked');
        window.mayerFun.unlockAchievement('vault_conqueror', 'Vault of the Archon Breached', 'Broke all 5 seals and claimed the master credentials of Mayer!', '👑', 150);
        window.mayerFun.triggerConfetti(150);
      }
    }
  });

  victoryClose.addEventListener('click', () => {
    victoryModal.classList.remove('open');
  });

  // Modal Backdrop Click to Close
  [relicModal, chestModal, journalModal, victoryModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    }
  });

  const closeAllModals = () => {
    relicModal.classList.remove('open');
    if (chestModal) chestModal.classList.remove('open');
    journalModal.classList.remove('open');
    victoryModal.classList.remove('open');
  };
});
