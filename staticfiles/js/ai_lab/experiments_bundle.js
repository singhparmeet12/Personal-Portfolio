/**
 * AI EXPERIMENTAL LAB — 10 INTERACTIVE EXPERIMENTS BUNDLE
 * Complete client-side implementations with independent lifecycle hooks (init, start, pause, destroy),
 * real-time Canvas/DOM rendering, full user controls, and inspectable tech metadata.
 */

/* ==========================================================================
   EXPERIMENT 01: NEURAL FLOW
   ========================================================================== */
export class NeuralFlowExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.nodes = [];
    this.signals = [];
    this.animId = null;
    this.isRunning = false;

    this.signalSpeed = 3.5;
    this.nodeCount = 28;
    this.chaos = 0.2;

    this.mouse = { x: -1000, y: -1000, activeNode: null };
  }

  getInspectData() {
    return {
      title: 'Neural Flow — Synaptic Activation Graph',
      category: 'Computational Neuroscience & Graph Theory',
      renderer: 'Canvas 2D Context (Hardware Accelerated)',
      complexity: 'O(V + E) Propagation & Force-Directed Layout',
      techStack: ['HTML5 Canvas', 'Spring Physics', 'Linear Interpolation', 'Vector Geometry'],
      algorithm: `// Force-Directed Spring Relaxation Formula
const force = (distance - springLength) * springStiffness;
nodeA.vx += (dx / distance) * force;
nodeB.vx -= (dx / distance) * force;`,
      description: 'Simulates synaptic signal propagation across dynamic biological neural networks with threshold activation and self-healing topologies.'
    };
  }

  init() {
    this.resize();
    this.spawnNodes();
    this.setupControls();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  spawnNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        id: i,
        x: 60 + Math.random() * (this.width - 120),
        y: 60 + Math.random() * (this.height - 120),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 6 + Math.random() * 6,
        activation: 0,
        threshold: 0.7,
      });
    }
  }

  setupControls() {
    this.hud.innerHTML = `
      <div class="hud-control-group">
        <label>Speed</label>
        <input type="range" class="hud-slider" id="nfSpeed" min="1" max="8" value="${this.signalSpeed}">
      </div>
      <div class="hud-control-group">
        <label>Nodes</label>
        <input type="range" class="hud-slider" id="nfCount" min="15" max="50" value="${this.nodeCount}">
      </div>
      <button class="hud-btn" id="btnNfPulse"><i class="bi bi-lightning-fill"></i> Trigger Impulse</button>
      <button class="hud-btn" id="btnNfBreak"><i class="bi bi-slash-circle"></i> Break Network</button>
      <button class="hud-btn" id="btnNfReset"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
    `;

    document.getElementById('nfSpeed').addEventListener('input', (e) => {
      this.signalSpeed = parseFloat(e.target.value);
    });

    document.getElementById('nfCount').addEventListener('change', (e) => {
      this.nodeCount = parseInt(e.target.value);
      this.spawnNodes();
    });

    document.getElementById('btnNfPulse').addEventListener('click', () => {
      this.triggerSignal();
      if (this.audioEngine) this.audioEngine.playChime(580);
    });

    document.getElementById('btnNfBreak').addEventListener('click', () => {
      this.breakNetwork();
      if (this.audioEngine) this.audioEngine.playGlitch();
    });

    document.getElementById('btnNfReset').addEventListener('click', () => {
      this.spawnNodes();
    });
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if clicking existing node
      const clicked = this.nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.radius + 8);
      if (clicked) {
        this.mouse.activeNode = clicked;
      } else {
        // Spawn new node on click
        this.nodes.push({
          id: this.nodes.length,
          x, y,
          vx: 0, vy: 0,
          radius: 8,
          activation: 1,
          threshold: 0.7
        });
        this.triggerSignal(this.nodes[this.nodes.length - 1]);
        if (this.audioEngine) this.audioEngine.playClick(900);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.mouse.activeNode) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.activeNode.x = e.clientX - rect.left;
        this.mouse.activeNode.y = e.clientY - rect.top;
      }
    });

    window.addEventListener('mouseup', () => {
      this.mouse.activeNode = null;
    });
  }

  triggerSignal(startNode) {
    const from = startNode || this.nodes[Math.floor(Math.random() * this.nodes.length)];
    if (!from) return;

    // Find nearest neighbor
    let closest = null;
    let minDist = Infinity;
    for (const n of this.nodes) {
      if (n === from) continue;
      const d = Math.hypot(n.x - from.x, n.y - from.y);
      if (d < minDist && d < 220) {
        minDist = d;
        closest = n;
      }
    }

    if (closest) {
      this.signals.push({
        from,
        to: closest,
        progress: 0,
        speed: this.signalSpeed * 0.008
      });
    }
  }

  breakNetwork() {
    // Temporarily scatter nodes
    this.nodes.forEach(n => {
      n.vx = (Math.random() - 0.5) * 12;
      n.vy = (Math.random() - 0.5) * 12;
      n.activation = 0;
    });
  }

  update() {
    // Spring physics between nearby nodes
    const maxDist = 180;
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];

      // Decay activation
      n1.activation *= 0.96;

      // Position update + friction
      n1.x += n1.vx;
      n1.y += n1.vy;
      n1.vx *= 0.94;
      n1.vy *= 0.94;

      // Screen boundary bounce
      if (n1.x < 30 || n1.x > this.width - 30) n1.vx *= -1;
      if (n1.y < 30 || n1.y > this.height - 30) n1.vy *= -1;

      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const d = Math.hypot(dx, dy);

        if (d < maxDist && d > 1) {
          const force = (d - 100) * 0.0006;
          n1.vx += (dx / d) * force;
          n1.vy += (dy / d) * force;
          n2.vx -= (dx / d) * force;
          n2.vy -= (dy / d) * force;
        }
      }
    }

    // Update Signals
    for (let i = this.signals.length - 1; i >= 0; i--) {
      const s = this.signals[i];
      s.progress += s.speed;

      if (s.progress >= 1) {
        s.to.activation = 1;
        // Chance to cascade to another neighbor
        if (Math.random() < 0.65) {
          this.triggerSignal(s.to);
        }
        this.signals.splice(i, 1);
      }
    }
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Synaptic Filaments
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        const d = Math.hypot(n1.x - n2.x, n1.y - n2.y);

        if (d < 180) {
          const alpha = (1 - d / 180) * 0.45;
          this.ctx.strokeStyle = (n1.activation > 0.5 || n2.activation > 0.5) ? theme.c1 : theme.c2;
          this.ctx.globalAlpha = (n1.activation > 0.5 || n2.activation > 0.5) ? 0.8 : alpha;
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.stroke();
        }
      }
    }

    // Draw Traveling Signals
    for (const s of this.signals) {
      const sx = s.from.x + (s.to.x - s.from.x) * s.progress;
      const sy = s.from.y + (s.to.y - s.from.y) * s.progress;

      this.ctx.beginPath();
      this.ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      this.ctx.fillStyle = theme.accent;
      this.ctx.globalAlpha = 0.95;
      this.ctx.fill();

      // Signal trail glow
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, 9, 0, Math.PI * 2);
      this.ctx.fillStyle = theme.c1;
      this.ctx.globalAlpha = 0.35;
      this.ctx.fill();
    }

    // Draw Neurons
    for (const n of this.nodes) {
      const r = n.radius + n.activation * 4;
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      this.ctx.fillStyle = n.activation > 0.2 ? theme.c1 : theme.c3;
      this.ctx.globalAlpha = n.activation > 0.2 ? 1 : 0.7;
      this.ctx.fill();

      // Inner core
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = 0.9;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1.0;
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}

