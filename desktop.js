/**
 * ==========================================================================
 * KWAME OS 95 - VIRTUAL DESKTOP ENGINE (ULTIMATE FUN & GAMIFICATION SUITE)
 * Features: Kwam-E Assistant, KwameAMP, MS Paint 95, SysAdmin Panic,
 * Achievements System, Konami Code Easter Egg, Mechanical Keyboard Audio
 * ==========================================================================
 */

// ==========================================================================
// 1. RETRO WEB AUDIO API SYNTHESIZER ENGINE
// ==========================================================================
class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicPlaying = false;
    this.currentTrack = 0;
    this.musicTimer = null;
    this.masterMusicGain = null;
    this.analyser = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.masterMusicGain = this.ctx.createGain();
        this.masterMusicGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.masterMusicGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playKeyClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    // Cherry MX Blue switch click simulation
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const randPitch = 1600 + (Math.random() * 400 - 200);
    osc.type = 'square';
    osc.frequency.setValueAtTime(randPitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.025);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [440, 330];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.12 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.12);
      osc.stop(this.ctx.currentTime + i * 0.12 + 0.25);
    });
  }

  playStartup() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C E G C E G
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const startTime = this.ctx.currentTime + idx * 0.1;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  playFloppy() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const t = this.ctx.currentTime + i * 0.06;
      osc.frequency.setValueAtTime(150 + Math.random() * 100, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    }
  }

  playTrash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const t = this.ctx.currentTime + idx * 0.12;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [392, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      const t = this.ctx.currentTime + i * 0.09;
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  playSprayHiss() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2500 + Math.random() * 800, this.ctx.currentTime);
    g.gain.setValueAtTime(0.03, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playWrenchClang() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.18, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playChirp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.12, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playSipSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(700, this.ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.08, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Generative Synthesizer Engine for KwameAMP
  playTrack(trackIdx) {
    this.init();
    this.stopMusic();
    this.currentTrack = trackIdx;
    this.musicPlaying = true;

    // Track patterns (Note frequencies and durations)
    const patterns = [
      // 0: 8-Bit Taifa Groove
      [
        { f: 261.63, d: 0.2 }, { f: 329.63, d: 0.2 }, { f: 392.00, d: 0.2 }, { f: 523.25, d: 0.4 },
        { f: 440.00, d: 0.2 }, { f: 392.00, d: 0.2 }, { f: 329.63, d: 0.4 }, { f: 293.66, d: 0.2 },
        { f: 329.63, d: 0.2 }, { f: 392.00, d: 0.4 }, { f: 523.25, d: 0.4 }, { f: 659.25, d: 0.6 }
      ],
      // 1: Cyber Optane Drift
      [
        { f: 146.83, d: 0.25 }, { f: 220.00, d: 0.25 }, { f: 293.66, d: 0.25 }, { f: 349.23, d: 0.25 },
        { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.25 }, { f: 293.66, d: 0.25 }, { f: 220.00, d: 0.5 },
        { f: 174.61, d: 0.25 }, { f: 261.63, d: 0.25 }, { f: 349.23, d: 0.5 }, { f: 523.25, d: 0.5 }
      ],
      // 2: SysAdmin Midnight Coffee
      [
        { f: 196.00, d: 0.4 }, { f: 246.94, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 392.00, d: 0.6 },
        { f: 329.63, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 246.94, d: 0.4 }, { f: 196.00, d: 0.8 }
      ]
    ];

    const currentPattern = patterns[trackIdx % patterns.length];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.musicPlaying || !this.ctx) return;
      const note = currentPattern[noteIndex];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = trackIdx === 1 ? 'sawtooth' : (trackIdx === 2 ? 'sine' : 'square');
      osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + note.d * 0.95);

      osc.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + note.d);

      noteIndex = (noteIndex + 1) % currentPattern.length;
      this.musicTimer = setTimeout(playNextNote, note.d * 1000);
    };

    playNextNote();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  setMusicVolume(val) {
    if (this.masterMusicGain && this.ctx) {
      this.masterMusicGain.gain.setValueAtTime(val * 0.4, this.ctx.currentTime);
    }
  }
}

const audio = new RetroAudioEngine();

// ==========================================================================
// 2. CASE STUDIES & PORTFOLIO DATABASE
// ==========================================================================
const PROJECTS_DATA = [
  {
    id: "optane",
    name: "Optane_H20_Recovery.sys",
    title: "Intel Optane H20 Storage Recovery",
    category: "Hardware & Storage Diagnostics",
    size: "512 KB",
    date: "2024-05-14",
    summary: "Diagnosed and resolved a critical partition misidentification where a 512GB internal SSD was presented as an erroneous 2TB GPT-protected partition due to corrupted Intel Optane metadata binding in BIOS.",
    specs: [
      "Target: Intel Optane H20 (32GB 3D XPoint + 512GB QLC NAND)",
      "Issue: False 2TB protected GPT partition table",
      "Resolution: Low-level BIOS de-concatenation & Diskpart clean",
      "Result: Full 512GB volume reclaimed without data loss"
    ],
    tags: ["Intel Optane", "GPT Partitions", "Diskpart", "BIOS Metadata", "Storage Recovery"],
    codeSnippet: `DISKPART> list disk
DISKPART> select disk 0
DISKPART> clean
DISKPART> convert gpt
DISKPART> create partition primary
DISKPART> format fs=ntfs quick label="SYSTEM_RESTORED"`
  },
  {
    id: "win11",
    name: "Win11_OOBE_Bypass.cfg",
    title: "Windows 11 Customization & OOBE Bypasses",
    category: "OS Deployment & Automated Config",
    size: "820 KB",
    date: "2024-08-20",
    summary: "Created automated multiboot environments using Ventoy to bypass restrictive TPM/SecureBoot checks and forced online Microsoft account requirements via local registry modifications and MOK certificates.",
    specs: [
      "Tooling: Ventoy Multiboot, autounattend.xml, CMD OOBE",
      "Bypass: BypassNRO.cmd + local admin elevation",
      "Verification: Machine Owner Key (MOK) shim loader verification",
      "Deployment: Under 8 minutes zero-touch installation"
    ],
    tags: ["Windows 11", "Ventoy", "OOBE Bypass", "Registry Tweaks", "MOK Certificates"],
    codeSnippet: `OOBE\\BYPASSNRO
reg add HKLM\\SYSTEM\\Setup\\LabConfig /v BypassTPMCheck /t REG_DWORD /d 1
reg add HKLM\\SYSTEM\\Setup\\LabConfig /v BypassSecureBootCheck /t REG_DWORD /d 1`
  },
  {
    id: "macbook",
    name: "MacBook_Monterey_Fix.log",
    title: "MacBook Pro Recovery & Certificate Bypass",
    category: "Apple Hardware & EFI Systems",
    size: "640 KB",
    date: "2024-02-11",
    summary: "Overcame expired Apple server security certificates on an Intel-based 13-inch MacBook Pro by entering Internet Recovery, overriding date stamps in Terminal strings, repartitioning disk schemas, and cleanly deploying macOS Monterey.",
    specs: [
      "Hardware: MacBook Pro 13-inch (Intel Core i5)",
      "Problem: 'An error occurred while preparing the installation'",
      "Fix: Terminal date synchronisation & APFS diskutil rebuild",
      "OS Deployed: macOS Monterey 12.7"
    ],
    tags: ["macOS Monterey", "Diskutil", "Terminal", "EFI Recovery", "Security Certs"],
    codeSnippet: `date 010101012022
diskutil unmountDisk force /dev/disk0
diskutil eraseDisk APFS "Macintosh HD" /dev/disk0`
  },
  {
    id: "ps3",
    name: "PS3_CFW_SSD_Mod.bin",
    title: "PlayStation 3 Hardware Upgrade & CFW",
    category: "Firmware Modding & Hardware Optimization",
    size: "1.2 MB",
    date: "2023-11-04",
    summary: "Jailbroke a PS3 Slim (CECH-2504B, date code 0D). Replaced legacy mechanical HDD with a high-speed SSD and configured Evilnat Custom Firmware with webMAN MOD for thermal fan curves and remote homebrew execution.",
    specs: [
      "Model: PS3 Slim CECH-2504B (Minver 3.50)",
      "Firmware: Evilnat 4.90 Cobra CFW",
      "Storage Upgrade: 500GB SATA III SSD",
      "Enhancements: Dynamic fan threshold max 65°C, FTP server"
    ],
    tags: ["Custom Firmware", "SSD Mod", "webMAN MOD", "Thermal Profiling", "Homebrew"],
    codeSnippet: `CFW Evilnat 4.90 [Cobra 8.4] Loaded
webMAN MOD v1.47.45: Active
FAN SPEED: Dynamic (Target Cell/RSX <= 65°C)
STORAGE: 465 GB / 500 GB Available (SSD Trim Simulation)`
  },
  {
    id: "tplink",
    name: "Archer_MR200_Bridge.net",
    title: "TP-Link Archer MR200 Network AP Bridging",
    category: "Networking & Infrastructure",
    size: "410 KB",
    date: "2024-04-18",
    summary: "Configured a TP-Link Archer MR200 v1 as a secondary wireless access point connected via LAN-to-LAN Ethernet to a primary Tenda router. Successfully flashed firmware v1.0.5 locally, assigned static IP subnet routing, and prevented DHCP collision.",
    specs: [
      "Hardware: TP-Link Archer MR200 v1 + Tenda Primary Router",
      "Topology: LAN-to-LAN Ethernet bridge",
      "Config: Static IP 192.168.0.2 / 255.255.255.0, DHCP Server Disabled",
      "Result: Seamless single-subnet roaming and 0% packet collision"
    ],
    tags: ["TP-Link Archer MR200", "LAN-to-LAN", "DHCP Management", "Subnet Routing"],
    codeSnippet: `Primary Router IP: 192.168.0.1 (DHCP Range: 192.168.0.100 - 200)
MR200 AP IP:       192.168.0.2 (DHCP: Disabled)
Ethernet Uplink:   LAN1 to LAN1 (WAN Port Unused)`
  },
  {
    id: "wasscely",
    name: "Wasscely_Platform_Migration.doc",
    title: "Wasscely Educational Platform Migration",
    category: "Web Systems & Platform Architecture",
    size: "950 KB",
    date: "2024-09-02",
    summary: "Executed the complete rebranding and technical infrastructure migration of the WASSCE student preparation portal to 'Wasscely'. Rectified administrative slug collisions, purged multi-tiered server caches, and resolved dark-mode CSS rendering artifacts.",
    specs: [
      "Role: Web Systems Administrator & Migration Lead",
      "Stack: WordPress, PHP 8.1, Cloudflare Edge Cache, MySQL",
      "Scope: 10,000+ past questions database, 25+ subject syllabi",
      "Downtime: Zero unplanned service interruption"
    ],
    tags: ["Wasscely", "Platform Migration", "Cache Purging", "Asset Pipelines"],
    codeSnippet: `wp search-replace 'wassce-portal.edu' 'wasscely.com' --all-tables
wp cache flush
systemctl restart php8.1-fpm nginx`
  }
];

