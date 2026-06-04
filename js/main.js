// 프로필 사진 로드 실패 시 fallback 텍스트 표시
const img = document.getElementById('profileImg');
const fallback = document.getElementById('profileFallback');

if (img) {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    if (fallback) fallback.style.display = 'flex';
  });
}

// 섹션 스크롤 진입 애니메이션
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

sections.forEach(s => observer.observe(s));
