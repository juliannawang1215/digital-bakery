/**
 * Bakery 3D Gallery Component
 * Reusable component for displaying 3D models in a grid with modal viewer.
 *
 * Usage:
 *   import { BakeryGallery } from './components/bakery/bakery.js';
 *   BakeryGallery.mount(document.getElementById('bakery-root'), { items });
 */

export const BakeryGallery = {
  /**
   * Mount the bakery gallery into a container element.
   * @param {HTMLElement} container - DOM element to render into
   * @param {Object} options - Configuration
   * @param {Array<{src: string, name: string}>} options.items - 3D model items
   * @param {string} [options.subtitle] - Optional subtitle text below the grid
   */
  mount(container, { items = [], subtitle = '' } = {}) {
    if (!container) return;

    const gridId = 'bakery-grid-' + Math.random().toString(36).slice(2, 9);
    const modalId = 'bakery-modal-' + Math.random().toString(36).slice(2, 9);

    container.innerHTML = `
      <div class="bakery-component">
        ${subtitle ? `<p class="text-[15px] text-amber-900/70 mb-12 w-full h-fit">${subtitle}</p>` : ''}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6" id="${gridId}">
          ${items.map((item, i) => this._renderCard(item, i)).join('')}
        </div>

        <div class="modal-backdrop" id="${modalId}" aria-hidden="true" aria-label="3D model viewer">
          <div class="modal-content" role="dialog" aria-modal="true">
            <button class="modal-close" aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l10 10M14 4L4 14"/></svg>
            </button>
            <div class="modal-viewer relative" id="${modalId}-viewer">
              <div class="model-error absolute inset-0 hidden flex-col items-center justify-center p-4 z-10 rounded-b-2xl">
                <p class="text-sm font-medium mb-2">Could not load model</p>
                <p class="text-xs text-center opacity-90">Run <code class="bg-white/20 px-1.5 py-0.5 rounded">node serve.js</code> and open via <code class="bg-white/20 px-1.5 py-0.5 rounded">http://localhost:8080</code></p>
              </div>
              <model-viewer
                id="${modalId}-model"
                camera-controls
                auto-rotate
                camera-orbit="45deg 75deg 2.5m"
                min-camera-orbit="auto auto 0.5m"
                max-camera-orbit="auto auto 10m"
                interaction-prompt="auto"
                shadow-intensity="1.2"
                environment-image="neutral"
                exposure="1.2"
                tone-mapping="commerce"
              >
                <div slot="progress-bar" style="display:none"></div>
              </model-viewer>
            </div>
          </div>
        </div>
      </div>
    `;

    this._init(container, modalId);
  },

  _defaultCamera() {
    return {
      orbit: '45deg 75deg 2.5m',
      minOrbit: 'auto auto 1.5m',
      maxOrbit: 'auto auto 4m',
      modalMinOrbit: 'auto auto 0.5m',
      modalMaxOrbit: 'auto auto 10m',
      orientation: '0 15deg 45deg',   // 卡片默认：Z 45° + Y 向右 15°
      modalOrientation: '0 0 45deg', // 弹窗默认：仅 Z 45°，Y 为 0
    };
  },

  _renderCard(item, index) {
    const src = this._escapeHtml(item.src);
    const name = this._escapeHtml(item.name);
    const poster = item.poster ? this._escapeHtml(item.poster) : '';
    const thumbnail = item.thumbnail ? this._escapeHtml(item.thumbnail) : '';
    const scale = item.scale ? this._escapeHtml(item.scale) : '';
    const def = this._defaultCamera();
    const orbit = this._escapeHtml(item.cameraOrbit ?? def.orbit);
    const minOrbit = this._escapeHtml(item.minCameraOrbit ?? def.minOrbit);
    const maxOrbit = this._escapeHtml(item.maxCameraOrbit ?? def.maxOrbit);
    const modalMin = this._escapeHtml(item.modalMinCameraOrbit ?? def.modalMinOrbit);
    const modalMax = this._escapeHtml(item.modalMaxCameraOrbit ?? def.modalMaxOrbit);
    const orientation = this._escapeHtml(item.orientation ?? def.orientation);

    if (thumbnail) {
      return `
      <article class="bakery-card relative" data-src="${src}" data-name="${name}" data-camera-orbit="${orbit}" data-camera-min="${modalMin}" data-camera-max="${modalMax}" data-orientation="${orientation}"${scale ? ` data-scale="${scale}"` : ''}>
        <div class="card-click-overlay" data-src="${src}" data-name="${name}"></div>
        <div class="bakery-name-pill">${name}</div>
        <div class="aspect-square relative model-area model-area--thumbnail">
          <img src="${thumbnail}" alt="${name}" class="w-full h-full object-cover" loading="lazy" />
        </div>
      </article>
    `;
    }

    return `
      <article class="bakery-card relative" data-src="${src}" data-name="${name}" data-camera-orbit="${orbit}" data-camera-min="${modalMin}" data-camera-max="${modalMax}" data-orientation="${orientation}"${scale ? ` data-scale="${scale}"` : ''}>
        <div class="card-click-overlay" data-src="${src}" data-name="${name}"></div>
        <div class="bakery-name-pill">${name}</div>
        <div class="aspect-square relative model-area">
          <model-viewer
            src="${src}"
            ${poster ? `poster="${poster}"` : ''}
            ${scale ? `scale="${scale}"` : ''}
            orientation="${orientation}"
            alt="${name}"
            camera-controls
            disable-zoom
            disable-pan
            interaction-prompt="none"
            camera-orbit="${orbit}"
            min-camera-orbit="${minOrbit}"
            max-camera-orbit="${maxOrbit}"
            style="pointer-events: none;"
          >
            <div slot="progress-bar" style="display:none"></div>
          </model-viewer>
        </div>
      </article>
    `;
  },

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  _init(container, modalId) {
    const modal = container.querySelector(`#${modalId}`);
    const modalViewer = container.querySelector(`#${modalId}-model`);
    const viewerWrap = container.querySelector(`#${modalId}-viewer`);
    const errorEl = viewerWrap?.querySelector('.model-error');
    const cards = container.querySelectorAll('.bakery-card');
    const overlays = container.querySelectorAll('.card-click-overlay');

    if (!modal || !modalViewer || !viewerWrap) return;

    const setupBlurToClear = (mv, wrap) => {
      if (!wrap) return;
      const onProgress = (e) => {
        const p = e.detail?.totalProgress ?? 0;
        wrap.style.setProperty('--blur-amount', `${24 * (1 - p)}px`);
        if (p >= 1) {
          wrap.classList.add('loaded');
          mv.removeEventListener('progress', onProgress);
        }
      };
      const onLoad = () => {
        wrap.classList.add('loaded');
        wrap.style.setProperty('--blur-amount', '0px');
        mv.removeEventListener('progress', onProgress);
      };
      mv.addEventListener('progress', onProgress);
      mv.addEventListener('load', onLoad, { once: true });
      if (mv.loaded) {
        wrap.classList.add('loaded');
        wrap.style.setProperty('--blur-amount', '0px');
      }
    };

    container.querySelectorAll('.bakery-card .model-area model-viewer').forEach((mv) => {
      setupBlurToClear(mv, mv.closest('.model-area'));
    });

    const openModal = (src, name, cardEl) => {
      modalViewer.removeAttribute('src');
      viewerWrap.classList.remove('loaded');
      viewerWrap.style.setProperty('--blur-amount', '24px');
      if (errorEl) {
        errorEl.classList.add('hidden');
        errorEl.style.display = 'none';
      }

      const def = this._defaultCamera();
      const orbit = cardEl?.getAttribute('data-camera-orbit') ?? def.orbit;
      const minOrbit = cardEl?.getAttribute('data-camera-min') ?? def.modalMinOrbit;
      const maxOrbit = cardEl?.getAttribute('data-camera-max') ?? def.modalMaxOrbit;
      const scale = cardEl?.getAttribute('data-scale');
      modalViewer.setAttribute('camera-orbit', orbit);
      modalViewer.setAttribute('min-camera-orbit', minOrbit);
      modalViewer.setAttribute('max-camera-orbit', maxOrbit);
      modalViewer.setAttribute('orientation', def.modalOrientation);
      if (scale) modalViewer.setAttribute('scale', scale);
      else modalViewer.removeAttribute('scale');

      const onProgress = (e) => {
        const p = e.detail?.totalProgress ?? 0;
        viewerWrap.style.setProperty('--blur-amount', `${24 * (1 - p)}px`);
        if (p >= 1) {
          viewerWrap.classList.add('loaded');
          modalViewer.removeEventListener('progress', onProgress);
        }
      };
      const onLoad = () => {
        viewerWrap.classList.add('loaded');
        viewerWrap.style.setProperty('--blur-amount', '0px');
        modalViewer.removeEventListener('progress', onProgress);
      };
      modalViewer.addEventListener('progress', onProgress);
      modalViewer.addEventListener('load', onLoad, { once: true });

      modalViewer.setAttribute('src', src);
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        if (modalViewer.loaded && !viewerWrap.classList.contains('loaded')) {
          onLoad();
        }
      });

      modalViewer.addEventListener(
        'error',
        () => {
          viewerWrap.classList.add('loaded');
          if (errorEl) {
            errorEl.classList.remove('hidden');
            errorEl.style.display = 'flex';
          }
        },
        { once: true }
      );
    };

    const closeModal = () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    const handleCardClick = (e) => {
      const card = e.currentTarget.closest('.bakery-card');
      const src = e.currentTarget.getAttribute('data-src');
      const name = e.currentTarget.getAttribute('data-name') || 'Bakery Item';
      if (src) openModal(src, name, card);
    };

    overlays.forEach((el) => el.addEventListener('click', handleCardClick));
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-click-overlay')) return;
        const src = card.getAttribute('data-src');
        const name = card.getAttribute('data-name') || 'Bakery Item';
        if (src) openModal(src, name, card);
      });
    });

    container.querySelector('.modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  },
};
