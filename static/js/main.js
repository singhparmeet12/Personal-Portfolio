/**
 * PARMEET SINGH — FULL-STACK DEVELOPER PORTFOLIO CLIENT ENGINE
 * Features:
 * 1. Time-Aware Intelligent Default Ambience:
 *    - 06:00 AM – 03:00 PM: ☀️ Day Mode (Light theme)
 *    - 03:00 PM – 08:00 PM: 🌅 Sunset Mode (Golden Hour)
 *    - 08:00 PM – 06:00 AM: 🌙 Night Mode (Dark theme)
 * 2. Real-Time Accurate Local Time Clock
 * 3. 100% Synchronized Modal Artwork (Exact active theme opens in modal)
 * 4. Living 60fps Canvas (Gliding Birds, Rain, Sunbeams, Coffee Steam, Blinking Cursor)
 * 5. Web Audio Lo-Fi Synthesizer (Lofi Ambient Soundscape)
 * 6. Dynamic Hero Typewriter & Project Filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  initLofiWorkspace();
  initThemeEngine();
  initNavbar();
  initMobileNav();
  initHeroTypewriter();
  initProjectFiltering();
  initCopyEmail();
  initInteractiveShowcase();
  initAboutWorldExperience();
});

/* --------------------------------------------------------------------------
   TIME UTILITY: Get mode based on current real-world local time
   - 6 AM to 3 PM: day
   - 3 PM to 8 PM: sunset
   - 8 PM to 6 AM: night
   -------------------------------------------------------------------------- */
function getTimeBasedDefaultMode() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 15) {
    return 'day';
  } else if (hour >= 15 && hour < 20) {
    return 'sunset';
  } else {
    return 'night';
  }
}

/* --------------------------------------------------------------------------
   1. UNIFIED THEME & SCENE ENGINE
   -------------------------------------------------------------------------- */
