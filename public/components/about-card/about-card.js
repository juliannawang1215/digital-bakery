/**
 * About Card — True Physics Unfold
 * 用法：AboutCard.open() 打开 | AboutCard.close() 关闭
 */

export const AboutCard = {
  _backdrop: null,
  _boundKeydown: null,
  _paper: null,
  _wrapper: null,
  _foldTimeout: null,

  open() {
    if (!this._backdrop) this._render();
    this._backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    this._playFoldAnimation();
    this._boundKeydown = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this._boundKeydown);
  },

  close() {
    if (!this._backdrop) return;
    if (this._foldTimeout) clearTimeout(this._foldTimeout);
    this._backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (this._boundKeydown) document.removeEventListener('keydown', this._boundKeydown);
  },

  _playFoldAnimation() {
    if (!this._wrapper || !this._paper) return;
    const existingScene = this._wrapper.querySelector('.fold-scene');
    if (existingScene) existingScene.remove();
    this._paper.style.visibility = 'visible';
    this._paper.classList.remove('start-anim');

    const scene = document.createElement('div');
    scene.className = 'fold-scene';
    this._wrapper.appendChild(scene);

    const createFoldPart = (name, clipPath, isMid) => {
      const part = document.createElement('div');
      part.className = `fold-part fold-${name}`;
      const front = document.createElement('div');
      front.className = 'fold-front';
      front.style.clipPath = clipPath;
      const clone = this._paper.cloneNode(true);
      clone.style.visibility = 'visible';
      front.appendChild(clone);
      part.appendChild(front);
      if (!isMid) {
        const back = document.createElement('div');
        back.className = 'fold-back';
        part.appendChild(back);
      }
      scene.appendChild(part);
    };

    createFoldPart('mid', 'inset(33.333% -100% 33.333% -100%)', true);
    createFoldPart('bot', 'inset(66.666% -100% -100% -100%)', false);
    createFoldPart('top', 'inset(-100% -100% 66.666% -100%)', false);

    const creaseTop = document.createElement('div');
    creaseTop.className = 'crease-line crease-line-top';
    scene.appendChild(creaseTop);
    const creaseBot = document.createElement('div');
    creaseBot.className = 'crease-line crease-line-bot';
    scene.appendChild(creaseBot);

    this._paper.style.visibility = 'hidden';

    this._foldTimeout = setTimeout(() => {
      this._foldTimeout = null;
      scene.remove();
      this._paper.style.visibility = 'visible';
      this._paper.classList.add('start-anim');
    }, 2000);
  },

  _render() {
    const html = `
      <div class="about-card-backdrop" id="about-card-backdrop" aria-hidden="true">
        <div class="paper-wrapper-3d">
          <div class="paper-card" data-about-card-paper>
            <div class="content-wrapper">
              <svg class="close-btn" data-about-card-close viewBox="0 0 40 40" fill="none" stroke-width="1.5">
                <path d="M 12 12 Q 20 20 28 30 M 28 10 C 22 18 16 26 10 32" />
              </svg>
              <p>Welcome, welcome!</p>
              <p>It's nice to meet you — I'm Julianna.</p>
              <p>I grew up in San Francisco, days spent chasing sunsets and resting under my grandparents' loquat trees. In search of a similar feeling, I like tending to this space as a garden.</p>
              <p>I study CS at Carnegie Mellon by day, and play with pixels by night ★=-</p>
              <p>I think a lot about ways computing can bring us together. I want to create digital spaces that invite playful chaos and remind people of how colorful the world can be.</p>
              <p>My work is largely guided by questions. Life expands when you lean into your curiosities, and I think it's one of the most beautiful things we can do.</p>
              <p>Feel free to wander around and stay awhile. :-)</p>
              <div class="card-footer">
                <div class="signature-area">
                  <svg class="signature-svg" viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <mask id="penflow-mask">
                        <path class="pen-stroke" d="M -20,70 Q 20,30 60,70 T 140,70 T 220,70 T 340,70" stroke="white" stroke-width="140" stroke-linecap="round" fill="none" />
                      </mask>
                    </defs>
                    <text x="5" y="90" font-family="'Brittany Signature', sans-serif" font-size="46" fill="#000" mask="url(#penflow-mask)">Julianna Wang</text>
                  </svg>
                  <svg class="smiley" viewBox="0 0 44 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="smile-mouth" d="M 4 8 C 14 18, 30 18, 40 6" stroke="#000" stroke-width="2" stroke-linecap="round"/>
                    <circle class="smile-eye" cx="16" cy="4" r="1.5" fill="#000"/>
                    <circle class="smile-eye" cx="28" cy="4" r="1.5" fill="#000"/>
                  </svg>
                </div>
                <div class="links">
                  <a href="https://www.linkedin.com/in/julianna-wang-design/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                  <a href="mailto:hello@example.com" target="_blank">Email ↗</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstElementChild);

    this._backdrop = document.getElementById('about-card-backdrop');
    if (!this._backdrop) this._backdrop = document.querySelector('.about-card-backdrop');

    this._paper = this._backdrop.querySelector('[data-about-card-paper]');
    this._wrapper = this._backdrop.querySelector('.paper-wrapper-3d');

    this._backdrop.querySelector('[data-about-card-close]').addEventListener('click', () => this.close());
    this._backdrop.addEventListener('click', (e) => {
      if (e.target === this._backdrop) this.close();
    });
  },
};