const REJECTED_IDEAS = [
  {
    name: "Attempted_Overclock_Microwave.exe",
    path: "C:\\Kwame\\Experiments\\HomeLab",
    date: "2024-01-12",
    size: "74 KB",
    desc: "Tried adjusting the magnetron frequency to heat up leftover pizza in 3.2 seconds. Aborted after the microwave started picking up AM radio signals and dimmed the neighborhood streetlights."
  },
  {
    name: "Subnetting_My_Toaster.cfg",
    path: "C:\\Kwame\\IoT_Madness",
    date: "2023-10-05",
    size: "12 KB",
    desc: "Configured a static VLAN /30 for a dual-slot toaster to ping my phone when toast reaches optimal browning. Canceled because DHCP leases expired while bagels were still raw."
  },
  {
    name: "Replacing_RAM_With_Pure_Optimism.dll",
    path: "C:\\Windows\\System32\\Hope",
    date: "2024-03-22",
    size: "0 KB",
    desc: "A custom memory manager that promised infinite swap space through sheer willpower. Resulted in kernel panic 0x000000DEAD."
  },
  {
    name: "Writing_Kernel_In_Pure_CSS.js",
    path: "C:\\Kwame\\FrontendNightmares",
    date: "2023-08-14",
    size: "142 KB",
    desc: "Attempted to build a process scheduler using CSS :checked checkboxes and flexbox alignment. Browser engine filed a formal grievance."
  },
  {
    name: "Quantum_BIOS_On_Optane_H20.tmp",
    path: "C:\\Firmware\\Quantum",
    date: "2024-05-15",
    size: "404 KB",
    desc: "Attempted to simultaneously partition the Optane drive into both 512GB and 2TB states until observed by Diskpart. The superposition collapsed into a blue screen."
  },
  {
    name: "Download_More_RAM_Installer.vbs",
    path: "C:\\Users\\Afriyie\\Downloads",
    date: "2023-04-01",
    size: "1 KB",
    desc: "April Fools script sent to classmates that downloaded 64GB of ASCII text files repeating 'YOU NOW HAVE MORE RAM'."
  }
];

const MAILBOX_DATA = [
  {
    id: 1,
    sender: "Systems Admin <root@kwame.lan>",
    subject: "Welcome to Kwame OS 95 [Virtual Desktop]",
    date: "Mon, 24 Aug 2026 08:00:00",
    body: `Hello and welcome to Kwame Afriyie Ampomah's interactive Virtual Desktop portfolio!\n\nHere you can explore case studies, make retro tunes in KwameAMP, doodle in Paint 95, play SysAdmin Panic, and inspect funny rejected ideas.\n\nEnjoy the nostalgic experience!`
  },
  {
    id: 2,
    sender: "Tech Recruiter <talent@infrastructure-hire.com>",
    subject: "Inquiry: Systems & Hardware Diagnostic Specialist",
    date: "Sun, 23 Aug 2026 14:22:10",
    body: `Hi Kwame,\n\nWe came across your technical case studies on the Intel Optane H20 storage recovery and your work managing Wasscely and KEY WATCH GHANA web systems.\n\nYour combined skill in hardware diagnostics, network bridging, and Linux/Windows administration is impressive. Are you currently open to systems engineering or IT consulting roles?\n\nLooking forward to connecting!\nEmail: kwameampomah111@gmail.com\nPhone: 0200121912`
  },
  {
    id: 3,
    sender: "Wasscely Server Bot <daemon@wasscely.com>",
    subject: "Weekly Platform Status: 100% Uptime",
    date: "Fri, 21 Aug 2026 00:00:01",
    body: `Automated Platform Health Report:\n\n- Server Status: OPTIMAL\n- Cache Hit Ratio: 94.8%\n- Database Latency: 4.2ms\n- Active Students: 12,450\n- SSL Certificates: Auto-renewed & Valid\n\nAll migration pipelines intact. Excellent work on the system architecture!`
  }
];

// ==========================================================================
// 3. KWAMEAMP (WINAMP 2.X CHIPTUNE MUSIC PLAYER)
// ==========================================================================
class KwameAmpPlayer {
  constructor() {
    this.tracks = [
      { name: "1. 8-Bit Taifa Groove (Chiptune)", title: "Kwame Afriyie - 8-Bit Taifa Groove [01:45]" },
      { name: "2. Cyber Optane Drift (Synthwave)", title: "Kwame Afriyie - Cyber Optane Drift [02:10]" },
      { name: "3. SysAdmin Midnight Coffee (Lo-Fi)", title: "Kwame Afriyie - SysAdmin Midnight Coffee [02:30]" }
    ];
    this.currentIdx = 0;
    this.isPlaying = false;
    this.elapsedSecs = 0;
    this.timerInterval = null;
    this.animFrame = null;
  }

  init() {
    const playBtn = document.getElementById('amp-play');
    const pauseBtn = document.getElementById('amp-pause');
    const stopBtn = document.getElementById('amp-stop');
    const prevBtn = document.getElementById('amp-prev');
    const nextBtn = document.getElementById('amp-next');
    const volSlider = document.getElementById('amp-volume');
    const playlist = document.getElementById('amp-playlist');

    if (playBtn) playBtn.addEventListener('click', () => this.play());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (stopBtn) stopBtn.addEventListener('click', () => this.stop());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        audio.setMusicVolume(e.target.value / 100);
      });
    }

    if (playlist) {
      const items = playlist.querySelectorAll('.winamp-pl-item');
      items.forEach(item => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.getAttribute('data-index'), 10);
          this.loadTrack(idx);
          this.play();
        });
      });
    }

    this.startVisualizer();
  }

  loadTrack(idx) {
    this.currentIdx = (idx + this.tracks.length) % this.tracks.length;
    const track = this.tracks[this.currentIdx];
    const marquee = document.getElementById('amp-marquee');
    if (marquee) marquee.textContent = `${track.title} ***`;

    const items = document.querySelectorAll('.winamp-pl-item');
    items.forEach((it, i) => {
      it.classList.toggle('active', i === this.currentIdx);
    });

    this.elapsedSecs = 0;
    this.updateTimeDisplay();
  }

  play() {
    this.isPlaying = true;
    audio.playTrack(this.currentIdx);
    achievements.unlock('chiptune_dj');

    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        if (this.isPlaying) {
          this.elapsedSecs++;
          this.updateTimeDisplay();
        }
      }, 1000);
    }
  }

  pause() {
    this.isPlaying = false;
    audio.stopMusic();
  }

  stop() {
    this.isPlaying = false;
    this.elapsedSecs = 0;
    this.updateTimeDisplay();
    audio.stopMusic();
  }

  next() {
    this.loadTrack(this.currentIdx + 1);
    if (this.isPlaying) this.play();
  }

  prev() {
    this.loadTrack(this.currentIdx - 1);
    if (this.isPlaying) this.play();
  }

  updateTimeDisplay() {
    const timeEl = document.getElementById('amp-time');
    if (timeEl) {
      const mins = String(Math.floor(this.elapsedSecs / 60)).padStart(2, '0');
      const secs = String(this.elapsedSecs % 60).padStart(2, '0');
      timeEl.textContent = `${mins}:${secs}`;
    }
  }

  startVisualizer() {
    const canvas = document.getElementById('amp-visualizer');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      this.animFrame = requestAnimationFrame(draw);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (this.isPlaying && audio.analyser) {
        const bufferLength = audio.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audio.analyser.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / 24) - 2;
        for (let i = 0; i < 24; i++) {
          const val = dataArray[i * 1] || Math.random() * 80;
          const barHeight = (val / 255) * (canvas.height - 6);
          const x = i * (barWidth + 2);
          const y = canvas.height - barHeight;

          // Winamp green gradient
          const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
          grad.addColorStop(0, '#00ff00');
          grad.addColorStop(0.7, '#ffff00');
          grad.addColorStop(1, '#ff0000');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Top peak dot
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, Math.max(0, y - 3), barWidth, 1.5);
        }
      } else {
        // Flat green oscilloscope line
        ctx.strokeStyle = '#004400';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    };
    draw();
  }
}

