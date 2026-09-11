/**
 * AI EXPERIMENTAL LAB — MASTER SHELL ENTRY POINT
 * Initializes all core engines, hero computational field, constellation galaxy,
 * custom spring cursor, sound synthesizer, and UI controllers.
 */
import { LabAudioEngine } from './audio_engine.js';
import { LabThemeEngine } from './theme_engine.js';
import { LabCursorEngine } from './cursor_engine.js';
import { HeroFieldCanvas } from './hero_canvas.js';
import { ConstellationGalaxyMap } from './constellation_map.js';
import { LabUIControllers } from './ui_controllers.js';

class AILabMasterShell {
  constructor() {
    this.wrapper = document.getElementById('aiLabWrapper');
    if (!this.wrapper) return;

    this.audio = null;
    this.theme = null;
    this.cursor = null;
    this.hero = null;
    this.galaxy = null;
    this.ui = null;

    this.init();
  }

  init() {
    // 1. Audio Engine (procedural Web Audio, default muted)
    this.audio = new LabAudioEngine();

    // 2. Theme Engine (5 worlds)
    this.theme = new LabThemeEngine(this.wrapper, (world) => {
      if (this.audio) this.audio.playChime(640);
    });

    // 3. Custom Spring Cursor
    this.cursor = new LabCursorEngine(this.wrapper);

    // 4. Hero Computational Field
    const heroCanvas = document.getElementById('aiLabHeroCanvas');
    if (heroCanvas) {
      this.hero = new HeroFieldCanvas(heroCanvas, this.theme, this.audio);
    }

    // 5. Constellation Galaxy Map
    const galaxyViewport = document.getElementById('aiLabGalaxyViewport');
    const galaxyCanvas = document.getElementById('aiLabGalaxyCanvas');
    const galaxyOverlay = document.getElementById('galaxyNodeOverlay');

    if (galaxyViewport && galaxyCanvas && galaxyOverlay) {
      this.galaxy = new ConstellationGalaxyMap(
        galaxyViewport,
        galaxyCanvas,
        galaxyOverlay,
        this.theme,
        this.audio,
        (expData) => {
          if (this.ui) this.ui.openExperiment(expData);
        }
      );
    }

    // 6. UI Controllers, Modals & Chaos Deck
    this.ui = new LabUIControllers(this.theme, this.audio, this.hero, this.galaxy);

    // 7. Bind Theme Switcher Buttons in Hero & Deck
    document.querySelectorAll('.ai-lab-env-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const worldKey = btn.getAttribute('data-world');
        if (worldKey) this.theme.applyWorld(worldKey);
      });
    });

    // 8. Bind Sound Toggle Button
    const btnSound = document.getElementById('btnToggleSound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        btnSound.classList.toggle('active', !isMuted);
      });
    }

    // 9. Quick-Jump Button to Galaxy Map
    const btnExploreGalaxy = document.getElementById('btnExploreGalaxy');
    if (btnExploreGalaxy) {
      btnExploreGalaxy.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('aiLabConstellationSection');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    console.log('%c⚡ AI EXPERIMENTAL LAB ONLINE // 5 WORLDS READY', 'color:#00f5ff;font-weight:bold;font-size:12px;');
  }
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AILabMasterShell());
} else {
  new AILabMasterShell();
}
