/**
 * AI EXPERIMENTAL LAB — CONSTELLATION GALAXY MAP
 * Interactive orbital network of experiment nodes with dynamic physics filaments,
 * drag-and-reposition capability, orbital satellites, and click-to-launch transitions.
 */
export const EXPERIMENTS_REGISTRY = [
  {
    id: 'neural-flow',
    number: 'EXP 01',
    title: 'Neural Flow',
    badge: 'Synaptic Network',
    desc: 'Force-directed graph simulating signal latency, threshold activation, and node propagation.',
    tech: 'Canvas 2D • Spring Physics • O(V+E)',
    initialPos: { x: 0.22, y: 0.28 },
    status: 'ONLINE'
  },
  {
    id: 'prompt-alchemy',
    number: 'EXP 02',
    title: 'Prompt Alchemy',
    badge: 'Token Reaction',
    desc: 'Mix chemical prompt tokens into an interactive beaker to calculate emergent Prompt DNA.',
    tech: 'DOM Drag • Vector Token Matrix • State Engine',
    initialPos: { x: 0.48, y: 0.18 },
    status: 'ONLINE'
  },
  {
    id: 'dream-machine',
    number: 'EXP 03',
    title: 'AI Dream Machine',
    badge: 'Generative Canvas',
    desc: 'Procedural fractal entropy generator with real-time mutations and visual generational history.',
    tech: 'Perlin Noise • Fractal Recursion • Pixel Canvas',
    initialPos: { x: 0.78, y: 0.26 },
    status: 'ONLINE'
  },
  {
    id: 'agent-mind',
    number: 'EXP 04',
    title: 'Agent Mind',
    badge: 'Thought DAG',
    desc: 'Interactive DAG thought pipeline simulating multi-stage reasoning and reflection flows.',
    tech: 'DAG Architecture • State Machine • Bezier Routing',
    initialPos: { x: 0.18, y: 0.58 },
    status: 'ONLINE'
  },
  {
    id: 'vision-playground',
    number: 'EXP 05',
    title: 'Computer Vision',
    badge: 'Local Filter Matrix',
    desc: 'Real-time client-side image convolution: Sobel edge detection, ASCII matrix, and chromatic scan.',
    tech: 'Canvas ImageData • Pixel Convolution • 100% Client-Side',
    initialPos: { x: 0.50, y: 0.50 },
    status: 'ONLINE'
  },
  {
    id: 'sound-visualizer',
    number: 'EXP 06',
    title: 'Sound → Visual AI',
    badge: 'Audio Resonance',
    desc: 'Web Audio frequency spectrum analyzer responding to live mic or procedural synthetic harmonics.',
    tech: 'Web Audio API • Fast Fourier Transform (FFT) • Polar Oscillations',
    initialPos: { x: 0.82, y: 0.55 },
    status: 'ONLINE'
  },
  {
    id: 'generative-type',
    number: 'EXP 07',
    title: 'Generative Typography',
    badge: 'Kinetic Physics',
    desc: 'Dynamic typography converted into spring particles that react to cursor velocity and zero-g.',
    tech: 'Offscreen Raster • Verlet Springs • Velocity Force Fields',
    initialPos: { x: 0.32, y: 0.80 },
    status: 'ONLINE'
  },
  {
    id: 'signal-map',
    number: 'EXP 08',
    title: 'AI Signal Map',
    badge: 'Global Telemetry',
    desc: 'Orbital satellite communication mesh with real-time packet routing and cluster inspection.',
    tech: 'Spherical Geometry • Latency Matrix • Packet Stream Simulation',
    initialPos: { x: 0.65, y: 0.78 },
    status: 'ONLINE'
  },
  {
    id: 'chaos-lab',
    number: 'EXP 09',
    title: 'Chaos Lab',
    badge: 'Particle Dynamics',
    desc: 'High-speed particle physics sandbox with friction, turbulence, and an instant Stabilize snap.',
    tech: 'Verlet Dynamics • Collision Grid • Harmonograph Convergence',
    initialPos: { x: 0.88, y: 0.85 },
    status: 'ONLINE'
  },
  {
    id: 'secret-machine',
    number: 'EXP 10',
    title: 'Secret Machine',
    badge: 'Dormant System',
    desc: 'Unidentified neural mainframe waiting for calibration handshake and singularity test.',
    tech: 'Terminal Handshake • Cryptic Sequence • Easter Egg Engine',
    initialPos: { x: 0.08, y: 0.88 },
    status: 'DORMANT'
  }
];

