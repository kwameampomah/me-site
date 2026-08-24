// ==========================================================================
// Kwame Afriyie Ampomah Portfolio Scripts + Zero-G Physics & A06-Bot Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // --- Active Nav Link Highlighting on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  // --- Domain Tabs Switching ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update active button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active panel
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `tab-${targetTab}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // --- Copy to Clipboard Utility ---
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');

  const showToast = (message = 'Copied to clipboard!') => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';

        showToast(`Copied "${textToCopy}"`);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });

  // ==========================================================================
  // A06-Bot Cyber Companion
  // ==========================================================================
  const a06Bot = document.getElementById('a06-bot');
  const a06Speech = document.getElementById('a06-speech');

  const botQuotes = [
    "⚡ Did you know? Kwame rescued a 512GB Optane SSD from phantom GPT loops!",
    "💡 Taifa Station to Valley View: zero packet drops on the bridged AP!",
    "🎮 Press ↑↑↓↓←→←→BA anywhere for Retro Arcade Party Mode!",
    "🔦 Try the 'Flashlight Adventure' in the header for secret relics!",
    "🛠️ Samsung Galaxy A06 + Acer Aspire Go 14 = The Mayer Mobile Ops Rig.",
    "🌌 Click 'Zero-G Mode' in the navbar to let the page float in space!"
  ];
  let quoteIdx = 0;

  if (a06Bot && a06Speech) {
    a06Bot.addEventListener('click', () => {
      quoteIdx = (quoteIdx + 1) % botQuotes.length;
      a06Speech.textContent = botQuotes[quoteIdx];
      if (window.mayerFun) {
        window.mayerFun.addXP(10, 'Talked with A06-Droid');
        window.mayerFun.playChiptuneJingle('achievement');
      }
    });
  }

  // ==========================================================================
  // Zero-G Physics Sandbox Engine
  // ==========================================================================
  const zerogBtn = document.getElementById('zerog-btn');
  const zerogHud = document.getElementById('zerog-hud');
  const restoreGravityBtn = document.getElementById('restore-gravity-btn');

  let isZeroG = false;
  let floatingItems = [];
  let animFrameId = null;

  const startZeroG = () => {
    if (isZeroG) return;
    isZeroG = true;
    if (zerogHud) zerogHud.classList.add('active');

    // Pick cards & badges to float
    const targetEls = document.querySelectorAll('.about-card, .case-card, .experience-card, .skill-category-card, .contact-card, .hero-image-wrapper');
    floatingItems = [];

    targetEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const item = {
        el: el,
        origLeft: rect.left,
        origTop: rect.top,
        origWidth: rect.width,
        origHeight: rect.height,
        x: rect.left,
        y: rect.top,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5,
        rot: 0,
        vRot: (Math.random() - 0.5) * 1.5,
        isDragging: false
      };

      el.style.width = `${rect.width}px`;
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
      el.classList.add('zerog-floating-item');

      // Drag listener
      let dragStartX = 0;
      let dragStartY = 0;

      const onMouseDown = (e) => {
        item.isDragging = true;
        dragStartX = e.clientX - item.x;
        dragStartY = e.clientY - item.y;
        item.vx = 0;
        item.vy = 0;
      };

      const onMouseMove = (e) => {
        if (item.isDragging) {
          const newX = e.clientX - dragStartX;
          const newY = e.clientY - dragStartY;
          item.vx = (newX - item.x) * 0.4;
          item.vy = (newY - item.y) * 0.4;
          item.x = newX;
          item.y = newY;
        }
      };

      const onMouseUp = () => {
        item.isDragging = false;
      };

      el.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      floatingItems.push(item);
    });

    if (window.mayerFun) {
      window.mayerFun.addXP(50, 'Activated Zero-G Physics Mode');
      window.mayerFun.unlockAchievement('zero_g_master', 'Gravity Defier', 'Turned off gravity on Kwame\'s portfolio!', '🌌', 60);
      window.mayerFun.playChiptuneJingle('party');
    }

    runPhysicsLoop();
  };

  const runPhysicsLoop = () => {
    if (!isZeroG) return;

    floatingItems.forEach(item => {
      if (!item.isDragging) {
        item.x += item.vx;
        item.y += item.vy;
        item.rot += item.vRot;

        // Damping
        item.vx *= 0.995;
        item.vy *= 0.995;

        // Bounce off window borders
        const maxW = window.innerWidth - item.origWidth;
        const maxH = window.innerHeight - item.origHeight;

        if (item.x < 0) { item.x = 0; item.vx *= -0.85; }
        if (item.x > maxW) { item.x = maxW; item.vx *= -0.85; }
        if (item.y < 70) { item.y = 70; item.vy *= -0.85; }
        if (item.y > maxH) { item.y = maxH; item.vy *= -0.85; }
      }

      item.el.style.left = `${item.x}px`;
      item.el.style.top = `${item.y}px`;
      item.el.style.transform = `rotate(${item.rot}deg)`;
    });

    animFrameId = requestAnimationFrame(runPhysicsLoop);
  };

  const restoreGravity = () => {
    isZeroG = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (zerogHud) zerogHud.classList.remove('active');

    floatingItems.forEach(item => {
      item.el.style.transition = 'all 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.2)';
      item.el.style.transform = 'none';
      item.el.style.left = '';
      item.el.style.top = '';
      item.el.style.width = '';

      setTimeout(() => {
        item.el.classList.remove('zerog-floating-item');
        item.el.style.transition = '';
      }, 650);
    });

    floatingItems = [];
    if (window.mayerFun) window.mayerFun.playChiptuneJingle('achievement');
  };

  if (zerogBtn) zerogBtn.addEventListener('click', startZeroG);
  if (restoreGravityBtn) restoreGravityBtn.addEventListener('click', restoreGravity);

  // --- Konami Code Easter Egg Listener ---
  const konamiSeq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIdx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === konamiSeq[konamiIdx].toLowerCase()) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        const current = JSON.parse(localStorage.getItem('kwame_achievements') || '[]');
        if (!current.includes('konami_unlocked')) {
          current.push('konami_unlocked');
          localStorage.setItem('kwame_achievements', JSON.stringify(current));
        }
        alert("🎉 KONAMI CODE ACTIVATED!\nYou unlocked the secret 'Retro Master' trophy in the Virtual Desktop!");
      }
    } else {
      konamiIdx = 0;
    }
  });
});