function initThemeEngine() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Navbar theme toggles
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      sessionStorage.setItem('portfolio_user_selected_mode', nextTheme === 'dark' ? 'night' : 'day');

      if (window.syncLofiSceneMode) {
        window.syncLofiSceneMode(nextTheme === 'dark' ? 'night' : 'day');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. HERO TYPEWRITER / ROLE ROTATOR
   -------------------------------------------------------------------------- */
function initHeroTypewriter() {
  const roleElement = document.getElementById('heroRoleText');
  if (!roleElement) return;

  const roles = [
    'Full-Stack Python & Django Developer',
    'Architect of Scalable Web Platforms',
    'High-Performance Web Engineer',
    'Data Systems & Product Builder'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 60;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      roleElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      roleElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. LIVING LO-FI WORKSPACE ANIMATION & SCENE ENGINE
   -------------------------------------------------------------------------- */
function initLofiWorkspace() {
  const card = document.getElementById('lofiHeroCard');
  const tiltLayer = document.getElementById('lofiTiltLayer');
  const canvas = document.getElementById('lofiCanvasOverlay');
  const modalCanvas = document.getElementById('lofiModalCanvas');
  const clock = document.getElementById('lofiLiveClock');
  const sceneToggleBtn = document.getElementById('lofiSceneToggleBtn');
  const sceneToggleIcon = document.getElementById('lofiSceneToggleIcon');
  const sceneToggleText = document.getElementById('lofiSceneToggleText');
  const statusModeLabel = document.getElementById('lofiStatusModeLabel');
  const modalStatusLabel = document.getElementById('lofiModalStatusLabel');
  const modalDialog = document.getElementById('lofiModalDialog');
  const modalArtPane = document.getElementById('lofiModalArtPane');

  // Intelligent Time-Based Default on First Load
  const userChosenMode = sessionStorage.getItem('portfolio_user_selected_mode');
  let currentSceneMode = userChosenMode || getTimeBasedDefaultMode();

  function applySceneMode(mode) {
    currentSceneMode = mode;

    // Apply classes to both the hero card and modal containers
    [card, modalDialog, modalArtPane].forEach(el => {
      if (el) {
        el.classList.remove('day-mode', 'sunset-mode', 'night-mode');
        el.classList.add(`${mode}-mode`);
      }
    });

    if (mode === 'night') {
      if (sceneToggleIcon) sceneToggleIcon.className = 'bi bi-sun-fill';
      if (sceneToggleText) sceneToggleText.textContent = 'Day';
      if (statusModeLabel) statusModeLabel.textContent = '🌙 Night Focus';
      if (modalStatusLabel) modalStatusLabel.textContent = 'Late Night Focus • 8 PM - 6 AM';
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (mode === 'sunset') {
      if (sceneToggleIcon) sceneToggleIcon.className = 'bi bi-moon-stars-fill';
      if (sceneToggleText) sceneToggleText.textContent = 'Night';
      if (statusModeLabel) statusModeLabel.textContent = '🌅 Sunset Session';
      if (modalStatusLabel) modalStatusLabel.textContent = 'Golden Hour Focus • 3 PM - 8 PM';
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      // Day mode
      if (sceneToggleIcon) sceneToggleIcon.className = 'bi bi-sunset-fill';
      if (sceneToggleText) sceneToggleText.textContent = 'Sunset';
      if (statusModeLabel) statusModeLabel.textContent = '☀️ Day Session';
      if (modalStatusLabel) modalStatusLabel.textContent = 'Daytime Coding • 6 AM - 3 PM';
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  window.syncLofiSceneMode = (mode) => {
    applySceneMode(mode);
  };

  // Initial render with time-based mode
  applySceneMode(currentSceneMode);

  // 3-Way Cycle: Day -> Sunset -> Night -> Day
  if (sceneToggleBtn) {
    sceneToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let nextMode = 'day';
      if (currentSceneMode === 'day') nextMode = 'sunset';
      else if (currentSceneMode === 'sunset') nextMode = 'night';
      else if (currentSceneMode === 'night') nextMode = 'day';
      
      sessionStorage.setItem('portfolio_user_selected_mode', nextMode);
      applySceneMode(nextMode);
    });
  }

  // Real-Time Accurate Clock Display (Synced with visitor's actual local time)
  function updateLiveClock() {
    if (!clock) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clock.textContent = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000); // 1-second precision update

  // ------------------------------------------------------------------------
  // A. ISOLATED 3D MOUSE PARALLAX TILT
  // ------------------------------------------------------------------------
  if (card && tiltLayer) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      tiltLayer.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      tiltLayer.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
  }

  // ------------------------------------------------------------------------
  // B. PROCEDURAL CANVAS (Birds, Rain, Sunbeams, Steam & IDE Blinking Cursor)
  // ------------------------------------------------------------------------
  function setupAtmosphericCanvas(targetCanvas) {
    if (!targetCanvas) return null;
    const ctx = targetCanvas.getContext('2d');
    let width = (targetCanvas.width = targetCanvas.offsetWidth || 480);
    let height = (targetCanvas.height = targetCanvas.offsetHeight || 480);

    const resize = () => {
      width = targetCanvas.width = targetCanvas.offsetWidth || 480;
      height = targetCanvas.height = targetCanvas.offsetHeight || 480;
    };
    window.addEventListener('resize', resize);

    // 1. Distant Birds in Sky (Day & Sunset)
    const birds = [
      { x: width * 0.72, y: height * 0.12, speed: 0.45, wingPhase: 0, scale: 0.85 },
      { x: width * 0.58, y: height * 0.16, speed: 0.38, wingPhase: 1.8, scale: 0.7 },
      { x: width * 0.46, y: height * 0.09, speed: 0.42, wingPhase: 3.2, scale: 0.6 }
    ];

    // 2. Night Rain particles
    const raindrops = Array.from({ length: 32 }, () => ({
      x: width * 0.32 + Math.random() * (width * 0.44),
      y: height * 0.04 + Math.random() * (height * 0.48),
      speed: 1.8 + Math.random() * 2.2,
      length: 8 + Math.random() * 12,
      opacity: 0.25 + Math.random() * 0.35
    }));

    // 3. Coffee Steam particles
    const steamParticles = Array.from({ length: 20 }, (_, i) => ({
      x: width * 0.24 + (Math.random() - 0.5) * 8,
      y: height * 0.72 - (i * 2.5),
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.4 - Math.random() * 0.35,
      size: 2 + Math.random() * 3,
      alpha: 0.4,
      life: Math.random() * 100,
      maxLife: 80 + Math.random() * 50
    }));

    // 4. Ambient dust / sunbeam particles
    const dustParticles = Array.from({ length: 24 }, () => ({
      x: width * 0.12 + Math.random() * (width * 0.58),
      y: height * 0.25 + Math.random() * (height * 0.55),
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.15 - Math.random() * 0.25,
      size: 1 + Math.random() * 1.8,
      alpha: 0.15 + Math.random() * 0.45
    }));

    let animFrame = null;
    let tick = 0;

    function render() {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const isNight = currentSceneMode === 'night';
      const isSunset = currentSceneMode === 'sunset';

      // 1. Distant Birds (Gliding across window sky in Day & Sunset)
      if (!isNight) {
        ctx.fillStyle = isSunset ? 'rgba(55, 30, 60, 0.75)' : 'rgba(70, 95, 130, 0.65)';
        birds.forEach(b => {
          b.x -= b.speed;
          b.wingPhase += 0.08;

          if (b.x < width * 0.33) {
            b.x = width * 0.78;
            b.y = height * (0.08 + Math.random() * 0.18);
          }

          const wingY = Math.sin(b.wingPhase) * 2.5 * b.scale;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.quadraticCurveTo(b.x - 3 * b.scale, b.y - 3 * b.scale + wingY, b.x - 6 * b.scale, b.y + wingY);
          ctx.quadraticCurveTo(b.x - 3 * b.scale, b.y - 1 * b.scale, b.x, b.y);
          ctx.quadraticCurveTo(b.x + 3 * b.scale, b.y - 3 * b.scale + wingY, b.x + 6 * b.scale, b.y + wingY);
          ctx.quadraticCurveTo(b.x + 3 * b.scale, b.y - 1 * b.scale, b.x, b.y);
          ctx.fill();
        });
      }

      // 2. Window Rain (ONLY in Night Mode)
      if (isNight) {
        ctx.lineWidth = 1;
        raindrops.forEach(drop => {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180, 215, 255, ${drop.opacity})`;
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 1.2, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          drop.x -= 0.3;

          if (drop.y > height * 0.52 || drop.x < width * 0.3) {
            drop.y = height * 0.04;
            drop.x = width * 0.32 + Math.random() * (width * 0.44);
          }
        });
      }

      // 3. Blinking Code Cursor & Active IDE Highlights on Monitor
      const cursorBlink = Math.floor(tick / 35) % 2 === 0;
      if (cursorBlink) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(width * 0.28, height * 0.525, 2, 7);
      }

      // 4. Coffee Steam
      steamParticles.forEach(p => {
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.06) * 0.25;
        p.y += p.vy;
        p.size += 0.04;
        const maxA = isNight ? 0.38 : (isSunset ? 0.28 : 0.2);
        p.alpha = Math.max(0, maxA * (1 - p.life / p.maxLife));

        ctx.fillStyle = isSunset ? `rgba(255, 235, 210, ${p.alpha})` : `rgba(245, 245, 245, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          p.x = width * 0.24 + (Math.random() - 0.5) * 8;
          p.y = height * 0.72;
          p.life = 0;
          p.size = 2 + Math.random() * 3;
          p.alpha = maxA;
        }
      });

      // 5. Sunbeams & Ambient Dust Motes
      dustParticles.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;

        let particleColor = `rgba(255, 248, 220, ${d.alpha * 0.75})`;
        if (isNight) particleColor = `rgba(242, 182, 109, ${d.alpha})`;
        else if (isSunset) particleColor = `rgba(251, 146, 60, ${d.alpha * 0.85})`;

        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();

        if (d.y < height * 0.2 || d.x < width * 0.08 || d.x > width * 0.7) {
          d.y = height * 0.8;
          d.x = width * 0.12 + Math.random() * (width * 0.5);
        }
      });

      animFrame = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(animFrame);
  }

  setupAtmosphericCanvas(canvas);
  setupAtmosphericCanvas(modalCanvas);

  // ------------------------------------------------------------------------
  // C. WEB AUDIO LO-FI AMBIENT CHORD SYNTHESIZER (In Modal)
  // ------------------------------------------------------------------------
  const modalPlayBtn = document.getElementById('lofiModalPlayBtn');
  const modalPlayIcon = document.getElementById('lofiModalPlayIcon');
  const modalPlayText = document.getElementById('lofiModalPlayText');
  const volumeSlider = document.getElementById('lofiVolumeSlider');

  let audioCtx = null;
  let masterGain = null;
  let isAudioPlaying = false;
  let chordTimer = null;

  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];
  let chordIndex = 0;

  function initAudioEngine() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(audioCtx.destination);
  }

  function playLoFiChord() {
    if (!audioCtx || !isAudioPlaying) return;
    const now = audioCtx.currentTime;
    const chord = chords[chordIndex];
    chordIndex = (chordIndex + 1) % chords.length;

    chord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(430, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now + idx * 0.035);
      osc.stop(now + 2.5);
    });
  }

  function toggleAudio() {
    initAudioEngine();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      if (modalPlayIcon) modalPlayIcon.className = 'bi bi-pause-fill';
      if (modalPlayText) modalPlayText.textContent = 'Pause';

      playLoFiChord();
      chordTimer = setInterval(playLoFiChord, 2500);
    } else {
      if (modalPlayIcon) modalPlayIcon.className = 'bi bi-play-fill';
      if (modalPlayText) modalPlayText.textContent = 'Play';

      if (chordTimer) clearInterval(chordTimer);
    }
  }

  if (modalPlayBtn) modalPlayBtn.addEventListener('click', toggleAudio);

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (masterGain) {
        masterGain.gain.value = e.target.value / 100;
      }
    });
  }

  // ------------------------------------------------------------------------
  // D. MODAL EXPAND / COLLAPSE (100% Theme Synchronization)
  // ------------------------------------------------------------------------
  const modal = document.getElementById('lofiModalBackdrop');
  const expandBtn = document.getElementById('lofiCardExpandBtn');
  const closeBtn = document.getElementById('lofiModalCloseBtn');

  const openModal = () => {
    if (modal) {
      // Re-apply active mode to modal before showing
      applySceneMode(currentSceneMode);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (card) {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.lofi-top-actions')) return;
      openModal();
    });
  }

  if (expandBtn) {
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   4. PROJECT FILTERING (Tabs on /work/)
   -------------------------------------------------------------------------- */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('[data-project-category]');

  if (filterButtons.length === 0 || projectItems.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedSlug = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectItems.forEach(item => {
        const itemCategories = item.getAttribute('data-project-category').split(' ');
        if (selectedSlug === 'all' || itemCategories.includes(selectedSlug)) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.98)';
          setTimeout(() => {
            item.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.site-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   6. COPY EMAIL MICRO-INTERACTION
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'contact@parmeetsingh.dev';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-lg text-success"></i> Copied!';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);
      }).catch(err => {
        console.error('Clipboard copy error:', err);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE PRODUCT SHOWCASE ENGINE (GaadiMandi & TourCraze Case Studies)
   -------------------------------------------------------------------------- */
function initInteractiveShowcase() {
  const containers = document.querySelectorAll('.interactive-showcase-container');
  if (!containers.length) return;

  containers.forEach(container => {
    const tabBtns = container.querySelectorAll('.showcase-tab-btn');
    const layers = container.querySelectorAll('.showcase-layer');
    const captions = container.querySelectorAll('.showcase-caption-item');
    const autoPlayBtn = container.querySelector('.showcase-auto-btn');
    const autoPlayIcon = autoPlayBtn ? autoPlayBtn.querySelector('i') : null;
    const autoPlayText = autoPlayBtn ? autoPlayBtn.querySelector('span') : null;
    const cursor = container.querySelector('.showcase-cursor');

    const totalScreens = layers.length;
    let currentScreen = 1;
    let isAutoPlay = true;
    let autoTimer = null;

    const cursorTargets = {
      1: { top: '64%', left: '58%' },
      2: { top: '48%', left: '76%' },
      3: { top: '72%', left: '62%' },
      4: { top: '68%', left: '78%' }
    };

    function switchScreen(screenNum) {
      currentScreen = parseInt(screenNum);

      // Update Tabs
      tabBtns.forEach(btn => {
        if (parseInt(btn.getAttribute('data-screen')) === currentScreen) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Layers
      layers.forEach(layer => {
        if (parseInt(layer.getAttribute('data-layer')) === currentScreen) {
          layer.classList.add('active');
        } else {
          layer.classList.remove('active');
        }
      });

      // Update Captions
      captions.forEach(cap => {
        if (parseInt(cap.getAttribute('data-caption')) === currentScreen) {
          cap.classList.add('active');
        } else {
          cap.classList.remove('active');
        }
      });

      // Animate Micro Cursor
      if (cursor && cursorTargets[currentScreen]) {
        cursor.style.opacity = '1';
        cursor.style.top = cursorTargets[currentScreen].top;
        cursor.style.left = cursorTargets[currentScreen].left;
        setTimeout(() => {
          cursor.style.opacity = '0';
        }, 1400);
      }
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoTimer = setInterval(() => {
        let nextScreen = currentScreen + 1;
        if (nextScreen > totalScreens) nextScreen = 1;
        switchScreen(nextScreen);
      }, 3500);
    }

    function stopAutoPlay() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const screenNum = btn.getAttribute('data-screen');
        switchScreen(screenNum);
        isAutoPlay = false;
        stopAutoPlay();
        if (autoPlayIcon) autoPlayIcon.className = 'bi bi-play-fill';
        if (autoPlayText) autoPlayText.textContent = 'Resume Demo';
      });
    });

    if (autoPlayBtn) {
      autoPlayBtn.addEventListener('click', () => {
        isAutoPlay = !isAutoPlay;
        if (isAutoPlay) {
          if (autoPlayIcon) autoPlayIcon.className = 'bi bi-pause-fill';
          if (autoPlayText) autoPlayText.textContent = 'Live Demo Active';
          startAutoPlay();
        } else {
          if (autoPlayIcon) autoPlayIcon.className = 'bi bi-play-fill';
          if (autoPlayText) autoPlayText.textContent = 'Resume Demo';
          stopAutoPlay();
        }
      });
    }

    if (layers.length > 1) {
      startAutoPlay();
    }
  });
}

/* --------------------------------------------------------------------------
   8. PARMEET SINGH — SINGLE CONTINUOUS CINEMATIC SCROLLYTELLING ENGINE
   -------------------------------------------------------------------------- */
function initAboutWorldExperience() {
  const splitWrapper = document.getElementById('splitAboutWrapper');
  if (!splitWrapper) return;

  const chapterBlocks = document.querySelectorAll('.story-chapter-block');
  const stageImages = document.querySelectorAll('.stage-image');
  const stageDots = document.querySelectorAll('.stage-dot');
  const stageTimecode = document.getElementById('stageTimecodeText');
  const stageSceneIndex = document.getElementById('stageSceneIndexText');
  const stageLens = document.getElementById('stageLensText');
  const stylePills = document.querySelectorAll('.style-pill-btn');

  // Metadata for the 11 film chapters
  const filmMetadata = [
    { timecode: '08:00 AM • MORNING SETUP', lens: 'LENS: 35mm WIDE', label: 'THE DAY BEGINS' },
    { timecode: '09:15 AM • ACADEMIC ROOTS', lens: 'LENS: 50mm MEDIUM', label: 'B.TECH 2025 AI & DS' },
    { timecode: '10:30 AM • CERTIFIED SKILLS', lens: 'LENS: 50mm FOCUS', label: 'INFOSYS & UDEMY' },
    { timecode: '11:45 AM • CRAFT & SYSTEMS', lens: 'LENS: 85mm WORKSTATION', label: 'PYTHON / DJANGO' },
    { timecode: '01:15 PM • THE DAILY GRIND', lens: 'LENS: 50mm PAPER', label: 'APPLICATIONS & HUSTLE' },
    { timecode: '02:45 PM • ENGINEERING REAL PRODUCTS', lens: 'LENS: 85mm DATA', label: 'PRODUCTION MVPS' },
    { timecode: '04:15 PM • CLIENT OUTREACH', lens: 'LENS: 50mm CLIENT', label: 'FREELANCE IMPACT' },
    { timecode: '05:30 PM • BEYOND THE CODE', lens: 'LENS: 35mm SUNSET', label: 'HUMAN REFLECTION' },
    { timecode: '07:15 PM • CONTINUOUS LEARNING', lens: 'LENS: 50mm READING', label: 'THE QUIET COMPOUNDER' },
    { timecode: '09:00 PM • THE NIGHT GRIND', lens: 'LENS: 50mm AMBITION', label: 'NIGHT PERSISTENCE' },
    { timecode: '12:30 AM • THANK YOU', lens: 'LENS: 50mm PORTRAIT', label: 'A TOAST TO YOU' }
  ];

  let currentStyle = localStorage.getItem('parmeet_about_style') || 'real';
  let currentActiveScene = 1;
  let prevActiveScene = null;
  let prevActiveStyle = currentStyle;
  let crossfadeTimer = null;

  function updateStylePillUI() {
    stylePills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-style-target') === currentStyle);
    });
  }

  function setActiveScene(sceneNum, forceStyleSwitch = false) {
    if (sceneNum < 1 || sceneNum > 11) return;
    if (!forceStyleSwitch && sceneNum === currentActiveScene && document.querySelector(`.stage-image.active[data-style="${currentStyle}"]`)) return;

    prevActiveScene = currentActiveScene;
    currentActiveScene = sceneNum;

    // Seamless Layered Crossfade across active style:
    // Outgoing image stays pinned at opacity: 1 (z-index: 2)
    // Incoming image dissolves in on top (z-index: 3)
    stageImages.forEach(img => {
      const imgScene = parseInt(img.getAttribute('data-scene'), 10);
      const imgStyle = img.getAttribute('data-style');

      if (imgStyle === currentStyle && imgScene === currentActiveScene) {
        img.classList.remove('prev-active');
        img.classList.add('active');
      } else if (img.classList.contains('active')) {
        img.classList.remove('active');
        img.classList.add('prev-active');
      } else {
        img.classList.remove('active', 'prev-active');
      }
    });

    // Clean up outgoing image once crossfade completes
    if (crossfadeTimer) clearTimeout(crossfadeTimer);
    crossfadeTimer = setTimeout(() => {
      stageImages.forEach(img => {
        const imgScene = parseInt(img.getAttribute('data-scene'), 10);
        const imgStyle = img.getAttribute('data-style');
        if (imgStyle !== currentStyle || imgScene !== currentActiveScene) {
          img.classList.remove('prev-active');
        }
      });
    }, 600);

    // Update active chapter highlight on left
    chapterBlocks.forEach(ch => {
      const chScene = parseInt(ch.getAttribute('data-scene'), 10);
      ch.classList.toggle('active', chScene === sceneNum);
    });

    // Update quick selector dots
    stageDots.forEach((dot, idx) => {
      dot.classList.toggle('active', (idx + 1) === sceneNum);
    });

    // Update Telemetry text
    const meta = filmMetadata[sceneNum - 1] || filmMetadata[0];
    const formattedNum = sceneNum < 10 ? '0' + sceneNum : sceneNum;
    const styleLabel = currentStyle === 'real' ? '3D CINEMATIC' : 'LOFI ANIME';
    if (stageTimecode) stageTimecode.textContent = meta.timecode;
    if (stageSceneIndex) stageSceneIndex.textContent = `${formattedNum} / 11`;
    if (stageLens) stageLens.textContent = `${meta.lens} • ${styleLabel}`;

    // Update Living Room Ambient Lighting State
    const stageFrame = document.querySelector('.stage-canvas-frame');
    if (stageFrame) {
      stageFrame.classList.remove('ambient-day', 'ambient-sunset', 'ambient-night');
      if (sceneNum >= 9) {
        stageFrame.classList.add('ambient-night');
      } else if (sceneNum === 8) {
        stageFrame.classList.add('ambient-sunset');
      } else {
        stageFrame.classList.add('ambient-day');
      }
    }
    if (window.setAtmosphereScene) {
      window.setAtmosphereScene(sceneNum);
    }
  }

  // Style toggle event listeners
  stylePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetStyle = pill.getAttribute('data-style-target');
      if (targetStyle && targetStyle !== currentStyle) {
        currentStyle = targetStyle;
        localStorage.setItem('parmeet_about_style', currentStyle);
        updateStylePillUI();
        setActiveScene(currentActiveScene, true);
      }
    });
  });

  // Initialize style pill UI and Scene 1
  updateStylePillUI();
  setActiveScene(1, true);

  // Sticky Visual Stage is locked to 100% stable stationary coordinates
  const visualStage = document.getElementById('stickyVisualStage');
  if (visualStage) {
    visualStage.style.transform = 'none';
  }

  // ========================================================================
  // ATMOSPHERIC BREEZE & DUST MOTE PARTICLE CANVAS ENGINE
  // ========================================================================
  const atmoCanvas = document.getElementById('stageAtmosphereCanvas');
  if (atmoCanvas) {
    const ctx = atmoCanvas.getContext('2d');
    let animationFrameId = null;
    let particles = [];
    let width = 0;
    let height = 0;
    let currentSceneMode = 1;
    let breezePhase = 0;

    function resizeCanvas() {
      const rect = atmoCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      atmoCanvas.width = Math.floor(width * dpr);
      atmoCanvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        baseSpeedX: (Math.random() * 0.3 + 0.1) * (Math.random() > 0.35 ? 1 : -0.5),
        baseSpeedY: (Math.random() * 0.22 - 0.11),
        alpha: Math.random() * 0.45 + 0.15,
        maxAlpha: Math.random() * 0.45 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
        isBreezeDrifter: Math.random() > 0.5,
        isStarSparkle: Math.random() > 0.7
      };
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor(width * 0.08) + 20, 42);
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    window.setAtmosphereScene = function(sceneNum) {
      currentSceneMode = sceneNum;
    };

    function getParticleColor(p) {
      if (currentSceneMode >= 9) {
        // Night / Persistence / Thank You: cool starlight or warm incandescent
        if (p.isStarSparkle) {
          return `rgba(224, 242, 254, ${p.alpha})`; // cool starlight
        }
        return `rgba(253, 230, 138, ${p.alpha * 0.8})`; // warm lamp glow
      } else if (currentSceneMode === 8) {
        // Sunset: warm amber & golden twilight
        return `rgba(251, 146, 60, ${p.alpha})`;
      } else {
        // Daytime / Morning: golden sunbeams and clean daylight dust motes
        if (p.isBreezeDrifter) {
          return `rgba(254, 240, 138, ${p.alpha})`;
        }
        return `rgba(255, 255, 255, ${p.alpha})`;
      }
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      breezePhase += 0.015;
      const breezeGust = Math.sin(breezePhase) * 0.4 + 0.2; // subtle periodic breeze

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulsePhase += p.pulseSpeed;
        p.alpha = (Math.sin(p.pulsePhase) * 0.5 + 0.5) * p.maxAlpha;

        // Movement with slight sine wave drift
        p.x += p.baseSpeedX + (p.isBreezeDrifter ? breezeGust * 0.5 : 0);
        p.y += p.baseSpeedY + Math.sin(p.pulsePhase * 0.8) * 0.15;

        // Wrap boundaries
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderParticles);
    }

    resizeCanvas();
    initParticles();
    renderParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    }, { passive: true });

    // Pause particle canvas when off-screen to conserve GPU/battery
    const stageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationFrameId) renderParticles();
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    stageObserver.observe(atmoCanvas);
  }

  // ========================================================================
  // CONTINUOUS VIEWPORT CENTER TRACKER: SEAMLESS TRANSITIONS, ZERO DEAD ZONES
  // ========================================================================
  let scrollTicking = false;
  function updateActiveChapterOnScroll() {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
      const viewportTargetY = window.innerHeight * 0.45;
      let closestBlock = null;
      let minDistance = Infinity;

      chapterBlocks.forEach(block => {
        const card = block.querySelector('.chapter-content-card') || block;
        const rect = card.getBoundingClientRect();
        const cardCenterY = rect.top + (rect.height / 2);
        const dist = Math.abs(cardCenterY - viewportTargetY);

        if (dist < minDistance) {
          minDistance = dist;
          closestBlock = block;
        }
      });

      if (closestBlock) {
        const sceneNum = parseInt(closestBlock.getAttribute('data-scene') || '1', 10);
        if (sceneNum !== currentActiveScene) {
          setActiveScene(sceneNum);
        }
      }

      scrollTicking = false;
    });
  }

  window.addEventListener('scroll', updateActiveChapterOnScroll, { passive: true });
  window.addEventListener('resize', updateActiveChapterOnScroll, { passive: true });
  updateActiveChapterOnScroll();

  // Quick dot navigation: click dot to scroll directly to that chapter
  stageDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetScene = parseInt(dot.getAttribute('data-target-scene'), 10);
      const targetFormatted = targetScene < 10 ? '0' + targetScene : targetScene;
      const targetElement = document.getElementById(`chapter-${targetFormatted}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Smooth scroll for in-text chapter links
  const chapterLinks = document.querySelectorAll('.mini-project-tag[href^="#chapter-"]');
  chapterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

// Global helper for opening Certificate Lightbox
window.openCertLightbox = function(title, issuer, year, code, url) {
  const modalBackdrop = document.getElementById('certModalBackdrop');
  const modalCertCode = document.getElementById('modalCertCode');
  const modalCertYear = document.getElementById('modalCertYear');
  const modalCertTitle = document.getElementById('modalCertTitle');
  const modalCertIssuer = document.getElementById('modalCertIssuer');
  const modalCertBodyTitle = document.getElementById('modalCertBodyTitle');
  const modalCertBodyIssuer = document.getElementById('modalCertBodyIssuer');
  const modalCertUrlBtn = document.getElementById('modalCertUrlBtn');

  if (modalCertCode) modalCertCode.textContent = code || 'CERT';
  if (modalCertYear) modalCertYear.textContent = year || '2024';
  if (modalCertTitle) modalCertTitle.textContent = title;
  if (modalCertIssuer) modalCertIssuer.textContent = `Issued by ${issuer}`;
  if (modalCertBodyTitle) modalCertBodyTitle.textContent = title;
  if (modalCertBodyIssuer) modalCertBodyIssuer.textContent = `${issuer} • ${year}`;
  if (modalCertUrlBtn) {
    if (url && url !== '#' && url !== 'None' && url.length > 5) {
      modalCertUrlBtn.href = url;
      modalCertUrlBtn.style.display = 'inline-flex';
    } else {
      modalCertUrlBtn.style.display = 'none';
    }
  }

  if (modalBackdrop) modalBackdrop.classList.add('open');
};

// Close Certificate Lightbox handlers
document.addEventListener('DOMContentLoaded', () => {
  const modalBackdrop = document.getElementById('certModalBackdrop');
  const modalCloseBtn = document.getElementById('certModalClose');
  if (modalCloseBtn && modalBackdrop) {
    modalCloseBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        modalBackdrop.classList.remove('open');
      }
    });
  }
});