export class ConstellationGalaxyMap {
  constructor(viewportEl, canvasEl, overlayEl, themeEngine, audioEngine, onSelectExperiment) {
    this.viewport = viewportEl;
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.overlay = overlayEl;
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;
    this.onSelect = onSelectExperiment;

    this.nodes = [];
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = 0;
    this.height = 0;
    this.animId = null;

    this.activeDragNode = null;
    this.dragOffset = { x: 0, y: 0 };
    this.panOffset = { x: 0, y: 0 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.resize();
    this.spawnNodes();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.viewport.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || 680;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  spawnNodes() {
    this.overlay.innerHTML = '';
    this.nodes = EXPERIMENTS_REGISTRY.map((data) => {
      const x = data.initialPos.x * this.width;
      const y = data.initialPos.y * this.height;

      // Create DOM element for node card
      const el = document.createElement('div');
      el.className = 'galaxy-node-item';
      el.setAttribute('data-id', data.id);
      el.setAttribute('data-cursor', data.id === 'secret-machine' ? 'secret' : 'explore');
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      el.innerHTML = `
        <div class="galaxy-node-card">
          <div class="galaxy-node-badge">
            <span class="node-dot"></span>
            <span>${data.number} • ${data.badge}</span>
          </div>
          <h3 class="galaxy-node-title">${data.title}</h3>
          <p class="galaxy-node-snippet">${data.desc}</p>
          <div class="galaxy-node-footer">
            <span>${data.status}</span>
            <span class="galaxy-node-cta">Launch <i class="bi bi-arrow-right-short"></i></span>
          </div>
        </div>
      `;

      // Node card click triggers experiment theatre
      el.addEventListener('click', (e) => {
        if (this.audioEngine) this.audioEngine.playChime(640);
        if (typeof this.onSelect === 'function') {
          this.onSelect(data);
        }
      });

      this.overlay.appendChild(el);

      return {
        ...data,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        baseX: x,
        baseY: y,
        el,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: 0.008 + Math.random() * 0.012,
        orbitRadius: 18 + Math.random() * 24
      };
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.nodes.forEach(n => {
        n.x = n.initialPos.x * this.width;
        n.y = n.initialPos.y * this.height;
      });
    }, { passive: true });

    // Node Dragging on Desktop & Touch
    this.overlay.addEventListener('mousedown', (e) => {
      const nodeEl = e.target.closest('.galaxy-node-item');
      if (nodeEl) {
        const id = nodeEl.getAttribute('data-id');
        this.activeDragNode = this.nodes.find(n => n.id === id);
        if (this.activeDragNode) {
          this.dragOffset.x = e.clientX - this.activeDragNode.x;
          this.dragOffset.y = e.clientY - this.activeDragNode.y;
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.activeDragNode) {
        const rect = this.viewport.getBoundingClientRect();
        this.activeDragNode.x = e.clientX - rect.left;
        this.activeDragNode.y = e.clientY - rect.top;
      }
    }, { passive: true });

    window.addEventListener('mouseup', () => {
      this.activeDragNode = null;
    });
  }

  update() {
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];

      // Gentle organic orbital float when not dragging
      if (n !== this.activeDragNode) {
        n.orbitAngle += n.orbitSpeed;
        const targetX = n.baseX + Math.cos(n.orbitAngle) * n.orbitRadius;
        const targetY = n.baseY + Math.sin(n.orbitAngle) * (n.orbitRadius * 0.7);

        n.x += (targetX - n.x) * 0.05;
        n.y += (targetY - n.y) * 0.05;
      }

      // Update DOM element position
      n.el.style.left = `${n.x}px`;
      n.el.style.top = `${n.y}px`;
    }
  }

  draw() {
    const theme = this.themeEngine.getCurrent();
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Constellation Filaments between neighboring nodes
    this.ctx.lineWidth = 1.2;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

        if (dist < 320) {
          const alpha = (1 - dist / 320) * 0.55;
          const grad = this.ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
          grad.addColorStop(0, theme.c1);
          grad.addColorStop(1, theme.c2);

          this.ctx.strokeStyle = grad;
          this.ctx.globalAlpha = alpha;
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);

          // Subtle bezier curve for organic feeling
          const midX = (n1.x + n2.x) / 2 + Math.sin(n1.orbitAngle) * 15;
          const midY = (n1.y + n2.y) / 2 + Math.cos(n2.orbitAngle) * 15;
          this.ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);
          this.ctx.stroke();

          // Data packet traveling along connection
          const packetT = ((Date.now() / 1200) + (i * 0.2)) % 1;
          const px = (1 - packetT) * (1 - packetT) * n1.x + 2 * (1 - packetT) * packetT * midX + packetT * packetT * n2.x;
          const py = (1 - packetT) * (1 - packetT) * n1.y + 2 * (1 - packetT) * packetT * midY + packetT * packetT * n2.y;

          this.ctx.beginPath();
          this.ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          this.ctx.fillStyle = theme.accent;
          this.ctx.globalAlpha = alpha * 1.5;
          this.ctx.fill();
        }
      }
    }

    // Draw Orbital Satellite rings around each node anchor
    for (const n of this.nodes) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
      this.ctx.fillStyle = theme.c1;
      this.ctx.globalAlpha = 0.8;
      this.ctx.fill();

      // Pulsing outer orbit ring
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 16 + Math.sin(n.orbitAngle * 2) * 4, 0, Math.PI * 2);
      this.ctx.strokeStyle = theme.c2;
      this.ctx.lineWidth = 1;
      this.ctx.globalAlpha = 0.3;
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.ctx.globalAlpha = 1.0;
  }

  loop() {
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.animId) this.loop();
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  destroy() {
    this.stop();
  }
}