// ==========================================================================
// 4. MS PAINT 95 (CANVAS DRAWING APP)
// ==========================================================================
class MSPaintApp {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.currentTool = 'pencil';
    this.currentColor = '#000000';
    this.strokeSize = 3;
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.snapshot = null;

    this.paletteColors = [
      '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
      '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
    ];
  }

  init() {
    this.canvas = document.getElementById('paint-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

    // Initial white fill
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Populate color swatches
    const swatchContainer = document.getElementById('paint-swatches');
    if (swatchContainer) {
      swatchContainer.innerHTML = '';
      this.paletteColors.forEach(color => {
        const sw = document.createElement('div');
        sw.className = 'color-swatch';
        sw.style.backgroundColor = color;
        sw.addEventListener('click', () => this.setColor(color));
        swatchContainer.appendChild(sw);
      });
    }

    // Tool buttons
    const toolBtns = document.querySelectorAll('.paint-tool-btn');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.getAttribute('data-tool');
        document.getElementById('paint-status').textContent = `Canvas: 540x320 | Tool: ${this.currentTool.toUpperCase()}`;
        audio.playClick();
      });
    });

    // Stroke size options
    const sizeOpts = document.querySelectorAll('.paint-size-option');
    sizeOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        sizeOpts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.strokeSize = parseInt(opt.getAttribute('data-size'), 10);
        audio.playClick();
      });
    });

    // Mouse events on canvas
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDraw());
    this.canvas.addEventListener('mouseleave', () => this.stopDraw());
  }

  setColor(color) {
    this.currentColor = color;
    const box = document.getElementById('paint-selected-color');
    if (box) box.style.backgroundColor = color;
    audio.playClick();
  }

  getCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) * (this.canvas.width / rect.width)),
      y: Math.floor((e.clientY - rect.top) * (this.canvas.height / rect.height))
    };
  }

  startDraw(e) {
    this.isDrawing = true;
    const { x, y } = this.getCoords(e);
    this.startX = x;
    this.startY = y;

    if (this.currentTool === 'bucket') {
      this.floodFill(x, y, this.currentColor);
      this.isDrawing = false;
      achievements.unlock('paint_artist');
      return;
    }

    if (this.currentTool === 'line') {
      this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    } else if (this.currentTool === 'spray') {
      this.spray(x, y);
      audio.playSprayHiss();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }
  }

  draw(e) {
    if (!this.isDrawing) return;
    const { x, y } = this.getCoords(e);

    this.ctx.lineWidth = this.strokeSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (this.currentTool === 'pencil') {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = 1.5;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } else if (this.currentTool === 'brush') {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } else if (this.currentTool === 'eraser') {
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = this.strokeSize * 2.5;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } else if (this.currentTool === 'spray') {
      this.spray(x, y);
    } else if (this.currentTool === 'line') {
      if (this.snapshot) this.ctx.putImageData(this.snapshot, 0, 0);
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.stroke();
    }
  }

  stopDraw() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.ctx.closePath();
      achievements.unlock('paint_artist');
    }
  }

  spray(x, y) {
    const density = 25;
    const radius = this.strokeSize * 4;
    this.ctx.fillStyle = this.currentColor;

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const sx = x + r * Math.cos(angle);
      const sy = y + r * Math.sin(angle);
      this.ctx.fillRect(sx, sy, 1.5, 1.5);
    }
  }

  floodFill(startX, startY, fillHex) {
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imgData.data;
    const targetIdx = (startY * this.canvas.width + startX) * 4;
    const targetR = data[targetIdx];
    const targetG = data[targetIdx + 1];
    const targetB = data[targetIdx + 2];

    // Convert hex to rgb
    const fillR = parseInt(fillHex.slice(1, 3), 16);
    const fillG = parseInt(fillHex.slice(3, 5), 16);
    const fillB = parseInt(fillHex.slice(5, 7), 16);

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const queue = [[startX, startY]];
    const width = this.canvas.width;
    const height = this.canvas.height;

    while (queue.length > 0) {
      const [cx, cy] = queue.pop();
      const idx = (cy * width + cx) * 4;

      if (data[idx] === targetR && data[idx + 1] === targetG && data[idx + 2] === targetB) {
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = 255;

        if (cx > 0) queue.push([cx - 1, cy]);
        if (cx < width - 1) queue.push([cx + 1, cy]);
        if (cy > 0) queue.push([cx, cy - 1]);
        if (cy < height - 1) queue.push([cx, cy + 1]);
      }
    }
    this.ctx.putImageData(imgData, 0, 0);
    audio.playFloppy();
  }

  clearCanvas() {
    if (confirm("Clear entire drawing canvas?")) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      audio.playTrash();
      appManager.showToast("Paint canvas cleared!");
    }
  }

  downloadCanvas() {
    const link = document.createElement('a');
    link.download = `kwame_paint_art_${Date.now()}.png`;
    link.href = this.canvas.toDataURL();
    link.click();
    audio.playStartup();
    achievements.unlock('paint_artist');
    appManager.showToast("Masterpiece exported as PNG!");
  }
}

// ==========================================================================
// 5. SYSADMIN PANIC! (60-SECOND MICRO-GAME)
// ==========================================================================
class SysAdminPanicGame {
  constructor() {
    this.isRunning = false;
    this.timeLeft = 60;
    this.uptime = 100.0;
    this.score = 0;
    this.timer = null;
    this.spawnTimer = null;
    this.activeIncidents = [];
  }

  start() {
    this.isRunning = true;
    this.timeLeft = 60;
    this.uptime = 100.0;
    this.score = 0;
    this.activeIncidents = [];

    const overlay = document.getElementById('panic-overlay');
    if (overlay) overlay.style.display = 'none';

    const field = document.getElementById('panic-field');
    if (field) field.innerHTML = '';

    // Render 4 server racks
    for (let i = 0; i < 4; i++) {
      const rack = document.createElement('div');
      rack.className = 'server-rack';
      rack.id = `rack-${i}`;
      rack.style.left = `${40 + i * 135}px`;
      rack.style.top = `60px`;

      for (let s = 0; s < 4; s++) {
        const slot = document.createElement('div');
        slot.className = 'rack-slot';
        slot.innerHTML = `<span style="font-size:9px; color:#888;">U${s + 1}</span><div class="rack-led"></div>`;
        rack.appendChild(slot);
      }

      field.appendChild(rack);
    }

    this.updateHUD();
    audio.playFanfare();

    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.activeIncidents.length > 0) {
        this.uptime = Math.max(0, this.uptime - (this.activeIncidents.length * 0.45));
      }
      this.updateHUD();

