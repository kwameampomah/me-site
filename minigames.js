// ==========================================================================
// MINI-GAMES: Optane Sector Defrag & Subnet Route Master Engine
// ==========================================================================

class MiniGamesController {
  constructor() {
    this.modal = null;
    this.activeGame = null;
    this.timerInterval = null;
    this.initDOM();
  }

  initDOM() {
    if (!document.getElementById('minigame-modal')) {
      const modal = document.createElement('div');
      modal.id = 'minigame-modal';
      modal.className = 'minigame-modal-backdrop';
      modal.innerHTML = `
        <div class="minigame-card" id="minigame-container">
          <!-- Game content rendered here -->
        </div>
      `;
      document.body.appendChild(modal);
      this.modal = modal;

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeGame();
      });
    } else {
      this.modal = document.getElementById('minigame-modal');
    }
  }

  closeGame() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.modal) this.modal.classList.remove('open');
    this.activeGame = null;
  }

  // --- Game 1: Optane Sector Defrag ---
  startOptaneGame() {
    const container = document.getElementById('minigame-container');
    let timeLeft = 16;
    let corruptedCount = 6;
    let repairedCount = 0;

    container.innerHTML = `
      <div class="minigame-header">
        <span class="minigame-tag">HARDWARE FORENSICS // ARCADE PUZZLE</span>
        <h2 class="minigame-title">Optane Sector Defragmenter</h2>
        <p class="minigame-desc">Corrupted GPT partition metadata has infected 6 sectors! Click all blinking red sectors before BIOS lock-out.</p>
      </div>

      <div class="minigame-status-bar">
        <span>TIME: <span class="timer-highlight" id="optane-timer">${timeLeft}s</span></span>
        <span>SECTORS TO PURGE: <span class="score-highlight" id="optane-remaining">${corruptedCount}</span></span>
      </div>

      <div class="optane-grid" id="optane-grid"></div>

      <div class="minigame-footer-btns">
        <button class="minigame-btn cancel" id="optane-abort-btn">ABORT DIAGNOSTIC</button>
      </div>
    `;

    const grid = document.getElementById('optane-grid');
    const corruptedIndices = new Set();
    while (corruptedIndices.size < corruptedCount) {
      corruptedIndices.add(Math.floor(Math.random() * 16));
    }

    for (let i = 0; i < 16; i++) {
      const sector = document.createElement('div');
      sector.className = 'optane-sector';
      sector.dataset.index = i;

      if (corruptedIndices.has(i)) {
        sector.classList.add('corrupted');
        sector.innerHTML = `<span>0x${(i * 32).toString(16).toUpperCase()}</span><span>CORRUPT</span>`;
      } else {
        sector.innerHTML = `<span>0x${(i * 32).toString(16).toUpperCase()}</span><span>OK</span>`;
      }

      sector.addEventListener('click', () => {
        if (sector.classList.contains('corrupted')) {
          sector.classList.remove('corrupted');
          sector.classList.add('repaired');
          sector.innerHTML = `<span>0x${(i * 32).toString(16).toUpperCase()}</span><span>CLEAN</span>`;
          repairedCount++;
          document.getElementById('optane-remaining').textContent = `${corruptedCount - repairedCount}`;

          if (window.mayerFun) window.mayerFun.playChiptuneJingle('achievement');

          if (repairedCount >= corruptedCount) {
            clearInterval(this.timerInterval);
            this.victoryOptane();
          }
        }
      });

      grid.appendChild(sector);
    }

    document.getElementById('optane-abort-btn').addEventListener('click', () => this.closeGame());

    this.modal.classList.add('open');

    this.timerInterval = setInterval(() => {
      timeLeft--;
      const timerEl = document.getElementById('optane-timer');
      if (timerEl) timerEl.textContent = `${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.gameOver('BIOS Timeout! The GPT partition collapsed. Try again!');
      }
    }, 1000);
  }

  victoryOptane() {
    const container = document.getElementById('minigame-container');
    container.innerHTML = `
      <div class="minigame-header">
        <span class="minigame-tag">⚡ OPERATION SUCCESSFUL ⚡</span>
        <h2 class="minigame-title" style="color: #4ade80;">Storage Sectors Restored!</h2>
        <p class="minigame-desc">Invalid descriptors cleared. 512GB partition normalized and bound to BIOS.</p>
      </div>
      <div style="font-size: 3.5rem; margin: 1.5rem 0;">💾 ✨</div>
      <div class="minigame-footer-btns">
        <button class="minigame-btn primary" id="optane-claim-btn">CLAIM 75 XP & CLOSE</button>
      </div>
    `;

    if (window.mayerFun) {
      window.mayerFun.addXP(75, 'Mini-game: Optane Sector Defrag');
      window.mayerFun.unlockAchievement(
        'partition_master',
        'Partition Exorcist',
        'Repaired corrupted GPT storage sectors under 16 seconds!',
        '💾',
        75
      );
      window.mayerFun.triggerConfetti(90);
    }

    document.getElementById('optane-claim-btn').addEventListener('click', () => this.closeGame());
  }

  // --- Game 2: Subnet Route Master ---
  startSubnetGame() {
    const container = document.getElementById('minigame-container');

    // 3x3 puzzle tiles: types 'line' (| or -), 'corner' (L), 'cross' (+)
    // Target solution:
    // (0,0): corner (connects East & South) -> rot 0
    // (0,1): line (connects East & West) -> rot 90
    // (0,2): corner (connects West & South) -> rot 90
    // (1,2): line (connects North & South) -> rot 0
    // (2,2): corner (connects North & West) -> rot 180
    // We randomize initial rotations.

    const tilesData = [
      { type: 'corner', rot: 90 },  // (0,0) Start
      { type: 'line', rot: 0 },    // (0,1)
      { type: 'corner', rot: 0 },   // (0,2)
      { type: 'line', rot: 90 },   // (1,0)
      { type: 'cross', rot: 0 },    // (1,1)
      { type: 'line', rot: 90 },   // (1,2)
      { type: 'corner', rot: 270 }, // (2,0)
      { type: 'line', rot: 0 },    // (2,1)
      { type: 'corner', rot: 90 }   // (2,2) Exit
    ];

    container.innerHTML = `
      <div class="minigame-header">
        <span class="minigame-tag">NETWORKING &amp; BRIDGING // ROUTE PUZZLE</span>
        <h2 class="minigame-title">Subnet Route Master</h2>
        <p class="minigame-desc">Rotate the network cables to route packets from <strong>Taifa Station (Top-Left)</strong> to <strong>Valley View Server (Bottom-Right)</strong>.</p>
      </div>

      <div class="subnet-grid" id="subnet-grid"></div>

      <div class="minigame-footer-btns">
        <button class="minigame-btn cancel" id="subnet-abort-btn">ABORT ROUTE</button>
      </div>
    `;

    const grid = document.getElementById('subnet-grid');

    const getSymbol = (type) => {
      if (type === 'line') return '┃';
      if (type === 'corner') return '┗';
      return '╋';
    };

    tilesData.forEach((tile, idx) => {
      const el = document.createElement('div');
      el.className = 'subnet-tile';
      el.dataset.index = idx;
      el.style.transform = `rotate(${tile.rot}deg)`;
      el.textContent = getSymbol(tile.type);

      el.addEventListener('click', () => {
        tile.rot = (tile.rot + 90) % 360;
        el.style.transform = `rotate(${tile.rot}deg)`;
        if (window.mayerFun) window.mayerFun.playChiptuneJingle('achievement');
        this.checkSubnetWin(tilesData);
      });

      grid.appendChild(el);
    });

    document.getElementById('subnet-abort-btn').addEventListener('click', () => this.closeGame());
    this.modal.classList.add('open');
  }

  checkSubnetWin(tiles) {
    // Check if the critical path (0,0)->(0,1)->(0,2)->(1,2)->(2,2) is connected:
    // (0,0) corner needs rot 0 (connects East & South) or rot 270 (North & East - invalid entry) -> 0
    // (0,1) line needs rot 90 (East-West) or 270
    // (0,2) corner needs rot 90 (West & South)
    // (1,2) line needs rot 0 (North-South) or 180
    // (2,2) corner needs rot 180 (North & West)
    const c0 = tiles[0].rot === 0;
    const c1 = (tiles[1].rot === 90 || tiles[1].rot === 270);
    const c2 = tiles[2].rot === 90;
    const c3 = (tiles[5].rot === 0 || tiles[5].rot === 180);
    const c4 = tiles[8].rot === 180;

    if (c0 && c1 && c2 && c3 && c4) {
      document.querySelectorAll('.subnet-tile').forEach((t, i) => {
        if ([0, 1, 2, 5, 8].includes(i)) t.classList.add('connected');
      });
      setTimeout(() => this.victorySubnet(), 400);
    }
  }

  victorySubnet() {
    const container = document.getElementById('minigame-container');
    container.innerHTML = `
      <div class="minigame-header">
        <span class="minigame-tag">⚡ ROUTE ESTABLISHED ⚡</span>
        <h2 class="minigame-title" style="color: #4ade80;">Network Link Operational!</h2>
        <p class="minigame-desc">Taifa AP successfully bridged to Valley View without DHCP collisions or packet drops.</p>
      </div>
      <div style="font-size: 3.5rem; margin: 1.5rem 0;">🌐 ⚡ 📡</div>
      <div class="minigame-footer-btns">
        <button class="minigame-btn primary" id="subnet-claim-btn">CLAIM 75 XP & CLOSE</button>
      </div>
    `;

    if (window.mayerFun) {
      window.mayerFun.addXP(75, 'Mini-game: Subnet Route Master');
      window.mayerFun.unlockAchievement(
        'packet_pathfinder',
        'Packet Pathfinder',
        'Routed data packets cleanly across isolated subnets!',
        '🌐',
        75
      );
      window.mayerFun.triggerConfetti(90);
    }

    document.getElementById('subnet-claim-btn').addEventListener('click', () => this.closeGame());
  }

  gameOver(msg) {
    const container = document.getElementById('minigame-container');
    container.innerHTML = `
      <div class="minigame-header">
        <span class="minigame-tag" style="color: #ef4444;">SYSTEM FAILURE</span>
        <h2 class="minigame-title" style="color: #ef4444;">Operation Incomplete</h2>
        <p class="minigame-desc">${msg}</p>
      </div>
      <div class="minigame-footer-btns">
        <button class="minigame-btn primary" id="retry-btn">RETRY OPERATION</button>
        <button class="minigame-btn cancel" id="close-btn">EXIT</button>
      </div>
    `;

    document.getElementById('retry-btn').addEventListener('click', () => this.startOptaneGame());
    document.getElementById('close-btn').addEventListener('click', () => this.closeGame());
  }
}

// Global instance
window.miniGames = new MiniGamesController();
window.playOptaneGame = () => window.miniGames.startOptaneGame();
window.playSubnetGame = () => window.miniGames.startSubnetGame();
