/**
 * AI EXPERIMENTAL LAB — THEME & WORLD ENGINE
 * Manages the 5 distinct visual worlds, canvas color mapping, and CSS property updates.
 */
export const WORLDS = {
  neural: {
    id: 'neural',
    name: 'Neural',
    c1: '#00f5ff',
    c2: '#3b5bff',
    c3: '#7c3cff',
    accent: '#00f5ff',
    glow: 'rgba(0, 245, 255, 0.45)',
    bg: '#030712',
    bgField: 'rgba(3, 7, 18, 0.28)',
    desc: 'Electric synaptic network & coherent signal pulses',
  },
  quantum: {
    id: 'quantum',
    name: 'Quantum',
    c1: '#d946ef',
    c2: '#f43f5e',
    c3: '#8b5cf6',
    accent: '#f43f5e',
    glow: 'rgba(217, 70, 239, 0.45)',
    bg: '#090314',
    bgField: 'rgba(9, 3, 20, 0.28)',
    desc: 'Probability distributions & wave-particle interference',
  },
  'cyber-organic': {
    id: 'cyber-organic',
    name: 'Cyber Organic',
    c1: '#b6ff00',
    c2: '#10b981',
    c3: '#14b8a6',
    accent: '#b6ff00',
    glow: 'rgba(182, 255, 0, 0.45)',
    bg: '#02110c',
    bgField: 'rgba(2, 17, 12, 0.28)',
    desc: 'Synthetic cellular membranes & bio-luminescent geometry',
  },
  'machine-dream': {
    id: 'machine-dream',
    name: 'Machine Dream',
    c1: '#fda4af',
    c2: '#c084fc',
    c3: '#67e8f9',
    accent: '#fda4af',
    glow: 'rgba(244, 114, 182, 0.45)',
    bg: '#0c0817',
    bgField: 'rgba(12, 8, 23, 0.28)',
    desc: 'Surreal morphing latent gradients & dreamlike float',
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal / Void',
    c1: '#22c55e',
    c2: '#f59e0b',
    c3: '#ef4444',
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.5)',
    bg: '#020408',
    bgField: 'rgba(2, 4, 8, 0.35)',
    desc: 'Monochrome phosphor telemetry, CRT scanlines & diagnostic ASCII',
  }
};

export class LabThemeEngine {
  constructor(containerEl, onThemeChange) {
    this.container = containerEl || document.body;
    this.onThemeChange = onThemeChange;
    this.currentWorld = 'neural';

    // Check URL param first (?theme=quantum), then localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    const saved = localStorage.getItem('ai_lab_theme');

    if (urlTheme && WORLDS[urlTheme]) {
      this.currentWorld = urlTheme;
    } else if (saved && WORLDS[saved]) {
      this.currentWorld = saved;
    }

    this.applyWorld(this.currentWorld, false);
  }

  getCurrent() {
    return WORLDS[this.currentWorld] || WORLDS.neural;
  }

  applyWorld(worldKey, notify = true) {
    if (!WORLDS[worldKey]) return;
    this.currentWorld = worldKey;
    localStorage.setItem('ai_lab_theme', worldKey);

    if (this.container) {
      this.container.setAttribute('data-lab-world', worldKey);
    }
    document.documentElement.setAttribute('data-lab-world', worldKey);

    // Update active button state in dock
    document.querySelectorAll('.ai-lab-env-btn').forEach(btn => {
      const w = btn.getAttribute('data-world');
      if (w === worldKey) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    if (notify && typeof this.onThemeChange === 'function') {
      this.onThemeChange(this.getCurrent());
    }
  }

  cycleNext() {
    const keys = Object.keys(WORLDS);
    const nextIdx = (keys.indexOf(this.currentWorld) + 1) % keys.length;
    this.applyWorld(keys[nextIdx]);
    return this.getCurrent();
  }
}