      if (this.timeLeft <= 0 || this.uptime <= 90.0) {
        this.endGame();
      }
    }, 1000);

    this.spawnTimer = setInterval(() => {
      this.spawnIncident();
    }, 2200);
  }

  spawnIncident() {
    if (!this.isRunning) return;
    const field = document.getElementById('panic-field');
    const rackIdx = Math.floor(Math.random() * 4);
    const rack = document.getElementById(`rack-${rackIdx}`);

    const types = [
      { text: "🔥 OVERHEAT!", color: "#ff3333" },
      { text: "🔌 LOOSE CABLE", color: "#ff9900" },
      { text: "💧 MEM LEAK", color: "#00ccff" },
      { text: "⚡ DNS FAIL", color: "#ff00ff" }
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];

    if (rack) rack.classList.add('on-fire');

    const bubble = document.createElement('div');
    bubble.className = 'panic-event-bubble';
    bubble.style.backgroundColor = chosen.color;
    bubble.textContent = chosen.text;
    bubble.style.left = `${30 + rackIdx * 135 + (Math.random() * 30 - 15)}px`;
    bubble.style.top = `${20 + Math.random() * 30}px`;

    const incidentObj = { id: Date.now() + Math.random(), el: bubble, rack };
    this.activeIncidents.push(incidentObj);

    bubble.addEventListener('click', () => {
      audio.playWrenchClang();
      this.score++;
      this.uptime = Math.min(100.0, this.uptime + 1.2);
      bubble.remove();
      if (rack) rack.classList.remove('on-fire');
      this.activeIncidents = this.activeIncidents.filter(inc => inc !== incidentObj);
      this.updateHUD();
    });

    field.appendChild(bubble);
  }

  updateHUD() {
    const timerEl = document.getElementById('panic-timer');
    const barEl = document.getElementById('panic-uptime-bar');
    const valEl = document.getElementById('panic-uptime-val');
    const scoreEl = document.getElementById('panic-score');

    if (timerEl) timerEl.textContent = `${this.timeLeft}s`;
    if (barEl) barEl.style.width = `${Math.max(0, this.uptime)}%`;
    if (valEl) {
      valEl.textContent = `${this.uptime.toFixed(1)}%`;
      valEl.style.color = this.uptime > 98 ? '#00ff66' : (this.uptime > 94 ? '#ffbb00' : '#ff3333');
    }
    if (scoreEl) scoreEl.textContent = this.score;
  }

  endGame() {
    this.isRunning = false;
    clearInterval(this.timer);
    clearInterval(this.spawnTimer);

    const overlay = document.getElementById('panic-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';

    if (this.uptime >= 95.0) {
      audio.playWin();
      achievements.unlock('uptime_hero');
      overlay.innerHTML = `
        <h2 style="color:#00ff66; font-size:24px;">🏆 SHIFT COMPLETED! (SUCCESS)</h2>
        <p style="font-size:13px; color:#fff;">You maintained <strong>${this.uptime.toFixed(1)}% Uptime</strong> and resolved <strong>${this.score} incidents</strong>!</p>
        <p style="color:#ffd700; font-size:12px;">Rank: Senior Infrastructure Legend</p>
        <button class="mail-btn" onclick="sysAdminGame.start()" style="font-size:13px; padding:6px 14px; background:#00aa44; color:#fff;">Play Again</button>
      `;
    } else {
      audio.playError();
      overlay.innerHTML = `
        <h2 style="color:#ff3333; font-size:24px;">💥 DATA CENTER OUTAGE!</h2>
        <p style="font-size:13px; color:#fff;">Uptime degraded to ${this.uptime.toFixed(1)}%. The SLA was breached!</p>
        <button class="mail-btn" onclick="sysAdminGame.start()" style="font-size:13px; padding:6px 14px; background:#000080; color:#fff;">Retry Shift</button>
      `;
    }
  }
}

// ==========================================================================
// 6. KWAM-E (ANIMATED DESKTOP ASSISTANT)
// ==========================================================================
class KwamEAssistant {
  constructor() {
    this.bubble = null;
    this.textEl = null;
    this.hideTimeout = null;
    this.jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "There are 10 types of people in the world: those who understand binary and those who don't.",
      "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
      "Kwame's rule #1: If at first you don't succeed, call it version 1.0!",
      "Have you tried turning it off and on again?",
      "Intel Optane H20 partitions can be tricky, but Kwame tamed the GPT beast!"
    ];
  }

  init() {
    this.bubble = document.getElementById('kwame-bubble');
    this.textEl = document.getElementById('kwame-bubble-text');
    const avatarBox = document.getElementById('kwam-e-container');

    if (avatarBox) {
      appManager.makeDraggable(avatarBox);
    }

    // Greet user on launch
    setTimeout(() => {
      this.speak("Hi! I'm Kwam-E, your IT assistant. Click me for tech jokes or advice!");
    }, 1500);

    // Eye blink animation loop
    setInterval(() => {
      const eyeL = document.getElementById('kwame-eye-l');
      const eyeR = document.getElementById('kwame-eye-r');
      if (eyeL && eyeR) {
        eyeL.setAttribute('r', '0.5');
        eyeR.setAttribute('r', '0.5');
        setTimeout(() => {
          eyeL.setAttribute('r', '2.5');
          eyeR.setAttribute('r', '2.5');
        }, 180);
      }
    }, 4200);
  }

  speak(message, duration = 6500) {
    if (!this.bubble || !this.textEl) return;
    audio.playChirp();
    this.textEl.textContent = message;
    this.bubble.style.display = 'block';

    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.hideBubble();
    }, duration);
  }

  hideBubble() {
    if (this.bubble) this.bubble.style.display = 'none';
  }

  handleClick() {
    const joke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
    this.speak(joke);
  }

  onAppOpen(appName) {
    const messages = {
      notepad: "Reading bio.txt! Did you know Kwame studies IT pedagogy at Valley View University?",
      explorer: "Case Studies folder! Check out the Intel Optane & TP-Link network recovery logs.",
      trash: "Snooping through rejected experiments, are we? Check out the microwave overclocking file!",
      terminal: "MS-DOS Prompt ready! Try typing 'help', 'matrix', or 'skills'.",
      paint: "Time to doodle! Paint 95 has an authentic spray can and PNG export!",
      kwameamp: "KwameAMP! Track 1 has that authentic 8-bit Taifa bounce.",
      syspanic: "Uh oh! Keep those server racks cool and maintain 99.9% uptime!",
      trophies: "Inspect your achievements! Try the secret Konami Code on your keyboard."
    };

    if (messages[appName]) {
      this.speak(messages[appName]);
    }
  }
}

// ==========================================================================
// 7. ACHIEVEMENTS & TROPHY CASE MANAGER
// ==========================================================================
class AchievementsManager {
  constructor() {
    this.achievementsList = [
      { id: 'optane_doc', name: 'Disk Doctor', icon: '💾', desc: 'Inspected real-world case studies' },
      { id: 'trash_snoop', name: 'Snoop Master', icon: '🗑️', desc: 'Explored funny rejected experiments' },
      { id: 'terminal_hacker', name: 'Hackerman', icon: '💻', desc: 'Ran commands in MS-DOS prompt' },
      { id: 'paint_artist', name: 'Pixel Picasso', icon: '🎨', desc: 'Created artwork in MS Paint 95' },
      { id: 'chiptune_dj', name: 'DJ Kwame', icon: '📻', desc: 'Rocked out with KwameAMP' },
      { id: 'uptime_hero', name: 'Uptime Hero', icon: '🚨', desc: 'Survived the SysAdmin Panic shift' },
      { id: 'minesweeper_win', name: 'Mine Specialist', icon: '💣', desc: 'Cleared a Minesweeper match' },
      { id: 'konami_unlocked', name: 'Retro Master', icon: '⭐', desc: 'Entered the secret Konami Code' },
      { id: 'coffee_addict', name: 'Caffeine Overclock', icon: '☕', desc: 'Sipped SysAdmin coffee on desk' },
      { id: 'theme_stylist', name: 'OS Chameleon', icon: '⚙️', desc: 'Switched visual operating themes' }
    ];
    this.unlocked = JSON.parse(localStorage.getItem('kwame_achievements') || '[]');
  }

  unlock(id) {
    if (this.unlocked.includes(id)) return;
    this.unlocked.push(id);
    localStorage.setItem('kwame_achievements', JSON.stringify(this.unlocked));

    const ach = this.achievementsList.find(a => a.id === id);
    if (!ach) return;

    audio.playFanfare();
    this.showBanner(ach);
    this.renderTrophyCase();
  }

  showBanner(ach) {
    const existing = document.querySelector('.achievement-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div style="font-size:28px;">${ach.icon}</div>
      <div>
        <div style="font-size:10px; color:#ffd700; font-weight:bold; letter-spacing:1px;">🏆 ACHIEVEMENT UNLOCKED!</div>
        <div style="font-size:13px; font-weight:bold;">${ach.name}</div>
        <div style="font-size:11px; color:#ddd;">${ach.desc}</div>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }

  renderTrophyCase() {
    const grid = document.getElementById('trophy-grid-display');
    const countLabel = document.getElementById('trophy-count-label');
    const percentLabel = document.getElementById('trophy-percent-label');

    if (!grid) return;
    grid.innerHTML = '';

    const count = this.unlocked.length;
    const total = this.achievementsList.length;
    const pct = Math.round((count / total) * 100);

    if (countLabel) countLabel.textContent = `${count} of ${total} Trophies Unlocked`;
    if (percentLabel) percentLabel.textContent = `${pct}%`;

    this.achievementsList.forEach(ach => {
      const isUnlocked = this.unlocked.includes(ach.id);
      const card = document.createElement('div');
      card.className = `trophy-badge ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="trophy-icon">${isUnlocked ? ach.icon : '🔒'}</div>
        <div class="trophy-name">${ach.name}</div>
        <div class="trophy-desc">${ach.desc}</div>
      `;
      grid.appendChild(card);
    });
  }
}

// ==========================================================================
// 8. KONAMI CODE & CONFETTI CELEBRATION
// ==========================================================================
function initKonamiCode() {
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let cur = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === code[cur].toLowerCase()) {
      cur++;
      if (cur === code.length) {
        cur = 0;
        triggerCelebration();
      }
    } else {
      cur = 0;
    }
  });
}

