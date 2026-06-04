/* =========================================
   0. 테마 & 다크모드 — 최우선 실행
   ========================================= */
(function () {
  const themeLink  = document.getElementById('theme-css');
  const darkToggle = document.getElementById('darkToggle');
  const palToggle  = document.getElementById('palToggle');
  const palPanel   = document.getElementById('palPanel');
  const swatches   = document.querySelectorAll('.swatch');

  /* ── 저장된 설정 불러오기 ── */
  const savedTheme = localStorage.getItem('resume-theme') || 'purple';
  const savedMode  = localStorage.getItem('resume-mode')  || 'auto';

  /* ── 테마 적용 ── */
  function applyTheme(name) {
    themeLink.href = `css/themes/theme-${name}.css`;
    swatches.forEach(s => s.classList.toggle('active', s.dataset.theme === name));
    localStorage.setItem('resume-theme', name);
  }

  /* ── 다크모드 적용 ── */
  function applyMode(mode) {
    const html = document.documentElement;
    if (mode === 'dark')  { html.setAttribute('data-mode', 'dark');  darkToggle.textContent = '☀️'; }
    else if (mode === 'light') { html.setAttribute('data-mode', 'light'); darkToggle.textContent = '🌙'; }
    else                  { html.removeAttribute('data-mode');          darkToggle.textContent = '🌙'; }
    localStorage.setItem('resume-mode', mode);
  }

  applyTheme(savedTheme);
  applyMode(savedMode);

  /* ── 팔레트 토글 ── */
  palToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = palPanel.classList.toggle('open');
    palToggle.setAttribute('aria-expanded', isOpen);
  });

  /* ── 스와치 클릭 ── */
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      applyTheme(swatch.dataset.theme);
      palPanel.classList.remove('open');
      palToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── 다크모드 토글 ── */
  darkToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-mode');
    applyMode(current === 'dark' ? 'light' : 'dark');
  });

  /* ── 패널 외부 클릭 시 닫기 ── */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#palWidget')) {
      palPanel.classList.remove('open');
      palToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── ESC 키로 패널 닫기 ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      palPanel.classList.remove('open');
      palToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* =========================================
   1. 프로필 사진 fallback
   ========================================= */
const img = document.getElementById('profileImg');
const fallback = document.getElementById('profileFallback');
if (img) {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    if (fallback) fallback.style.display = 'flex';
  });
}

/* =========================================
   2. Hero 요소 순차 등장 애니메이션
   ========================================= */
const heroAnims = document.querySelectorAll('.hero--anim');
heroAnims.forEach(el => {
  const delay = parseInt(el.dataset.delay) || 0;
  setTimeout(() => el.classList.add('hero--visible'), delay);
});

/* =========================================
   3. 타이핑 효과 (badge 텍스트)
   ========================================= */
const typingEl = document.getElementById('typingText');
const typingTexts = ['소방안전관리 전문가', 'CAD 설계 전문가', '안전을 설계합니다'];
let tIdx = 0, cIdx = 0, isDeleting = false;

function typeLoop() {
  const current = typingTexts[tIdx];
  typingEl.textContent = isDeleting
    ? current.slice(0, cIdx--)
    : current.slice(0, cIdx++);

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && cIdx > current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && cIdx < 0) {
    isDeleting = false;
    tIdx = (tIdx + 1) % typingTexts.length;
    cIdx = 0;
    delay = 400;
  }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 900);

/* =========================================
   4. Hero 배경 파티클 (Canvas)
   ========================================= */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function randomBetween(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = randomBetween(0, canvas.width);
    this.y    = randomBetween(0, canvas.height);
    this.r    = randomBetween(1, 3);
    this.vx   = randomBetween(-0.25, 0.25);
    this.vy   = randomBetween(-0.4, -0.1);
    this.alpha= randomBetween(0.08, 0.35);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -this.r) this.reset();
    if (this.x < -this.r || this.x > canvas.width + this.r) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  particles = Array.from({ length: Math.min(count, 80) }, () => new Particle());
}
initParticles();

function connectParticles() {
  const MAX_DIST = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* =========================================
   5. GSAP MotionPath — rect가 path 위를 순환
   ========================================= */
gsap.registerPlugin(MotionPathPlugin);

gsap.to('#motion-rect', {
  motionPath: {
    path: '#motion-path',
    align: '#motion-path',
    alignOrigin: [0.5, 0.5],
    autoRotate: true,
  },
  duration: 20,
  ease: 'none',
  repeat: -1,
});

/* =========================================
   7. 섹션 스크롤 진입 애니메이션
   ========================================= */
const sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
sections.forEach(s => sectionObserver.observe(s));
