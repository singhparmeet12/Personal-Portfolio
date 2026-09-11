/**
 * AI EXPERIMENTAL LAB — SPRING PHYSICS CURSOR ENGINE
 * Smooth lag interpolation & interactive contextual labels.
 * Disabled on touch screens to ensure flawless native mobile ergonomics.
 */
export class LabCursorEngine {
  constructor(containerEl) {
    this.container = containerEl;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.dot = null;
    this.ring = null;
    this.label = null;

    this.mouse = { x: -100, y: -100 };
    this.pos = { x: -100, y: -100 };
    this.target = { x: -100, y: -100 };
    this.animId = null;

    if (!this.isTouch) {
      this.initElements();
      this.bindEvents();
      this.loop();
    }
  }

  initElements() {
    this.dot = document.createElement('div');
    this.dot.className = 'lab-cursor-dot';
    this.dot.setAttribute('aria-hidden', 'true');

    this.ring = document.createElement('div');
    this.ring.className = 'lab-cursor-ring';
    this.ring.setAttribute('aria-hidden', 'true');

    this.label = document.createElement('span');
    this.label.className = 'lab-cursor-label';
    this.label.textContent = '';
    this.ring.appendChild(this.label);

    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;

      if (this.dot) {
        this.dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    }, { passive: true });

    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const state = target.getAttribute('data-cursor');
        this.setState(state);
      } else if (e.target.closest('button, a, input, select, .galaxy-node-item, .clickable')) {
        this.setState('hover');
      } else {
        this.setState('normal');
      }
    });

    document.addEventListener('mouseleave', () => {
      if (this.dot) this.dot.style.opacity = '0';
      if (this.ring) this.ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (this.dot) this.dot.style.opacity = '1';
      if (this.ring) this.ring.style.opacity = '1';
    });
  }

  setState(state) {
    if (!this.ring || !this.label) return;

    this.ring.classList.remove('cursor-hover', 'cursor-explore', 'cursor-drag', 'cursor-secret');

    switch (state) {
      case 'explore':
        this.ring.classList.add('cursor-explore');
        this.label.textContent = 'EXPLORE';
        break;
      case 'move':
      case 'drag':
        this.ring.classList.add('cursor-drag');
        this.label.textContent = 'MOVE';
        break;
      case 'secret':
        this.ring.classList.add('cursor-secret');
        this.label.textContent = '???';
        break;
      case 'interact':
        this.ring.classList.add('cursor-hover');
        this.label.textContent = 'ACTIVATE';
        break;
      case 'hover':
        this.ring.classList.add('cursor-hover');
        this.label.textContent = '';
        break;
      default:
        this.label.textContent = '';
        break;
    }
  }

  loop() {
    // Spring lerp physics for cursor trailing ring
    const factor = 0.18;
    this.pos.x += (this.target.x - this.pos.x) * factor;
    this.pos.y += (this.target.y - this.pos.y) * factor;

    if (this.ring) {
      this.ring.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) translate(-50%, -50%)`;
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.dot && this.dot.parentNode) this.dot.parentNode.removeChild(this.dot);
    if (this.ring && this.ring.parentNode) this.ring.parentNode.removeChild(this.ring);
  }
}
