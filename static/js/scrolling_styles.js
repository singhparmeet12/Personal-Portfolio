/**
 * SCROLLING STYLES COLLECTION (STYLES 02 - 07 + UNIFIED CONTROLLER)
 * High-performance 60fps scroll drivers and style switching engine
 */

(function() {
  'use strict';

  class ScrollingStylesManager {
    constructor() {
      this.activeStyle = 1;
      this.initializedStyles = new Set();
      this.initHubModal();
      this.initTopBarSwitcher();
    }

    initTopBarSwitcher() {
      const select = document.getElementById('globalStyleSelect');
      if (select) {
        select.addEventListener('change', (e) => {
          this.switchStyle(parseInt(e.target.value, 10));
        });
      }

      const hubBtn = document.getElementById('btnOpenStylesHub');
      if (hubBtn) {
        hubBtn.addEventListener('click', () => this.openStylesHub());
      }

      const closeHubBtn = document.getElementById('btnCloseStylesHub');
      if (closeHubBtn) {
        closeHubBtn.addEventListener('click', () => this.closeStylesHub());
      }
    }

    initHubModal() {
      const overlay = document.getElementById('stylesHubOverlay');
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) this.closeStylesHub();
        });
      }

      // Add click listeners to cards inside hub
      document.querySelectorAll('.style-card[data-style-target]').forEach(card => {
        card.addEventListener('click', () => {
          const target = parseInt(card.getAttribute('data-style-target'), 10);
          if (target) {
            this.switchStyle(target);
            this.closeStylesHub();
          }
        });
      });
    }

    openStylesHub() {
      const overlay = document.getElementById('stylesHubOverlay');
      if (overlay) {
        overlay.classList.add('active');
        // update active card highlight
        document.querySelectorAll('.style-card').forEach(c => {
          const s = parseInt(c.getAttribute('data-style-target'), 10);
          c.classList.toggle('active-style', s === this.activeStyle);
        });
      }
    }

    closeStylesHub() {
      const overlay = document.getElementById('stylesHubOverlay');
      if (overlay) overlay.classList.remove('active');
    }

    switchStyle(styleId) {
      if (styleId < 1 || styleId > 7) return;
      this.activeStyle = styleId;

      // 1. Update UI controls
      const select = document.getElementById('globalStyleSelect');
      if (select) select.value = styleId.toString();

      const badge = document.getElementById('currentStyleBadge');
      const styleNames = [
        '01 // ILLUSION OF SCROLL',
        '02 // SCROLL TRIGGER',
        '03 // PIN ANIMATION',
        '04 // PARALLAX DEPTH',
        '05 // HORIZONTAL SCROLL',
        '06 // SCROLL PROGRESS',
        '07 // SCROLL LINKED'
      ];
      if (badge) badge.textContent = styleNames[styleId - 1];

      // 2. Hide all containers, show target
      for (let i = 1; i <= 7; i++) {
        const c = document.getElementById(`styleContainer_${i}`);
        if (c) {
          if (i === styleId) {
            c.classList.add('active');
            c.style.display = (i === 1) ? 'flex' : 'block';
          } else {
            c.classList.remove('active');
            c.style.display = 'none';
          }
        }
      }

      // 3. Pause / resume engines
      if (styleId === 1) {
        if (window.illusionEngine) {
          window.illusionEngine.resize();
          window.illusionEngine.start();
        }
      } else {
        if (window.illusionEngine) {
          window.illusionEngine.stop();
        }
        this.initStyleEngine(styleId);
      }
    }

    initStyleEngine(styleId) {
      switch (styleId) {
        case 2: this.initStyle02Trigger(); break;
        case 3: this.initStyle03Pin(); break;
        case 4: this.initStyle04Parallax(); break;
        case 5: this.initStyle05Horizontal(); break;
        case 6: this.initStyle06Progress(); break;
        case 7: this.initStyle07Linked(); break;
      }
    }

    /* ------------------------------------------------------------------------
       STYLE 02: SCROLL TRIGGER (12 Sections)
       ------------------------------------------------------------------------ */
    initStyle02Trigger() {
      const container = document.getElementById('styleContainer_2');
      if (!container || this.initializedStyles.has(2)) return;
      this.initializedStyles.add(2);

      const sections = container.querySelectorAll('.st2-section');
      const counterEl = container.querySelector('.st2-counter-num');
      const dots = container.querySelectorAll('.st2-rail-dot');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-triggered');
            const idx = parseInt(entry.target.getAttribute('data-sec-index'), 10);
            if (counterEl && !isNaN(idx)) {
              counterEl.textContent = `${idx < 10 ? '0' + idx : idx} / 12`;
            }
            dots.forEach((d, i) => d.classList.toggle('active', i === (idx - 1)));

            // Trigger number counter if Section 07
            if (entry.target.id === 'st2_sec7' && !entry.target.dataset.counted) {
              entry.target.dataset.counted = 'true';
              this.animateCounter(container.querySelector('#st2_stat1'), 0, 98, '%', 1200);
              this.animateCounter(container.querySelector('#st2_stat2'), 0, 24, 'M', 1400);
              this.animateCounter(container.querySelector('#st2_stat3'), 0, 12.8, 'K', 1600, 1);
            }
          }
        });
      }, { root: container, threshold: 0.25 });

      sections.forEach(sec => observer.observe(sec));

      // Enable interactive rail dots navigation
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          if (sections[idx]) {
            sections[idx].scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      // Trigger first section immediately
      if (sections[0]) sections[0].classList.add('is-triggered');
    }

    animateCounter(el, start, end, suffix, duration, decimals = 0) {
      if (!el) return;
      const startTime = performance.now();
      const step = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeProgress;
        el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    /* ------------------------------------------------------------------------
       STYLE 03: PIN ANIMATION (14 Sections)
       ------------------------------------------------------------------------ */
    initStyle03Pin() {
      const container = document.getElementById('styleContainer_3');
      if (!container || this.initializedStyles.has(3)) return;
      this.initializedStyles.add(3);

      const counterEl = container.querySelector('.st3-counter-num');
      const sections = container.querySelectorAll('.st3-pin-section, .st3-section');

      let ticking = false;
      container.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollTop = container.scrollTop;
            const containerH = container.clientHeight;

            sections.forEach((sec, idx) => {
              const rectTop = sec.offsetTop - scrollTop;
              if (rectTop <= containerH * 0.4 && rectTop >= -sec.offsetHeight * 0.6) {
                if (counterEl) {
                  const num = idx + 1;
                  counterEl.textContent = `${num < 10 ? '0' + num : num} / 14`;
                }
              }
            });

            // Pinned Section 02 stages (01 Frame -> 02 Focus -> 03 Form)
            const sec2 = document.getElementById('st3_sec2');
            if (sec2) {
              const p = Math.max(0, Math.min(1, (scrollTop - sec2.offsetTop) / (sec2.offsetHeight - containerH || 1)));
              const layers = sec2.querySelectorAll('.st3-pin-stage-layer, .st3-monolith-layer');
              const stageIdx = p < 0.33 ? 0 : (p < 0.66 ? 1 : 2);
              layers.forEach((l, i) => l.classList.toggle('active', i === stageIdx));
            }

            // Pinned Section 04 typography (EVOLVE -> ADAPT -> TRANSFORM)
            const sec4 = document.getElementById('st3_sec4');
            if (sec4) {
              const p4 = Math.max(0, Math.min(1, (scrollTop - sec4.offsetTop) / (sec4.offsetHeight - containerH || 1)));
              const wordEl = sec4.querySelector('.st3-pin-evolve-word');
              if (wordEl) {
                if (p4 < 0.33) {
                  wordEl.textContent = 'EVOLVE';
                  wordEl.style.color = '#ffffff';
                } else if (p4 < 0.66) {
                  wordEl.textContent = 'ADAPT';
                  wordEl.style.color = '#8b5cf6';
                } else {
                  wordEl.textContent = 'TRANSFORM';
                  wordEl.style.color = '#00f5ff';
                }
              }
            }

            // Pinned Section 07 full-screen color shift (Black -> Dark Blue -> Violet -> Green -> White)
            const sec7 = document.getElementById('st3_sec7');
            if (sec7) {
              const p7 = Math.max(0, Math.min(1, (scrollTop - sec7.offsetTop) / (sec7.offsetHeight - containerH || 1)));
              const colors = [
                { bg: '#07080b', text: '#ffffff', label: 'BLACK' },
                { bg: '#0a1931', text: '#ffffff', label: 'DARK BLUE' },
                { bg: '#2b0938', text: '#ffffff', label: 'VIOLET' },
                { bg: '#042f1a', text: '#ffffff', label: 'ELECTRIC GREEN' },
                { bg: '#f8fafc', text: '#090b10', label: 'PURE WHITE' }
              ];
              const colorIdx = Math.min(colors.length - 1, Math.floor(p7 * colors.length));
              sec7.style.backgroundColor = colors[colorIdx].bg;
              sec7.style.color = colors[colorIdx].text;
              const labelEl = sec7.querySelector('.st3-color-label');
              if (labelEl) labelEl.textContent = colors[colorIdx].label;
            }

            // Pinned Section 08 Stats (01 -> 02 -> 03 -> 04)
            const sec8 = document.getElementById('st3_sec8');
            if (sec8) {
              const p8 = Math.max(0, Math.min(1, (scrollTop - sec8.offsetTop) / (sec8.offsetHeight - containerH || 1)));
              const numEl = sec8.querySelector('.st3-pinned-stat-num');
              const titleEl = sec8.querySelector('.st3-pinned-stat-title');
              const stats = [
                { num: '01', title: 'STRATEGY // Discovery & Blueprinting' },
                { num: '02', title: 'DESIGN // High-Precision Spatial UI' },
                { num: '03', title: 'TECHNOLOGY // 60 FPS GPU Architecture' },
                { num: '04', title: 'IMPACT // Measurable Market Authority' }
              ];
              const sIdx = Math.min(stats.length - 1, Math.floor(p8 * stats.length));
              if (numEl) numEl.textContent = stats[sIdx].num;
              if (titleEl) titleEl.textContent = stats[sIdx].title;
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    /* ------------------------------------------------------------------------
       STYLE 04: PARALLAX DEPTH (15 Sections)
       ------------------------------------------------------------------------ */
    initStyle04Parallax() {
      const container = document.getElementById('styleContainer_4');
      if (!container || this.initializedStyles.has(4)) return;
      this.initializedStyles.add(4);

      const counterEl = container.querySelector('.st4-counter-num');
      const sections = container.querySelectorAll('.st4-parallax-section, .st4-stratum-viewport');

      let ticking = false;
      container.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollTop = container.scrollTop;
            const containerH = container.clientHeight;

            sections.forEach((sec, idx) => {
              const secTop = sec.offsetTop;
              const relY = scrollTop - secTop;

              // Parallax layers calculation
              const bgLayer = sec.querySelector('.st4-layer-bg, .st4-stratum-bg');
              const midLayer = sec.querySelector('.st4-layer-mid, .st4-stratum-mid');
              const subLayer = sec.querySelector('.st4-layer-subject, .st4-stratum-sub');
              const foreLayer = sec.querySelector('.st4-layer-fore, .st4-stratum-fore');

              if (bgLayer) bgLayer.style.transform = `translate3d(0, ${relY * 0.12}px, 0)`;
              if (midLayer) midLayer.style.transform = `translate3d(0, ${relY * 0.28}px, 0)`;
              if (subLayer) subLayer.style.transform = `translate3d(0, ${relY * 0.48}px, 0)`;
              if (foreLayer) foreLayer.style.transform = `translate3d(0, ${relY * 0.85}px, 0)`;

              // Active section counter
              if (relY >= -containerH * 0.5 && relY < containerH * 0.5) {
                if (counterEl) {
                  const num = idx + 1;
                  counterEl.textContent = `${num < 10 ? '0' + num : num} / 15`;
                }
              }
            });

            // Horizontal Parallax strip in Section 08
            const sec8 = document.getElementById('st4_sec8');
            if (sec8) {
              const rel8 = scrollTop - sec8.offsetTop;
              const strip1 = sec8.querySelector('.st4-h-strip-1');
              const strip2 = sec8.querySelector('.st4-h-strip-2');
              if (strip1) strip1.style.transform = `translate3d(${rel8 * -0.3}px, 0, 0)`;
              if (strip2) strip2.style.transform = `translate3d(${rel8 * 0.3}px, 0, 0)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    /* ------------------------------------------------------------------------
       STYLE 05: HORIZONTAL SCROLL (15 Scenes)
       ------------------------------------------------------------------------ */
    initStyle05Horizontal() {
      const container = document.getElementById('styleContainer_5');
      if (!container || this.initializedStyles.has(5)) return;
      this.initializedStyles.add(5);

      const track = container.querySelector('.st5-horizontal-track, .st5-mural-track');
      const progressFill = container.querySelector('.st5-progress-fill, .st5-ribbon-fill');
      const counterEl = container.querySelector('.st5-counter-num');
      const scenes = container.querySelectorAll('.st5-scene, .st5-mural-scene');

      let ticking = false;
      container.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const maxScroll = container.scrollHeight - container.clientHeight;
            if (maxScroll <= 0) {
              ticking = false;
              return;
            }

            const progress = Math.max(0, Math.min(1, container.scrollTop / maxScroll));
            const maxTrackTranslate = track ? (track.scrollWidth - window.innerWidth) : 0;

            if (track) {
              track.style.transform = `translate3d(-${progress * maxTrackTranslate}px, 0, 0)`;
            }
            if (progressFill) {
              progressFill.style.width = `${progress * 100}%`;
            }

            // Active scene calculation
            const totalScenes = scenes.length || 15;
            const currentScene = Math.min(totalScenes, Math.floor(progress * totalScenes) + 1);
            if (counterEl) {
              counterEl.textContent = `${currentScene < 10 ? '0' + currentScene : currentScene} / ${totalScenes < 10 ? '0' + totalScenes : totalScenes}`;
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    /* ------------------------------------------------------------------------
       STYLE 06: SCROLL PROGRESS (15 Sections)
       ------------------------------------------------------------------------ */
    initStyle06Progress() {
      const container = document.getElementById('styleContainer_6');
      if (!container || this.initializedStyles.has(6)) return;
      this.initializedStyles.add(6);

      const railFill = container.querySelector('.st6-rail-fill, .st6-telemetry-fill');
      const pctDisplay = container.querySelector('.st6-pct-counter, .st6-radar-readout');
      const counterEl = container.querySelector('.st6-counter-num');
      const chapterBadge = container.querySelector('.st6-chapter-badge, .st6-chapter-radar');
      const gaugeMeter = container.querySelector('.st6-gauge-meter');
      const sections = container.querySelectorAll('.st6-progress-section');

      const chapters = [
        { maxPct: 15, name: 'CHAPTER // INTRODUCTION' },
        { maxPct: 35, name: 'CHAPTER // VISION' },
        { maxPct: 55, name: 'CHAPTER // PROCESS' },
        { maxPct: 75, name: 'CHAPTER // WORK' },
        { maxPct: 92, name: 'CHAPTER // RESULT' },
        { maxPct: 100, name: 'CHAPTER // CONCLUSION' }
      ];

      let ticking = false;
      container.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const maxScroll = container.scrollHeight - container.clientHeight;
            if (maxScroll <= 0) {
              ticking = false;
              return;
            }

            const progress = Math.max(0, Math.min(1, container.scrollTop / maxScroll));
            const pct = Math.round(progress * 100);

            if (railFill) railFill.style.height = `${pct}%`;
            if (pctDisplay) pctDisplay.textContent = `${pct < 10 ? '0' + pct : pct}%`;

            // Circular gauge (dashoffset 380 -> 0)
            if (gaugeMeter) {
              gaugeMeter.style.strokeDashoffset = `${380 * (1 - progress)}`;
            }

            // Active chapter
            const currentChap = chapters.find(c => pct <= c.maxPct) || chapters[chapters.length - 1];
            if (chapterBadge) chapterBadge.textContent = currentChap.name;

            // Section counter
            sections.forEach((sec, idx) => {
              const rectTop = sec.offsetTop - container.scrollTop;
              if (rectTop <= container.clientHeight * 0.5 && rectTop >= -sec.offsetHeight * 0.5) {
                if (counterEl) {
                  const num = idx + 1;
                  counterEl.textContent = `${num < 10 ? '0' + num : num} / 15`;
                }
              }
            });
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    /* ------------------------------------------------------------------------
       STYLE 07: SCROLL LINKED ANIMATION (15 Sections)
       ------------------------------------------------------------------------ */
    initStyle07Linked() {
      const container = document.getElementById('styleContainer_7');
      if (!container || this.initializedStyles.has(7)) return;
      this.initializedStyles.add(7);

      const scrubPctEl = container.querySelector('.st7-scrub-pct');
      const counterEl = container.querySelector('.st7-counter-num');
      const sections = container.querySelectorAll('.st7-scrub-section, .st7-scrub-scene');

      let ticking = false;
      container.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollTop = container.scrollTop;
            const containerH = container.clientHeight;
            const maxScroll = container.scrollHeight - containerH;
            const globalProg = maxScroll > 0 ? (scrollTop / maxScroll) : 0;

            if (scrubPctEl) {
              scrubPctEl.textContent = `${Math.round(globalProg * 100)}% SCRUB`;
            }

            sections.forEach((sec, idx) => {
              const secTop = sec.offsetTop;
              const secH = sec.offsetHeight;
              // Local progress through section: 0 to 1
              const localProg = Math.max(0, Math.min(1, (scrollTop - secTop + containerH * 0.5) / secH));

              // Active section counter
              if (scrollTop >= secTop - containerH * 0.5 && scrollTop < secTop + secH - containerH * 0.5) {
                if (counterEl) {
                  const num = idx + 1;
                  counterEl.textContent = `${num < 10 ? '0' + num : num} / 15`;
                }
              }

              // Section 01 Hero: Scrubbed scale and upward drift
              if (sec.id === 'st7_sec1') {
                const heroTarget = sec.querySelector('.st7-hero-object');
                if (heroTarget) {
                  const s = 0.7 + 0.35 * localProg;
                  const y = -60 * localProg;
                  const r = localProg * 12;
                  heroTarget.style.transform = `scale(${s}) translateY(${y}px) rotate(${r}deg)`;
                }
              }

              // Section 02 Scrubbed Typography: MOTION spreading apart
              if (sec.id === 'st7_sec2') {
                const motionEl = sec.querySelector('.st7-motion-word');
                if (motionEl) {
                  const letterSpacing = 0.05 + 0.35 * localProg;
                  const scale = 0.9 + 0.25 * localProg;
                  const opacity = 0.4 + 0.6 * localProg;
                  motionEl.style.letterSpacing = `${letterSpacing}em`;
                  motionEl.style.transform = `scale(${scale})`;
                  motionEl.style.opacity = opacity;
                }
              }

              // Section 03 Image transformation frame
              if (sec.id === 'st7_sec3') {
                const frame = sec.querySelector('.st7-transform-frame');
                if (frame) {
                  const w = 55 + 45 * localProg;
                  const br = 24 * (1 - localProg);
                  frame.style.width = `${w}%`;
                  frame.style.borderRadius = `${br}px`;
                }
              }

              // Section 05 Sequential transformation (Wireframe -> Finished)
              if (sec.id === 'st7_sec5') {
                const wireframe = sec.querySelector('.st7-morph-wireframe');
                const finished = sec.querySelector('.st7-morph-finished');
                if (wireframe && finished) {
                  wireframe.style.opacity = 1 - localProg;
                  finished.style.opacity = localProg;
                }
              }
            });
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // Instantiate when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollingStylesEngine = new ScrollingStylesManager();
  });

  // Global helper to switch styles
  window.selectScrollingStyle = function(styleId) {
    if (window.scrollingStylesEngine) {
      window.scrollingStylesEngine.switchStyle(styleId);
    }
  };

  window.openStylesHubModal = function() {
    if (window.scrollingStylesEngine) {
      window.scrollingStylesEngine.openStylesHub();
    }
  };

  window.closeStylesHubModal = function() {
    if (window.scrollingStylesEngine) {
      window.scrollingStylesEngine.closeStylesHub();
    }
  };

})();
