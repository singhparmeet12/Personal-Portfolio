/**
 * AI EXPERIMENTAL LAB — HERO LIVING COMPUTATIONAL FIELD
 * Particle network simulating neural constellations with pointer gravity,
 * fluid velocity, and click impulse shockwaves.
 */
export class HeroFieldCanvas {
  constructor(canvasEl, themeEngine, audioEngine) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.themeEngine = themeEngine;
    this.audioEngine = audioEngine;

    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.particles = [];
    this.numParticles = 140;
    this.maxDistance = 110;

    this.mouse = { x: -1000, y: -1000, radius: 160, isDown: false };
    this.shockwaves = [];
    this.chaos = 0.2;
    this.animId = null;
    this.isRunning = false;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || 560;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Dynamic count based on viewport width
    if (this.width < 768) {
      this.numParticles = 65;
      this.maxDistance = 80;
    } else {
      this.numParticles = 135;
      this.maxDistance = 120;
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 1.1,
        vy: (Math.random() - 0.5) * 1.1,
        baseRadius: 1.5 + Math.random() * 2,
        radius: 1.5 + Math.random() * 2,
        energy: Math.random(),
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    }, { passive: true });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    }, { passive: true });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Touch support for mobile devices
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.touches[0].clientX - rect.left;
        this.mouse.y = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // CLICK -> IMPULSE
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.triggerImpulse(x, y);
    });
  }

  triggerImpulse(x, y) {
    this.shockwaves.push({
      x: x || this.width / 2,
      y: y || this.height / 2,
      radius: 5,
      maxRadius: Math.max(this.width, this.height) * 0.7,
      speed: 16 + this.chaos * 12,
      opacity: 0.95,
    });

    if (this.audioEngine) {
      this.audioEngine.playImpulse();
    }
  }

  setChaos(chaosVal) {
    this.chaos = chaosVal; // 0.0 -> 1.0
  }

  update() {
    const theme = this.themeEngine.getCurrent();

    // Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.opacity *= 0.94;

      if (sw.radius > sw.maxRadius || sw.opacity < 0.02) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update Particles
    const chaosFactor = 1 + this.chaos * 2.8;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.energy += p.pulseSpeed;
      p.radius = p.baseRadius + Math.sin(p.energy) * 0.8;

      // Base movement + chaos
      p.x += p.vx * chaosFactor;
      p.y += p.vy * chaosFactor;

      // Mouse gravity interaction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 3.5;
        // Subtle attraction or repulsion based on chaos
        if (this.chaos > 0.6) {
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        } else {
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Shockwave push
      for (const sw of this.shockwaves) {
        const swDx = p.x - sw.x;
        const swDy = p.y - sw.y;
        const swDist = Math.hypot(swDx, swDy);
        const diff = Math.abs(swDist - sw.radius);

        if (diff < 35) {
          const push = (1 - diff / 35) * 8 * sw.opacity;
          p.x += (swDx / (swDist || 1)) * push;
          p.y += (swDy / (swDist || 1)) * push;
        }
      }

      // Screen boundary wrap
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
    }
  }

  draw() {
    const theme = this.themeEngine.getCurrent();

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Shockwaves
    for (const sw of this.shockwaves) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = theme.c1;
      this.ctx.lineWidth = 2.5;
      this.ctx.globalAlpha = sw.opacity;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Draw Connection Lines
    this.ctx.lineWidth = 0.8;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.45;
          this.ctx.strokeStyle = theme.c2;
          this.ctx.globalAlpha = alpha;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    // Draw Particle Nodes
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const isNearMouse = Math.hypot(this.mouse.x - p.x, this.mouse.y - p.y) < this.mouse.radius;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, isNearMouse ? p.radius * 1.5 : p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = isNearMouse ? theme.c1 : theme.c3;
      this.ctx.globalAlpha = isNearMouse ? 0.95 : 0.65;
      this.ctx.fill();

      // Node subtle glow
      if (isNearMouse || this.chaos > 0.4) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        this.ctx.fillStyle = theme.c1;
        this.ctx.globalAlpha = 0.15;
        this.ctx.fill();
      }
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
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  destroy() {
    this.stop();
  }
}
