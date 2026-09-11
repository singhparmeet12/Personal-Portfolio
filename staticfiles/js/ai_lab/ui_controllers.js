/**
 * AI EXPERIMENTAL LAB — UI CONTROLLERS & INTERACTION ORCHESTRATOR
 * Coordinates Theatre Modal (Play vs Inspect), Global Chaos Slider, Keyboard Shortcuts,
 * Discovery Tracker, Lab Manual Dialog, and Shareable URL State.
 */
import {
  NeuralFlowExperiment,
  PromptAlchemyExperiment,
  DreamMachineExperiment,
  AgentMindExperiment,
  ComputerVisionExperiment,
  SoundVisualizerExperiment,
  GenerativeTypeExperiment,
  SignalMapExperiment,
  ChaosLabExperiment,
  SecretMachineExperiment
} from './experiments_bundle.js';

export class LabUIControllers {
  constructor(themeEngine, audioEngine, heroCanvas, constellationMap) {
    this.theme = themeEngine;
    this.audio = audioEngine;
    this.hero = heroCanvas;
    this.constellation = constellationMap;

    this.activeExpInstance = null;
    this.activeExpData = null;
    this.currentMode = 'play'; // 'play' or 'inspect'
    this.chaosValue = 0.2;

    this.discovered = new Set(JSON.parse(localStorage.getItem('ai_lab_discovered') || '[]'));

    this.init();
  }

  init() {
    this.bindChaosSlider();
    this.bindTheatreModal();
    this.bindManualModal();
    this.bindSurpriseButtons();
    this.bindKeyboardShortcuts();
    this.updateDiscoveryBadge();
    this.syncUrlState();
  }

