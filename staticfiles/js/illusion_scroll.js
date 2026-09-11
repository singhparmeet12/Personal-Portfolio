/**
 * LAB EXPERIMENT: THE ILLUSION OF SCROLL (20-ACT FULL-SCREEN IMMERSIVE ENGINE)
 * Full-Page Viewport Environments, 3D Monolith Room Flips, Edge-to-Edge Wipes,
 * and 20 Distinct Creative Motion Archetypes
 */

export class IllusionScrollEngine {
  constructor() {
    this.modal = document.getElementById('illusionScrollModal');
    if (!this.modal) return;

    this.viewport = document.getElementById('illusionViewport');
    this.camera = document.getElementById('illusionCamera');
    this.canvas = document.getElementById('illusionBgCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // HUD & Telemetry
    this.progressPill = document.getElementById('illusionProgressPill');
    this.railFill = document.getElementById('illusionRailFill');
    this.actSelector = document.getElementById('illusionActSelector');

    this.techniqueHUD = document.getElementById('illusionTechniqueHUD');
    this.hudActBadge = document.getElementById('hudActBadge');
    this.hudSkillBadge = document.getElementById('hudSkillBadge');
    this.hudTitle = document.getElementById('hudTitle');
    this.hudDesc = document.getElementById('hudDesc');

    // Calibrated Slower Scroll Sensitivity (3x slower than before)
    this.targetProgress = 0;
    this.progress = 0;
    this.scrollSpeed = 0.000035; // Fine-grained, deliberate scrub
    this.touchStartY = 0;

    // Mouse parallax
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Starfield & Ambient Particles
    this.particles = [];
    this.numParticles = 160;
    this.warpSpeed = 1;

    // Matrix Rain Columns for Act 11
    this.matrixColumns = [];
    this.matrixChars = "010101010101<>[]{}+=*~#$!&^%µΩλ";

    // Constellation Nodes for Act 04
    this.nodes = [];
    this.initConstellationNodes();

    // Clock & Loop
    this.clock = 0;
    this.animId = null;
    this.isRunning = false;

    // 20 Full-Screen Immersive Acts Definitions
    this.acts = [
      {
        id: 1, range: [0.00, 0.05],
        name: "Kinetic Typography Warp",
        skill: "CSS 3D Matrix & Typography",
        benefit: "High-impact cinematic hero titles where letterforms expand beyond screen edges as the camera punches through.",
        bg: ['#04010a', '#180a30', '#00f5ff']
      },
      {
        id: 2, range: [0.05, 0.10],
        name: "Full-Page 3D Monolith Room Flip",
        skill: "3D Spatial Geometry & Projections",
        benefit: "The entire screen revolves 90° horizontally along the Y-axis from a wireframe architectural room into a chromatic core.",
        bg: ['#0d0416', '#ff2bd6', '#ff7a18']
      },
      {
        id: 3, range: [0.10, 0.15],
        name: "Edge-to-Edge Dull-to-Vivid Laser Wipe",
        skill: "Dual-Pane Slicing & Caustics",
        benefit: "Full 100vw × 100vh split curtain: dull monochrome architectural blueprint wiped into radiant neon RGB caustics.",
        bg: ['#080808', '#00f5ff', '#ff2bd6']
      },
      {
        id: 4, range: [0.15, 0.20],
        name: "Sacred Geometry & Constellation Mesh",
        skill: "Vector Splines & Mesh Physics",
        benefit: "Sacred geometric solids morphing on canvas while 50 interconnected vector constellation nodes react to cursor.",
        bg: ['#051508', '#b6ff00', '#22c55e']
      },
      {
        id: 5, range: [0.20, 0.25],
        name: "Panoramic Lateral Speedway",
        skill: "Orthogonal Axis Decoupling",
        benefit: "Vertical scroll translates into rapid horizontal camera tracking across a 250vw panoramic tech freeway.",
        bg: ['#081426', '#38bdf8', '#818cf8']
      },
      {
        id: 6, range: [0.25, 0.30],
        name: "Fullscreen Diagonal Guillotine Fault",
        skill: "Bi-Directional Polygon Shearing",
        benefit: "The entire 100vw screen splits along a -45° seam; top and bottom halves slide apart, revealing molten cybernetic core.",
        bg: ['#12011a', '#ec4899', '#6366f1']
      },
      {
        id: 7, range: [0.30, 0.35],
        name: "3D Origami Spatial OS Unfold",
        skill: "Compound 3D Hinge Kinetics",
        benefit: "4 massive panels unfold from the center outwards to the 4 edges of the viewport like an expanding spatial dashboard.",
        bg: ['#140826', '#a855f7', '#ec4899']
      },
      {
        id: 8, range: [0.35, 0.40],
        name: "Fullscreen Cylindrical Holo-Turbine",
        skill: "Radial 3D Polygonal Drum Projection",
        benefit: "Heavy turbine drum revolving 6 massive curved slats continuously 360° across the upper and lower screen horizons.",
        bg: ['#180315', '#ff2bd6', '#7c3cff']
      },
      {
        id: 9, range: [0.40, 0.45],
        name: "N-Body Gravitational Singularity",
        skill: "High-Density Particle Physics",
        benefit: "250 celestial matter particles orbiting dual shifting gravity wells across every pixel of the display.",
        bg: ['#031020', '#0ea5e9', '#6366f1']
      },
      {
        id: 10, range: [0.45, 0.50],
        name: "Exploded 3D Glassmorphism Desktop",
        skill: "Multi-Tier Parallax Glass Depth",
        benefit: "3 full-bleed frosted glass workspaces separating along the Z-axis with responsive mouse tilt reflection.",
        bg: ['#100524', '#8b5cf6', '#d946ef']
      },
      {
        id: 11, range: [0.50, 0.55],
        name: "Cyberpunk Matrix Rain & Glyph Decoder",
        skill: "Canvas Stream Buffers & CRT FX",
        benefit: "Cascades of luminous green/cyan glyphs pouring down the entire 100vw width with real-time text deciphering.",
        bg: ['#02120a', '#10b981', '#064e3b']
      },
      {
        id: 12, range: [0.55, 0.60],
        name: "Audio-Reactive Polar Oscilloscope",
        skill: "Harmonic Frequency Synthesis",
        benefit: "Massive multi-frequency polar resonance rings pulsating outwards to the window borders.",
        bg: ['#1a0319', '#f43f5e', '#fb923c']
      },
      {
        id: 13, range: [0.60, 0.65],
        name: "Reverse Gravity Inversion Vortex",
        skill: "Coordinate Inversion & Anti-Scroll",
        benefit: "Camera executes an upside-down 180° inversion; gravity flips and ambient embers drift upwards against scroll input.",
        bg: ['#0b031c', '#6366f1', '#a855f7']
      },
      {
        id: 14, range: [0.65, 0.70],
        name: "Infinite Volumetric Hex Warp Tunnel",
        skill: "Infinite Z-Depth Stacking",
        benefit: "Concentric neon hexagonal rings racing past the viewer's peripheral vision at hyper-speed.",
        bg: ['#160212', '#ff2bd6', '#00f5ff']
      },
      {
        id: 15, range: [0.70, 0.75],
        name: "Viscous Magnetic Ferrofluid Simulation",
        skill: "Procedural Organic Blob Caustics",
        benefit: "Deep liquid ferrofluid spikes stretching dynamically towards cursor and vibrating with scroll velocity.",
        bg: ['#020d18', '#0284c7', '#38bdf8']
      },
      {
        id: 16, range: [0.75, 0.80],
        name: "Retro CRT Phosphor Scanline Glitch",
        skill: "Post-Processing Shader Emulation",
        benefit: "Full-screen scanlines, barrel distortion, RGB subpixel chromatic aberration, and holographic CRT interference.",
        bg: ['#110114', '#ec4899', '#00f5ff']
      },
      {
        id: 17, range: [0.80, 0.85],
        name: "Isometric Blueprint City Elevation",
        skill: "3D Wireframe Architectural Mesh",
        benefit: "3D wireframe digital buildings elevating from a Tron-style perspective grid floor into the sky.",
        bg: ['#031024', '#00f5ff', '#38bdf8']
      },
      {
        id: 18, range: [0.85, 0.90],
        name: "Reality Detonation & Glass Shatter",
        skill: "Polygonal Fragment Velocity Physics",
        benefit: "The entire viewport glass plaque shatters into 24 flying 3D shards exploding toward the viewer.",
        bg: ['#140212', '#ff2bd6', '#ec4899']
      },
      {
        id: 19, range: [0.90, 0.95],
        name: "Hyperspace Singularity & Event Horizon",
        skill: "Volumetric Accretion Disk Physics",
        benefit: "Cosmic black hole event horizon bending light and drawing all particles into a central gravitational singularity.",
        bg: ['#05010a', '#a855f7', '#00f5ff']
      },
      {
        id: 20, range: [0.95, 1.00],
        name: "Luminous Dawn Horizon & Skills Hub",
        skill: "Atmospheric Light Bloom & Conversion",
        benefit: "The entire environment transitions from deep cosmos into radiant daylight sunrise, presenting core skills and contact CTA.",
        bg: ['#f8fafc', '#f1f5f9', '#7c3cff']
      }
    ];

    this.currentActIndex = 0;
    this.init();
  }

  init() {
    this.resize();
    this.initParticles();
    this.initMatrixRain();
    this.bindEvents();
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    this.initMatrixRain();
  }

  initParticles() {
    this.particles = [];
    const colors = ['#00f5ff', '#ff2bd6', '#b6ff00', '#ffffff', '#818cf8'];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * (this.width || 1440),
        y: Math.random() * (this.height || 900),
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 1.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  initConstellationNodes() {
    this.nodes = [];
    for (let i = 0; i < 45; i++) {
      this.nodes.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 500,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 3 + 2
      });
    }
  }