function triggerCelebration() {
  audio.playFanfare();
  achievements.unlock('konami_unlocked');
  appManager.showToast("🎉 KONAMI CODE ACTIVATED! SECRET GOLD TROPHY UNLOCKED!");

  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.5) * 16 - 4,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360
    });
  }

  let frames = 0;
  const loop = () => {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.rotation += 4;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (frames < 240) {
      requestAnimationFrame(loop);
    } else {
      canvas.style.display = 'none';
    }
  };
  loop();
}

// ==========================================================================
// 9. WINDOW MANAGER & DESKTOP CONTROLLER
// ==========================================================================
class AppManager {
  constructor() {
    this.activeWindow = null;
    this.highestZ = 200;
    this.windows = {};
    this.soundEnabled = true;
    this.crtEnabled = true;
    this.coffeeCount = 0;
    this.lampOn = false;
  }

  init() {
    this.renderExplorer();
    this.renderTrash();
    this.renderMail();
    this.initDesktopIcons();
    this.initWindows();
    this.startClock();
    this.startModemLeds();
    this.initContextMenu();
    this.initSelectionBox();
    this.initStickyNotes();
    this.initTerminal();
    this.initMechanicalKeys();

    minesweeper.init();
    kwameAmp.init();
    paintApp.init();
    kwamE.init();
    achievements.renderTrophyCase();
    initKonamiCode();

    const startAudioOnce = () => {
      audio.playStartup();
      document.removeEventListener('click', startAudioOnce);
    };
    document.addEventListener('click', startAudioOnce);

    this.bringToFront('win-notepad');
    this.updateTaskbarTabs();
  }

