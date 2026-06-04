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
   5. 섹션 스크롤 진입 애니메이션
   ========================================= */
const sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
sections.forEach(s => sectionObserver.observe(s));