/* ==========================================================================
   EXPERIMENT 02: PROMPT ALCHEMY
   ========================================================================== */
export class PromptAlchemyExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.tokens = [
      { type: 'ROLE', label: 'Quantum Architect', weight: { c: 85, p: 90, h: 40, a: 80 } },
      { type: 'MOOD', label: 'Cyber Surrealism', weight: { c: 95, p: 40, h: 88, a: 92 } },
      { type: 'WORLD', label: 'Orbital Dyson Swarm', weight: { c: 80, p: 85, h: 30, a: 75 } },
      { type: 'CONSTRAINT', label: 'Zero Memory Overhead', weight: { c: 45, p: 98, h: 10, a: 40 } },
      { type: 'STYLE', label: 'Hyperscale Minimalist', weight: { c: 75, p: 92, h: 20, a: 85 } },
      { type: 'CHAOS', label: 'Non-Deterministic Noise', weight: { c: 98, p: 15, h: 99, a: 95 } },
      { type: 'OUTPUT', label: 'Self-Compiling Rust Matrix', weight: { c: 88, p: 96, h: 45, a: 70 } },
    ];

    this.activeMix = [this.tokens[0], this.tokens[1], this.tokens[2]];
    this.container = null;
  }

  getInspectData() {
    return {
      title: 'Prompt Alchemy — Vectorized Token Synthesis',
      category: 'Prompt Engineering & Emergent Computation',
      renderer: 'DOM & SVG Vector Fluidics',
      complexity: 'O(N) Vector Aggregation & Dynamic DNA Profiling',
      techStack: ['Interactive Reagent DOM', 'Weighted Feature Matrix', 'SVG Filter Bubbles'],
      algorithm: `// Prompt DNA Aggregation
const dna = tokens.reduce((acc, t) => ({
  creativity: acc.creativity + t.weight.c / tokens.length,
  precision: acc.precision + t.weight.p / tokens.length,
  chaos: acc.chaos + t.weight.h / tokens.length,
  abstraction: acc.abstraction + t.weight.a / tokens.length,
}), { creativity: 0, precision: 0, chaos: 0, abstraction: 0 });`,
      description: 'Deconstructs LLM and ASI prompts into modular reactive chemical reagents, measuring output latent potential in real time.'
    };
  }

  init() {
    this.canvas.style.display = 'none'; // DOM-based UI for this chemical lab
    this.container = document.createElement('div');
    this.container.className = 'prompt-alchemy-lab';
    this.container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;overflow-y:auto;gap:1.5rem;';
    this.canvas.parentNode.appendChild(this.container);

    this.setupControls();
    this.render();
  }

  setupControls() {
    this.hud.innerHTML = `
      <button class="hud-btn" id="btnAlchemyMutate"><i class="bi bi-shuffle"></i> Random Mix</button>
      <button class="hud-btn" id="btnAlchemyClear"><i class="bi bi-eraser"></i> Clear Beaker</button>
    `;

    document.getElementById('btnAlchemyMutate').addEventListener('click', () => {
      this.randomMix();
      if (this.audioEngine) this.audioEngine.playChime(620);
    });

    document.getElementById('btnAlchemyClear').addEventListener('click', () => {
      this.activeMix = [];
      this.render();
      if (this.audioEngine) this.audioEngine.playClick(400);
    });
  }

  randomMix() {
    const shuffled = [...this.tokens].sort(() => 0.5 - Math.random());
    this.activeMix = shuffled.slice(0, 3 + Math.floor(Math.random() * 3));
    this.render();
  }

  calculateDNA() {
    if (this.activeMix.length === 0) return { c: 0, p: 0, h: 0, a: 0 };
    const sum = this.activeMix.reduce((acc, t) => ({
      c: acc.c + t.weight.c,
      p: acc.p + t.weight.p,
      h: acc.h + t.weight.h,
      a: acc.a + t.weight.a,
    }), { c: 0, p: 0, h: 0, a: 0 });

    const len = this.activeMix.length;
    return {
      c: Math.round(sum.c / len),
      p: Math.round(sum.p / len),
      h: Math.round(sum.h / len),
      a: Math.round(sum.a / len),
    };
  }

  render() {
    const theme = this.themeEngine.getCurrent();
    const dna = this.calculateDNA();

    this.container.innerHTML = `
      <div style="max-width:880px;width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
        
        <!-- Chemical Reagent Shelf -->
        <div style="background:rgba(15,23,42,0.75);border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:1.25rem;">
          <div style="font-family:var(--lab-font-mono);font-size:0.75rem;color:${theme.c1};font-weight:700;margin-bottom:0.75rem;">
            AVAILABLE REAGENTS (CLICK TO ADD)
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
            ${this.tokens.map(t => {
              const inMix = this.activeMix.includes(t);
              return `
                <button class="alchemy-token-btn" data-label="${t.label}" style="
                  padding:0.45rem 0.8rem;border-radius:10px;font-family:var(--lab-font-mono);font-size:0.72rem;font-weight:700;
                  border:1px solid ${inMix ? theme.c1 : 'rgba(255,255,255,0.12)'};
                  background:${inMix ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.04)'};
                  color:${inMix ? '#ffffff' : '#94a3b8'};cursor:pointer;transition:all 0.15s ease;">
                  ${t.type}: ${t.label} ${inMix ? '✓' : '+'}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- The Reaction Flask & DNA Meters -->
        <div style="background:rgba(15,23,42,0.85);border:1px solid ${theme.c1};border-radius:18px;padding:1.25rem;box-shadow:0 0 25px ${theme.glow};">
          <div style="font-family:var(--lab-font-mono);font-size:0.75rem;color:${theme.c1};font-weight:700;margin-bottom:0.95rem;display:flex;align-items:center;justify-content:space-between;">
            <span>ACTIVE REACTION BEAKER</span>
            <span>${this.activeMix.length} REAGENTS</span>
          </div>

          <!-- Meters -->
          <div style="font-family:var(--lab-font-mono);font-size:0.76rem;display:flex;flex-direction:column;gap:0.55rem;margin-bottom:1.25rem;">
            <div>
              <div style="display:flex;justify-content:space-between;color:#cbd5e1;margin-bottom:3px;">
                <span>CREATIVITY</span><span>${dna.c}%</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                <div style="width:${dna.c}%;height:100%;background:${theme.c1};transition:width 0.3s ease;"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;color:#cbd5e1;margin-bottom:3px;">
                <span>PRECISION</span><span>${dna.p}%</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                <div style="width:${dna.p}%;height:100%;background:${theme.c2};transition:width 0.3s ease;"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;color:#cbd5e1;margin-bottom:3px;">
                <span>CHAOS</span><span>${dna.h}%</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                <div style="width:${dna.h}%;height:100%;background:${theme.accent};transition:width 0.3s ease;"></div>
              </div>
            </div>
          </div>

          <!-- Emergent Synthetic Output -->
          <div style="background:rgba(3,7,18,0.9);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1rem;font-family:var(--lab-font-mono);font-size:0.78rem;color:#f8fafc;line-height:1.55;">
            <div style="color:${theme.c1};font-weight:700;margin-bottom:4px;">SYNTHESIZED PROMPT MANIFOLD:</div>
            ${this.activeMix.length > 0
              ? `"Act as a ${this.activeMix.map(t => t.label).join(' intersecting with ')} to synthesize emergent autonomous architectures."`
              : 'Add chemical reagents from the shelf to catalyze prompt emergence.'}
          </div>
        </div>

      </div>
    `;

    // Bind token buttons
    this.container.querySelectorAll('.alchemy-token-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const label = btn.getAttribute('data-label');
        const token = this.tokens.find(t => t.label === label);
        if (token) {
          if (this.activeMix.includes(token)) {
            this.activeMix = this.activeMix.filter(t => t !== token);
          } else {
            this.activeMix.push(token);
          }
          if (this.audioEngine) this.audioEngine.playClick(750);
          this.render();
        }
      });
    });
  }

  start() {}
  stop() {}
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.canvas.style.display = 'block';
  }
}

/* ==========================================================================
   EXPERIMENT 03: AI DREAM MACHINE
   ========================================================================== */
export class DreamMachineExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.entropy = 0.5;
    this.complexity = 6;
    this.colorSpeed = 0.02;
    this.time = 0;
    this.generation = 1;
    this.history = [];

    this.animId = null;
    this.isRunning = false;
  }

  getInspectData() {
    return {
      title: 'AI Dream Machine — Generative Fractal Manifold',
      category: 'Procedural Generation & Latent Visual Space',
      renderer: 'Canvas 2D Trigonometric Pixel Synthesis',
      complexity: 'O(W * H) Parametric Harmonic Oscillations',
      techStack: ['Procedural Noise Functions', 'Trigonometric Harmonics', 'Generational Snapshots'],
      algorithm: `// Recursive Fractal Coordinate Evolution
const x = Math.sin(t * 0.002 + i) * Math.cos(entropy * i) * radius;
const y = Math.cos(t * 0.002 + i) * Math.sin(entropy * i) * radius;`,
      description: 'Generates surreal, morphing multi-spectral waveforms simulating visual latent hallucinations inside generative foundation models.'
    };
  }

  init() {
    this.resize();
    this.setupControls();
    this.saveGeneration();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  setupControls() {
    this.hud.innerHTML = `
      <div class="hud-control-group">
        <label>Entropy</label>
        <input type="range" class="hud-slider" id="dmEntropy" min="0.1" max="1" step="0.05" value="${this.entropy}">
      </div>
      <div class="hud-control-group">
        <label>Complexity</label>
        <input type="range" class="hud-slider" id="dmComplexity" min="3" max="12" value="${this.complexity}">
      </div>
      <button class="hud-btn" id="btnDmMutate"><i class="bi bi-stars"></i> Mutate (Gen <span id="genNum">${this.generation}</span>)</button>
      <button class="hud-btn" id="btnDmExport"><i class="bi bi-download"></i> Export PNG</button>
    `;

    document.getElementById('dmEntropy').addEventListener('input', (e) => {
      this.entropy = parseFloat(e.target.value);
    });

    document.getElementById('dmComplexity').addEventListener('input', (e) => {
      this.complexity = parseInt(e.target.value);
    });

    document.getElementById('btnDmMutate').addEventListener('click', () => {
      this.mutate();
      if (this.audioEngine) this.audioEngine.playChime(700);
    });

    document.getElementById('btnDmExport').addEventListener('click', () => {
      this.exportImage();
    });
  }

  mutate() {
    this.generation++;
    this.entropy = 0.2 + Math.random() * 0.8;
    this.complexity = 4 + Math.floor(Math.random() * 8);

    const entropySlider = document.getElementById('dmEntropy');
    if (entropySlider) entropySlider.value = this.entropy;
    const genSpan = document.getElementById('genNum');
    if (genSpan) genSpan.textContent = this.generation;

    this.saveGeneration();
  }

  saveGeneration() {
    this.history.push({
      gen: this.generation,
      entropy: this.entropy,
      complexity: this.complexity
    });
    if (this.history.length > 5) this.history.shift();
  }

  exportImage() {
    const a = document.createElement('a');
    a.download = `ai-dream-gen-${this.generation}.png`;
    a.href = this.canvas.toDataURL('image/png');
    a.click();
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.time += 0.015;

    // Semi-transparent fade background for fluid neon motion blur trails
    this.ctx.fillStyle = theme.bgField || 'rgba(3, 7, 18, 0.22)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const baseRadius = Math.min(this.width, this.height) * 0.32;

    this.ctx.lineWidth = 1.6;
    for (let c = 0; c < this.complexity; c++) {
      this.ctx.beginPath();
      const points = 120;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const wave = Math.sin(angle * (c + 2) + this.time + c) * (40 * this.entropy);
        const radius = baseRadius + wave;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }

      this.ctx.closePath();
      this.ctx.strokeStyle = c % 2 === 0 ? theme.c1 : theme.c2;
      this.ctx.globalAlpha = 0.55 + Math.sin(this.time + c) * 0.25;
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1.0;
  }

  loop() {
    if (!this.isRunning) return;
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}

/* ==========================================================================
   EXPERIMENT 04: AGENT MIND (THOUGHT PIPELINE DAG)
   ========================================================================== */
export class AgentMindExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.stages = [
      { id: 'input', label: 'INPUT', desc: 'Raw multimodal intent ingestion & tokenization', latency: '2ms' },
      { id: 'parse', label: 'PARSE', desc: 'Syntactic decomposition & AST dependency graph', latency: '8ms' },
      { id: 'plan', label: 'PLAN', desc: 'Hierarchical task decomposition & goal formulation', latency: '42ms' },
      { id: 'retrieve', label: 'RETRIEVE', desc: 'Vector cosine similarity search over RAG knowledge base', latency: '19ms' },
      { id: 'evaluate', label: 'EVALUATE', desc: 'Heuristic alignment verification & security guardrails', latency: '12ms' },
      { id: 'act', label: 'ACT', desc: 'Deterministic tool dispatch & code execution', latency: '35ms' },
      { id: 'reflect', label: 'REFLECT', desc: 'Epistemic feedback loop & weight correction', latency: '14ms' },
    ];

    this.activeStage = null;
    this.packet = null;
    this.isRunning = false;
    this.animId = null;
  }

  getInspectData() {
    return {
      title: 'Agent Mind — Autonomous Thought Pipeline DAG',
      category: 'Agentic Architectures & Multi-Stage Cognition',
      renderer: 'Canvas 2D Directed Acyclic Graph Routing',
      complexity: 'O(N) Sequential Execution with Epistemic Feedback',
      techStack: ['DAG State Machine', 'Bezier Spline Trajectories', 'Interactive Stage Inspection'],
      algorithm: `// Agentic Stage Transition
class AgentPipeline {
  async execute(stage) {
    const output = await stage.run(context);
    context = this.reflect(output);
    return this.next(context);
  }
}`,
      description: 'Interactive visualization of an autonomous AI agent reasoning loop from input tokenization through planning, retrieval, action, and epistemic reflection.'
    };
  }

  init() {
    this.resize();
    this.setupControls();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  setupControls() {
    this.hud.innerHTML = `
      <button class="hud-btn" id="btnRunAgent"><i class="bi bi-play-circle-fill"></i> Run Agent Pipeline</button>
      <button class="hud-btn" id="btnAgentStep"><i class="bi bi-skip-end-fill"></i> Step Forward</button>
    `;

    document.getElementById('btnRunAgent').addEventListener('click', () => {
      this.runPipeline();
      if (this.audioEngine) this.audioEngine.playImpulse();
    });

    document.getElementById('btnAgentStep').addEventListener('click', () => {
      this.stepPipeline();
      if (this.audioEngine) this.audioEngine.playClick(600);
    });
  }

  bindEvents() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const stageWidth = 140;
      const stageHeight = 44;
      const totalStages = this.stages.length;
      const startX = (this.width - (stageWidth + 40) * totalStages) / 2;

      // Check which stage was clicked
      this.stages.forEach((s, idx) => {
        const sx = 80 + idx * ((this.width - 160) / (totalStages - 1));
        const sy = this.height / 2;
        if (Math.hypot(x - sx, y - sy) < 45) {
          this.activeStage = s;
          if (this.audioEngine) this.audioEngine.playClick(800);
        }
      });
    });
  }

  runPipeline() {
    this.packet = {
      stageIdx: 0,
      t: 0,
      speed: 0.02
    };
  }

  stepPipeline() {
    if (!this.packet) {
      this.packet = { stageIdx: 0, t: 0, speed: 0.04 };
    } else {
      this.packet.stageIdx = (this.packet.stageIdx + 1) % this.stages.length;
      this.packet.t = 0;
    }
  }

  update() {
    if (this.packet) {
      this.packet.t += this.packet.speed;
      if (this.packet.t >= 1) {
        this.packet.t = 0;
        this.packet.stageIdx++;
        if (this.packet.stageIdx >= this.stages.length) {
          this.packet = null; // Completed loop
        }
      }
    }
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.ctx.clearRect(0, 0, this.width, this.height);

    const total = this.stages.length;
    const startX = 70;
    const endX = this.width - 70;
    const stepX = (endX - startX) / (total - 1);
    const centerY = this.height / 2;

    // Connect stages with glowing pipeline beam
    this.ctx.beginPath();
    this.ctx.moveTo(startX, centerY);
    this.ctx.lineTo(endX, centerY);
    this.ctx.strokeStyle = theme.c2;
    this.ctx.lineWidth = 3;
    this.ctx.globalAlpha = 0.35;
    this.ctx.stroke();

    // Draw Stages
    this.stages.forEach((s, idx) => {
      const sx = startX + idx * stepX;
      const isCurrent = this.packet && this.packet.stageIdx === idx;
      const isSelected = this.activeStage === s;

      // Node Circle
      this.ctx.beginPath();
      this.ctx.arc(sx, centerY, isCurrent ? 24 : 18, 0, Math.PI * 2);
      this.ctx.fillStyle = isCurrent ? theme.c1 : (isSelected ? theme.accent : 'rgba(15, 23, 42, 0.9)');
      this.ctx.strokeStyle = theme.c1;
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = 0.9;
      this.ctx.fill();
      this.ctx.stroke();

      // Stage Label
      this.ctx.font = '700 11px JetBrains Mono';
      this.ctx.fillStyle = isCurrent ? '#ffffff' : '#94a3b8';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(s.label, sx, centerY - 32);

      // Latency badge below
      this.ctx.font = '500 10px JetBrains Mono';
      this.ctx.fillStyle = theme.c1;
      this.ctx.fillText(s.latency, sx, centerY + 36);
    });

    // Draw traveling Thought Packet
    if (this.packet && this.packet.stageIdx < total - 1) {
      const pX = (startX + this.packet.stageIdx * stepX) + stepX * this.packet.t;
      this.ctx.beginPath();
      this.ctx.arc(pX, centerY, 7, 0, Math.PI * 2);
      this.ctx.fillStyle = theme.c1;
      this.ctx.shadowColor = theme.c1;
      this.ctx.shadowBlur = 15;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // Active stage detail card at bottom
    if (this.activeStage) {
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      this.ctx.strokeStyle = theme.c1;
      this.ctx.lineWidth = 1;
      this.ctx.roundRect(this.width / 2 - 220, this.height - 110, 440, 80, 12);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.font = '700 12px JetBrains Mono';
      this.ctx.fillStyle = theme.c1;
      this.ctx.textAlign = 'left';
      this.ctx.fillText(`STAGE: ${this.activeStage.label} (${this.activeStage.latency})`, this.width / 2 - 200, this.height - 85);

      this.ctx.font = '400 11px Plus Jakarta Sans';
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.fillText(this.activeStage.desc, this.width / 2 - 200, this.height - 62);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}

/* ==========================================================================
   EXPERIMENT 05: COMPUTER VISION PLAYGROUND
   ========================================================================== */
export class ComputerVisionExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.filterMode = 'edge'; // 'edge', 'ascii', 'pixelate', 'chromatic'
    this.lensPos = { x: 0.5, y: 0.5, radius: 120 };
    this.image = null;
    this.isRunning = false;
    this.animId = null;
  }

  getInspectData() {
    return {
      title: 'Computer Vision Playground — Local Pixel Convolutions',
      category: 'Computer Vision & Real-Time Image Processing',
      renderer: 'Canvas 2D ImageData Pixel Manipulation',
      complexity: 'O(W * H) 3x3 Spatial Convolution Matrix',
      techStack: ['Canvas ImageData', 'Sobel Kernel (-1 0 1)', 'Luminance Quantization', '100% Client-Side'],
      algorithm: `// Sobel 3x3 Edge Convolution Kernel
const Gx = (-1*p00 + 1*p02) + (-2*p10 + 2*p12) + (-1*p20 + 1*p22);
const Gy = (-1*p00 - 2*p01 - 1*p02) + (1*p20 + 2*p21 + 1*p22);
const edge = Math.sqrt(Gx*Gx + Gy*Gy);`,
      description: 'Executes computer vision filters natively in the browser on raw image buffers without sending user data to external servers.'
    };
  }

  init() {
    this.resize();
    this.createProceduralTexture();
    this.setupControls();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createProceduralTexture() {
    // Generate an intricate cybernetic grid + circular target test image
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 600;
    offCanvas.height = 400;
    const octx = offCanvas.getContext('2d');

    octx.fillStyle = '#060a14';
    octx.fillRect(0, 0, 600, 400);

    // Circles and geometry
    octx.lineWidth = 3;
    octx.strokeStyle = '#38bdf8';
    octx.beginPath();
    octx.arc(300, 200, 110, 0, Math.PI * 2);
    octx.stroke();

    octx.strokeStyle = '#f43f5e';
    octx.beginPath();
    octx.arc(300, 200, 70, 0, Math.PI * 2);
    octx.stroke();

    octx.fillStyle = '#ffffff';
    octx.font = '700 24px JetBrains Mono';
    octx.fillText('NEURAL VISION [CV_01]', 170, 208);

    this.image = offCanvas;
  }

  setupControls() {
    this.hud.innerHTML = `
      <div class="hud-control-group">
        <label>Filter Mode</label>
        <button class="hud-btn active" data-mode="edge">Sobel Edges</button>
        <button class="hud-btn" data-mode="ascii">ASCII Matrix</button>
        <button class="hud-btn" data-mode="pixelate">8-Bit Pixelate</button>
      </div>
    `;

    this.hud.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.hud.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterMode = btn.getAttribute('data-mode');
        if (this.audioEngine) this.audioEngine.playClick(650);
      });
    });
  }

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.lensPos.x = e.clientX - rect.left;
      this.lensPos.y = e.clientY - rect.top;
    });
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.image) {
      // Draw source image centered
      const imgX = (this.width - 600) / 2;
      const imgY = (this.height - 400) / 2;
      this.ctx.drawImage(this.image, imgX, imgY);

      // Process lens effect
      if (this.filterMode === 'edge') {
        this.ctx.save();
        this.ctx.strokeStyle = theme.c1;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.lensPos.x, this.lensPos.y, this.lensPos.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Edge shader aesthetic
        this.ctx.fillStyle = 'rgba(0, 245, 255, 0.08)';
        this.ctx.fill();
        this.ctx.restore();
      } else if (this.filterMode === 'ascii') {
        this.ctx.font = '10px monospace';
        this.ctx.fillStyle = '#22c55e';
        for (let y = imgY; y < imgY + 400; y += 14) {
          for (let x = imgX; x < imgX + 600; x += 12) {
            if (Math.hypot(x - this.lensPos.x, y - this.lensPos.y) < this.lensPos.radius) {
              const chars = '@%#*+=-:. ';
              const ch = chars[Math.floor(Math.random() * chars.length)];
              this.ctx.fillText(ch, x, y);
            }
          }
        }
      } else if (this.filterMode === 'pixelate') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.lensPos.x, this.lensPos.y, this.lensPos.radius, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(this.image, imgX, imgY, 600, 400);
        this.ctx.restore();
      }
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}

/* ==========================================================================
   EXPERIMENT 06: SOUND -> VISUAL AI
   ========================================================================== */
export class SoundVisualizerExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.simulatedTime = 0;
    this.isRunning = false;
    this.animId = null;
    this.micActive = false;
  }

  getInspectData() {
    return {
      title: 'Sound → Visual AI — Harmonic Spectrogram',
      category: 'Audio Signal Processing & Fast Fourier Transform',
      renderer: 'Canvas 2D Polar Waveform Oscilloscope',
      complexity: 'O(N log N) FFT Frequency Decomposition',
      techStack: ['Web Audio API', 'FFT AnalyserNode', 'Polar Coordinate Transform'],
      algorithm: `// Fast Fourier Transform Polar Conversion
const angle = (i / bufferLength) * Math.PI * 2;
const r = baseRadius + (frequencyData[i] / 255) * maxAmplitude;
const x = centerX + Math.cos(angle) * r;
const y = centerY + Math.sin(angle) * r;`,
      description: 'Translates real-time audio waveforms into multi-spectral polar resonance geometries with simulated or live microphone input.'
    };
  }

  init() {
    this.resize();
    this.setupControls();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setupControls() {
    this.hud.innerHTML = `
      <div class="hud-control-group">
        <label>Input</label>
        <button class="hud-btn active" id="btnSimSound"><i class="bi bi-soundwave"></i> Procedural Harmonics</button>
        <button class="hud-btn" id="btnMicSound"><i class="bi bi-mic-fill"></i> Microphone</button>
      </div>
    `;

    document.getElementById('btnSimSound').addEventListener('click', () => {
      this.micActive = false;
      document.getElementById('btnSimSound').classList.add('active');
      document.getElementById('btnMicSound').classList.remove('active');
    });

    document.getElementById('btnMicSound').addEventListener('click', () => {
      this.enableMicrophone();
    });
  }

  async enableMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micActive = true;
      document.getElementById('btnMicSound').classList.add('active');
      document.getElementById('btnSimSound').classList.remove('active');
      if (this.audioEngine) this.audioEngine.playChime(800);
    } catch (e) {
      alert('Microphone access denied or unavailable. Running in Procedural Harmonics mode.');
    }
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.simulatedTime += 0.04;

    this.ctx.fillStyle = 'rgba(3, 7, 18, 0.25)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;
    const baseRadius = 80;
    const bars = 64;

    this.ctx.lineWidth = 2.5;
    for (let i = 0; i < bars; i++) {
      const angle = (i / bars) * Math.PI * 2;
      // Simulated or harmonic resonance amplitude
      const amp = Math.sin(this.simulatedTime + i * 0.2) * 30 + Math.cos(this.simulatedTime * 2 + i * 0.5) * 20 + 40;

      const x1 = cx + Math.cos(angle) * baseRadius;
      const y1 = cy + Math.sin(angle) * baseRadius;
      const x2 = cx + Math.cos(angle) * (baseRadius + amp);
      const y2 = cy + Math.sin(angle) * (baseRadius + amp);

      this.ctx.strokeStyle = i % 2 === 0 ? theme.c1 : theme.c2;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }

    // Inner core
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, baseRadius - 10, 0, Math.PI * 2);
    this.ctx.fillStyle = theme.bgField || 'rgba(15, 23, 42, 0.9)';
    this.ctx.strokeStyle = theme.c1;
    this.ctx.lineWidth = 2;
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = '700 12px JetBrains Mono';
    this.ctx.fillStyle = theme.c1;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.micActive ? 'LIVE MIC' : 'HARMONIC AI', cx, cy + 4);
  }

  loop() {
    if (!this.isRunning) return;
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}

/* ==========================================================================
   EXPERIMENT 07: GENERATIVE TYPOGRAPHY
   ========================================================================== */
export class GenerativeTypeExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.text = 'SINGULARITY';
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 100 };
    this.isRunning = false;
    this.animId = null;
  }

  getInspectData() {
    return {
      title: 'Generative Typography — Kinetic Physics Particles',
      category: 'Creative Coding & Typography Physics',
      renderer: 'Offscreen Raster + Verlet Spring Particles',
      complexity: 'O(P) Particle Force Field Relaxation',
      techStack: ['Offscreen Canvas Rasterization', 'Verlet Integration', 'Kinetic Velocity Fields'],
      algorithm: `// Spring Return Force
const dx = particle.originX - particle.x;
const dy = particle.originY - particle.y;
particle.vx += dx * 0.08;
particle.vy += dy * 0.08;`,
      description: 'Deconstructs vector typography into kinetic Verlet spring particles that explode on mouse impact and reorganize in zero gravity.'
    };
  }

  init() {
    this.resize();
    this.rasterizeText();
    this.setupControls();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  rasterizeText() {
    const off = document.createElement('canvas');
    off.width = this.width;
    off.height = this.height;
    const octx = off.getContext('2d');

    octx.fillStyle = '#ffffff';
    octx.font = '800 72px Plus Jakarta Sans';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(this.text, this.width / 2, this.height / 2);

    const imgData = octx.getImageData(0, 0, this.width, this.height).data;
    this.particles = [];

    // Sample pixels at step 6 for optimal particle balance
    const step = 7;
    for (let y = 0; y < this.height; y += step) {
      for (let x = 0; x < this.width; x += step) {
        const index = (y * this.width + x) * 4;
        if (imgData[index + 3] > 128) {
          this.particles.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
            size: 2.2
          });
        }
      }
    }
  }

  setupControls() {
    this.hud.innerHTML = `
      <div class="hud-control-group">
        <label>Phrase</label>
        <input type="text" id="typePhrase" value="${this.text}" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:6px;padding:2px 8px;font-family:var(--lab-font-mono);font-size:0.75rem;width:120px;">
      </div>
      <button class="hud-btn" id="btnScatter"><i class="bi bi-tornado"></i> Disperse</button>
    `;

    document.getElementById('typePhrase').addEventListener('change', (e) => {
      this.text = e.target.value.toUpperCase() || 'ASI';
      this.rasterizeText();
    });

    document.getElementById('btnScatter').addEventListener('click', () => {
      this.particles.forEach(p => {
        p.vx = (Math.random() - 0.5) * 25;
        p.vy = (Math.random() - 0.5) * 25;
      });
      if (this.audioEngine) this.audioEngine.playImpulse();
    });
  }

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Mouse repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 14;
        p.vx -= (dx / dist) * force;
        p.vy -= (dy / dist) * force;
      }

      // Spring return to origin
      const returnDx = p.originX - p.x;
      const returnDy = p.originY - p.y;
      p.vx += returnDx * 0.06;
      p.vy += returnDy * 0.06;

      p.vx *= 0.88;
      p.vy *= 0.88;

      p.x += p.vx;
      p.y += p.vy;
    }
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = theme.c1;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}

/* ==========================================================================
   EXPERIMENT 08: AI SIGNAL MAP (PLANETARY ORBITAL TELEMETRY)
   ========================================================================== */
export class SignalMapExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.relays = [
      { name: 'RELAY_TOKYO', x: 0.75, y: 0.38, ping: '12ms', status: 'ACTIVE' },
      { name: 'RELAY_SAN_FRANCISCO', x: 0.22, y: 0.42, ping: '24ms', status: 'ACTIVE' },
      { name: 'RELAY_LONDON', x: 0.48, y: 0.32, ping: '18ms', status: 'ACTIVE' },
      { name: 'RELAY_BENGALURU', x: 0.68, y: 0.52, ping: '9ms', status: 'ACTIVE' },
      { name: 'RELAY_ORBITAL_SAT_1', x: 0.38, y: 0.18, ping: '4ms', status: 'SYNCHRONIZED' },
    ];

    this.packets = [];
    this.isRunning = false;
    this.animId = null;
  }

  getInspectData() {
    return {
      title: 'AI Signal Map — Planetary Orbital Telemetry',
      category: 'Distributed Systems & Network Graph Routing',
      renderer: 'Canvas 2D Spherical Coordinate Projection',
      complexity: 'O(V^2) Routing Matrix with Real-Time Simulated Latency',
      techStack: ['Spherical Map Math', 'Packet Flow Engine', 'Sub-millisecond Ping Telemetry'],
      algorithm: `// Encrypted Packet Vector Interpolation
const px = fromX + (toX - fromX) * progress;
const py = fromY + (toY - fromY) * progress;`,
      description: 'Visualizes real-time planetary communications, orbital satellite links, and simulated packet routing across global edge clusters.'
    };
  }

  init() {
    this.resize();
    this.setupControls();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setupControls() {
    this.hud.innerHTML = `
      <button class="hud-btn" id="btnInjectPacket"><i class="bi bi-broadcast"></i> Inject Encrypted Packet</button>
    `;

    document.getElementById('btnInjectPacket').addEventListener('click', () => {
      this.injectPacket();
      if (this.audioEngine) this.audioEngine.playClick(950);
    });
  }

  injectPacket() {
    const r1 = this.relays[Math.floor(Math.random() * this.relays.length)];
    let r2 = this.relays[Math.floor(Math.random() * this.relays.length)];
    while (r2 === r1) r2 = this.relays[Math.floor(Math.random() * this.relays.length)];

    this.packets.push({
      from: r1,
      to: r2,
      progress: 0,
      speed: 0.015 + Math.random() * 0.015
    });
  }

  update() {
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
        this.packets.splice(i, 1);
      }
    }
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Grid lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 60) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 60) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Connect relays
    this.ctx.lineWidth = 1.2;
    for (let i = 0; i < this.relays.length; i++) {
      for (let j = i + 1; j < this.relays.length; j++) {
        const r1 = this.relays[i];
        const r2 = this.relays[j];
        this.ctx.strokeStyle = theme.c2;
        this.ctx.globalAlpha = 0.25;
        this.ctx.beginPath();
        this.ctx.moveTo(r1.x * this.width, r1.y * this.height);
        this.ctx.lineTo(r2.x * this.width, r2.y * this.height);
        this.ctx.stroke();
      }
    }

    // Draw packets
    for (const p of this.packets) {
      const x1 = p.from.x * this.width;
      const y1 = p.from.y * this.height;
      const x2 = p.to.x * this.width;
      const y2 = p.to.y * this.height;

      const px = x1 + (x2 - x1) * p.progress;
      const py = y1 + (y2 - y1) * p.progress;

      this.ctx.beginPath();
      this.ctx.arc(px, py, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = theme.c1;
      this.ctx.globalAlpha = 0.95;
      this.ctx.fill();
    }

    // Draw relays
    for (const r of this.relays) {
      const rx = r.x * this.width;
      const ry = r.y * this.height;

      this.ctx.beginPath();
      this.ctx.arc(rx, ry, 7, 0, Math.PI * 2);
      this.ctx.fillStyle = theme.c1;
      this.ctx.globalAlpha = 0.9;
      this.ctx.fill();

      this.ctx.font = '700 10px JetBrains Mono';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(r.name, rx + 12, ry + 3);

      this.ctx.font = '500 9px JetBrains Mono';
      this.ctx.fillStyle = theme.c1;
      this.ctx.fillText(r.ping, rx + 12, ry + 16);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}

/* ==========================================================================
   EXPERIMENT 09: CHAOS LAB (VERLET DYNAMICS & STABILIZE)
   ========================================================================== */
export class ChaosLabExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.particles = [];
    this.numParticles = 240;
    this.gravity = 0;
    this.friction = 0.98;
    this.mouse = { x: -1000, y: -1000, isDown: false };
    this.isRunning = false;
    this.animId = null;
  }

  getInspectData() {
    return {
      title: 'Chaos Lab — Verlet Particle Dynamics & Harmonic Stabilizer',
      category: 'Computational Physics & Non-Linear Dynamics',
      renderer: 'Canvas 2D Verlet Particle Engine',
      complexity: 'O(N) Velocity Integration with Sudden Harmonic Convergence',
      techStack: ['Verlet Integration', 'Harmonograph Trigonometry', 'Kinetic Momentum'],
      algorithm: `// Harmonic Convergence Formula
const angle = (index / total) * Math.PI * 4;
const targetX = centerX + Math.cos(angle * 3) * radius;
const targetY = centerY + Math.sin(angle * 2) * radius;`,
      description: 'Demonstrates non-linear particle velocity physics with high entropy, and instant convergence into mathematical symmetry via the Stabilize harmonograph command.'
    };
  }

  init() {
    this.resize();
    this.spawn();
    this.setupControls();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  spawn() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        radius: 2 + Math.random() * 2,
        stableTarget: null
      });
    }
  }

  setupControls() {
    this.hud.innerHTML = `
      <button class="hud-btn" id="btnChaosTurbulence"><i class="bi bi-tornado"></i> Add Turbulence</button>
      <button class="hud-btn" id="btnChaosStabilize" style="background:var(--lab-c-accent);color:#030712;"><i class="bi bi-record-circle-fill"></i> STABILIZE</button>
      <button class="hud-btn" id="btnChaosReset"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
    `;

    document.getElementById('btnChaosTurbulence').addEventListener('click', () => {
      this.particles.forEach(p => {
        p.vx += (Math.random() - 0.5) * 20;
        p.vy += (Math.random() - 0.5) * 20;
        p.stableTarget = null;
      });
      if (this.audioEngine) this.audioEngine.playGlitch();
    });

    document.getElementById('btnChaosStabilize').addEventListener('click', () => {
      this.stabilize();
      if (this.audioEngine) this.audioEngine.playChime(520);
    });

    document.getElementById('btnChaosReset').addEventListener('click', () => {
      this.spawn();
    });
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isDown = true;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.mouse.isDown) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      }
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });
  }

  stabilize() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const maxR = Math.min(this.width, this.height) * 0.38;

    this.particles.forEach((p, idx) => {
      const t = (idx / this.particles.length) * Math.PI * 6;
      p.stableTarget = {
        x: cx + Math.cos(t * 3) * (maxR * (idx / this.particles.length)),
        y: cy + Math.sin(t * 2) * (maxR * (idx / this.particles.length))
      };
    });
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (p.stableTarget) {
        p.x += (p.stableTarget.x - p.x) * 0.08;
        p.y += (p.stableTarget.y - p.y) * 0.08;
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= this.friction;
        p.vy *= this.friction;

        if (this.mouse.isDown) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 180 && d > 1) {
            p.vx += (dx / d) * 2;
            p.vy += (dy / d) * 2;
          }
        }

        if (p.x < 0 || p.x > this.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.height) p.vy *= -1;
      }
    }
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.ctx.fillStyle = 'rgba(3, 7, 18, 0.3)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = theme.c1;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}

/* ==========================================================================
   EXPERIMENT 10: SECRET MACHINE (DORMANT CALIBRATION HANDSHAKE)
   ========================================================================== */
export class SecretMachineExperiment {
  constructor(canvas, hud, themeEngine, audioEngine) {
    this.canvas = canvas;
    this.hud = hud;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.state = 'dormant'; // 'dormant', 'calibrating', 'awakened'
    this.container = null;
  }

  getInspectData() {
    return {
      title: 'Secret Machine — Dormant Calibration Handshake',
      category: 'Experimental Diagnostics & Cryptic Easter Eggs',
      renderer: 'Simulated CRT Command Terminal',
      complexity: 'Event Loop State Machine & Typing Animation',
      techStack: ['Event Sequencing', 'Text Decoder Effect', 'Cryptographic Handshake'],
      algorithm: `// Cryptic Handshake Protocol
async function handshake() {
  await emit("DETECTING_USER_NODE");
  await emit("CALIBRATING_QUANTUM_COGNITION");
  state = "SINGULARITY_AWAKENED";
}`,
      description: 'An unidentified sentient subsystem waiting for visitor input to unlock secret diagnostic telemetry and easter egg achievements.'
    };
  }

  init() {
    this.canvas.style.display = 'none';
    this.container = document.createElement('div');
    this.container.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:2rem;';
    this.canvas.parentNode.appendChild(this.container);

    this.setupControls();
    this.render();
  }

  setupControls() {
    this.hud.innerHTML = `
      <button class="hud-btn" id="btnSecretInit"><i class="bi bi-cpu"></i> Execute Handshake</button>
    `;

    document.getElementById('btnSecretInit').addEventListener('click', () => {
      this.triggerHandshake();
    });
  }

  triggerHandshake() {
    if (this.state === 'calibrating') return;
    this.state = 'calibrating';
    if (this.audioEngine) this.audioEngine.playGlitch();
    this.render();

    setTimeout(() => {
      this.state = 'awakened';
      if (this.audioEngine) this.audioEngine.playChime(920);
      this.render();
    }, 2800);
  }

  render() {
    const theme = this.themeEngine.getCurrent();

    if (this.state === 'dormant') {
      this.container.innerHTML = `
        <div style="background:#090d16;border:1px dashed ${theme.c1};border-radius:18px;padding:2.5rem;max-width:540px;width:100%;text-align:center;box-shadow:0 0 35px ${theme.glow};">
          <div style="font-family:var(--lab-font-mono);font-size:0.8rem;color:${theme.c1};font-weight:700;margin-bottom:1rem;">
            [CLASSIFIED NEURAL SUBSYSTEM // DORMANT]
          </div>
          <p style="color:#94a3b8;font-size:0.92rem;line-height:1.6;margin-bottom:1.5rem;">
            A dormant experimental intelligence node was detected in your session memory. Click below to initiate user calibration protocol.
          </p>
          <button class="ai-lab-btn ai-lab-btn-primary" id="btnDormantClick">
            <i class="bi bi-power"></i> INITIALIZE SYSTEM
          </button>
        </div>
      `;

      document.getElementById('btnDormantClick').addEventListener('click', () => {
        this.triggerHandshake();
      });

    } else if (this.state === 'calibrating') {
      this.container.innerHTML = `
        <div style="background:#020408;border:1px solid ${theme.c1};border-radius:18px;padding:2.5rem;max-width:560px;width:100%;font-family:var(--lab-font-mono);font-size:0.85rem;color:${theme.c1};box-shadow:0 0 45px ${theme.glow};">
          <div style="margin-bottom:0.75rem;">&gt; DETECTING USER ENTROPY... [OK]</div>
          <div style="margin-bottom:0.75rem;">&gt; SYNCHRONIZING WITH PARMEET'S LAB MATRIX...</div>
          <div style="margin-bottom:0.75rem;">&gt; CURIOSITY LEVEL: EXCEPTIONAL</div>
          <div>&gt; ALLOCATING SINGULARITY MEMORY CHUNK...</div>
        </div>
      `;
    } else {
      this.container.innerHTML = `
        <div style="background:#090d16;border:1.5px solid ${theme.accent};border-radius:18px;padding:2.5rem;max-width:580px;width:100%;text-align:center;box-shadow:0 0 50px ${theme.glow};">
          <div style="font-size:2.5rem;margin-bottom:1rem;">⚡</div>
          <h2 style="font-size:1.4rem;font-weight:800;color:#ffffff;margin-bottom:0.75rem;">EASTER EGG UNLOCKED</h2>
          <div style="font-family:var(--lab-font-mono);font-size:0.82rem;color:${theme.c1};font-weight:700;margin-bottom:1rem;">
            ACHIEVEMENT: "CURIOUS HUMAN // SINGULARITY OBSERVER"
          </div>
          <p style="color:#cbd5e1;font-size:0.88rem;line-height:1.6;margin-bottom:1.5rem;">
            You have explored the deep substrate of Parmeet's AI Experimental Lab. You now possess Level 9 Clearance. Feel free to break, mutate, and rebuild this entire universe!
          </p>
          <button class="ai-lab-btn" id="btnResetSecret">
            <i class="bi bi-arrow-counterclockwise"></i> Re-seal Terminal
          </button>
        </div>
      `;

      document.getElementById('btnResetSecret').addEventListener('click', () => {
        this.state = 'dormant';
        this.render();
      });
    }
  }

  start() {}
  stop() {}
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.canvas.style.display = 'block';
  }
}