  initMechanicalKeys() {
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        audio.playKeyClick();
      }
    });
  }

  initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
      this.makeDraggable(icon, true);

      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        icons.forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        audio.playClick();
      });

      icon.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const appName = icon.getAttribute('data-app');
        this.openApp(appName);
      });
    });

    document.getElementById('desktop').addEventListener('click', (e) => {
      if (e.target.id === 'desktop') {
        icons.forEach(i => i.classList.remove('selected'));
        this.closeStartMenu();
        this.closeContextMenu();
      }
    });
  }

  initWindows() {
    const windowEls = document.querySelectorAll('.os-window');
    windowEls.forEach(win => {
      const id = win.id;
      this.windows[id] = win;

      win.addEventListener('mousedown', () => {
        this.bringToFront(id);
      });

      const titlebar = win.querySelector('.window-titlebar');
      if (titlebar) this.makeWindowDraggable(win, titlebar);

      const resizer = win.querySelector('.window-resizer');
      if (resizer) this.makeWindowResizable(win, resizer);

      const minBtn = win.querySelector('.win-minimize');
      if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); this.minimizeWindow(id); });

      const maxBtn = win.querySelector('.win-maximize');
      if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMaximize(id); });

      const closeBtn = win.querySelector('.win-close');
      if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.closeWindow(id); });
    });
  }

  makeWindowDraggable(win, handle) {
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('win-btn')) return;
      if (win.classList.contains('maximized')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = win.offsetLeft;
      initialTop = win.offsetTop;
      this.bringToFront(win.id);
      audio.playClick();
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      newTop = Math.max(0, Math.min(window.innerHeight - 60, newTop));
      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  makeWindowResizable(win, handle) {
    let isResizing = false;
    let startX = 0, startY = 0, initialW = 0, initialH = 0;

    handle.addEventListener('mousedown', (e) => {
      if (win.classList.contains('maximized')) return;
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      initialW = win.offsetWidth;
      initialH = win.offsetHeight;
      this.bringToFront(win.id);
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const dw = e.clientX - startX;
      const dh = e.clientY - startY;
      win.style.width = `${Math.max(280, initialW + dw)}px`;
      win.style.height = `${Math.max(180, initialH + dh)}px`;
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
    });
  }

  makeDraggable(el, isIcon = false) {
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    el.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('.sticky-close') || e.target.closest('.sticky-body a') || e.target.closest('.kwame-bubble')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;
      if (!isIcon) el.style.zIndex = ++this.highestZ;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.position = 'absolute';
      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  bringToFront(id) {
    const win = document.getElementById(id);
    if (!win) return;
    this.highestZ += 2;
    win.style.zIndex = this.highestZ;
    document.querySelectorAll('.os-window').forEach(w => w.classList.remove('active'));
    win.classList.add('active');
    this.activeWindow = id;
    this.updateTaskbarTabs();
  }

  openApp(app) {
    audio.playFloppy();
    let winId = '';
    switch (app) {
      case 'notepad':
      case 'bio':
        winId = 'win-notepad';
        break;
      case 'explorer':
      case 'portfolio':
        winId = 'win-explorer';
        break;
      case 'mail':
      case 'contact':
        winId = 'win-mail';
        break;
      case 'trash':
        winId = 'win-trash';
        achievements.unlock('trash_snoop');
        break;
      case 'terminal':
        winId = 'win-terminal';
        setTimeout(() => document.getElementById('term-input')?.focus(), 50);
        break;
      case 'minesweeper':
        winId = 'win-minesweeper';
        break;
      case 'kwameamp':
        winId = 'win-kwameamp';
        break;
      case 'paint':
        winId = 'win-paint';
        break;
      case 'syspanic':
        winId = 'win-syspanic';
        break;
      case 'trophies':
        winId = 'win-trophies';
        achievements.renderTrophyCase();
        break;
      case 'cpanel':
        winId = 'win-cpanel';
        break;
      case 'viewer':
        winId = 'win-viewer';
        break;
      default:
        winId = 'win-notepad';
    }

    const win = document.getElementById(winId);
    if (win) {
      win.style.display = 'flex';
      win.classList.remove('minimized');
      this.bringToFront(winId);
    }
    this.closeStartMenu();
    kwamE.onAppOpen(app);
  }

  closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
      audio.playClick();
      win.style.display = 'none';
      win.classList.remove('active');
      this.updateTaskbarTabs();
    }
  }

  minimizeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
      audio.playClick();
      win.classList.add('minimized');
      win.classList.remove('active');
      this.updateTaskbarTabs();
    }
  }

  toggleMaximize(id) {
    const win = document.getElementById(id);
    if (win) {
      audio.playClick();
      win.classList.toggle('maximized');
    }
  }

  updateTaskbarTabs() {
    const tasksContainer = document.getElementById('taskbar-tasks');
    tasksContainer.innerHTML = '';

    const titles = {
      'win-notepad': { title: 'bio.txt', icon: '📄' },
      'win-explorer': { title: 'Case Studies', icon: '📁' },
      'win-viewer': { title: 'Viewer', icon: '🔍' },
      'win-mail': { title: 'Outlook 97', icon: '✉️' },
      'win-trash': { title: 'Recycle Bin', icon: '🗑️' },
      'win-terminal': { title: 'MS-DOS', icon: '💻' },
      'win-minesweeper': { title: 'Minesweeper', icon: '💣' },
      'win-kwameamp': { title: 'KwameAMP', icon: '📻' },
      'win-paint': { title: 'Paint 95', icon: '🎨' },
      'win-syspanic': { title: 'SysPanic', icon: '🚨' },
      'win-trophies': { title: 'Trophies', icon: '🏆' },
      'win-cpanel': { title: 'Display Props', icon: '⚙️' }
    };

    Object.keys(this.windows).forEach(id => {
      const win = document.getElementById(id);
      if (win && win.style.display !== 'none') {
        const info = titles[id] || { title: 'Window', icon: '🪟' };
        const tab = document.createElement('button');
        tab.className = `task-tab ${win.classList.contains('active') && !win.classList.contains('minimized') ? 'active' : ''}`;
        tab.innerHTML = `<span>${info.icon}</span><span>${info.title}</span>`;

        tab.addEventListener('click', () => {
          audio.playClick();
          if (win.classList.contains('minimized')) {
            win.classList.remove('minimized');
            this.bringToFront(id);
          } else if (win.classList.contains('active')) {
            this.minimizeWindow(id);
          } else {
            this.bringToFront(id);
          }
        });

        tasksContainer.appendChild(tab);
      }
    });
  }

  // Case Studies Explorer
  renderExplorer() {
    const grid = document.getElementById('explorer-items-list');
    if (!grid) return;
    grid.innerHTML = '';

    PROJECTS_DATA.forEach(proj => {
      const item = document.createElement('div');
      item.className = 'explorer-item';
      item.innerHTML = `
        <svg viewBox="0 0 32 32">
          <path d="M6 3 L20 3 L26 9 L26 29 L6 29 Z" fill="#38bdf8" stroke="#000" stroke-width="1.5"/>
          <path d="M20 3 L20 9 L26 9 Z" fill="#fff" stroke="#000"/>
          <line x1="9" y1="14" x2="23" y2="14" stroke="#000" stroke-width="1.5"/>
          <line x1="9" y1="18" x2="23" y2="18" stroke="#000" stroke-width="1.5"/>
          <line x1="9" y1="22" x2="18" y2="22" stroke="#000" stroke-width="1.5"/>
        </svg>
        <span class="explorer-item-name">${proj.name}</span>
      `;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        grid.querySelectorAll('.explorer-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        document.getElementById('explorer-status').textContent = `${proj.name} | Size: ${proj.size} | Date: ${proj.date}`;
      });

      item.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.openProjectViewer(proj);
      });

      grid.appendChild(item);
    });
  }

  openProjectViewer(proj) {
    const titleEl = document.getElementById('viewer-title');
    const contentEl = document.getElementById('viewer-content');

    titleEl.textContent = `${proj.name} - Technical Specification`;
    achievements.unlock('optane_doc');

    contentEl.innerHTML = `
      <div class="project-viewer">
        <div class="pv-header">
          <div>
            <h3 style="font-size: 15px; margin-bottom: 4px;">${proj.title}</h3>
            <span style="font-size: 11px; color: var(--os-text-muted);">Timestamp: ${proj.date} &bull; Classification: IT Ops / Diagnostics</span>
          </div>
          <span class="pv-badge">${proj.category}</span>
        </div>

        <p style="font-size: 12px; line-height: 1.5;">${proj.summary}</p>

        <div class="pv-specs">
          <strong>TECHNICAL SPECIFICATIONS:</strong><br />
          ${proj.specs.map(s => `• ${s}`).join('<br />')}
        </div>

        <div>
          <strong style="font-size: 11px; display: block; margin-bottom: 4px;">COMMAND / DIAGNOSTIC TRACE:</strong>
          <pre style="background:#000; color:#00ff00; padding:8px; font-family:var(--os-font-mono); font-size:11px; overflow-x:auto; border:1px inset #808080;">${proj.codeSnippet}</pre>
        </div>

        <div class="pv-tags">
          ${proj.tags.map(t => `<span class="pv-tag">${t}</span>`).join('')}
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
          <button class="mail-btn" onclick="appManager.copyProjectDetails('${proj.id}')">📋 Copy Case Study</button>
          <button class="mail-btn" onclick="appManager.closeWindow('win-viewer')">Close Viewer</button>
        </div>
      </div>
    `;

    this.openApp('viewer');
  }

  copyProjectDetails(projId) {
    const proj = PROJECTS_DATA.find(p => p.id === projId);
    if (proj) {
      const text = `${proj.title}\nCategory: ${proj.category}\n\n${proj.summary}\n\nSpecs:\n${proj.specs.join('\n')}`;
      navigator.clipboard.writeText(text);
      this.showToast(`Copied ${proj.name} specs to clipboard!`);
    }
  }

  explorerUp() {
    audio.playClick();
    this.showToast("Root directory reached (C:\\Kwame\\Portfolio_Projects)");
  }

  // Notepad
  saveNotepad() {
    audio.playFloppy();
    this.showToast("Changes committed to bio.txt successfully!");
  }

  copyNotepad() {
    const val = document.getElementById('notepad-text').value;
    navigator.clipboard.writeText(val);
    this.showToast("bio.txt copied to clipboard!");
  }

  showNotepadAbout() {
    audio.playError();
    alert("Kwame OS 95 Notepad\nVersion 4.0\nCreated for Kwame Afriyie Ampomah Portfolio Experience.");
  }

  // Mailbox
  renderMail() {
    const list = document.getElementById('mail-inbox-items');
    if (!list) return;
    list.innerHTML = '';

    MAILBOX_DATA.forEach((mail, idx) => {
      const item = document.createElement('div');
      item.className = `mail-item ${idx === 0 ? 'active' : ''}`;
      item.innerHTML = `
        <div class="mail-item-sender">${mail.sender}</div>
        <div class="mail-item-subj">${mail.subject}</div>
      `;

      item.addEventListener('click', () => {
        list.querySelectorAll('.mail-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        this.displayMail(mail);
      });

      list.appendChild(item);
    });

    if (MAILBOX_DATA.length > 0) {
      this.displayMail(MAILBOX_DATA[0]);
    }
  }

  displayMail(mail) {
    const viewer = document.getElementById('mail-viewer-body');
    if (!viewer) return;
    viewer.innerHTML = `
      <div class="mail-meta-row"><span class="mail-meta-label">From:</span><span>${mail.sender}</span></div>
      <div class="mail-meta-row"><span class="mail-meta-label">Date:</span><span>${mail.date}</span></div>
      <div class="mail-meta-row"><span class="mail-meta-label">Subject:</span><strong>${mail.subject}</strong></div>
      <div class="mail-body-content" style="white-space: pre-wrap;">${mail.body}</div>
    `;
  }

  showMailInbox() {
    document.getElementById('mail-view-inbox').style.display = 'flex';
    document.getElementById('mail-view-compose').style.display = 'none';
  }

  showMailCompose() {
    document.getElementById('mail-view-inbox').style.display = 'none';
    document.getElementById('mail-view-compose').style.display = 'flex';
    document.getElementById('compose-subject').focus();
  }

  sendMailForm() {
    const subj = encodeURIComponent(document.getElementById('compose-subject').value || "Inquiry for Kwame Afriyie Ampomah");
    const body = encodeURIComponent(document.getElementById('compose-message').value || "Hello Kwame,");
    audio.playStartup();
    this.showToast("Launching transmission to kwameampomah111@gmail.com...");
    window.location.href = `mailto:kwameampomah111@gmail.com?subject=${subj}&body=${body}`;
  }

  copyContactEmail() {
    navigator.clipboard.writeText("kwameampomah111@gmail.com");
    this.showToast("Email address kwameampomah111@gmail.com copied!");
  }

  // Trash
  renderTrash() {
    const tbody = document.getElementById('trash-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    REJECTED_IDEAS.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>🗑️ ${item.name}</td>
        <td>${item.path}</td>
        <td>${item.date}</td>
        <td>${item.size}</td>
      `;

      tr.addEventListener('dblclick', () => {
        audio.playError();
        alert(`[DELETED ARTIFACT REPORT]\n\nFile: ${item.name}\nSize: ${item.size}\nDate Discarded: ${item.date}\n\nPost-Mortem Log:\n${item.desc}`);
      });

      tbody.appendChild(tr);
    });
  }

  emptyTrash() {
    audio.playTrash();
    const tbody = document.getElementById('trash-table-body');
    if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#888;">Recycle Bin is empty. No rejected ideas left in buffer!</td></tr>';
    document.getElementById('trash-status').textContent = '0 items | 0 KB free';
    this.showToast("Recycle bin purged cleanly!");
  }

  restoreTrash() {
    audio.playStartup();
    this.renderTrash();
    document.getElementById('trash-status').textContent = '6 item(s) restored | Proceed with caution';
    this.showToast("All funny rejected ideas restored to disk!");
  }

  // Terminal
  initTerminal() {
    const input = document.getElementById('term-input');
    const output = document.getElementById('term-output');

    if (!input || !output) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        input.value = '';
        this.handleTerminalCommand(cmd, output);
        output.scrollTop = output.scrollHeight;
        achievements.unlock('terminal_hacker');
      }
    });
  }

  handleTerminalCommand(rawCmd, output) {
    const line = document.createElement('div');
    line.innerHTML = `<span style="color:#fff;">C:\\KWAME&gt;</span> ${rawCmd}`;
    output.appendChild(line);

    if (!rawCmd) return;

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    const res = document.createElement('div');
    res.style.margin = '4px 0 10px 0';

    switch (cmd) {
      case 'help':
        res.innerHTML = `
AVAILABLE COMMANDS:
  HELP         - Display this assistance manual
  DIR          - List files and directories
  CAT [file]   - Display contents of text file
  WHOAMI       - Show current user identity
  SKILLS       - List technical skill matrix
  PROJECTS     - List real-world portfolio recovery operations
  CONTACT      - Print email, phone, and social handles
  THEME [name] - Switch UI theme (win95 | scifi | mac | desk)
  CRT [on/off] - Toggle retro CRT scanlines
  SOUND [on/off]- Toggle Web Audio synthesizer
  MATRIX       - Trigger digital rain matrix simulation
  BSOD         - Simulate fatal kernel panic
  CLS / CLEAR  - Clear screen buffer
  EXIT         - Close command prompt
`;
        break;

      case 'dir':
        res.innerHTML = `
 Directory of C:\\KWAME

08/24/2026  12:00 PM    &lt;DIR&gt;          .
08/24/2026  12:00 PM    &lt;DIR&gt;          ..
08/20/2026  10:15 AM             2,410 bio.txt
05/14/2024  09:30 AM           524,288 Optane_H20_Recovery.sys
08/20/2024  02:45 PM           839,680 Win11_OOBE_Bypass.cfg
02/11/2024  04:12 PM           655,360 MacBook_Monterey_Fix.log
11/04/2023  06:00 PM         1,258,291 PS3_CFW_SSD_Mod.bin
04/18/2024  11:20 AM           420,110 Archer_MR200_Bridge.net
09/02/2024  01:10 PM           972,800 Wasscely_Platform_Migration.doc
               7 File(s)      4,672,939 bytes
               2 Dir(s)   1,073,741,824 bytes free
`;
        break;

      case 'cat':
      case 'type':
        if (arg.includes('bio')) {
          res.innerHTML = `Kwame Afriyie Ampomah (Mayer) - IT Specialist & Systems Admin\nValley View University | Taifa, Accra\nSpecializing in Web Systems, Hardware Diagnostics & Network Infrastructure.`;
        } else if (arg) {
          res.innerHTML = `[RAW DUMP OF ${arg.toUpperCase()}]:\nVerified case study file. Use 'explorer' or 'projects' to inspect formatted specs.`;
        } else {
          res.innerHTML = `Usage: CAT [filename] (e.g. CAT bio.txt)`;
        }
        break;

      case 'whoami':
        res.innerHTML = `User: Kwame Afriyie Ampomah (Mayer)\nRole: Systems Administrator & IT Specialist\nAuthority: NT AUTHORITY\\SYSTEM`;
        break;

      case 'skills':
        res.innerHTML = `
[TECHNICAL DOMAINS]
• Diagnostics:    Intel Optane H20, GPT Partitioning, Diskpart, Ventoy, BIOS EFI
• Networking:     TP-Link Archer MR200 AP, LAN-to-LAN Bridging, Subnets, DHCP
• Web Systems:    WordPress Admin, Wasscely Platform, PHP/MySQL, Cloudflare Caching
• Version Ctrl:   Git & GitHub Repositories, Branching, Commit workflows
• Modding/HW:     PS3 CFW Evilnat, SSD Storage Swaps, Thermal Profiles
• Pedagogy:       B.Ed in Information Technology (Valley View University)
`;
        break;

      case 'projects':
        res.innerHTML = PROJECTS_DATA.map(p => `• [${p.name}] - ${p.title} (${p.category})`).join('\n');
        break;

      case 'contact':
        res.innerHTML = `Email:    kwameampomah111@gmail.com\nPhone:    0200121912\nGitHub:   https://github.com/kwameampomah\nLinkedIn: https://www.linkedin.com/in/kwame-ampomah-10175931b`;
        break;

      case 'theme':
        if (['win95', 'scifi', 'mac', 'desk'].includes(arg)) {
          this.setTheme(`theme-${arg}`);
          res.innerHTML = `Theme successfully switched to: theme-${arg}`;
        } else {
          res.innerHTML = `Available themes: win95, scifi, mac, desk (e.g. THEME SCIFI)`;
        }
        break;

      case 'crt':
        if (arg === 'off') {
          this.setCRT(false);
          res.innerHTML = `CRT scanlines: DISABLED`;
        } else {
          this.setCRT(true);
          res.innerHTML = `CRT scanlines: ENABLED`;
        }
        break;

      case 'sound':
        if (arg === 'off') {
          this.soundEnabled = false;
          audio.enabled = false;
          res.innerHTML = `Audio Synthesizer: MUTED`;
        } else {
          this.soundEnabled = true;
          audio.enabled = true;
          res.innerHTML = `Audio Synthesizer: UNMUTED`;
        }
        break;

      case 'cls':
      case 'clear':
        output.innerHTML = '';
        return;

      case 'matrix':
        res.innerHTML = `<span style="color:#00ff00;">WAKE UP, NEO... THE MATRIX HAS YOU.\nKWAME OS 95 TERMINAL ENGAGED.</span>`;
        break;

      case 'bsod':
        this.triggerBSOD();
        return;

      case 'exit':
        this.closeWindow('win-terminal');
        return;

      default:
        audio.playError();
        res.innerHTML = `Bad command or file name: "${rawCmd}". Type "HELP" for instructions.`;
    }

    output.appendChild(res);
  }

  // Sticky Notes
  initStickyNotes() {
    const notes = document.querySelectorAll('.sticky-note');
    notes.forEach(note => this.makeDraggable(note));
  }

  newStickyNote() {
    audio.playClick();
    const desktop = document.getElementById('desktop');
    const note = document.createElement('div');
    note.className = 'sticky-note pinned-pink';
    note.style.top = `${100 + Math.random() * 150}px`;
    note.style.left = `${200 + Math.random() * 200}px`;

    note.innerHTML = `
      <div class="sticky-pin"></div>
      <div class="sticky-title">
        <span>📌 MEMO #${Math.floor(Math.random() * 900 + 100)}</span>
        <span class="sticky-close">✕</span>
      </div>
      <div class="sticky-body" contenteditable="true">
        • Check Optane partition status<br />
        • Wasscely cache maintenance<br />
        • Type reminder here...
      </div>
    `;

    note.querySelector('.sticky-close').addEventListener('click', () => note.remove());
    this.makeDraggable(note);
    desktop.appendChild(note);
    this.closeContextMenu();
    this.showToast("New Sticky Note pinned to desktop!");
  }

  // Selection Box
  initSelectionBox() {
    const desktop = document.getElementById('desktop');
    const box = document.getElementById('selection-box');
    let isSelecting = false;
    let startX = 0, startY = 0;

    desktop.addEventListener('mousedown', (e) => {
      if (e.target !== desktop && e.target.id !== 'desktop-icons') return;
      if (e.button !== 0) return;

      isSelecting = true;
      startX = e.clientX;
      startY = e.clientY;
      box.style.left = `${startX}px`;
      box.style.top = `${startY}px`;
      box.style.width = '0px';
      box.style.height = '0px';
      box.style.display = 'block';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isSelecting) return;
      const curX = e.clientX;
      const curY = e.clientY;

      const left = Math.min(startX, curX);
      const top = Math.min(startY, curY);
      const width = Math.abs(curX - startX);
      const height = Math.abs(curY - startY);

      box.style.left = `${left}px`;
      box.style.top = `${top}px`;
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;

      const icons = document.querySelectorAll('.desktop-icon');
      const boxRect = box.getBoundingClientRect();

      icons.forEach(icon => {
        const iconRect = icon.getBoundingClientRect();
        const intersects = !(boxRect.right < iconRect.left || boxRect.left > iconRect.right || boxRect.bottom < iconRect.top || boxRect.top > iconRect.bottom);
        if (intersects) icon.classList.add('selected');
        else icon.classList.remove('selected');
      });
    });

    document.addEventListener('mouseup', () => {
      if (isSelecting) {
        isSelecting = false;
        box.style.display = 'none';
      }
    });
  }

  // Context Menu
  initContextMenu() {
    const menu = document.getElementById('context-menu');
    const desktop = document.getElementById('desktop');

    desktop.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.os-window') || e.target.closest('.sticky-note') || e.target.closest('#kwam-e-container')) return;
      e.preventDefault();
      menu.style.left = `${Math.min(window.innerWidth - 180, e.clientX)}px`;
      menu.style.top = `${Math.min(window.innerHeight - 180, e.clientY)}px`;
      menu.style.display = 'flex';
      audio.playClick();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#context-menu')) {
        this.closeContextMenu();
      }
    });
  }

  closeContextMenu() {
    const menu = document.getElementById('context-menu');
    if (menu) menu.style.display = 'none';
  }

  refreshDesktop() {
    audio.playStartup();
    this.closeContextMenu();
    this.showToast("Desktop refreshed & buffers cleared!");
  }

  // Start Menu
  toggleStartMenu() {
    audio.playClick();
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('btn-start');
    menu.classList.toggle('open');
    btn.classList.toggle('active');
  }

  closeStartMenu() {
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('btn-start');
    if (menu) menu.classList.remove('open');
    if (btn) btn.classList.remove('active');
  }

  // Clock & LEDs
  startClock() {
    const clock = document.getElementById('clock-widget');
    const update = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      if (clock) clock.textContent = `${hours}:${minutes} ${ampm}`;
    };
    update();
    setInterval(update, 1000);
  }

  startModemLeds() {
    const tx = document.getElementById('led-tx');
    const rx = document.getElementById('led-rx');
    setInterval(() => {
      if (tx && Math.random() > 0.4) tx.classList.toggle('blink-green');
      if (rx && Math.random() > 0.3) rx.classList.toggle('blink-yellow');
    }, 280);
  }

  // Themes
  setTheme(themeName) {
    document.body.className = themeName;
    const selector = document.getElementById('theme-selector');
    if (selector) selector.value = themeName;
    audio.playStartup();
    achievements.unlock('theme_stylist');
    this.showToast(`Theme updated: ${themeName.replace('theme-', '').toUpperCase()}`);
  }

  toggleCRT() {
    this.setCRT(!this.crtEnabled);
  }

  setCRT(enabled) {
    this.crtEnabled = enabled;
    const crt = document.getElementById('crt-overlay');
    const btn = document.getElementById('btn-toggle-crt');
    if (crt) crt.style.opacity = enabled ? 'var(--os-crt-opacity)' : '0';
    if (btn) btn.textContent = enabled ? '📺 CRT: ON' : '📺 CRT: OFF';
    audio.playClick();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    audio.enabled = this.soundEnabled;
    const btn = document.getElementById('btn-toggle-sound');
    if (btn) btn.textContent = this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    if (this.soundEnabled) audio.playStartup();
    this.showToast(`Sound Effects: ${this.soundEnabled ? 'ENABLED' : 'MUTED'}`);
  }

  // BSOD & Shutdown
  triggerBSOD() {
    audio.playError();
    const bsod = document.getElementById('bsod-screen');
    if (bsod) bsod.style.display = 'flex';
  }

  recoverBSOD() {
    const bsod = document.getElementById('bsod-screen');
    if (bsod) bsod.style.display = 'none';
    audio.playStartup();
    this.showToast("Kwame OS 95 recovered from kernel panic!");
  }

  triggerShutDown() {
    audio.playError();
    if (confirm("Are you sure you want to shut down Kwame OS 95?")) {
      document.body.innerHTML = `
        <div style="background:#000; color:#ff6600; width:100vw; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:var(--os-font-ui); text-align:center;">
          <h1 style="font-size:32px; margin-bottom:16px;">It is now safe to turn off your computer.</h1>
          <p style="font-size:16px; color:#aaa; margin-bottom:24px;">Thank you for exploring Kwame Afriyie Ampomah's Virtual Desktop portfolio.</p>
          <button onclick="window.location.reload()" style="padding:8px 20px; font-size:14px; background:#c0c0c0; border:2px outset #fff; cursor:pointer; font-weight:bold;">Restart Kwame OS</button>
        </div>
      `;
    }
  }

  // Interactive Desk Props
  sipCoffee() {
    this.coffeeCount++;
    audio.playSipSound();
    achievements.unlock('coffee_addict');
    const mug = document.getElementById('prop-coffee');
    if (mug) {
      mug.style.transform = 'scale(0.92) rotate(-5deg)';
      setTimeout(() => mug.style.transform = 'scale(1) rotate(0deg)', 200);
    }
    this.showToast(`☕ SysAdmin Coffee Sipped! (+5% Brain Clock Speed, Sip #${this.coffeeCount})`);
  }

  toggleLamp() {
    this.lampOn = !this.lampOn;
    audio.playClick();
    document.body.style.filter = this.lampOn ? 'brightness(1.15) contrast(1.05)' : 'none';
    this.showToast(this.lampOn ? "💡 Desk Lamp: ON (Warm Illumination)" : "💡 Desk Lamp: OFF");
  }

  bounceBall() {
    audio.playClick();
    const ball = document.getElementById('prop-ball');
    if (!ball) return;
    ball.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    ball.style.transform = 'translateY(-60px) scale(1.15)';
    setTimeout(() => {
      ball.style.transform = 'translateY(0) scale(1)';
    }, 400);
    this.showToast("🔴 Stress Ball Bounced! Tension relieved.");
  }

  showToast(msg) {
    const existing = document.querySelector('.os-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'os-toast';
    toast.innerHTML = `<span>💬</span><span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 3200);
  }
}

// ==========================================================================
// 10. MINESWEEPER ENGINE
// ==========================================================================
class MinesweeperGame {
  constructor() {
    this.rows = 9;
    this.cols = 9;
    this.minesCount = 10;
    this.grid = [];
    this.gameOver = false;
    this.timer = 0;
    this.timerInterval = null;
    this.flagsLeft = 10;
    this.firstClick = true;
  }

  init() {
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.flagsLeft = this.minesCount;
    this.gameOver = false;
    this.firstClick = true;
    this.updateDisplays();

    const face = document.getElementById('mine-reset-btn');
    if (face) face.textContent = '🙂';

    const container = document.getElementById('mine-grid');
    if (!container) return;
    container.innerHTML = '';

    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        const cell = {
          r,
          c,
          isMine: false,
          revealed: false,
          flagged: false,
          neighborMines: 0,
          el: document.createElement('div')
        };

        cell.el.className = 'mine-cell';
        cell.el.addEventListener('click', () => this.handleClick(cell));
        cell.el.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.handleRightClick(cell);
        });

        container.appendChild(cell.el);
        row.push(cell);
      }
      this.grid.push(row);
    }
  }

  placeMines(safeR, safeC) {
    let placed = 0;
    while (placed < this.minesCount) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!this.grid[r][c].isMine && !(r === safeR && c === safeC)) {
        this.grid[r][c].isMine = true;
        placed++;
      }
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.grid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                if (this.grid[nr][nc].isMine) count++;
              }
            }
          }
          this.grid[r][c].neighborMines = count;
        }
      }
    }
  }

  handleClick(cell) {
    if (this.gameOver || cell.flagged || cell.revealed) return;

    if (this.firstClick) {
      this.firstClick = false;
      this.placeMines(cell.r, cell.c);
      this.startTimer();
    }

    if (cell.isMine) {
      this.endGame(false, cell);
      return;
    }

    audio.playClick();
    this.revealCell(cell);
    this.checkWin();
  }

  revealCell(cell) {
    if (cell.revealed || cell.flagged) return;
    cell.revealed = true;
    cell.el.classList.add('revealed');

    if (cell.neighborMines > 0) {
      cell.el.textContent = cell.neighborMines;
      const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000', '#808080'];
      cell.el.style.color = colors[cell.neighborMines] || '#000';
    } else {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cell.r + dr, nc = cell.c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            this.revealCell(this.grid[nr][nc]);
          }
        }
      }
    }
  }

  handleRightClick(cell) {
    if (this.gameOver || cell.revealed) return;
    audio.playClick();
    cell.flagged = !cell.flagged;
    cell.el.textContent = cell.flagged ? '🚩' : '';
    this.flagsLeft += cell.flagged ? -1 : 1;
    this.updateDisplays();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer = Math.min(999, this.timer + 1);
      this.updateDisplays();
    }, 1000);
  }

  updateDisplays() {
    const flagsEl = document.getElementById('mine-flags-left');
    const timerEl = document.getElementById('mine-timer');
    if (flagsEl) flagsEl.textContent = String(this.flagsLeft).padStart(3, '0');
    if (timerEl) timerEl.textContent = String(this.timer).padStart(3, '0');
  }

  checkWin() {
    let unrevealedSafe = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.grid[r][c].isMine && !this.grid[r][c].revealed) {
          unrevealedSafe++;
        }
      }
    }
    if (unrevealedSafe === 0) {
      this.endGame(true);
    }
  }

  endGame(isWin, triggerCell = null) {
    this.gameOver = true;
    clearInterval(this.timerInterval);
    const face = document.getElementById('mine-reset-btn');

    if (isWin) {
      audio.playWin();
      if (face) face.textContent = '😎';
      achievements.unlock('minesweeper_win');
      appManager.showToast(`🎉 Congratulations! You cleared the minefield in ${this.timer}s!`);
    } else {
      audio.playError();
      if (face) face.textContent = '😵';
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.grid[r][c].isMine) {
            this.grid[r][c].el.textContent = '💣';
            this.grid[r][c].el.classList.add('mine');
          }
        }
      }
      if (triggerCell) triggerCell.el.style.backgroundColor = '#ff0000';
    }
  }
}

// Global Singletons
const appManager = new AppManager();
const minesweeper = new MinesweeperGame();
const kwameAmp = new KwameAmpPlayer();
const paintApp = new MSPaintApp();
const sysAdminGame = new SysAdminPanicGame();
const kwamE = new KwamEAssistant();
const achievements = new AchievementsManager();

document.addEventListener('DOMContentLoaded', () => {
  appManager.init();
});