  bindChaosSlider() {
    const slider = document.getElementById('aiLabChaosSlider');
    const valDisplay = document.getElementById('aiLabChaosVal');
    const btnReset = document.getElementById('btnResetChaos');

    if (slider) {
      slider.addEventListener('input', (e) => {
        this.chaosValue = parseFloat(e.target.value) / 100;
        if (valDisplay) valDisplay.textContent = `${e.target.value}%`;
        if (this.hero) this.hero.setChaos(this.chaosValue);
        document.documentElement.style.setProperty('--lab-chaos-level', this.chaosValue);

        if (this.chaosValue > 0.8 && this.audio) {
          this.audio.playGlitch();
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (slider) slider.value = 20;
        if (valDisplay) valDisplay.textContent = '20%';
        this.chaosValue = 0.2;
        if (this.hero) this.hero.setChaos(0.2);
        if (this.audio) this.audio.playClick(800);
      });
    }
  }

  bindTheatreModal() {
    const modal = document.getElementById('labTheatreModal');
    const btnClose = document.getElementById('btnCloseTheatre');
    const btnModePlay = document.getElementById('btnModePlay');
    const btnModeInspect = document.getElementById('btnModeInspect');

    if (btnClose) {
      btnClose.addEventListener('click', () => this.closeExperiment());
    }

    if (btnModePlay && btnModeInspect) {
      btnModePlay.addEventListener('click', () => this.setTheatreMode('play'));
      btnModeInspect.addEventListener('click', () => this.setTheatreMode('inspect'));
    }
  }

  openExperiment(expData) {
    this.activeExpData = expData;
    const modal = document.getElementById('labTheatreModal');
    const titleEl = document.getElementById('theatreTitle');
    const badgeEl = document.getElementById('theatreBadge');
    const canvas = document.getElementById('theatreStageCanvas');
    const hud = document.getElementById('theatreStageHud');

    if (!modal || !canvas) return;

    // Track discovery
    this.discovered.add(expData.id);
    localStorage.setItem('ai_lab_discovered', JSON.stringify([...this.discovered]));
    this.updateDiscoveryBadge();

    // Set header info
    if (titleEl) titleEl.textContent = `${expData.number}: ${expData.title}`;
    if (badgeEl) badgeEl.textContent = expData.badge;

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Clear previous instance
    if (this.activeExpInstance && typeof this.activeExpInstance.destroy === 'function') {
      this.activeExpInstance.destroy();
      this.activeExpInstance = null;
    }

    // Instantiate selected experiment class
    switch (expData.id) {
      case 'neural-flow':
        this.activeExpInstance = new NeuralFlowExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'prompt-alchemy':
        this.activeExpInstance = new PromptAlchemyExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'dream-machine':
        this.activeExpInstance = new DreamMachineExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'agent-mind':
        this.activeExpInstance = new AgentMindExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'vision-playground':
        this.activeExpInstance = new ComputerVisionExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'sound-visualizer':
        this.activeExpInstance = new SoundVisualizerExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'generative-type':
        this.activeExpInstance = new GenerativeTypeExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'signal-map':
        this.activeExpInstance = new SignalMapExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'chaos-lab':
        this.activeExpInstance = new ChaosLabExperiment(canvas, hud, this.theme, this.audio);
        break;
      case 'secret-machine':
        this.activeExpInstance = new SecretMachineExperiment(canvas, hud, this.theme, this.audio);
        break;
      default:
        this.activeExpInstance = new NeuralFlowExperiment(canvas, hud, this.theme, this.audio);
        break;
    }

    if (this.activeExpInstance && typeof this.activeExpInstance.init === 'function') {
      this.activeExpInstance.init();
    }

    this.setTheatreMode('play');
  }

  closeExperiment() {
    const modal = document.getElementById('labTheatreModal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (this.activeExpInstance && typeof this.activeExpInstance.destroy === 'function') {
      this.activeExpInstance.destroy();
      this.activeExpInstance = null;
    }
    this.activeExpData = null;
  }

  setTheatreMode(mode) {
    this.currentMode = mode;
    const playBtn = document.getElementById('btnModePlay');
    const inspectBtn = document.getElementById('btnModeInspect');
    const stageView = document.getElementById('theatreStageView');
    const inspectView = document.getElementById('theatreInspectView');

    if (mode === 'play') {
      if (playBtn) playBtn.classList.add('active');
      if (inspectBtn) inspectBtn.classList.remove('active');
      if (stageView) stageView.style.display = 'flex';
      if (inspectView) inspectView.classList.remove('active');
    } else {
      if (inspectBtn) inspectBtn.classList.add('active');
      if (playBtn) playBtn.classList.remove('active');
      if (stageView) stageView.style.display = 'none';
      if (inspectView) {
        inspectView.classList.add('active');
        this.renderInspectData();
      }
    }
  }

  renderInspectData() {
    const container = document.getElementById('theatreInspectContainer');
    if (!container || !this.activeExpInstance) return;

    const data = this.activeExpInstance.getInspectData();
    const theme = this.theme.getCurrent();

    container.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <span class="ai-lab-eyebrow" style="margin-bottom: 0.85rem;"><i class="bi bi-cpu-fill"></i> ARCHITECTURE &amp; ALGORITHMS</span>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-bottom: 0.65rem;">${data.title}</h2>
        <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">${data.description}</p>
      </div>

      <div class="inspect-grid">
        <div class="inspect-stat-card">
          <div class="inspect-stat-label">Domain Category</div>
          <div class="inspect-stat-value">${data.category}</div>
        </div>
        <div class="inspect-stat-card">
          <div class="inspect-stat-label">Renderer Pipeline</div>
          <div class="inspect-stat-value">${data.renderer}</div>
        </div>
        <div class="inspect-stat-card">
          <div class="inspect-stat-label">Algorithmic Complexity</div>
          <div class="inspect-stat-value" style="color: ${theme.c1};">${data.complexity}</div>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1rem; color: #ffffff; margin-bottom: 0.75rem; font-family: var(--lab-font-mono);">
          CORE MATHEMATICAL FORMULA / IMPLEMENTATION SNIPPET:
        </h4>
        <pre class="inspect-code-block"><code>${data.algorithm}</code></pre>
      </div>

      <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.25rem;">
        <div style="font-family: var(--lab-font-mono); font-size: 0.76rem; color: ${theme.c1}; font-weight: 700; margin-bottom: 0.5rem;">
          CLIENT-SIDE BROWSER STACK:
        </div>
        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
          ${data.techStack.map(t => `<span class="badge-tech" style="background: rgba(255,255,255,0.06); color: #cbd5e1; font-size: 0.74rem;">${t}</span>`).join('')}
        </div>
      </div>
    `;
  }

  bindManualModal() {
    const modal = document.getElementById('labManualModal');
    const btnOpen = document.getElementById('btnOpenManual');
    const btnClose = document.getElementById('btnCloseManual');

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        if (modal) modal.classList.add('active');
        if (this.audio) this.audio.playClick(720);
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        if (modal) modal.classList.remove('active');
      });
    }
  }

  bindSurpriseButtons() {
    const btnSurprise = document.getElementById('btnSurpriseMe');
    const btnBored = document.getElementById('btnBoredMe');

    if (btnSurprise) {
      btnSurprise.addEventListener('click', () => {
        this.launchRandomExperiment();
      });
    }

    if (btnBored) {
      btnBored.addEventListener('click', () => {
        if (this.hero) this.hero.triggerImpulse();
        if (this.audio) this.audio.playGlitch();
        this.chaosValue = 0.9;
        const slider = document.getElementById('aiLabChaosSlider');
        if (slider) slider.value = 90;
        this.launchRandomExperiment();
      });
    }
  }

  launchRandomExperiment() {
    import('./constellation_map.js').then(({ EXPERIMENTS_REGISTRY }) => {
      const randomExp = EXPERIMENTS_REGISTRY[Math.floor(Math.random() * EXPERIMENTS_REGISTRY.length)];
      this.openExperiment(randomExp);
    });
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case '1':
          this.theme.applyWorld('neural');
          break;
        case '2':
          this.theme.applyWorld('quantum');
          break;
        case '3':
          this.theme.applyWorld('cyber-organic');
          break;
        case '4':
          this.theme.applyWorld('machine-dream');
          break;
        case '5':
          this.theme.applyWorld('terminal');
          break;
        case 'r':
        case 'R':
          this.launchRandomExperiment();
          break;
        case 'c':
        case 'C':
          this.chaosValue = this.chaosValue > 0.6 ? 0.2 : 0.85;
          const s = document.getElementById('aiLabChaosSlider');
          if (s) s.value = Math.round(this.chaosValue * 100);
          if (this.hero) this.hero.setChaos(this.chaosValue);
          if (this.audio) this.audio.playGlitch();
          break;
        case 'm':
        case 'M':
          if (this.audio) {
            const isMuted = this.audio.toggleMute();
            const btn = document.getElementById('btnToggleSound');
            if (btn) btn.classList.toggle('active', !isMuted);
          }
          break;
        case 'h':
        case 'H':
        case '?':
          const manual = document.getElementById('labManualModal');
          if (manual) manual.classList.toggle('active');
          break;
        case 'Escape':
          this.closeExperiment();
          const m = document.getElementById('labManualModal');
          if (m) m.classList.remove('active');
          break;
        case ' ':
          if (this.hero && !this.activeExpInstance) {
            e.preventDefault();
            this.hero.triggerImpulse();
          }
          break;
      }
    });
  }

  updateDiscoveryBadge() {
    const badge = document.getElementById('labDiscoveryCount');
    if (badge) {
      badge.textContent = `${this.discovered.size} / 10`;
    }
  }

  syncUrlState() {
    const world = this.theme.getCurrent().id;
    const url = new URL(window.location);
    url.searchParams.set('lab_theme', world);
    window.history.replaceState({}, '', url);
  }
}
