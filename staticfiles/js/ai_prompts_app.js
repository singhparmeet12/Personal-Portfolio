/**
 * AI Prompts Lab — Simplified Hover-to-Reveal Showcase
 * Vanilla JavaScript Engine
 */

(function () {
  'use strict';

  // DOM Elements
  const gridContainer = document.getElementById('aipPromptsGrid');
  const emptyState = document.getElementById('aipEmptyState');
  const searchInput = document.getElementById('aipSearchInput');
  const searchClear = document.getElementById('aipSearchClear');
  const categoriesNav = document.getElementById('aipCategoriesNav');
  const gridCounter = document.getElementById('aipGridCounter');
  const statsText = document.getElementById('aipStatsText');
  const resetSearchBtn = document.getElementById('aipResetSearchBtn');

  // Modal Elements
  const modalOverlay = document.getElementById('aipModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalTrend = document.getElementById('modalTrend');
  const modalImgBefore = document.getElementById('modalImgBefore');
  const modalImgAfter = document.getElementById('modalImgAfter');
  const modalPromptText = document.getElementById('modalPromptText');
  const modalCopyBtn = document.getElementById('modalCopyBtn');
  const modalDnaGrid = document.getElementById('modalDnaGrid');
  const modalWhyItWorks = document.getElementById('modalWhyItWorks');
  const modalModelsRow = document.getElementById('modalModelsRow');

  // Toast
  const toastEl = document.getElementById('aipToast');
  const toastMsg = document.getElementById('aipToastMsg');
  let toastTimer = null;

  // App State
  let activeCategory = 'all';
  let searchQuery = '';
  let activeModalPrompt = null;

  const dataset = window.AI_PROMPTS_DATA || [];
  const categories = window.AI_PROMPTS_CATEGORIES || [];

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function init() {
    renderCategories();
    renderCards();
    bindEvents();

    if (statsText) {
      statsText.textContent = `${dataset.length} Curated Master Prompts`;
    }
  }

  // =========================================================================
  // RENDER CATEGORIES
  // =========================================================================
  function renderCategories() {
    if (!categoriesNav) return;
    categoriesNav.innerHTML = '';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `aip-cat-btn ${cat.id === activeCategory ? 'is-active' : ''}`;
      btn.dataset.category = cat.id;
      btn.innerHTML = `
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
        <span class="aip-cat-count">${cat.count}</span>
      `;

      btn.addEventListener('click', () => {
        activeCategory = cat.id;
        document.querySelectorAll('.aip-cat-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderCards();
      });

      categoriesNav.appendChild(btn);
    });
  }

  // =========================================================================
  // RENDER CARDS (HOVER-TO-REVEAL BEFORE/AFTER)
  // =========================================================================
  function renderCards() {
    if (!gridContainer) return;

    // Filter prompts
    const filtered = dataset.filter(p => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const textToSearch = [
          p.title,
          p.short_description,
          p.prompt,
          p.category_name,
          ...(p.tags || []),
          p.dna.subject,
          p.dna.lighting,
          p.dna.camera,
          p.dna.texture,
          p.dna.color,
          p.dna.mood
        ].join(' ').toLowerCase();

        return textToSearch.includes(q);
      }
      return true;
    });

    // Update Counter
    if (gridCounter) {
      gridCounter.textContent = `Showing ${filtered.length} of ${dataset.length} Prompts`;
    }

    // Empty state handling
    if (filtered.length === 0) {
      gridContainer.querySelectorAll('.aip-card').forEach(c => c.remove());
      if (emptyState) emptyState.classList.add('is-visible');
      return;
    } else {
      if (emptyState) emptyState.classList.remove('is-visible');
    }

    // Remove existing cards, keep empty state element
    gridContainer.querySelectorAll('.aip-card').forEach(c => c.remove());

    // Render cards
    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'aip-card';
      card.dataset.id = p.id;

      card.innerHTML = `
        <!-- Dual-Image Compare Frame (Cover: Transformed, Hover: Original) -->
        <div class="aip-compare-frame" title="Hover to reveal original photo" data-id="${p.id}">
          <!-- Transformed AI result visible by default -->
          <img src="${p.result_image}" alt="${p.title}" class="aip-img-after" loading="lazy">
          
          <!-- Original photo revealed on hover/touch -->
          <img src="${p.original_image}" alt="Original Photo" class="aip-img-before" loading="lazy">
          
          <!-- Dynamic Status Pill -->
          <div class="aip-compare-badge">
            <span class="aip-badge-ai"><i class="bi bi-stars"></i> AI Result</span>
            <span class="aip-badge-hint"><i class="bi bi-cursor"></i> Hover for Original</span>
            <span class="aip-badge-orig"><i class="bi bi-camera-fill"></i> Original Photo</span>
          </div>

          <!-- Mobile Touch Support Button -->
          <button type="button" class="aip-touch-toggle-btn" aria-label="Toggle Original Photo">
            <i class="bi bi-eye"></i> Hold for Original
          </button>
        </div>

        <!-- Card Body Details -->
        <div class="aip-card-body">
          <div class="aip-card-meta">
            <span class="aip-category-tag">${escapeHtml(p.category_name || p.category)}</span>
            <span class="aip-trend-tag">${escapeHtml(p.badge)}</span>
          </div>

          <h3 class="aip-card-title">${escapeHtml(p.title)}</h3>
          <p class="aip-card-desc">${escapeHtml(p.short_description)}</p>

          <!-- Prompt DNA Chips -->
          <div class="aip-dna-chips">
            <span class="aip-dna-chip" title="Lighting: ${escapeHtml(p.dna.lighting)}">
              <i class="bi bi-lightbulb"></i> ${escapeHtml(p.dna.lighting)}
            </span>
            <span class="aip-dna-chip" title="Camera / Medium: ${escapeHtml(p.dna.camera)}">
              <i class="bi bi-camera"></i> ${escapeHtml(p.dna.camera)}
            </span>
            <span class="aip-dna-chip" title="Mood: ${escapeHtml(p.dna.mood)}">
              <i class="bi bi-emoji-smile"></i> ${escapeHtml(p.dna.mood)}
            </span>
          </div>

          <!-- Action Triggers -->
          <div class="aip-card-actions">
            <button type="button" class="aip-copy-btn" data-prompt-id="${p.id}">
              <i class="bi bi-clipboard"></i> Copy Master Prompt
            </button>
            <button type="button" class="aip-inspect-btn" data-inspect-id="${p.id}">
              <i class="bi bi-info-circle"></i> Inspect DNA
            </button>
          </div>
        </div>
      `;

      // Attach Touch & Hold Interactivity
      const frame = card.querySelector('.aip-compare-frame');
      const touchBtn = card.querySelector('.aip-touch-toggle-btn');

      // Touch screen support: Press and hold to reveal
      frame.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          frame.classList.add('is-touch-revealed');
        }
      });
      window.addEventListener('pointerup', () => {
        frame.classList.remove('is-touch-revealed');
      });
      window.addEventListener('pointercancel', () => {
        frame.classList.remove('is-touch-revealed');
      });

      // Tap on touchBtn toggle
      touchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        frame.classList.toggle('is-touch-revealed');
      });

      // 1-Click Copy Button
      const copyBtn = card.querySelector('.aip-copy-btn');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyPromptToClipboard(p);
      });

      // Inspect Button
      const inspectBtn = card.querySelector('.aip-inspect-btn');
      inspectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetailModal(p);
      });

      // Clicking card image opens modal
      frame.addEventListener('click', (e) => {
        // Only open modal if not clicking the touchBtn
        if (!e.target.closest('.aip-touch-toggle-btn')) {
          openDetailModal(p);
        }
      });

      gridContainer.appendChild(card);
    });
  }

  // =========================================================================
  // COPY TO CLIPBOARD & TOAST
  // =========================================================================
  function copyPromptToClipboard(promptObj) {
    if (!promptObj || !promptObj.prompt) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(promptObj.prompt).then(() => {
        showToast(`Copied prompt: "${promptObj.title}"`);
      }).catch(() => {
        fallbackCopyText(promptObj.prompt, promptObj.title);
      });
    } else {
      fallbackCopyText(promptObj.prompt, promptObj.title);
    }
  }

  function fallbackCopyText(text, title) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`Copied prompt: "${title}"`);
    } catch (e) {
      showToast(`Selected prompt for copying.`);
    }
    document.body.removeChild(ta);
  }

  function showToast(msg) {
    if (!toastEl) return;
    if (toastMsg) toastMsg.textContent = msg;

    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('is-visible');
    }, 2800);
  }

  // =========================================================================
  // DETAIL MODAL
  // =========================================================================
  function openDetailModal(p) {
    if (!modalOverlay || !p) return;
    activeModalPrompt = p;

    if (modalTitle) modalTitle.textContent = p.title;
    if (modalCategory) modalCategory.textContent = p.category_name || p.category;
    if (modalTrend) modalTrend.textContent = p.badge;
    if (modalImgBefore) modalImgBefore.src = p.original_image;
    if (modalImgAfter) modalImgAfter.src = p.result_image;
    if (modalPromptText) modalPromptText.textContent = p.prompt;
    if (modalWhyItWorks) modalWhyItWorks.textContent = p.why_it_works;

    // Render DNA Grid
    if (modalDnaGrid) {
      modalDnaGrid.innerHTML = '';
      const dnaFields = [
        { label: 'Subject', val: p.dna.subject, icon: 'bi-person' },
        { label: 'Lighting', val: p.dna.lighting, icon: 'bi-brightness-high' },
        { label: 'Camera / Lens', val: p.dna.camera, icon: 'bi-camera' },
        { label: 'Texture & Medium', val: p.dna.texture, icon: 'bi-layers' },
        { label: 'Color Palette', val: p.dna.color, icon: 'bi-palette' },
        { label: 'Mood / Vibe', val: p.dna.mood, icon: 'bi-emoji-smile' }
      ];

      dnaFields.forEach(f => {
        const item = document.createElement('div');
        item.className = 'aip-modal-dna-card';
        item.innerHTML = `
          <div class="aip-modal-dna-card-title">
            <i class="bi ${f.icon}"></i> ${f.label}
          </div>
          <div class="aip-modal-dna-card-desc">${escapeHtml(f.val || 'Standard')}</div>
        `;
        modalDnaGrid.appendChild(item);
      });
    }

    // Render Model Compatibility Matrix
    if (modalModelsRow) {
      modalModelsRow.innerHTML = '';
      const models = p.models || { 'Midjourney v6.1': 5, 'Flux.1 Dev': 5, 'DALL-E 3': 4, 'SDXL 1.0': 4 };
      Object.entries(models).forEach(([modelName, rating]) => {
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const badge = document.createElement('div');
        badge.className = 'aip-model-badge';
        badge.innerHTML = `
          <span>${escapeHtml(modelName)}</span>
          <span class="aip-model-stars">${stars}</span>
        `;
        modalModelsRow.appendChild(badge);
      });
    }

    modalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // =========================================================================
  // EVENT BINDINGS
  // =========================================================================
  function bindEvents() {
    // Search with debounce
    let searchDebounce = null;
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          searchQuery = searchInput.value;
          if (searchClear) {
            searchClear.style.display = searchQuery ? 'block' : 'none';
          }
          renderCards();
        }, 120);
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        searchClear.style.display = 'none';
        renderCards();
      });
    }

    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        activeCategory = 'all';
        if (searchClear) searchClear.style.display = 'none';
        renderCategories();
        renderCards();
      });
    }

    // Modal Close Events
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeDetailModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeDetailModal();
      });
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDetailModal();
    });

    // Modal Copy Button
    if (modalCopyBtn) {
      modalCopyBtn.addEventListener('click', () => {
        if (activeModalPrompt) copyPromptToClipboard(activeModalPrompt);
      });
    }
  }

  // Utility escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // DOM ready trigger
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
