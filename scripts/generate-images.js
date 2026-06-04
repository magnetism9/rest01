/**
 * OG Image (1200×630) + Favicon (64×64) 생성 스크립트
 * 실행: node scripts/generate-images.js
 */
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs   = require('fs');
const path = require('path');

/* ── 한국어 폰트 등록 ── */
const FONT_DIR = 'C:\\Windows\\Fonts';
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'malgunbd.ttf'), 'MG');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'malgun.ttf'),   'MG');

const F_BOLD = 'bold {S}px MG, sans-serif';
const F_REG  = '{S}px MG, sans-serif';
const f = (tpl, s) => tpl.replace('{S}', s);

/* ── 둥근 사각형 헬퍼 ── */
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r,     r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r,  0,            Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r,     y + h - r, r,  Math.PI / 2,  Math.PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r,     y + r,     r,  Math.PI,      -Math.PI / 2);
  ctx.closePath();
}

/* ════════════════════════════════════════
   OG IMAGE  1200 × 630
   ════════════════════════════════════════ */
function buildOgImage() {
  const W = 1200, H = 630;
  const cv  = createCanvas(W, H);
  const ctx = cv.getContext('2d');

  /* ── 배경 그라디언트 (다크블루) ── */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,   '#06091e');
  bg.addColorStop(0.5, '#0d1840');
  bg.addColorStop(1,   '#162858');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* ── 배경 도트 그리드 ── */
  ctx.fillStyle = 'rgba(65,105,225,.06)';
  for (let x = 30; x < W; x += 44)
    for (let y = 30; y < H; y += 44) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

  /* ── 우상단 글로우 ── */
  const g1 = ctx.createRadialGradient(W, 0, 0, W, 0, 500);
  g1.addColorStop(0,   'rgba(65,105,225,.3)');
  g1.addColorStop(1,   'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  /* ── 좌하단 글로우 ── */
  const g2 = ctx.createRadialGradient(0, H, 0, 0, H, 380);
  g2.addColorStop(0,   'rgba(65,105,225,.18)');
  g2.addColorStop(1,   'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  /* ── 우측 데코 원 ── */
  const CX = W - 170, CY = H / 2 - 10;
  ctx.beginPath();
  ctx.arc(CX, CY, 155, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(65,105,225,.14)';
  ctx.lineWidth = 44;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(CX, CY, 95, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(65,105,225,.22)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(65,105,225,.35)';
  ctx.font = f(F_BOLD, 64);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GJS', CX, CY);

  /* ── 좌측 수직 강조바 ── */
  const bar = ctx.createLinearGradient(0, 140, 0, 500);
  bar.addColorStop(0, '#4169e1');
  bar.addColorStop(1, 'rgba(65,105,225,0)');
  ctx.fillStyle = bar;
  ctx.fillRect(72, 140, 5, 360);

  /* ── 배지 (이력서) ── */
  rrect(ctx, 96, 148, 126, 38, 19);
  ctx.fillStyle = 'rgba(65,105,225,.25)';
  ctx.fill();
  rrect(ctx, 96, 148, 126, 38, 19);
  ctx.strokeStyle = 'rgba(107,143,255,.8)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#a8c4ff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = f(F_BOLD, 15);
  ctx.fillText('이  력  서', 96 + 63, 148 + 19);

  /* ── 영문 서브타이틀 ── */
  ctx.fillStyle = 'rgba(168,196,255,.55)';
  ctx.font = f(F_REG, 22);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Portfolio  ·  Resume  ·  2026', 96, 230);

  /* ── 메인 헤드라인 ── */
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  ctx.font = f(F_REG, 38);
  ctx.fillText('한국의 웹개발 전문가', 96, 290);

  /* ── 이름 (대형) ── */
  ctx.fillStyle = '#ffffff';
  ctx.font = f(F_BOLD, 108);
  ctx.fillText('구자성', 96, 420);

  /* ── 자격 태그들 ── */
  const tags = ['소방안전관리', 'CAD 설계', '서비스경영', '1종 운전'];
  let tx = 96;
  ctx.font = f(F_BOLD, 15);
  for (const tag of tags) {
    const tw = ctx.measureText(tag).width;
    rrect(ctx, tx, 440, tw + 24, 30, 15);
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    ctx.fill();
    rrect(ctx, tx, 440, tw + 24, 30, 15);
    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(168,196,255,.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, tx + (tw + 24) / 2, 440 + 15);
    tx += tw + 24 + 10;
  }

  /* ── 구분선 ── */
  ctx.beginPath();
  ctx.moveTo(96, 490);
  ctx.lineTo(680, 490);
  ctx.strokeStyle = 'rgba(65,105,225,.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  /* ── 이메일 ── */
  ctx.fillStyle = '#6b8fff';
  ctx.font = f(F_REG, 19);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('✉  Magentsim99@naver.com', 96, 525);

  /* ── URL ── */
  ctx.fillStyle = 'rgba(255,255,255,.22)';
  ctx.font = f(F_REG, 15);
  ctx.textAlign = 'right';
  ctx.fillText('magnetism9.github.io/rest01', W - 56, H - 32);

  /* ── 저장 ── */
  const out = path.resolve(__dirname, '../images/og-image.png');
  fs.writeFileSync(out, cv.toBuffer('image/png'));
  console.log('✅  og-image.png  (1200×630)  →  images/og-image.png');
}

/* ════════════════════════════════════════
   FAVICON  64 × 64
   ════════════════════════════════════════ */
function buildFavicon() {
  const S  = 64;
  const cv  = createCanvas(S, S);
  const ctx = cv.getContext('2d');

  /* 배경 원 */
  const bg = ctx.createLinearGradient(0, 0, S, S);
  bg.addColorStop(0, '#3d1a5e');
  bg.addColorStop(1, '#5a2d7a');
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();

  /* 옐로우 강조 호 */
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 4, -Math.PI * 0.38, Math.PI * 0.18);
  ctx.strokeStyle = '#f0c000';
  ctx.lineWidth = 5;
  ctx.stroke();

  /* 이니셜 '구' */
  ctx.fillStyle = '#ffffff';
  ctx.font = f(F_BOLD, 29);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('구', S / 2, S / 2 + 1);

  const out = path.resolve(__dirname, '../images/favicon.png');
  fs.writeFileSync(out, cv.toBuffer('image/png'));
  console.log('✅  favicon.png    (64×64)     →  images/favicon.png');
}

buildOgImage();
buildFavicon();