  initMatrixRain() {
    const colCount = Math.floor((this.width || 1440) / 24);
    this.matrixColumns = [];
    for (let i = 0; i < colCount; i++) {
      this.matrixColumns.push({
        x: i * 24,
        y: Math.random() * -600,
        speed: 4 + Math.random() * 8
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize(), { passive: true });

    if (this.viewport) {
      // Wheel scrub with fine-grained damping
      this.viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + e.deltaY * this.scrollSpeed));
      }, { passive: false });

      // Touch drag for mobile
      this.viewport.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          this.touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      this.viewport.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const deltaY = this.touchStartY - e.touches[0].clientY;
          this.touchStartY = e.touches[0].clientY;
          this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + deltaY * 0.00015));
        }
      }, { passive: true });

      // Mouse move parallax
      this.viewport.addEventListener('mousemove', (e) => {
        this.mouse.targetX = (e.clientX / (this.width || 1) - 0.5) * 40;
        this.mouse.targetY = (e.clientY / (this.height || 1) - 0.5) * 40;
      }, { passive: true });
    }

    // Keyboard Arrow Keys Navigation (calibrated fine steps)
    window.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;

      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.targetProgress = Math.min(1, this.targetProgress + 0.005);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.targetProgress = Math.max(0, this.targetProgress - 0.005);
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        this.targetProgress = Math.min(1, this.targetProgress + 0.05);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        this.targetProgress = Math.max(0, this.targetProgress - 0.05);
      } else if (e.key === 'Home') {
        this.targetProgress = 0;
      } else if (e.key === 'End') {
        this.targetProgress = 1;
      }
    });

    // Act Selector in Top Bar
    if (this.actSelector) {
      this.actSelector.addEventListener('change', (e) => {
        const actNum = parseInt(e.target.value, 10);
        this.jumpToAct(actNum, true);
      });
    }

    // Rail Chapter Ticks click-to-jump
    const ticks = document.querySelectorAll('.rail-tick');
    ticks.forEach((tick) => {
      tick.addEventListener('click', (e) => {
        e.stopPropagation();
        const actNum = parseInt(tick.getAttribute('data-act'), 10);
        this.jumpToAct(actNum, true);
      });
    });

    // Action buttons in Act 20
    const btnReset = document.getElementById('btnIllusionRunAgain');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.resetToStart();
      });
    }

    const btnBackLab = document.getElementById('btnIllusionBackLab');
    if (btnBackLab) {
      btnBackLab.addEventListener('click', () => {
        window.closeIllusionScrollModal();
      });
    }
  }

  jumpToAct(actNumber, immediate = false) {
    const act = this.acts.find(a => a.id === actNumber);
    if (act) {
      this.targetProgress = (act.range[0] + act.range[1]) / 2;
      if (immediate) {
        this.progress = this.targetProgress;
        this.updateCamera();
      }
    }
  }

  updateCamera() {
    this.clock += 0.02;
    const lerp = 0.045; // Silky physical inertia
    this.progress += (this.targetProgress - this.progress) * lerp;
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    const p = Math.max(0, Math.min(1, this.progress));
    const pct = Math.round(p * 100);

    if (this.progressPill) {
      this.progressPill.textContent = `${pct}% TRANSIT`;
    }
    if (this.railFill) {
      this.railFill.style.height = `${pct}%`;
    }

    // Determine Active Act (1 to 20)
    let activeAct = this.acts[0];
    for (let i = 0; i < this.acts.length; i++) {
      if (p >= this.acts[i].range[0] && p <= this.acts[i].range[1]) {
        activeAct = this.acts[i];
        break;
      }
    }
    this.currentActIndex = activeAct.id - 1;

    // Update Floating Technique HUD
    if (this.hudActBadge) this.hudActBadge.textContent = `ACT ${String(activeAct.id).padStart(2, '0')} // 20`;
    if (this.hudSkillBadge) this.hudSkillBadge.textContent = activeAct.skill;
    if (this.hudTitle) this.hudTitle.textContent = activeAct.name;
    if (this.hudDesc) this.hudDesc.textContent = activeAct.benefit;

    // Update Top Bar Dropdown
    if (this.actSelector && this.actSelector.value != activeAct.id) {
      this.actSelector.value = activeAct.id;
    }

    // Update Rail Tick Active States
    document.querySelectorAll('.rail-tick').forEach((tick) => {
      const actId = parseInt(tick.getAttribute('data-act'), 10);
      if (actId === activeAct.id) {
        tick.classList.add('active');
      } else {
        tick.classList.remove('active');
      }
    });

    // ------------------------------------------------------------------------
    // RENDER EACH OF THE 20 FULL-SCREEN ACTS
    // ------------------------------------------------------------------------

    // Act 01: Kinetic Typography Warp (0.00 -> 0.05)
    this.renderScene(1, 0.00, 0.05, (prog, el) => {
      const title = el.querySelector('.inscription-title');
      const sub = el.querySelector('.inscription-sub');
      const ty = -prog * 35;
      const opacity = Math.max(0, 1 - prog * 1.5);
      const letterSpacing = 0.01 + prog * 0.06;
      if (title) {
        title.style.transform = `translate3d(0, ${ty}px, 0)`;
        title.style.letterSpacing = `${letterSpacing}em`;
        title.style.opacity = opacity;
      }
      if (sub) {
        sub.style.transform = `translate3d(0, ${ty * 0.6}px, 0)`;
        sub.style.opacity = opacity;
      }
    });

    // Act 02: Full-Page 3D Monolith Room 90° Flip (0.05 -> 0.10)
    this.renderScene(2, 0.05, 0.10, (prog, el) => {
      const box = document.getElementById('roomBox3D');
      const rotY = prog * -90; // Exact 90-degree horizontal room flip
      const rotX = Math.sin(prog * Math.PI) * 4 + this.mouse.y * 0.15;
      if (box) {
        box.style.transform = `translateZ(-190px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.opacity = opacity;
      el.style.transform = 'translate3d(0, 0, 0)';
    });

    // Act 03: Edge-to-Edge Dull-to-Vivid Laser Curtain Wipe (0.10 -> 0.15)
    this.renderScene(3, 0.10, 0.15, (prog, el) => {
      const vividPane = document.getElementById('wipeVividPaneFull');
      const laser = document.getElementById('wipeLaserFull');
      const pct = prog * 100;
      if (vividPane) {
        vividPane.style.clipPath = `inset(0 0 0 ${pct}%)`;
      }
      if (laser) {
        laser.style.left = `${pct}%`;
      }
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.opacity = opacity;
      el.style.transform = 'translate3d(0, 0, 0)';
    });

    // Act 04: Sacred Geometry & Constellation Node Mesh (0.15 -> 0.20)
    this.renderScene(4, 0.15, 0.20, (prog, el) => {
      const rotZ = prog * 90;
      const ty = (1 - Math.sin(prog * Math.PI)) * 18;
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = `translate3d(0, ${ty}px, 0) rotateZ(${rotZ}deg)`;
      el.style.opacity = opacity;
      this.updateSVGMorph(prog);
    });

    // Act 05: Panoramic Lateral Speedway (0.20 -> 0.25)
    this.renderScene(5, 0.20, 0.25, (prog, el) => {
      const track = document.getElementById('conveyorSpeedwayTrack');
      if (track) {
        const shiftX = 320 - prog * 980;
        track.style.transform = `translate3d(${shiftX}px, 0, 0)`;
      }
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = opacity;
    });

    // Act 06: Fullscreen Diagonal Guillotine Fault (0.25 -> 0.30)
    this.renderScene(6, 0.25, 0.30, (prog, el) => {
      const topHalf = document.getElementById('guillotineTop');
      const btmHalf = document.getElementById('guillotineBottom');
      const shearDist = Math.sin(prog * Math.PI) * 80;
      if (topHalf) {
        topHalf.style.transform = `translate3d(${-shearDist}px, ${-shearDist * 0.6}px, 0)`;
      }
      if (btmHalf) {
        btmHalf.style.transform = `translate3d(${shearDist}px, ${shearDist * 0.6}px, 0)`;
      }
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = opacity;
    });

    // Act 07: 3D Origami Spatial OS Unfold (0.30 -> 0.35)
    this.renderScene(7, 0.30, 0.35, (prog, el) => {
      const pTop = document.getElementById('origamiPanelTop');
      const pBtm = document.getElementById('origamiPanelBottom');
      const pLft = document.getElementById('origamiPanelLeft');
      const pRgt = document.getElementById('origamiPanelRight');

      const unfoldAngle = (1 - prog) * 90;
      if (pTop) pTop.style.transform = `rotateX(${unfoldAngle}deg)`;
      if (pBtm) pBtm.style.transform = `rotateX(${-unfoldAngle}deg)`;
      if (pLft) pLft.style.transform = `rotateY(${-unfoldAngle}deg)`;
      if (pRgt) pRgt.style.transform = `rotateY(${unfoldAngle}deg)`;

      const rotX = 10 - prog * 6 + this.mouse.y * 0.15;
      const rotY = -8 + prog * 16 + this.mouse.x * 0.15;
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = `translate3d(0, 0, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      el.style.opacity = opacity;
    });

    // Act 08: Fullscreen Cylindrical Holo-Turbine (0.35 -> 0.40)
    this.renderScene(8, 0.35, 0.40, (prog, el) => {
      const drum = document.getElementById('turbineDrum');
      if (drum) {
        const rotX = prog * 360;
        drum.style.transform = `translateZ(-120px) rotateX(${rotX}deg)`;
      }
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = opacity;
    });

    // Act 09: N-Body Gravitational Singularity (0.40 -> 0.45)
    this.renderScene(9, 0.40, 0.45, (prog, el) => {
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = opacity;
    });

    // Act 10: Exploded 3D Glassmorphism Desktop (0.45 -> 0.50)
    this.renderScene(10, 0.45, 0.50, (prog, el) => {
      const p1 = document.getElementById('glassPlate1');
      const p2 = document.getElementById('glassPlate2');
      const p3 = document.getElementById('glassPlate3');

      const sep = 20 + prog * 35;
      if (p1) p1.style.transform = `translate3d(0, ${-85 - sep * 0.3}px, ${sep * 0.4}px)`;
      if (p2) p2.style.transform = `translate3d(0, 0, 0)`;
      if (p3) p3.style.transform = `translate3d(0, ${85 + sep * 0.3}px, ${-sep * 0.4}px)`;

      const rotY = this.mouse.x * 0.15;
      const rotX = -this.mouse.y * 0.15;
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = `translate3d(0, 0, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      el.style.opacity = opacity;
    });

    // Act 11: Cyberpunk Matrix Rain & Glyph Decoder (0.50 -> 0.55)
    this.renderScene(11, 0.50, 0.55, (prog, el) => {
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = opacity;
      this.updateMatrixDecoder(prog);
    });

    // Act 12: Audio-Reactive Polar Oscilloscope (0.55 -> 0.60)
    this.renderScene(12, 0.55, 0.60, (prog, el) => {
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = opacity;
    });

    // Act 13: Reverse Gravity Inversion Vortex (0.60 -> 0.65)
    this.renderScene(13, 0.60, 0.65, (prog, el) => {
      const ty = -Math.sin(prog * Math.PI) * 35;
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = `translate3d(0, ${ty}px, 0)`;
      el.style.opacity = opacity;
    });

    // Act 14: Infinite Volumetric Hex Warp Tunnel (0.65 -> 0.70)
    this.renderScene(14, 0.65, 0.70, (prog, el) => {
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.opacity = opacity;
      el.style.transform = 'translate3d(0, 0, 0)';
      this.updateHexTunnel(prog);
    });

    // Act 15: Viscous Liquid Ferrofluid Simulation (0.70 -> 0.75)
    this.renderScene(15, 0.70, 0.75, (prog, el) => {
      const rotY = this.mouse.x * 0.2;
      const rotX = -this.mouse.y * 0.2;
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = `translate3d(0, 0, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      el.style.opacity = opacity;
    });

    // Act 16: Retro CRT Phosphor Scanline Glitch (0.75 -> 0.80)
    this.renderScene(16, 0.75, 0.80, (prog, el) => {
      const jitterX = (Math.random() - 0.5) * 2.5;
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = `translate3d(${jitterX}px, 0, 0)`;
      el.style.opacity = opacity;
    });

    // Act 17: Isometric Wireframe Blueprint City (0.80 -> 0.85)
    this.renderScene(17, 0.80, 0.85, (prog, el) => {
      const towers = el.querySelectorAll('.isocity-tower');
      towers.forEach((tw, i) => {
        const heightLift = Math.min(1, prog * 1.5) * (30 + i * 18);
        tw.style.transform = `translateZ(${heightLift}px)`;
      });
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = 'translate3d(0, 0, 0)';
      el.style.opacity = opacity;
    });

    // Act 18: Reality Detonation & Glass Shatter (0.85 -> 0.90)
    this.renderScene(18, 0.85, 0.90, (prog, el) => {
      const shards = el.querySelectorAll('.shatter-shard-full');
      let opacity = 1;

      if (prog < 0.35) {
        opacity = prog / 0.25;
        shards.forEach((s) => {
          s.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
          s.style.opacity = '1';
        });
        this.warpSpeed = 1;
      } else {
        const blast = (prog - 0.35) / 0.65;
        shards.forEach((s) => {
          const dx = parseFloat(s.getAttribute('data-dx') || '0') * blast * 160;
          const dy = parseFloat(s.getAttribute('data-dy') || '0') * blast * 160;
          const r = parseFloat(s.getAttribute('data-rot') || '0') * blast * 0.4;
          s.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${r}deg)`;
          s.style.opacity = Math.max(0, 1 - blast * 1.2);
        });
        opacity = 1 - blast;
        this.warpSpeed = 1 + blast * 4;
      }

      el.style.transform = `translate3d(0, 0, 0)`;
      el.style.opacity = Math.max(0, Math.min(1, opacity));
    });

    // Act 19: Hyperspace Singularity & Event Horizon (0.90 -> 0.95)
    this.renderScene(19, 0.90, 0.95, (prog, el) => {
      const opacity = Math.min(1, Math.sin(prog * Math.PI) * 2.2);
      el.style.transform = `translate3d(0, 0, 0)`;
      el.style.opacity = opacity;
      this.warpSpeed = 1.5 + prog * 4;
    });

    // Act 20: Luminous Dawn Horizon & Master Skills Hub (0.95 -> 1.00)
    this.renderScene(20, 0.95, 1.00, (prog, el) => {
      const ty = (1 - prog) * 20;
      const opacity = Math.min(1, prog * 2.5);
      el.style.transform = `translate3d(0, ${ty}px, 0)`;
      el.style.opacity = opacity;
      this.warpSpeed = 0.5;
    });

    // Subtle global camera tilting
    if (this.camera) {
      this.camera.style.transform = `rotateX(${-this.mouse.y * 0.1}deg) rotateY(${this.mouse.x * 0.1}deg)`;
    }
  }

  renderScene(actNum, startRange, endRange, transformCallback) {
    const el = document.getElementById(`illusionScene${actNum}`);
    if (!el) return;

    const p = this.progress;
    const buffer = 0.012;
    if (p >= startRange - buffer && p <= endRange + buffer) {
      el.style.display = 'flex';
      const prog = Math.max(0, Math.min(1, (p - startRange) / (endRange - startRange)));
      transformCallback(prog, el);
    } else {
      el.style.display = 'none';
    }
  }

  // --------------------------------------------------------------------------
  // SPECIALIZED ANIMATION HANDLERS
  // --------------------------------------------------------------------------
  updateSVGMorph(prog) {
    const pathEl = document.getElementById('morphPathFull');
    if (!pathEl) return;

    const p1 = "M 140 30 C 200 30 250 80 250 140 C 250 200 200 250 140 250 C 80 250 30 200 30 140 C 30 80 80 30 140 30 Z";
    const p2 = "M 140 20 L 250 85 L 250 195 L 140 260 L 30 195 L 30 85 Z";
    const p3 = "M 140 10 L 260 140 L 140 270 L 20 140 Z";

    if (prog < 0.33) {
      pathEl.setAttribute('d', p1);
    } else if (prog < 0.66) {
      pathEl.setAttribute('d', p2);
    } else {
      pathEl.setAttribute('d', p3);
    }
  }

  updateMatrixDecoder(prog) {
    const textEl = document.getElementById('matrixDecodeTextFull');
    if (!textEl) return;

    const targetWords = ["ADVANCED ARCHITECTURE", "WEBGL & CREATIVE CODE", "20-ACT FULLPAGE MASTERCLASS"];
    const target = targetWords[Math.min(targetWords.length - 1, Math.floor(prog * targetWords.length))];
    const chars = "!<>-_\\/[]{}—=+*^?#________01";

    const resolvedLength = Math.floor(prog * target.length);
    let output = "";
    for (let i = 0; i < target.length; i++) {
      if (i < resolvedLength) {
        output += target[i];
      } else {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    textEl.textContent = output;
  }

  updateHexTunnel(prog) {
    const frames = document.querySelectorAll('.hex-ring');
    frames.forEach((frame, idx) => {
      const offset = (idx * 140 + prog * 1600) % 900;
      const tz = -900 + offset;
      const rotZ = idx * 20 + prog * 120;
      const scale = 0.25 + (offset / 900) * 0.85;
      const opacity = Math.sin((offset / 900) * Math.PI);
      frame.style.transform = `translate3d(0, 0, ${tz}px) rotateZ(${rotZ}deg) scale3d(${scale}, ${scale}, 1)`;
      frame.style.opacity = opacity;
    });
  }

  // --------------------------------------------------------------------------
  // FULL-PAGE CANVAS ENVIRONMENT ENGINE
  // --------------------------------------------------------------------------
  drawBackground() {
    if (!this.ctx) return;
    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;
    const p = this.progress;

    const act = this.acts[this.currentActIndex] || this.acts[0];
    const [c1, c2, c3] = act.bg;

    // Act 03: Fullscreen Split Background (Dull Grayscale vs Neon Aurora)
    if (act.id === 3) {
      const actProg = Math.max(0, Math.min(1, (p - act.range[0]) / (act.range[1] - act.range[0])));
      const laserX = actProg * w;

      // Left Side: Dull Grayscale Blueprint
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, laserX, h);
      ctx.clip();
      ctx.fillStyle = '#12151a';
      ctx.fillRect(0, 0, w, h);

      // Blueprint grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // Right Side: Vivid Saturated Aurora Caustics
      ctx.save();
      ctx.beginPath();
      ctx.rect(laserX, 0, w - laserX, h);
      ctx.clip();
      const grad = ctx.createRadialGradient(
        w * 0.7 + this.mouse.x * 3,
        h * 0.4 + this.mouse.y * 3,
        20,
        w * 0.7,
        h * 0.4,
        Math.max(w, h) * 0.8
      );
      grad.addColorStop(0, '#ff2bd6');
      grad.addColorStop(0.4, '#00f5ff');
      grad.addColorStop(0.8, '#160228');
      grad.addColorStop(1, '#05010c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      return;
    }

    // Act 20: Luminous Dawn Sunrise Atmosphere
    if (act.id === 20) {
      const dawnGrad = ctx.createLinearGradient(0, 0, 0, h);
      dawnGrad.addColorStop(0, '#e0f2fe');
      dawnGrad.addColorStop(0.5, '#f8fafc');
      dawnGrad.addColorStop(1, '#fed7aa');
      ctx.fillStyle = dawnGrad;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    // Default Dynamic Radial Gradient Environment
    const grad = ctx.createRadialGradient(
      w / 2 + this.mouse.x * 2.5,
      h / 2 + this.mouse.y * 2.5,
      20,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.85
    );
    grad.addColorStop(0, c2);
    grad.addColorStop(0.65, c1);
    grad.addColorStop(1, '#020008');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Act 02: 3D Perspective Floor Grid
    if (act.id === 2) {
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.12)';
      ctx.lineWidth = 1;
      const cy = h * 0.65;
      for (let x = -w; x <= w * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(w / 2, cy);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = cy; y <= h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    // Act 11: Real-time Matrix Rain
    if (act.id === 11) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
      ctx.font = '14px monospace';
      for (let i = 0; i < this.matrixColumns.length; i++) {
        const col = this.matrixColumns[i];
        const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
        ctx.fillText(char, col.x, col.y);
        col.y += col.speed;
        if (col.y > h) {
          col.y = Math.random() * -100;
        }
      }
    }

    // Act 12: Polar Harmonic Waveforms
    if (act.id === 12) {
      ctx.lineWidth = 2.5;
      const rings = 4;
      for (let r = 0; r < rings; r++) {
        ctx.beginPath();
        ctx.strokeStyle = ['#ff2bd6', '#00f5ff', '#fb923c', '#b6ff00'][r];
        const baseR = 120 + r * 60;
        for (let theta = 0; theta <= Math.PI * 2; theta += 0.05) {
          const harmonic = Math.sin(theta * 6 + this.clock * 3 + r) * 20;
          const radius = baseR + harmonic;
          const px = w / 2 + Math.cos(theta) * radius;
          const py = h / 2 + Math.sin(theta) * radius;
          if (theta === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Act 19: Wormhole Accretion Disk Swirl
    if (act.id === 19) {
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(this.clock * 0.8);
      ctx.lineWidth = 1.5;
      for (let ring = 0; ring < 6; ring++) {
        ctx.beginPath();
        ctx.strokeStyle = ring % 2 === 0 ? '#ff2bd6' : '#00f5ff';
        ctx.arc(0, 0, 80 + ring * 40, 0, Math.PI * 1.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Starfield & Warp Particles across entire display
    const speed = this.warpSpeed;
    ctx.lineWidth = 1.4;
    for (let i = 0; i < this.particles.length; i++) {
      const pt = this.particles[i];
      pt.y -= pt.speed * speed;
      if (pt.y < 0) pt.y = h;

      ctx.beginPath();
      if (speed > 3) {
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x, pt.y - speed * 6);
        ctx.strokeStyle = pt.color;
        ctx.globalAlpha = 0.85;
        ctx.stroke();
      } else {
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = 0.55;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }

  loop() {
    if (!this.isRunning) return;
    this.updateCamera();
    this.drawBackground();
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
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  get active() {
    return this.isRunning;
  }

  resetToStart() {
    this.targetProgress = 0;
    this.progress = 0;
  }

  reset() {
    this.resetToStart();
  }
}

// Global Modal Controller Registry
let illusionInstance = null;

export function getIllusionEngine() {
  if (!illusionInstance) {
    illusionInstance = new IllusionScrollEngine();
    window.illusionEngine = illusionInstance;
  }
  return illusionInstance;
}

window.getIllusionEngine = getIllusionEngine;
window.initIllusionScroll = getIllusionEngine;

window.openIllusionScrollModal = function() {
  const modal = document.getElementById('illusionScrollModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const engine = getIllusionEngine();
    engine.resize();
    engine.start();
  }
};

window.closeIllusionScrollModal = function() {
  const modal = document.getElementById('illusionScrollModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (illusionInstance) {
      illusionInstance.stop();
    }
  }
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      getIllusionEngine();
    });
  } else {
    getIllusionEngine();
  }
}

